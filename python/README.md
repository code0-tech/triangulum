# Triangulum Python Package

Python bindings for the [Triangulum](https://github.com/code0-tech/triangulum) validation layer. This package wraps the TypeScript library and a bundled [Bun](https://bun.sh) runtime to validate flows using the TypeScript compiler.

## Installation

```bash
pip install triangulum   # or: uv add triangulum
```

Platform specific wheels with a bundled bun binary are published for:

- `macosx_11_0_arm64` (macOS Apple Silicon)
- `macosx_10_12_x86_64` (macOS Intel)
- `manylinux_2_17_x86_64` (Linux x64)
- `musllinux_1_2_x86_64` (Linux x64 musl)
- `manylinux_2_17_aarch64` (Linux ARM64)
- `musllinux_1_2_aarch64` (Linux ARM64 musl)

For any other platform pip falls back to the pure python wheel, which requires `bun` on `PATH`.

## Usage

```python
from triangulum import Validation

result = Validation(flow, function_definitions, data_types).validate()

result.is_valid      # => True / False
result.return_type   # => "void"
result.diagnostics   # => [Diagnostic, ...]
```

The arguments are [Tucana](https://github.com/code0-tech/tucana) protobuf messages:

- `flow` — `tucana.generated.shared.flow_pb2.ValidationFlow`
- `function_definitions` — `list[tucana.generated.shared.function_pb2.FunctionDefinition]`
- `data_types` — `list[tucana.generated.shared.data_type_pb2.DefinitionDataType]`

### Diagnostics

Each diagnostic contains:

| Field | Description |
|---|---|
| `message` | Human-readable error description |
| `code` | TypeScript diagnostic code |
| `severity` | `"error"` or `"warning"` |
| `node_id` | ID of the node that caused the error |
| `parameter_index` | Index of the parameter that caused the error |

## Development

Prerequisites: [Bun](https://bun.sh) installed locally, and the TypeScript package built in the repository root (`npm ci && npm run build`, plus `npm ci` in `entrypoint/`).

```bash
cd python
uv sync
uv run python tasks.py entrypoints  # bundles the TypeScript entrypoint into JS
uv run pytest
```

### Building wheels

```bash
uv run python tasks.py wheels
```

This bundles the entrypoint, downloads the bun binaries (with SHA256 checksum verification) for all supported platforms and writes the sdist, the pure python wheel and one wheel per platform to `dist/`.

Bun's version and checksums live in [`bun.json`](../bun.json) in the repository root, shared with the ruby gem.

## License

See [LICENSE](../LICENSE).
