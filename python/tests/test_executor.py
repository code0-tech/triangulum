import base64

import pytest

from triangulum import BunNotFound, TriangulumFailed
from triangulum import executor
from triangulum.executor import run_ts_triangulum, serialize_input
from tests.factories import build_flow, literal_value, node, param


def test_serialize_input_groups_messages_by_empty_lines(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                parameters=[param(id=1, runtime_parameter_id="a", value=literal_value(1))],
            )
        ]
    )

    lines = serialize_input(flow, functions, data_types).split("\n")

    # flow, "", 4 functions, "", 5 data types, ""
    assert lines[0] == base64.b64encode(flow.SerializeToString()).decode("ascii")
    assert [index for index, line in enumerate(lines) if line == ""] == [1, 6, 12]
    assert len(lines) == 13


def test_serialize_input_keeps_the_separators_for_empty_groups(functions):
    flow = build_flow(node_functions=[])

    lines = serialize_input(flow, functions, []).split("\n")

    assert [index for index, line in enumerate(lines) if line == ""] == [1, 6, 7]


def test_run_ts_triangulum_raises_on_a_failing_entrypoint(tmp_path):
    entrypoint = tmp_path / "boom.ts"
    entrypoint.write_text("console.error('kaputt');\nprocess.exit(3);\n")

    with pytest.raises(TriangulumFailed) as error:
        run_ts_triangulum(entrypoint, "")

    assert "STATUS: 3" in str(error.value)
    assert "kaputt" in str(error.value)


def test_bun_raises_when_no_bun_is_available(monkeypatch, tmp_path):
    monkeypatch.setattr(executor.shutil, "which", lambda _: None)
    monkeypatch.setattr(executor, "BUNDLED_BUN", tmp_path / "exe" / "bun")

    with pytest.raises(BunNotFound):
        executor.bun()
