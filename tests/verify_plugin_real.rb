# Mock Jekyll classes
module Jekyll
  class Hooks
    def self.register(owners, event, &block)
      @hooks ||= {}
      @hooks[event] ||= []
      @hooks[event] << block
    end
    def self.trigger(event, doc)
      (@hooks[event] || []).each { |block| block.call(doc) }
    end
  end
end

# Load the plugin
require_relative '../_plugins/external_links.rb'

# Test helper
class MockDoc
  attr_accessor :output, :output_ext
  def initialize(content)
    @output = content
    @output_ext = ".html"
  end
end

def assert_contains(doc, expected, message)
  if doc.output.include?(expected)
    puts "PASS: #{message}"
  else
    puts "FAIL: #{message}. Got: #{doc.output}"
    exit(1)
  end
end

def assert_not_contains(doc, unexpected, message)
  if !doc.output.include?(unexpected)
    puts "PASS: #{message}"
  else
    puts "FAIL: #{message}. Got: #{doc.output}"
    exit(1)
  end
end

puts "--- Starting Verification ---"

# Test 1: Standard HTTPS link
puts "Test 1: Standard HTTPS link"
doc = MockDoc.new('<a href="https://example.com" target="_blank">Link</a>')
Jekyll::Hooks.trigger(:post_render, doc)
assert_contains(doc, 'rel="noopener noreferrer"', "Standard HTTPS link should have rel attribute")

# Test 2: Protocol-relative link
puts "Test 2: Protocol-relative link"
doc = MockDoc.new('<a href="//example.com" target="_blank">Link</a>')
Jekyll::Hooks.trigger(:post_render, doc)
assert_contains(doc, 'rel="noopener noreferrer"', "Protocol-relative link should have rel attribute")

# Test 3: Reversed attributes
puts "Test 3: Reversed attributes"
doc = MockDoc.new('<a target="_blank" href="https://example.com">Link</a>')
Jekyll::Hooks.trigger(:post_render, doc)
assert_contains(doc, 'rel="noopener noreferrer"', "Reversed attributes link should have rel attribute")

# Test 4: Internal link (no target)
puts "Test 4: Internal link"
doc = MockDoc.new('<a href="/about">About</a>')
Jekyll::Hooks.trigger(:post_render, doc)
assert_not_contains(doc, 'rel="noopener noreferrer"', "Internal link should NOT have rel attribute")

# Test 5: External link without target=_blank
puts "Test 5: External link without target=_blank"
doc = MockDoc.new('<a href="https://google.com">Google</a>')
Jekyll::Hooks.trigger(:post_render, doc)
assert_not_contains(doc, 'rel="noopener noreferrer"', "External link without target=_blank should NOT have rel attribute")

puts "--- Verification Complete ---"
