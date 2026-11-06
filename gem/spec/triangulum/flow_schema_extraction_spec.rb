# frozen_string_literal: true

RSpec.describe Triangulum::FlowSchemaExtraction do
  let(:data_types) { default_data_types }
  let(:functions) { default_functions }

  describe '#extract' do
    it 'extracts input and output schemas of a flow' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::math::add',
            parameters: [
              param(id: 1, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 2, runtime_parameter_id: 'b', value: literal_value(0))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).extract

      expect(result.flow).to have_attributes(
        input_schema: { type: 'object', additionalProperties: false },
        output_schema: { type: 'null' }
      )
      expect(result.subflow_parameters).to be_empty
      expect(result.subflow_references).to be_empty
    end

    it 'extracts subflow schemas' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::control::for_each',
            parameters: [
              param(id: 1, runtime_parameter_id: 'list', value: literal_value([1, 2, 3])),
              param(id: 2, runtime_parameter_id: 'consumer', value: node_function_value(2))
            ]
          ),
          node(
            id: 2,
            function_id: 'std::math::add',
            parameters: [
              param(id: 3, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 4, runtime_parameter_id: 'b', value: reference_node(
                input_type: reference_input_type(node_id: 1, parameter_index: 1, input_index: 0)
              ))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).extract

      expect(result.flow).to have_attributes(
        input_schema: { type: 'object', additionalProperties: false },
        output_schema: { type: 'null' }
      )
      expect(result.subflow_parameters).to contain_exactly(
        described_class::SchematizedObject.new(
          id: 'gid://sagittarius/NodeParameter/2',
          input_schema: {
            type: 'object',
            properties: {
              item: {
                type: 'number'
              }
            },
            required: ['item'],
            additionalProperties: false
          },
          output_schema: { type: 'null' }
        )
      )
      expect(result.subflow_references).to be_empty
    end

    it 'extracts schemas of sub-flows sitting inline in a literal' do
      # `tools: ["${item_0}"]` -- a list of sub-flows can only be filled through a
      # literal carrying inline references, so the sub-flow has no parameter slot of
      # its own and is addressed by the id of the inline reference holding it.
      tools_function = Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'custom::ai::agent',
        signature: '(tools: LIST<CONSUMER<NUMBER>>): void'
      )

      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'custom::ai::agent',
            parameters: [
              param(
                id: 1,
                runtime_parameter_id: 'tools',
                value: literal_value(
                  ['${item_0}'],
                  [inline_reference(id: 7, signature: 'item_0', value: node_function_value(2))]
                )
              )
            ]
          ),
          node(
            id: 2,
            function_id: 'std::math::add',
            parameters: [
              param(id: 2, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 3, runtime_parameter_id: 'b', value: reference_node(
                input_type: reference_input_type(node_id: 1, parameter_index: 0, input_index: 0)
              ))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions + [tools_function], data_types).extract

      expect(result.subflow_parameters).to be_empty
      expect(result.subflow_references).to contain_exactly(
        described_class::SchematizedObject.new(
          id: 'gid://sagittarius/InlineReferenceValue/7',
          input_schema: {
            type: 'object',
            properties: {
              item: {
                type: 'number'
              }
            },
            required: ['item'],
            additionalProperties: false
          },
          output_schema: { type: 'null' }
        )
      )
    end

    it 'skips inline sub-flows whose reference carries no database id' do
      # `database_id` is optional in the proto. An inline sub-flow without one cannot
      # be addressed by the consumer, so it is left out rather than reported with a
      # null id, which would match the wrong rows.
      tools_function = Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'custom::ai::agent',
        signature: '(tools: LIST<CONSUMER<NUMBER>>): void'
      )

      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'custom::ai::agent',
            parameters: [
              param(
                id: 1,
                runtime_parameter_id: 'tools',
                value: literal_value(
                  ['${item_0}'],
                  [inline_reference(signature: 'item_0', value: node_function_value(2))]
                )
              )
            ]
          ),
          node(
            id: 2,
            function_id: 'std::math::add',
            parameters: [
              param(id: 2, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 3, runtime_parameter_id: 'b', value: literal_value(2))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions + [tools_function], data_types).extract

      expect(result.subflow_references).to be_empty
    end
  end
end
