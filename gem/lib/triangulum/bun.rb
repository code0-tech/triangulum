# frozen_string_literal: true

module Triangulum
  # @!visibility private
  module Bun
    VERSION = 'v1.3.11'

    # rubocop:disable Layout/LineLength
    # rubygems platform name => [bun release zip filename, sha256 checksum]
    NATIVE_PLATFORMS = {
      'arm64-darwin' => %w[bun-darwin-aarch64.zip 6f5a3467ed9caec4795bf78cd476507d9f870c7d57b86c945fcb338126772ffc],
      'x86_64-darwin' => %w[bun-darwin-x64.zip c4fe2b9247218b0295f24e895aaec8fee62e74452679a9026b67eacbd611a286],
      'x86_64-linux-gnu' => %w[bun-linux-x64.zip 8611ba935af886f05a6f38740a15160326c15e5d5d07adef966130b4493607ed],
      'x86_64-linux-musl' => %w[bun-linux-x64-musl.zip b0fce3bc4fab52f26a1e0d8886dc07fd0c0eb2a274cb343b59c83a2d5997b5b1],
      'aarch64-linux-gnu' => %w[bun-linux-aarch64.zip d13944da12a53ecc74bf6a720bd1d04c4555c038dfe422365356a7be47691fdf],
      'aarch64-linux-musl' => %w[bun-linux-aarch64-musl.zip 0f5bf5dc3f276053196274bb84f90a44e2fa40c9432bd6757e3247a8d9476a3d]
    }.freeze
    # rubocop:enable Layout/LineLength

    def self.download_url(filename)
      "https://github.com/oven-sh/bun/releases/download/bun-#{VERSION}/#{filename}"
    end
  end
end
