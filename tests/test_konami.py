import unittest
import os
from bs4 import BeautifulSoup

class TestKonami(unittest.TestCase):
    def test_konami_script_present(self):
        """Test that the konami.js script is included in the index.html file."""
        index_path = os.path.join('_site', 'index.html')
        self.assertTrue(os.path.exists(index_path), "index.html does not exist. Did you build the site?")

        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')

            # Find script tags
            scripts = soup.find_all('script')
            konami_found = False
            for script in scripts:
                if script.get('src') and 'konami.js' in script.get('src'):
                    konami_found = True
                    break

            self.assertTrue(konami_found, "konami.js script tag not found in index.html")

    def test_konami_file_exists(self):
        """Test that the konami.js file actually exists in the assets folder."""
        js_path = os.path.join('_site', 'assets', 'js', 'konami.js')
        self.assertTrue(os.path.exists(js_path), f"konami.js not found at {js_path}")

if __name__ == '__main__':
    unittest.main()
