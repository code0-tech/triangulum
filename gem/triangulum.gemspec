# frozen_string_literal: true

require_relative 'lib/triangulum/version'

Gem::Specification.new do |spec|
  spec.name = 'triangulum'
  spec.version = Triangulum::VERSION
  spec.authors = ['Niklas van Schrick']
  spec.email = ['mc.taucher2003@gmail.com']
  spec.license = 'MIT'

  spec.summary = 'Triangulum is the CodeZero validation layer'
  spec.homepage = 'https://github.com/code0-tech/triangulum'
  spec.required_ruby_version = '>= 3.1.0'

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['changelog_uri'] = "#{spec.homepage}/releases"
  spec.metadata['rubygems_mfa_required'] = 'true'

  # Specify which files should be added to the gem when it is released.
  spec.files = Dir.glob('lib/**/*', base: __dir__).select { |f| File.file?(File.join(__dir__, f)) } + ['README.md']
  spec.bindir = 'exe'
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  spec.add_dependency 'base64', '~> 0.3'
  spec.add_dependency 'json', '~> 2.19'
  spec.add_dependency 'open3', '~> 0.2'
  spec.add_dependency 'tucana', '~> 0.0', '>= 0.0.62'

  spec.add_development_dependency 'irb', '~> 1.17'
  spec.add_development_dependency 'rake', '~> 13.0'
  spec.add_development_dependency 'rubyzip', '~> 2.3'

  spec.add_development_dependency 'rspec', '~> 3.0'

  spec.add_development_dependency 'rubocop', '~> 1.21'
  spec.add_development_dependency 'rubocop-rake', '~> 0.7.0'
  spec.add_development_dependency 'rubocop-rspec', '~> 3.0'
end
