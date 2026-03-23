# frozen_string_literal: true

RSpec.describe Triangulum::Validation do
  let(:data_types) { default_data_types }
  let(:functions) { default_functions }

  describe '#validate' do
    it 'validates a simple valid flow' do
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

      result = described_class.new(flow, functions, data_types).validate

      expect(result.valid?).to be true
      expect(result.diagnostics).to be_empty
    end

    it 'detects type errors in parameters' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::math::add',
            parameters: [
              param(id: 1, runtime_parameter_id: 'a', value: literal_value('not a number')),
              param(id: 2, runtime_parameter_id: 'b', value: literal_value(10))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).validate

      expect(result.valid?).to be false
      expect(result.diagnostics).not_to be_empty
      expect(result.diagnostics.first.message).to include('number')
    end

    it 'validates a flow with references between nodes' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::math::add',
            next_node_id: 2,
            parameters: [
              param(id: 1, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 2, runtime_parameter_id: 'b', value: literal_value(2))
            ]
          ),
          node(
            id: 2,
            function_id: 'std::math::add',
            parameters: [
              param(id: 3, runtime_parameter_id: 'a', value: reference_node(node_id: 1)),
              param(id: 4, runtime_parameter_id: 'b', value: literal_value(3))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).validate

      expect(result.valid?).to be true
      expect(result.diagnostics).to be_empty
    end

    it 'validates a flow with nested scopes' do
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
              param(id: 4, runtime_parameter_id: 'b', value: literal_value(2))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).validate

      expect(result.valid?).to be true
    end

    it 'returns diagnostics with node_id and parameter_index' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::math::add',
            parameters: [
              param(id: 1, runtime_parameter_id: 'a', value: literal_value('string')),
              param(id: 2, runtime_parameter_id: 'b', value: literal_value(10))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).validate

      expect(result.valid?).to be false
      diagnostic = result.diagnostics.find { |d| d.parameter_index == 0 }
      expect(diagnostic).not_to be_nil
      expect(diagnostic.node_id).not_to be_nil
    end

    it 'returns the return type' do
      flow = build_flow(
        node_functions: [
          node(
            id: 1,
            function_id: 'std::math::add',
            parameters: [
              param(id: 1, runtime_parameter_id: 'a', value: literal_value(1)),
              param(id: 2, runtime_parameter_id: 'b', value: literal_value(2))
            ]
          )
        ]
      )

      result = described_class.new(flow, functions, data_types).validate

      expect(result.return_type).to eq('void')
    end
  end
end
