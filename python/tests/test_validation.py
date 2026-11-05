from triangulum import Validation
from tests.factories import (
    build_flow,
    literal_value,
    node,
    node_function_value,
    param,
    reference_input_type,
    reference_node,
)


def test_validates_a_simple_valid_flow(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                parameters=[
                    param(id=1, runtime_parameter_id="a", value=literal_value(1)),
                    param(id=2, runtime_parameter_id="b", value=literal_value(0)),
                ],
            )
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is True
    assert result.diagnostics == []


def test_detects_type_errors_in_parameters(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                parameters=[
                    param(id=1, runtime_parameter_id="a", value=literal_value("not a number")),
                    param(id=2, runtime_parameter_id="b", value=literal_value(10)),
                ],
            )
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is False
    assert result.diagnostics
    assert "number" in result.diagnostics[0].message


def test_validates_a_flow_with_references_between_nodes(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                next_node_id=2,
                parameters=[
                    param(id=1, runtime_parameter_id="a", value=literal_value(1)),
                    param(id=2, runtime_parameter_id="b", value=literal_value(2)),
                ],
            ),
            node(
                id=2,
                function_id="std::math::add",
                parameters=[
                    param(id=3, runtime_parameter_id="a", value=reference_node(node_id=1)),
                    param(id=4, runtime_parameter_id="b", value=literal_value(3)),
                ],
            ),
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is True
    assert result.diagnostics == []


def test_validates_a_flow_with_nested_scopes(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::control::for_each",
                parameters=[
                    param(id=1, runtime_parameter_id="list", value=literal_value([1, 2, 3])),
                    param(id=2, runtime_parameter_id="consumer", value=node_function_value(2)),
                ],
            ),
            node(
                id=2,
                function_id="std::math::add",
                parameters=[
                    param(id=3, runtime_parameter_id="a", value=literal_value(1)),
                    param(id=4, runtime_parameter_id="b", value=literal_value(2)),
                ],
            ),
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is True
    assert result.diagnostics == []


def test_validates_a_flow_with_subflow_referencing_outer_scope(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::control::for_each",
                parameters=[
                    param(id=1, runtime_parameter_id="list", value=literal_value([1, 2, 3])),
                    param(id=2, runtime_parameter_id="consumer", value=node_function_value(2)),
                ],
            ),
            node(
                id=2,
                function_id="std::math::add",
                parameters=[
                    param(id=3, runtime_parameter_id="a", value=literal_value(1)),
                    param(
                        id=4,
                        runtime_parameter_id="b",
                        value=reference_node(
                            input_type=reference_input_type(
                                node_id=1, parameter_index=1, input_index=0
                            )
                        ),
                    ),
                ],
            ),
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is True
    assert result.diagnostics == []


def test_returns_diagnostics_with_node_id_and_parameter_index(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                parameters=[
                    param(id=1, runtime_parameter_id="a", value=literal_value("string")),
                    param(id=2, runtime_parameter_id="b", value=literal_value(10)),
                ],
            )
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.is_valid is False
    diagnostic = next((d for d in result.diagnostics if d.parameter_index == 0), None)
    assert diagnostic is not None
    assert diagnostic.node_id is not None


def test_returns_the_return_type(functions, data_types):
    flow = build_flow(
        node_functions=[
            node(
                id=1,
                function_id="std::math::add",
                parameters=[
                    param(id=1, runtime_parameter_id="a", value=literal_value(1)),
                    param(id=2, runtime_parameter_id="b", value=literal_value(2)),
                ],
            )
        ]
    )

    result = Validation(flow, functions, data_types).validate()

    assert result.return_type == "void"
