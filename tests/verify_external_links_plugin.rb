# Mock Jekyll environment
module Jekyll
  module Hooks
    # Store the block for later execution
    def self.register(owners, event, &block)
      @hook_block = block
    end

    def self.run_hook(doc)
      @hook_block.call(doc)
    end
  end
end

# Mock Doc object
class Doc
  attr_accessor :output, :output_ext
  def initialize(html)
    @output = html
    @output_ext = ".html"
  end
end

puts "Loading plugin..."
# Load the plugin file
require_relative '../_plugins/external_links.rb'
puts "Plugin loaded."

def verify(description, html, expected)
  doc = Doc.new(html)
  Jekyll::Hooks.run_hook(doc)
  if doc.output == expected
    puts "✅ PASS: #{description}"
  else
    puts "❌ FAIL: #{description}"
    puts "  Input:    #{html}"
    puts "  Expected: #{expected}"
    puts "  Actual:   #{doc.output}"
    exit 1
  end
end

puts "--- Running Tests ---"

# 1. Standard Case
verify(
  "Standard External Link",
  '<a href="https://google.com" target="_blank">Link</a>',
  '<a href="https://google.com" target="_blank" rel="noopener noreferrer">Link</a>'
)

# 2. Reversed Attributes
verify(
  "Reversed Attributes (target first)",
  '<a target="_blank" href="https://google.com">Link</a>',
  '<a target="_blank" href="https://google.com" rel="noopener noreferrer">Link</a>'
)

# 3. Protocol Relative
verify(
  "Protocol Relative URL",
  '<a href="//google.com" target="_blank">Link</a>',
  '<a href="//google.com" target="_blank" rel="noopener noreferrer">Link</a>'
)

# 4. Local Link (should not change)
verify(
  "Local Link",
  '<a href="/local/path" target="_blank">Link</a>',
  '<a href="/local/path" target="_blank">Link</a>'
)

# 5. Partial Rel (only has noopener)
verify(
  "Partial Rel (noopener)",
  '<a href="https://site.com" target="_blank" rel="noopener">Link</a>',
  '<a href="https://site.com" target="_blank" rel="noopener noreferrer">Link</a>'
)

# 6. Already Secure
verify(
  "Already Secure",
  '<a target="_blank" href="https://secure.com" rel="noopener noreferrer">Link</a>',
  '<a target="_blank" href="https://secure.com" rel="noopener noreferrer">Link</a>'
)

# 7. Multiple Links
verify(
  "Multiple Links",
  '<p><a href="https://a.com" target="_blank">A</a> and <a href="/b" target="_blank">B</a></p>',
  '<p><a href="https://a.com" target="_blank" rel="noopener noreferrer">A</a> and <a href="/b" target="_blank">B</a></p>'
)

puts "All tests passed!"
