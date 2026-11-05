"""Runs the bundled TypeScript entrypoints through bun."""

import base64
import shutil
import subprocess
from pathlib import Path

from triangulum.errors import BunNotFound, TriangulumFailed

JS_DIR = Path(__file__).parent / "js"

# Platform wheels embed the matching bun binary here, see hatch_build.py. The
# pure python wheel does not, and falls back to bun on PATH.
BUNDLED_BUN = Path(__file__).parent / "exe" / "bun"


def bun():
    """Path to the bun executable to run the entrypoints with."""
    if BUNDLED_BUN.is_file():
        return str(BUNDLED_BUN)

    found = shutil.which("bun")
    if found is None:
        raise BunNotFound(
            "No bundled bun binary found and no 'bun' on PATH. Install bun "
            "(https://bun.sh) or use a platform specific triangulum wheel."
        )

    return found


def run_ts_triangulum(entrypoint, payload):
    """Run ``entrypoint`` with ``payload`` on stdin and return its stdout."""
    process = subprocess.run(
        [bun(), "run", str(entrypoint)],
        input=payload,
        capture_output=True,
        text=True,
        check=False,
    )

    if process.returncode != 0:
        if process.returncode < 0:
            status_info = f"SIGNAL: {-process.returncode}"
        else:
            status_info = f"STATUS: {process.returncode}"

        raise TriangulumFailed(
            f"{status_info}\n\nOUT:\n{process.stdout}\n\nERR:\n{process.stderr}"
        )

    return process.stdout


def _encode(message):
    return base64.b64encode(message.SerializeToString()).decode("ascii")


def serialize_input(flow, function_definitions, data_types):
    """Serialize the protobuf messages into the entrypoint's stdin format.

    One base64 encoded message per line, the three groups separated by an empty
    line. Mirrors ``Triangulum::Validation#serialize_input`` in the ruby gem.
    """
    lines = [_encode(flow), ""]

    lines += [_encode(fd) for fd in function_definitions]
    lines.append("")

    lines += [_encode(dt) for dt in data_types]
    lines.append("")

    return "\n".join(lines)
