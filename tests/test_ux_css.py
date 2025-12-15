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
            self.assertIn("scroll-behavior: smooth", content, "Smooth scrolling not found in CSS")

    def test_css_contains_focus_visible(self):
        """Test that focus-visible styles are present."""
        css_path = os.path.join('_site', 'assets', 'main.css')
        self.assertTrue(os.path.exists(css_path), "main.css does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn(":focus-visible", content, ":focus-visible selector not found in CSS")
            self.assertIn("outline: 2px solid #82aaff", content, "Focus outline style not found")

    def test_css_contains_reduced_motion(self):
        """Test that reduced motion preference is respected."""
        css_path = os.path.join('_site', 'assets', 'main.css')
        self.assertTrue(os.path.exists(css_path), "main.css does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn("@media (prefers-reduced-motion: reduce)", content, "Reduced motion query not found")
            # We look for the block content roughly
            self.assertTrue(re.search(r"@media \(prefers-reduced-motion: reduce\) \{\s*html \{\s*scroll-behavior: auto;\s*\}\s*\}", content), "Reduced motion block incorrect")

if __name__ == '__main__':
    unittest.main()
