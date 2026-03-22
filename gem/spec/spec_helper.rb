# frozen_string_literal: true

require 'triangulum'
require 'tucana'

Tucana.load_protocol(:shared)

Dir[File.join(__dir__, 'support/**/*.rb')].each { |f| require f }

RSpec.configure do |config|
  config.example_status_persistence_file_path = '.rspec_status'
  config.disable_monkey_patching!
  config.include ProtobufFactories

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
