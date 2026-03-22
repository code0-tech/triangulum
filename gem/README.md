# Triangulum Ruby Gem

Ruby bindings for the [Triangulum](https://github.com/code0-tech/triangulum) validation layer. This gem wraps the TypeScript library and a bundled [Bun](https://bun.sh) runtime to validate flows using the TypeScript compiler.

## Installation

Add to your Gemfile:

```ruby
gem 'triangulum'
```

Platform-specific gems are published for:

- `arm64-darwin` (macOS Apple Silicon)
- `x86_64-darwin` (macOS Intel)
- `x86_64-linux-gnu` (Linux x64)
- `x86_64-linux-musl` (Linux x64 musl)
- `aarch64-linux-gnu` (Linux ARM64)
- `aarch64-linux-musl` (Linux ARM64 musl)

If Bundler doesn't automatically select the correct platform gem, add your platform:

```bash
bundle lock --add-platform x86_64-linux-gnu
```

## Usage

```ruby
result = Triangulum::Validation.new(flow, runtime_function_definitions, data_types).validate

result.valid?       # => true / false
result.return_type  # => "void"
result.diagnostics  # => [Triangulum::Validation::Diagnostic, ...]
```

The arguments are [Tucana](https://github.com/code0-tech/tucana) protobuf objects:

- `flow` — `Tucana::Shared::ValidationFlow`
- `runtime_function_definitions` — `Array<Tucana::Shared::RuntimeFunctionDefinition>`
- `data_types` — `Array<Tucana::Shared::DefinitionDataType>`

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

Prerequisites: [Bun](https://bun.sh) installed locally for building the entrypoint.

```bash
cd gem
bundle install
bundle exec rake prepare_build  # downloads bun binaries + builds JS entrypoint
bundle exec rake                # run tests and rubocop
```

### Building platform gems

```bash
bundle exec rake package
```

This will download bun binaries (with SHA256 checksum verification) for all supported platforms and build a `.gem` file for each.

## License

See [LICENSE](../LICENSE).
