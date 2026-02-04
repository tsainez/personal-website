require 'test/unit'

# Mock Jekyll
module Jekyll
  module Hooks
    def self.register(owners, event, &block)
      @hooks ||= {}
      @hooks[event] ||= []
      @hooks[event] << block
    end

    def self.trigger(event, doc)
      return unless @hooks && @hooks[event]
      @hooks[event].each { |hook| hook.call(doc) }
    end
  end
end

# Load the plugin
require_relative '../_plugins/external_links.rb'

class MockDoc
  attr_accessor :output, :output_ext

  def initialize(content)
    @output = content
    @output_ext = ".html"
  end
end

class TestExternalLinksPlugin < Test::Unit::TestCase
  def process(content)
    doc = MockDoc.new(content)
    Jekyll::Hooks.trigger(:post_render, doc)
    doc.output
  end

  def test_standard_http
    html = '<a href="http://example.com" target="_blank">Link</a>'
    expected = '<a href="http://example.com" target="_blank" rel="noopener noreferrer">Link</a>'
    assert_equal(expected, process(html))
  end

  def test_protocol_relative
    html = '<a href="//example.com" target="_blank">Link</a>'
    # Currently expected to FAIL (returns original)
    expected = '<a href="//example.com" target="_blank" rel="noopener noreferrer">Link</a>'
    assert_equal(expected, process(html), "Protocol relative URL should be handled")
  end

  def test_target_before_href
    html = '<a target="_blank" href="https://example.com">Link</a>'
    # Currently expected to FAIL (returns original)
    expected = '<a target="_blank" href="https://example.com" rel="noopener noreferrer">Link</a>'
    assert_equal(expected, process(html), "Target before href should be handled")
  end

  def test_existing_rel
    html = '<a href="https://example.com" target="_blank" rel="nofollow">Link</a>'
    # Currently expected to FAIL or produce duplicates if regex is bad
    expected = '<a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">Link</a>'
    assert_equal(expected, process(html))
  end

  def test_internal_link
    html = '<a href="/about" target="_blank">Link</a>'
    assert_equal(html, process(html))
  end
end
