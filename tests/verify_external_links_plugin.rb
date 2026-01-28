module Jekyll
  module Hooks
    def self.register(owners, event, &block)
      @block = block
    end
    def self.trigger(doc)
      @block.call(doc)
    end
  end
end

class MockDoc
  attr_accessor :output, :output_ext
  def initialize(output)
    @output = output
    @output_ext = ".html"
  end
end

# Load the plugin
require_relative '../_plugins/external_links.rb'

# Test Cases
def test(name, input, expected_match)
  doc = MockDoc.new(input)
  Jekyll::Hooks.trigger(doc)

  # Check if "noopener noreferrer" is present in some form
  if expected_match
    if doc.output.include?('noopener') && doc.output.include?('noreferrer')
      puts "✅ #{name}: Passed"
    else
      puts "❌ #{name}: Failed (Expected rel='noopener noreferrer')"
      puts "   Input:  #{input}"
      puts "   Output: #{doc.output}"
    end
  else
    if doc.output.include?('noopener') || doc.output.include?('noreferrer')
      puts "❌ #{name}: Failed (Unexpected rel attribute)"
    else
      puts "✅ #{name}: Passed"
    end
  end
end

puts "--- Verifying External Links Plugin ---"
test("Standard HTTPS", '<a href="https://google.com" target="_blank">Link</a>', true)
test("Standard HTTP", '<a href="http://insecure.com" target="_blank">Link</a>', true)
test("Protocol Relative", '<a href="//proto.com" target="_blank">Link</a>', true)
test("Target First", '<a target="_blank" href="https://reversed.com">Link</a>', true)
test("Target First Proto Relative", '<a target="_blank" href="//reversed-proto.com">Link</a>', true)
test("Internal Link", '<a href="/internal" target="_blank">Link</a>', false)
test("Existing Rel", '<a href="https://google.com" target="_blank" rel="nofollow">Link</a>', true)
