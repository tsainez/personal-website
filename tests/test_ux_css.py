import unittest
import os
import re

class TestUXCSS(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """
        ⚡ Bolt Optimization: Cache the CSS content once for the entire test class.
        Reading the same generated static file on every test method causes redundant
        disk I/O operations. Using setUpClass noticeably improves test execution speed.
        """
        css_path = os.path.join('_site', 'assets', 'main.css')
        if not os.path.exists(css_path):
            raise FileNotFoundError("main.css does not exist. Run jekyll build first.")
        with open(css_path, 'r', encoding='utf-8') as f:
            cls.css_content = f.read()

    def test_css_contains_smooth_scrolling(self):
        """Test that smooth scrolling is enabled in the CSS."""
        # Allow for optional spaces around colon
        self.assertTrue(re.search(r"scroll-behavior:\s*smooth", self.css_content), "Smooth scrolling not found in CSS")

    def test_css_contains_focus_visible(self):
        """Test that focus-visible styles are present."""
        self.assertIn(":focus-visible", self.css_content, ":focus-visible selector not found in CSS")
        # Allow for optional spaces and case insensitivity if needed, though colors are usually consistent
        self.assertTrue(re.search(r"outline:\s*2px solid #82aaff", self.css_content), "Focus outline style not found")

    def test_css_contains_reduced_motion(self):
        """Test that reduced motion preference is respected."""
        # Allow for minified format: @media(prefers-reduced-motion: reduce) (no space after @media)
        self.assertTrue(re.search(r"@media\s*\(prefers-reduced-motion:\s*reduce\)", self.css_content), "Reduced motion query not found")

        # Check for the rule inside. Minified output might be:
        # @media(prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
        # So we check for the existence of the rule in a flexible way.
        self.assertTrue(re.search(r"html\s*\{\s*scroll-behavior:\s*auto\s*\}", self.css_content), "Reduced motion rule for html not found")

if __name__ == '__main__':
    unittest.main()
