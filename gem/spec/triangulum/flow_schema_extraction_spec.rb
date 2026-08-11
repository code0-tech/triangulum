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
    end
  end
end
