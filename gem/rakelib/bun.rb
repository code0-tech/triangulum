# frozen_string_literal: true

BUN_VERSION = 'v1.3.11'

# rubocop:disable Layout/LineLength
# rubygems platform name => [bun release zip filename, sha256 checksum]
BUN_PLATFORMS = {
  'arm64-darwin' => %w[bun-darwin-aarch64.zip 6f5a3467ed9caec4795bf78cd476507d9f870c7d57b86c945fcb338126772ffc],
  'x86_64-darwin' => %w[bun-darwin-x64-baseline.zip fb6739b08bf54550edaa7c824cd5b2dca45b6a06afef408443087a63105f6f8d],
  'x86_64-linux-gnu' => %w[bun-linux-x64-baseline.zip abe346f63414547cdf6b35b7a649a490c728b93d006226156923918a84c0e59b],
  'x86_64-linux-musl' => %w[bun-linux-x64-musl-baseline.zip 2fa2b697f14ada86a28df771d3876ca7606d7453b2339454893b1937aa9c0c7e],
  'aarch64-linux-gnu' => %w[bun-linux-aarch64.zip d13944da12a53ecc74bf6a720bd1d04c4555c038dfe422365356a7be47691fdf],
  'aarch64-linux-musl' => %w[bun-linux-aarch64-musl.zip 0f5bf5dc3f276053196274bb84f90a44e2fa40c9432bd6757e3247a8d9476a3d]
}.freeze
# rubocop:enable Layout/LineLength

def bun_download_url(filename)
  "https://github.com/oven-sh/bun/releases/download/bun-#{BUN_VERSION}/#{filename}"
end
