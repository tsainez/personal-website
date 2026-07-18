import unittest
import os
import re

class TestUXCSS(unittest.TestCase):
    def test_css_contains_smooth_scrolling(self):
        """Test that smooth scrolling is enabled in the CSS."""
        css_path = os.path.join('_site', 'assets', 'main.css')
        self.assertTrue(os.path.exists(css_path), "main.css does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Allow for optional spaces around colon
            self.assertTrue(re.search(r"scroll-behavior:\s*smooth", content), "Smooth scrolling not found in CSS")

    def test_css_contains_focus_visible(self):
        """Test that focus-visible styles are present."""
        css_path = os.path.join('_site', 'assets', 'main.css')
        self.assertTrue(os.path.exists(css_path), "main.css does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn(":focus-visible", content, ":focus-visible selector not found in CSS")
            # Allow for optional spaces and case insensitivity if needed, though colors are usually consistent
            self.assertTrue(re.search(r"outline:\s*2px solid #82aaff", content), "Focus outline style not found")

    def test_css_contains_reduced_motion(self):
        """Test that reduced motion preference is respected."""
        css_path = os.path.join('_site', 'assets', 'main.css')
        self.assertTrue(os.path.exists(css_path), "main.css does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Allow for minified format: @media(prefers-reduced-motion: reduce) (no space after @media)
            self.assertTrue(re.search(r"@media\s*\(prefers-reduced-motion:\s*reduce\)", content), "Reduced motion query not found")

            # Check for the rule inside. Minified output might be:
            # @media(prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
            # So we check for the existence of the rule in a flexible way.
            self.assertTrue(re.search(r"html\s*\{\s*scroll-behavior:\s*auto\s*\}", content), "Reduced motion rule for html not found")

if __name__ == '__main__':
    unittest.main()
