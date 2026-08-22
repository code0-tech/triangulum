# frozen_string_literal: true

module ProtobufFactories
  def build_flow(node_functions:, starting_node_id: 1)
    Tucana::Shared::ValidationFlow.new(
      flow_id: 1,
      project_id: 1,
      type: 'test',
      starting_node_id: starting_node_id,
      node_functions: node_functions,
      project_slug: 'test',
      signature: '(): void'
    )
  end

  def literal_value(value, references = [])
    Tucana::Shared::NodeValue.new(
      literal_value: Tucana::Shared::LiteralValue.new(
        value: Tucana::Shared::Value.from_ruby(value),
        references: references
      )
    )
  end

  def reference_node(node_id: nil, input_type: nil, paths: [])
    Tucana::Shared::NodeValue.new(
      reference_value: Tucana::Shared::ReferenceValue.new(
        node_id: node_id,
        input_type: input_type,
        paths: paths
      )
    )
  end

  def reference_input_type(node_id:, parameter_index:, input_index:)
    Tucana::Shared::InputType.new(
      node_id: node_id,
      parameter_index: parameter_index,
      input_index: input_index
    )
  end

  def node_function_value(node_id)
    Tucana::Shared::NodeValue.new(
      sub_flow: Tucana::Shared::SubFlow.new(
        starting_node_id: node_id
      )
    )
  end

  def node(id:, function_id:, parameters: [], next_node_id: nil)
    Tucana::Shared::NodeFunction.new(
      database_id: id,
      runtime_function_id: function_id,
      parameters: parameters,
      next_node_id: next_node_id,
      definition_source: 'test'
    )
  end

  def param(id:, runtime_parameter_id:, value: nil)
    Tucana::Shared::NodeParameter.new(
      database_id: id,
      runtime_parameter_id: runtime_parameter_id,
      value: value
    )
  end

  def default_data_types
    [
      Tucana::Shared::DefinitionDataType.new(identifier: 'LIST', type: 'T[]', generic_keys: ['T']),
      Tucana::Shared::DefinitionDataType.new(identifier: 'NUMBER', type: 'number'),
      Tucana::Shared::DefinitionDataType.new(identifier: 'STRING', type: 'string'),
      Tucana::Shared::DefinitionDataType.new(identifier: 'CONSUMER', type: '(item:R) => void', generic_keys: ['R']),
      Tucana::Shared::DefinitionDataType.new(identifier: 'RUNNABLE', type: '() => void')
    ]
  end

  def default_functions
    [
      Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'std::math::add',
        signature: '(a: NUMBER, b: NUMBER): NUMBER'
      ),
      Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'std::list::at',
        signature: '<R>(list: LIST<R>, index: NUMBER): R'
      ),
      Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'std::control::for_each',
        signature: '<R>(list: LIST<R>, consumer: CONSUMER<R>): void'
      ),
      Tucana::Shared::FunctionDefinition.new(
        runtime_name: 'std::control::return',
        signature: '<R>(value: R): R'
      )
    ]
  end
end
