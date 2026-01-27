import unittest
import os
import re

class TestNavActiveState(unittest.TestCase):
    def test_header_html_contains_aria_current(self):
        """Test that header.html contains the liquid logic for aria-current."""
        filepath = os.path.join('_includes', 'header.html')
        self.assertTrue(os.path.exists(filepath), "header.html does not exist.")

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for the specific liquid logic
            # We look for the condition checking page.url and the attribute aria-current="page"
            self.assertTrue(re.search(r'{%\s*if\s+my_page\.url\s*==\s*page\.url\s*%}', content), "Liquid condition for page.url match not found")
            self.assertIn('aria-current="page"', content, "aria-current attribute not found")

    def test_main_scss_contains_active_style(self):
        """Test that main.scss contains the style for the active link."""
        filepath = os.path.join('assets', 'main.scss')
        self.assertTrue(os.path.exists(filepath), "main.scss does not exist.")

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for the selector
            # Regex to handle potential spacing variations
            pattern = r'\.site-nav\s+\.page-link\[aria-current="page"\]\s*\{'
            self.assertTrue(re.search(pattern, content), "Active link selector not found in main.scss")

            # Since we added it in a block, we can verify the content roughly
            # finding the block is harder with simple regex, but we can check if the strings exist
            self.assertIn('font-weight: bold', content)
            self.assertIn('color: $focus-color', content)

if __name__ == '__main__':
    unittest.main()
