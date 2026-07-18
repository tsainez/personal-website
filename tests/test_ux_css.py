import unittest
import os
import re

class TestUXCSS(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Read and cache CSS content once for all tests."""
        cls.css_path = os.path.join('_site', 'assets', 'main.css')
        # We don't fail here, we let individual tests fail if the file doesn't exist
        # However, to avoid errors opening a non-existent file:
        cls.css_exists = os.path.exists(cls.css_path)
        cls.content = ""
        if cls.css_exists:
            with open(cls.css_path, 'r', encoding='utf-8') as f:
                cls.content = f.read()

    def test_css_contains_smooth_scrolling(self):
        """Test that smooth scrolling is enabled in the CSS."""
        self.assertTrue(self.css_exists, "main.css does not exist.")
        # Allow for optional spaces around colon
        self.assertTrue(re.search(r"scroll-behavior:\s*smooth", self.content), "Smooth scrolling not found in CSS")

    def test_css_contains_focus_visible(self):
        """Test that focus-visible styles are present."""
        self.assertTrue(self.css_exists, "main.css does not exist.")
        self.assertIn(":focus-visible", self.content, ":focus-visible selector not found in CSS")
        # Allow for optional spaces and case insensitivity if needed, though colors are usually consistent
        self.assertTrue(re.search(r"outline:\s*2px solid #82aaff", self.content), "Focus outline style not found")

    def test_css_contains_reduced_motion(self):
        """Test that reduced motion preference is respected."""
        self.assertTrue(self.css_exists, "main.css does not exist.")
        # Allow for minified format: @media(prefers-reduced-motion: reduce) (no space after @media)
        self.assertTrue(re.search(r"@media\s*\(prefers-reduced-motion:\s*reduce\)", self.content), "Reduced motion query not found")

        # Check for the rule inside. Minified output might be:
        # @media(prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
        # So we check for the existence of the rule in a flexible way.
        self.assertTrue(re.search(r"html\s*\{\s*scroll-behavior:\s*auto\s*\}", self.content), "Reduced motion rule for html not found")

if __name__ == '__main__':
    unittest.main()
