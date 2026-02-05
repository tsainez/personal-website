import unittest
import os
import re

class TestSecurityEscaping(unittest.TestCase):
    def check_file_for_unescaped_var(self, filepath, variable):
        if not os.path.exists(filepath):
            return

        with open(filepath, 'r') as f:
            content = f.read()

        # Find all occurrences of {{ ... variable ... }}
        # This is a naive check.
        # We want to find {{ ... variable ... }} that does NOT contain 'escape'

        # Regex to find {{ <anything> variable <anything> }}
        # Non-greedy match for content inside {{ }}
        matches = re.findall(r'\{\{.*?\}\}', content)

        for match in matches:
            # We are looking for exact variable usage, so we need to be careful.
            # e.g. 'page.title' should match, but 'page.title_something' should not necessarily.
            # But for now, simple containment is likely sufficient for these specific vars.

            if variable in match:
                # Check if 'escape' or 'xml_escape' is in the match
                if 'escape' not in match and 'xml_escape' not in match:
                    self.fail(f"Unescaped variable '{variable}' found in {filepath}: {match}")

    def test_layouts_home_page_title(self):
        self.check_file_for_unescaped_var('_layouts/home.html', 'page.title')

    def test_layouts_home_list_title(self):
        self.check_file_for_unescaped_var('_layouts/home.html', 'page.list_title')

    def test_layouts_post_page_author(self):
        self.check_file_for_unescaped_var('_layouts/post.html', 'page.author')

    def test_includes_footer_site_email(self):
        self.check_file_for_unescaped_var('_includes/footer.html', 'site.email')

if __name__ == '__main__':
    unittest.main()
