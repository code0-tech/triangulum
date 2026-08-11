# frozen_string_literal: true

module Triangulum
  # == Triangulum::FlowSchemaExtraction
  # This class implements the extraction of flow schemas using the typescript package
  class FlowSchemaExtraction
    include Executor

    Result = Struct.new(:flow, :subflow_parameters, keyword_init: true)
    SchematizedObject = Struct.new(:id, :input_schema, :output_schema, keyword_init: true)

    ENTRYPOINT = File.expand_path('js/flow-schema-extraction.js', __dir__)

    attr_reader :flow, :function_definitions, :data_types

    def initialize(flow, runtime_function_definitions, data_types)
      @flow = flow
      @function_definitions = runtime_function_definitions
      @data_types = data_types
    end

    def extract
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
        flow: SchematizedObject.new(
          input_schema: json[:flow][:inputSchema],
          output_schema: json[:flow][:outputSchema]
        ),
        subflow_parameters: json[:subflowParameters].map do |param|
          SchematizedObject.new(
            id: param[:id],
            input_schema: param[:inputSchema],
            output_schema: param[:outputSchema]
          )
        end
      )
    end
  end
end
