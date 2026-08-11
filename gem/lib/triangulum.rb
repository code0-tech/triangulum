# frozen_string_literal: true

require 'base64'
require 'json'
require 'open3'

module Triangulum
  class Error < StandardError; end
end

require_relative 'triangulum/version'
require_relative 'triangulum/executor'
require_relative 'triangulum/flow_schema_extraction'
require_relative 'triangulum/validation'
