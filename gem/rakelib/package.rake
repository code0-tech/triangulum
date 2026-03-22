# frozen_string_literal: true

require 'rubygems/package_task'
require 'open-uri'
require 'digest'
require_relative 'bun'

desc 'Clean downloaded bun binaries'
task 'clobber:bun' do
  BUN_PLATFORMS.each_key do |platform|
    bun_path = File.join('exe', platform, 'bun')
    rm bun_path if File.exist?(bun_path)
  end
end

task clobber: %i[clobber:bun]

exepaths = []

TRIANGULUM_GEMSPEC = Bundler.load_gemspec('triangulum.gemspec')

BUN_PLATFORMS.each do |platform, (zip_filename, expected_checksum)|
  TRIANGULUM_GEMSPEC.dup.tap do |gemspec|
    exedir = File.join('exe', platform)
    exepath = File.join(exedir, 'bun')

    exepaths << exepath

    gemspec.platform = platform
    gemspec.files += [exepath]

    gem_path = Gem::PackageTask.new(gemspec).define
    desc "Build the #{platform} gem"
    task "gem:#{platform}" => [gem_path]

    directory exedir
    file exepath => [exedir] do
      url = bun_download_url(zip_filename)
      warn "Downloading #{exepath} from #{url} ..."

      URI.open(url) do |remote| # rubocop:disable Security/Open
        zip_data = remote.read

        actual_checksum = Digest::SHA256.hexdigest(zip_data)
        unless actual_checksum == expected_checksum
          raise "Checksum mismatch for #{zip_filename}: expected #{expected_checksum}, got #{actual_checksum}"
        end

        require 'zip'
        Zip::File.open_buffer(zip_data) do |zip|
          bun_entry = zip.find { |e| File.basename(e.name) == 'bun' }
          raise "bun binary not found in #{zip_filename}" unless bun_entry

          File.binwrite(exepath, bun_entry.get_input_stream.read)
        end
      end

      FileUtils.chmod(0o755, exepath, verbose: true)
    end
  end
end

desc 'Download all bun binaries'
task download: exepaths
