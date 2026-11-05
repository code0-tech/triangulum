"""Flow validation through the typescript package."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, List, Optional, Sequence

from triangulum.executor import JS_DIR, run_ts_triangulum, serialize_input

if TYPE_CHECKING:
    # tucana's generated protobuf modules import each other through a bare
    # ``shared`` package, so importing them requires ``tucana/generated`` on
    # ``sys.path``. We only need the messages for type hints and read nothing but
    # ``SerializeToString`` off them at runtime, so we never import them for real.
    from tucana.generated.shared.data_type_pb2 import DefinitionDataType
    from tucana.generated.shared.flow_pb2 import ValidationFlow
    from tucana.generated.shared.function_pb2 import FunctionDefinition

ENTRYPOINT = JS_DIR / "single-validation.js"


@dataclass(frozen=True)
class Diagnostic:
    """A single problem reported by the typescript compiler."""

    message: Optional[str] = None
    code: Optional[int] = None
    severity: Optional[str] = None
    node_id: Optional[str] = None
    parameter_index: Optional[int] = None


@dataclass(frozen=True)
class Result:
    """The outcome of validating a flow."""

    is_valid: bool
    return_type: Optional[str] = None
    diagnostics: List[Diagnostic] = field(default_factory=list)


class Validation:
    """Validates a flow against the available functions and data types.

    The arguments are `tucana <https://github.com/code0-tech/tucana>`_ protobuf
    messages, the same ones the ruby gem takes.
    """

    def __init__(
        self,
        flow: ValidationFlow,
        function_definitions: Sequence[FunctionDefinition],
        data_types: Sequence[DefinitionDataType],
    ):
        self.flow = flow
        self.function_definitions = function_definitions
        self.data_types = data_types

    def validate(self) -> Result:
        payload = serialize_input(self.flow, self.function_definitions, self.data_types)

        output = run_ts_triangulum(ENTRYPOINT, payload)

        return self._parse_output(output)

    @staticmethod
    def _parse_output(output: str) -> Result:
        parsed = json.loads(output)

        return Result(
            is_valid=parsed["isValid"],
            return_type=parsed.get("returnType"),
            diagnostics=[
                Diagnostic(
                    message=diagnostic.get("message"),
                    code=diagnostic.get("code"),
                    severity=diagnostic.get("severity"),
                    node_id=diagnostic.get("nodeId"),
                    parameter_index=diagnostic.get("parameterIndex"),
                )
                for diagnostic in parsed.get("diagnostics") or []
            ],
        )
