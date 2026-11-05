"""Protobuf factories for the tests, the pendant to spec/support/protobuf_factories.rb."""

from tucana.generated.shared.data_type_pb2 import DefinitionDataType
from tucana.generated.shared.flow_pb2 import (
    InputType,
    LiteralValue,
    NodeFunction,
    NodeParameter,
    NodeValue,
    ReferenceValue,
    SubFlow,
    ValidationFlow,
)
from tucana.generated.shared.function_pb2 import FunctionDefinition
from tucana.generated.shared.struct_pb2 import NULL_VALUE, ListValue, NumberValue, Struct, Value


def to_value(value):
    """Convert a python value into a ``shared.Value``.

    tucana's python package ships the generated protobuf code only, so unlike
    the ruby gem (``Value.from_ruby``) there is no helper to reuse.
    """
    if value is None:
        return Value(null_value=NULL_VALUE)
    if isinstance(value, bool):
        return Value(bool_value=value)
    if isinstance(value, int):
        return Value(number_value=NumberValue(integer=value))
    if isinstance(value, float):
        return Value(number_value=NumberValue(float=value))
    if isinstance(value, str):
        return Value(string_value=value)
    if isinstance(value, (list, tuple)):
        return Value(list_value=ListValue(values=[to_value(v) for v in value]))
    if isinstance(value, dict):
        return Value(struct_value=Struct(fields={k: to_value(v) for k, v in value.items()}))

    raise TypeError(f"Cannot convert {type(value).__name__} into a shared.Value")


def build_flow(node_functions, starting_node_id=1):
    return ValidationFlow(
        flow_id=1,
        project_id=1,
        type="test",
        starting_node_id=starting_node_id,
        node_functions=node_functions,
        project_slug="test",
        signature="(): void",
    )


def literal_value(value, references=()):
    return NodeValue(
        literal_value=LiteralValue(value=to_value(value), references=list(references))
    )


def reference_node(node_id=None, input_type=None, paths=()):
    reference = ReferenceValue(paths=list(paths))

    if node_id is not None:
        reference.node_id = node_id
    if input_type is not None:
        reference.input_type.CopyFrom(input_type)

    return NodeValue(reference_value=reference)


def reference_input_type(node_id, parameter_index, input_index):
    return InputType(
        node_id=node_id,
        parameter_index=parameter_index,
        input_index=input_index,
    )


def node_function_value(node_id):
    return NodeValue(sub_flow=SubFlow(starting_node_id=node_id))


def node(id, function_id, parameters=(), next_node_id=None):
    node_function = NodeFunction(
        database_id=id,
        runtime_function_id=function_id,
        parameters=list(parameters),
        definition_source="test",
    )

    if next_node_id is not None:
        node_function.next_node_id = next_node_id

    return node_function


def param(id, runtime_parameter_id, value=None):
    node_parameter = NodeParameter(
        database_id=id,
        runtime_parameter_id=runtime_parameter_id,
    )

    if value is not None:
        node_parameter.value.CopyFrom(value)

    return node_parameter


def default_data_types():
    return [
        DefinitionDataType(identifier="LIST", type="T[]", generic_keys=["T"]),
        DefinitionDataType(identifier="NUMBER", type="number"),
        DefinitionDataType(identifier="STRING", type="string"),
        DefinitionDataType(identifier="CONSUMER", type="(item:R) => void", generic_keys=["R"]),
        DefinitionDataType(identifier="RUNNABLE", type="() => void"),
    ]


def default_functions():
    return [
        FunctionDefinition(
            runtime_name="std::math::add",
            signature="(a: NUMBER, b: NUMBER): NUMBER",
        ),
        FunctionDefinition(
            runtime_name="std::list::at",
            signature="<R>(list: LIST<R>, index: NUMBER): R",
        ),
        FunctionDefinition(
            runtime_name="std::control::for_each",
            signature="<R>(list: LIST<R>, consumer: CONSUMER<R>): void",
        ),
        FunctionDefinition(
            runtime_name="std::control::return",
            signature="<R>(value: R): R",
        ),
    ]
