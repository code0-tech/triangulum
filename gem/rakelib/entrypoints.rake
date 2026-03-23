# frozen_string_literal: true

desc 'Bundle the TypeScript entrypoints into single JS files'
task 'build:entrypoints' do
  rm_rf 'lib/triangulum/js'
  directory 'lib/triangulum/js'

  entrypoints = %w[single-validation]

  entrypoints.each do |entrypoint|
    entrypoint_src = File.expand_path("../../entrypoint/#{entrypoint}.ts", __dir__)
    entrypoint_dst = File.expand_path("../lib/triangulum/js/#{entrypoint}.js", __dir__)

    sh 'bun', 'build', entrypoint_src, '--outfile', entrypoint_dst, '--target', 'bun'
  end
end
