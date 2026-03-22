# frozen_string_literal: true

desc 'Push all platform gems to RubyGems'
task 'push:all' do
  Dir['pkg/*.gem'].each do |gem_file|
    sh 'gem', 'push', gem_file
  end
end
