# frozen_string_literal: true

module Triangulum
  # == Triangulum::Validation
  # This class implements the validation using the typescript package
  class Validation
    include Executor

    Result = Struct.new(:valid?, :return_type, :diagnostics, keyword_init: true)
    Diagnostic = Struct.new(:message, :code, :severity, :node_id, :parameter_index, keyword_init: true)

    ENTRYPOINT = File.expand_path('js/single-validation.js', __dir__)

    attr_reader :flow, :function_definitions, :data_types

    def initialize(flow, runtime_function_definitions, data_types)
      @flow = flow
      @function_definitions = runtime_function_definitions
      @data_types = data_types
    end

    def validate
      input = serialize_input

      output = run_ts_triangulum(ENTRYPOINT, input)

      parse_output(output)
    end

    private

    def serialize_input
      input = []

      input << Base64.strict_encode64(flow.to_proto)
      input << ''

      function_definitions.each do |rfd|
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
  end
end
