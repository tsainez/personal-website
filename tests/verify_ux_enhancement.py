import unittest
import os
import re

class TestUXEnhancement(unittest.TestCase):
    def test_header_aria_current(self):
        """Test that _includes/header.html contains logic for aria-current='page'."""
        header_path = os.path.join('_includes', 'header.html')
        self.assertTrue(os.path.exists(header_path), "header.html does not exist.")

        with open(header_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for the presence of logic that adds aria-current="page"
            # We look for something like: if my_page.url == page.url
            # And aria-current="page" inside the anchor tag
            self.assertTrue(re.search(r'{%\s*if\s+my_page.url\s*==\s*page.url\s*%}', content),
                           "Liquid condition for current page not found in header.html")
            self.assertTrue(re.search(r'aria-current="page"', content),
                           "aria-current='page' attribute not found in header.html")

    def test_css_active_link_style(self):
        """Test that assets/main.scss contains styles for the active link."""
        css_path = os.path.join('assets', 'main.scss')
        self.assertTrue(os.path.exists(css_path), "main.scss does not exist.")

        with open(css_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for the selector. It might be nested or direct.
            # We look for [aria-current="page"]
            self.assertTrue(re.search(r'\[aria-current="page"\]', content),
                           "Style for [aria-current='page'] not found in main.scss")

if __name__ == '__main__':
    unittest.main()
