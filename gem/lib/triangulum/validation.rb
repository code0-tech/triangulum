# frozen_string_literal: true

module Triangulum
  # == Triangulum::Validation
  # This class implements the validation using the typescript package
  class Validation
    class TriangulumFailed < Triangulum::Error
    end

    class BunNotFound < Triangulum::Error
    end

    Result = Struct.new(:valid?, :return_type, :diagnostics, keyword_init: true)
    Diagnostic = Struct.new(:message, :code, :severity, :node_id, :parameter_index, keyword_init: true)

    ENTRYPOINT = File.expand_path('js/single-validation.js', __dir__)
    BUN_EXE = Dir.glob(File.expand_path('../../exe/*/bun', __dir__)).find do |path|
      platform = Gem::Platform.new(File.basename(File.dirname(path)))
      Gem::Platform.match_gem?(platform, Gem::Platform.local.to_s)
    end

    IS_RUBY_PLATFORM_GEM = Dir.glob(File.expand_path('../../exe/*/bun', __dir__)).empty?

    attr_reader :flow, :runtime_function_definitions, :data_types

    def initialize(flow, runtime_function_definitions, data_types)
      @flow = flow
      @runtime_function_definitions = runtime_function_definitions
      @data_types = data_types
    end

    def validate
      input = serialize_input

      output = run_ts_triangulum(input)

      parse_output(output)
    end

    private

    def run_ts_triangulum(input)
      stdout_s, stderr_s, status = Open3.capture3(
        bun, 'run', ENTRYPOINT,
        stdin_data: input
      )

      raise TriangulumFailed, "OUT:\n#{stdout_s}\n\nERR:\n#{stderr_s}" unless status.success?

      stdout_s
    end

    def serialize_input
      input = []

      input << Base64.strict_encode64(flow.to_proto)
      input << ''

      runtime_function_definitions.each do |rfd|
        input << Base64.strict_encode64(rfd.to_proto)
      end

      input << ''

      data_types.each do |dt|
        input << Base64.strict_encode64(dt.to_proto)
      end

      input << ''

      input.join("\n")
    end

    def parse_output(output)
      json = JSON.parse(output, symbolize_names: true)

      Result.new(
        valid?: json[:isValid],
        return_type: json[:returnType],
        diagnostics: json[:diagnostics].map do |diagnostic|
          Diagnostic.new(
            message: diagnostic[:message],
            code: diagnostic[:code],
            severity: diagnostic[:severity],
            node_id: diagnostic[:nodeId],
            parameter_index: diagnostic[:parameterIndex]
          )
        end
      )
    end

    def bun
      if IS_RUBY_PLATFORM_GEM
        'bun'
      else
        raise BunNotFound, "No bundled bun binary found for #{Gem::Platform.local}" if BUN_EXE.nil?

        BUN_EXE
      end
    end
  end
end
