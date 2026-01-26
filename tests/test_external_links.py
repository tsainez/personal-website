import unittest
import os
import subprocess

class TestExternalLinksPlugin(unittest.TestCase):
    def test_plugin_content_static(self):
        """Verify the plugin file contains the expected logic signatures."""
        plugin_path = '_plugins/external_links.rb'
        if not os.path.exists(plugin_path):
             plugin_path = '../_plugins/external_links.rb'

        self.assertTrue(os.path.exists(plugin_path), "Plugin file not found")

        with open(plugin_path, 'r') as f:
            content = f.read()

        # Regex signature
        # Use triple quotes to avoid escaping issues
        self.assertIn(r'''<a\s+(?:[^>]*\s+)?target=(["'])_blank\1[^>]*>''', content)

        # Logic signature
        self.assertIn(r'''match.match(/href=(["'])(?:https?:)?\/\//i)''', content)

    def test_plugin_logic_execution(self):
        """Run a Ruby script to verify the logic dynamically."""

        ruby_script = """
module Jekyll
  module Hooks
    def self.register(owners, event, &block)
      @hook_block = block
    end
    def self.run_hook(doc)
      @hook_block.call(doc)
    end
  end
end

class Doc
  attr_accessor :output, :output_ext
  def initialize(html)
    @output = html
    @output_ext = ".html"
  end
end

# Adjust path to find the plugin relative to where script is run
require_relative '_plugins/external_links.rb'

def verify(html, expected)
  doc = Doc.new(html)
  Jekyll::Hooks.run_hook(doc)
  if doc.output != expected
    puts "FAIL: Expected #{expected}, got #{doc.output}"
    exit 1
  end
end

# Test Cases
verify('<a href="https://g.com" target="_blank">L</a>', '<a href="https://g.com" target="_blank" rel="noopener noreferrer">L</a>')
verify('<a target="_blank" href="//g.com">L</a>', '<a target="_blank" href="//g.com" rel="noopener noreferrer">L</a>')
verify('<a href="/local" target="_blank">L</a>', '<a href="/local" target="_blank">L</a>')
"""
        temp_file = 'temp_verify_external_links.rb'
        with open(temp_file, 'w') as f:
            f.write(ruby_script)

        try:
            result = subprocess.run(['ruby', temp_file], capture_output=True, text=True)
            if result.returncode != 0:
                self.fail(f"Ruby verification failed:\\n{result.stderr}\\n{result.stdout}")
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

if __name__ == '__main__':
    unittest.main()
