import os
import unittest
from bs4 import BeautifulSoup

class TestActiveNav(unittest.TestCase):
    def test_about_page_has_active_state(self):
        file_path = '_site/about/index.html'

        if not os.path.exists(file_path):
            self.fail(f"File {file_path} does not exist. Please build the site first.")

        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # Find the nav link for About
        # <a class="page-link" href="/about/">About</a>
        # Note: href might be relative or absolute depending on config, but usually /about/

        nav_link = soup.find('a', class_='page-link', href='/about/')

        if not nav_link:
            # Fallback: try finding by text
            nav_links = soup.find_all('a', class_='page-link')
            for link in nav_links:
                if 'About' in link.get_text():
                    nav_link = link
                    break

        self.assertIsNotNone(nav_link, "Could not find 'About' navigation link")

        aria_current = nav_link.get('aria-current')
        self.assertEqual(aria_current, 'page', "About link on About page should have aria-current='page'")

if __name__ == '__main__':
    unittest.main()
