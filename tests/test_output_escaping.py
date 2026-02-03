import unittest
import re
from pathlib import Path

class TestOutputEscaping(unittest.TestCase):
    def check_file(self, filepath, variables):
        path = Path(filepath)
        if not path.exists():
            self.fail(f"File {filepath} not found.")

        content = path.read_text(encoding='utf-8')

        for var in variables:
            # Regex explanation:
            # \{\{ \s* : Match opening braces and optional whitespace
            # variable_name : The variable we are looking for (escaped)
            # [^}]*? : Match any character that isn't a closing brace (non-greedy)
            # \}\} : Match closing braces
            pattern = re.compile(r'\{\{\s*' + re.escape(var) + r'[^}]*?\}\}')

            matches = pattern.finditer(content)
            for match in matches:
                snippet = match.group(0)
                # Check if 'escape' filter is present in the tag
                self.assertTrue(
                    '| escape' in snippet or '|escape' in snippet,
                    f"Unescaped variable '{var}' found in {filepath}: {snippet}"
                )

    def test_home_layout(self):
        self.check_file('_layouts/home.html', ['page.title', 'page.list_title'])

    def test_post_layout(self):
        self.check_file('_layouts/post.html', ['page.author'])

    def test_footer_include(self):
        self.check_file('_includes/footer.html', ['site.email'])

if __name__ == '__main__':
    unittest.main()
