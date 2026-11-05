"""Exceptions raised by triangulum."""


class Error(Exception):
    """Base class for every triangulum error."""


class TriangulumFailed(Error):
    """The bun subprocess exited with a failure."""


class BunNotFound(Error):
    """No bun executable is available to run the entrypoints with."""
