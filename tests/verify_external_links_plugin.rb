# tests/verify_external_links_plugin.rb
# Verify the functionality of _plugins/external_links.rb

module Jekyll
  module Hooks
    def self.register(owners, event, &block)
      @block = block
    end

    def self.get_block
      @block
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

puts "Loading plugin..."
load File.expand_path('../_plugins/external_links.rb', __dir__)

block = Jekyll::Hooks.get_block
if block.nil?
  puts "❌ Error: Plugin did not register a hook."
  exit 1
end

test_cases = [
  { name: "Standard External", input: '<a href="http://example.com" target="_blank">Link</a>', should_have_rel: true },
  { name: "Target First", input: '<a target="_blank" href="http://example.com">Link</a>', should_have_rel: true },
  { name: "Protocol Relative", input: '<a href="//example.com" target="_blank">Link</a>', should_have_rel: true },
  { name: "HTTPS", input: '<a href="https://example.com" target="_blank">Link</a>', should_have_rel: true },
  { name: "Spaces around attributes", input: '<a href = "http://example.com" target = "_blank">Link</a>', should_have_rel: true },
  { name: "Internal Link", input: '<a href="/local" target="_blank">Link</a>', should_have_rel: false },
  { name: "Already Secured", input: '<a href="http://example.com" target="_blank" rel="noopener noreferrer">Link</a>', should_have_rel: true },
  { name: "Partial Rel", input: '<a href="http://example.com" target="_blank" rel="nofollow">Link</a>', should_have_rel: true },
  { name: "URL contains keyword", input: '<a href="http://example.com/noopener" target="_blank">Link</a>', should_have_rel: true },
  { name: "URL contains both keywords", input: '<a href="http://example.com/noopener/noreferrer" target="_blank" rel="foo">Link</a>', should_have_rel: true }
]

failures = 0

puts "Running tests..."
test_cases.each do |tc|
  doc = MockDoc.new(tc[:input])
  block.call(doc)

  # Strict check: must be in rel attribute
  rel_match = doc.output.match(/rel\s*=\s*(["'])(.*?)\1/i)
  has_rel_keywords = false
  if rel_match
    rel_content = rel_match[2]
    has_rel_keywords = rel_content.match?(/\bnoopener\b/) && rel_content.match?(/\bnoreferrer\b/)
  end

  # For "Partial Rel", we also want to make sure we didn't lose the original rel
  if tc[:name] == "Partial Rel"
     if !rel_match || !rel_match[2].include?('nofollow')
        puts "❌ [FAIL] #{tc[:name]} (Lost original rel)"
        failures += 1
        next
     end
  end

  if tc[:should_have_rel] && !has_rel_keywords
    puts "❌ [FAIL] #{tc[:name]}"
    puts "   Input:    #{tc[:input]}"
    puts "   Expected: Rel attribute with noopener noreferrer"
    puts "   Actual:   #{doc.output}"
    failures += 1
  elsif !tc[:should_have_rel] && has_rel_keywords
    puts "❌ [FAIL] #{tc[:name]} (Added rel to internal link)"
    puts "   Actual:   #{doc.output}"
    failures += 1
  else
    puts "✅ [PASS] #{tc[:name]}"
  end
end

if failures > 0
  puts "\nSummary: #{failures} tests failed."
  exit 1
else
  puts "\nAll tests passed!"
  exit 0
end
