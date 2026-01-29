
module Jekyll
  module Hooks
    @hooks = {}
    def self.register(owner, event, &block)
      @hooks[event] = block
    end
    def self.trigger(event, doc)
      @hooks[event].call(doc) if @hooks[event]
    end
  end
end

class Doc
  attr_accessor :output, :output_ext
  def initialize(output)
    @output = output
    @output_ext = ".html"
  end
end

# Load the plugin
plugin_path = '_plugins/external_links.rb'
unless File.exist?(plugin_path)
  puts "Error: Plugin file not found at #{plugin_path}"
  exit 1
end

begin
  eval(File.read(plugin_path))
rescue => e
  puts "Error loading plugin: #{e.message}"
  exit 1
end

test_cases = [
  { input: '<a href="https://example.com" target="_blank">HTTPS Link</a>', expected: 'rel="noopener noreferrer"', name: "HTTPS Link" },
  { input: '<a href="http://example.com" target="_blank">HTTP Link</a>', expected: 'rel="noopener noreferrer"', name: "HTTP Link" },
  { input: '<a href="//example.com" target="_blank">Protocol Relative Link</a>', expected: 'rel="noopener noreferrer"', name: "Protocol Relative Link" },
  { input: '<a href="/local/path" target="_blank">Local Link</a>', not_expected: 'rel="noopener noreferrer"', name: "Local Link" }
]

failed = false

test_cases.each do |tc|
  doc = Doc.new(tc[:input].dup)
  Jekyll::Hooks.trigger(:post_render, doc)

  passed = true
  if tc[:expected] && !doc.output.include?(tc[:expected])
    passed = false
  end
  if tc[:not_expected] && doc.output.include?(tc[:not_expected])
    passed = false
  end

  if passed
    puts "✅ PASS: #{tc[:name]}"
  else
    puts "❌ FAIL: #{tc[:name]}"
    puts "   Input:    #{tc[:input]}"
    puts "   Output:   #{doc.output}"
    puts "   Expected: #{tc[:expected] ? "To contain '#{tc[:expected]}'" : "NOT to contain '#{tc[:not_expected]}'"}"
    failed = true
  end
end

exit(failed ? 1 : 0)
