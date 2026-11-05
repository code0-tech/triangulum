#!/usr/bin/env python3
"""Build tasks for the triangulum python package.

The python pendant to ``gem/rakelib``:

    python tasks.py entrypoints   # bundle the TypeScript entrypoints into JS
    python tasks.py download      # download all bun binaries
    python tasks.py wheels        # build the pure python and all platform wheels
    python tasks.py clobber       # remove every build artifact
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

from hatch_build import ENTRYPOINTS, VENDOR_DIR, bun_platforms, download_bun

HERE = Path(__file__).parent
JS_DIR = HERE / "src" / "triangulum" / "js"
DIST_DIR = HERE / "dist"


def entrypoints():
    """Bundle the TypeScript entrypoints into single JS files."""
    for js in JS_DIR.glob("*.js"):
        js.unlink()
    JS_DIR.mkdir(parents=True, exist_ok=True)

    for entrypoint in ENTRYPOINTS:
        source = HERE.parent / "entrypoint" / f"{entrypoint}.ts"
        destination = JS_DIR / f"{entrypoint}.js"

        subprocess.run(
            ["bun", "build", str(source), "--outfile", str(destination), "--target", "bun"],
            check=True,
        )


def download():
    """Download all bun binaries."""
    for platform in bun_platforms():
        download_bun(platform)


def wheels():
    """Build the pure python wheel, the sdist and every platform wheel."""
    entrypoints()
    download()

    _build([])
    for platform in bun_platforms():
        _build(["--wheel"], platform=platform)


def _build(extra_args, platform=None):
    env = dict(os.environ)
    if platform:
        env["TRIANGULUM_WHEEL_PLATFORM"] = platform
        print(f"Building wheel for {platform} ...")
    else:
        env.pop("TRIANGULUM_WHEEL_PLATFORM", None)
        print("Building pure python wheel and sdist ...")

    subprocess.run(
        [sys.executable, "-m", "build", *extra_args, str(HERE)],
        check=True,
        env=env,
    )


def clobber():
    """Remove every build artifact."""
    for path in (DIST_DIR, VENDOR_DIR.parent):
        if path.exists():
            shutil.rmtree(path)

    for js in JS_DIR.glob("*.js"):
        js.unlink()


TASKS = {
    "entrypoints": entrypoints,
    "download": download,
    "wheels": wheels,
    "clobber": clobber,
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("task", choices=sorted(TASKS))
    TASKS[parser.parse_args().task]()
