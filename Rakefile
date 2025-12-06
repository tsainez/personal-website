require 'rspec/core/rake_task'

task :default => :spec

RSpec::Core::RakeTask.new(:spec) do |t|
  t.pattern = "spec/**/*_spec.rb"
end

desc "Build the site"
task :build do
  system("bundle exec jekyll build")
end

desc "Run tests"
task :test => [:build, :spec]
