import importlib.util
import sys

import pytest


def _make_tucana_protos_importable():
    """Put ``tucana/generated`` on ``sys.path``.

    tucana's generated protobuf modules import each other through a bare
    ``shared`` package (``from shared import translation_pb2``), which only
    resolves when their own directory is on ``sys.path``.
    """
    spec = importlib.util.find_spec("tucana")
    generated = f"{spec.submodule_search_locations[0]}/generated"
    if generated not in sys.path:
        sys.path.insert(0, generated)


_make_tucana_protos_importable()

from tests.factories import default_data_types, default_functions  # noqa: E402


@pytest.fixture
def data_types():
    return default_data_types()


@pytest.fixture
def functions():
    return default_functions()
