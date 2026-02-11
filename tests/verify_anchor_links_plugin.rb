# frozen_string_literal: true

require 'nokogiri'

# Mock Jekyll Hooks
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

# Mock Jekyll Document
class MockDoc
  attr_accessor :output, :output_ext

  def initialize(content)
    @output = content
    @output_ext = ".html"
  end
end

# Load the plugin
require_relative '../_plugins/anchor_links.rb'

def assert(condition, message)
  if condition
    puts "✅ PASS: #{message}"
  else
    puts "❌ FAIL: #{message}"
    exit(1)
  end
end

puts "--- Verifying Anchor Links Plugin ---"

# Test Case 1: Simple Header with ID
input_1 = '<h2 id="section-1">Section 1</h2>'
doc_1 = MockDoc.new(input_1)
Jekyll::Hooks.trigger(doc_1)

fragment_1 = Nokogiri::HTML::DocumentFragment.parse(doc_1.output)
anchor_1 = fragment_1.css('h2 a.anchor-link').first

assert(anchor_1, "Anchor link added to h2 with ID")
assert(anchor_1['href'] == '#section-1', "Href is correct")
assert(anchor_1.text == '#', "Text content is correct")


# Test Case 2: Header without ID (should skip)
input_2 = '<h2>Section 2</h2>'
doc_2 = MockDoc.new(input_2)
Jekyll::Hooks.trigger(doc_2)

fragment_2 = Nokogiri::HTML::DocumentFragment.parse(doc_2.output)
anchor_2 = fragment_2.css('h2 a.anchor-link').first

assert(anchor_2.nil?, "Anchor link NOT added to h2 without ID")


# Test Case 3: Header with existing anchor link (should skip)
input_3 = '<h2 id="section-3">Section 3 <a class="anchor-link" href="#custom">#</a></h2>'
doc_3 = MockDoc.new(input_3)
Jekyll::Hooks.trigger(doc_3)

fragment_3 = Nokogiri::HTML::DocumentFragment.parse(doc_3.output)
anchors_3 = fragment_3.css('h2 a.anchor-link')

assert(anchors_3.length == 1, "Duplicate anchor link NOT added")
assert(anchors_3.first['href'] == '#custom', "Original anchor link preserved")


# Test Case 4: Multiple headers (h3, h4)
input_4 = '<h3 id="h3">H3</h3><h4 id="h4">H4</h4>'
doc_4 = MockDoc.new(input_4)
Jekyll::Hooks.trigger(doc_4)

fragment_4 = Nokogiri::HTML::DocumentFragment.parse(doc_4.output)
assert(fragment_4.css('h3 a.anchor-link').any?, "Anchor added to h3")
assert(fragment_4.css('h4 a.anchor-link').any?, "Anchor added to h4")

puts "🎉 All tests passed!"
