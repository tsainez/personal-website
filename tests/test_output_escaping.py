import re
import unittest
import os

class TestOutputEscaping(unittest.TestCase):
    def test_home_page_title(self):
        filepath = '_layouts/home.html'
        variable = 'page.title'
        with open(filepath, 'r') as f:
            content = f.read()

        # We look for {{ page.title }} WITHOUT escape filter
        # Regex: {{\s*page\.title\s*(?!\|.*escape).*?}}
        # But this is tricky because | escape can be anywhere in the filter chain.
        # So we just find all occurrences and verify each has 'escape'.

        matches = re.finditer(r'{{\s*page\.title(.*?)\}\}', content)
        for match in matches:
            filters = match.group(1)
            if 'escape' not in filters:
                self.fail(f"Variable 'page.title' in '{filepath}' is not escaped. Found: {match.group(0)}")

    def test_home_list_title(self):
        filepath = '_layouts/home.html'
        with open(filepath, 'r') as f:
            content = f.read()

        # specifically checking for {{ page.list_title | default: "Posts" }}
        matches = re.finditer(r'{{\s*page\.list_title(.*?)\}\}', content)
        for match in matches:
            filters = match.group(1)
            if 'escape' not in filters:
                self.fail(f"Variable 'page.list_title' in '{filepath}' is not escaped. Found: {match.group(0)}")

    def test_post_author(self):
        filepath = '_layouts/post.html'
        with open(filepath, 'r') as f:
            content = f.read()

        matches = re.finditer(r'{{\s*page\.author(.*?)\}\}', content)
        for match in matches:
             filters = match.group(1)
             if 'escape' not in filters:
                 self.fail(f"Variable 'page.author' in '{filepath}' is not escaped. Found: {match.group(0)}")

    def test_site_email(self):
        filepath = '_includes/footer.html'
        with open(filepath, 'r') as f:
            content = f.read()

        matches = re.finditer(r'{{\s*site\.email(.*?)\}\}', content)
        for match in matches:
             filters = match.group(1)
             if 'escape' not in filters:
                 self.fail(f"Variable 'site.email' in '{filepath}' is not escaped. Found: {match.group(0)}")

if __name__ == '__main__':
    unittest.main()
