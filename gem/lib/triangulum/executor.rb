# frozen_string_literal: true

module Triangulum
  # == Triangulum::Executor
  # This module provides the execute methods for triangulum
  module Executor
    class TriangulumFailed < Triangulum::Error
    end

    class BunNotFound < Triangulum::Error
    end

    BUN_EXE = Dir.glob(File.expand_path('../../exe/*/bun', __dir__)).find do |path|
      platform = Gem::Platform.new(File.basename(File.dirname(path)))
      Gem::Platform.match_gem?(platform, Gem::Platform.local.to_s)
    end

    IS_RUBY_PLATFORM_GEM = Dir.glob(File.expand_path('../../exe/*/bun', __dir__)).empty?

    def run_ts_triangulum(entrypoint, input)
      stdout_s, stderr_s, status = Open3.capture3(
        bun, 'run', entrypoint,
        stdin_data: input
      )

      unless status.success?
        status_info = if status.signaled?
                        "SIGNAL: #{status.termsig}"
                      else
                        "STATUS: #{status.exitstatus}"
                      end

        raise TriangulumFailed, "#{status_info}\n\nOUT:\n#{stdout_s}\n\nERR:\n#{stderr_s}"
      end

      stdout_s
    end

    def bun
      if IS_RUBY_PLATFORM_GEM
        'bun'
      else
        raise BunNotFound, "No bundled bun binary found for #{Gem::Platform.local}" if BUN_EXE.nil?

        BUN_EXE
      end
    end
  end
end
