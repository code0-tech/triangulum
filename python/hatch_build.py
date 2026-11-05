"""Wheel build hook that bundles a platform specific bun binary.

The pure python wheel built without ``TRIANGULUM_WHEEL_PLATFORM`` expects ``bun``
on ``PATH``. Setting the variable to one of the keys of :data:`BUN_PLATFORMS`
produces a platform specific wheel with the matching bun binary embedded at
``triangulum/exe/bun``, which mirrors the platform gems built by ``gem/``.

Binaries are not downloaded during the build; run ``python tasks.py download``
first (``tasks.py wheels`` does both).
"""

import hashlib
import json
import os
import shutil
import stat
import urllib.request
import zipfile
from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface

HERE = Path(__file__).parent

# Bun release metadata is shared with the ruby gem, see <repo root>/bun.json.
# It only exists in a repository checkout, not in the published sdist, so the
# metadata is loaded lazily and only platform wheels depend on it.
BUN_METADATA_PATH = HERE.parent / "bun.json"

VENDOR_DIR = HERE / "vendor" / "exe"

ENTRYPOINTS = ("single-validation",)


def _load_metadata():
    if not BUN_METADATA_PATH.is_file():
        raise RuntimeError(
            f"{BUN_METADATA_PATH} not found. Platform wheels can only be built "
            f"from a triangulum repository checkout."
        )
    return json.loads(BUN_METADATA_PATH.read_text())


def bun_version():
    return _load_metadata()["version"]


def bun_platforms():
    """wheel platform tag => (bun release zip filename, sha256 checksum)"""
    return {p["wheel"]: (p["zip"], p["sha256"]) for p in _load_metadata()["platforms"]}


def bun_download_url(filename):
    return f"https://github.com/oven-sh/bun/releases/download/bun-{bun_version()}/{filename}"


def bun_path(platform):
    return VENDOR_DIR / platform / "bun"


def download_bun(platform):
    """Download and extract the bun binary for ``platform``, verifying its checksum."""
    zip_filename, expected_checksum = bun_platforms()[platform]
    destination = bun_path(platform)

    if destination.is_file():
        return destination

    url = bun_download_url(zip_filename)
    print(f"Downloading {destination} from {url} ...")

    with urllib.request.urlopen(url) as response:
        zip_data = response.read()

    actual_checksum = hashlib.sha256(zip_data).hexdigest()
    if actual_checksum != expected_checksum:
        raise RuntimeError(
            f"Checksum mismatch for {zip_filename}: "
            f"expected {expected_checksum}, got {actual_checksum}"
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    tmp_zip = destination.with_suffix(".zip")
    tmp_zip.write_bytes(zip_data)
    try:
        with zipfile.ZipFile(tmp_zip) as archive:
            entry = next(
                (e for e in archive.namelist() if Path(e).name == "bun"),
                None,
            )
            if entry is None:
                raise RuntimeError(f"bun binary not found in {zip_filename}")

            with archive.open(entry) as source, destination.open("wb") as target:
                shutil.copyfileobj(source, target)
    finally:
        tmp_zip.unlink()

    destination.chmod(destination.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    return destination


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        # An editable install is used for development, where the entrypoints are
        # bundled separately via `python tasks.py entrypoints`.
        for entrypoint in ENTRYPOINTS if version != "editable" else ():
            bundle = HERE / "src" / "triangulum" / "js" / f"{entrypoint}.js"
            if not bundle.is_file():
                raise RuntimeError(
                    f"{bundle} is missing. Run `python tasks.py entrypoints` before building."
                )

        platform = os.environ.get("TRIANGULUM_WHEEL_PLATFORM")
        if not platform:
            return

        platforms = bun_platforms()
        if platform not in platforms:
            raise RuntimeError(
                f"Unknown TRIANGULUM_WHEEL_PLATFORM {platform!r}, "
                f"expected one of {', '.join(sorted(platforms))}"
            )

        binary = bun_path(platform)
        if not binary.is_file():
            raise RuntimeError(
                f"{binary} is missing. Run `python tasks.py download` before building."
            )

        build_data["pure_python"] = False
        build_data["tag"] = f"py3-none-{platform}"
        build_data["force_include"][str(binary)] = "triangulum/exe/bun"
