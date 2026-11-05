# frozen_string_literal: true

require 'json'

# Bun release metadata is shared with the python package, see <repo root>/bun.json
BUN_METADATA = JSON.parse(File.read(File.expand_path('../../bun.json', __dir__))).freeze

BUN_VERSION = BUN_METADATA['version']

# rubygems platform name => [bun release zip filename, sha256 checksum]
BUN_PLATFORMS = BUN_METADATA['platforms'].to_h do |platform|
  [platform['gem'], [platform['zip'], platform['sha256']]]
end.freeze

def bun_download_url(filename)
  "https://github.com/oven-sh/bun/releases/download/bun-#{BUN_VERSION}/#{filename}"
end
