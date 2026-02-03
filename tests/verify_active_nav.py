import os
import unittest
from bs4 import BeautifulSoup

class TestActiveNav(unittest.TestCase):
    def test_about_page_has_active_nav(self):
        """
        Verify that the About page has aria-current="page" on the About navigation link.
        """
        path = os.path.join('_site', 'about', 'index.html')
        self.assertTrue(os.path.exists(path), f"{path} does not exist. Did you build the site?")

        with open(path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # Find the navigation
        nav = soup.find('nav', class_='site-nav')
        self.assertIsNotNone(nav, "Navigation not found")

        # Find the link to About
        # The link text should be "About" or similar based on page title.
        # Based on _includes/header.html, it uses my_page.title
        about_link = nav.find('a', string='About')
        self.assertIsNotNone(about_link, "About link not found in navigation")

        # Check for aria-current="page"
        aria_current = about_link.get('aria-current')
        self.assertEqual(aria_current, 'page', f"About link does not have aria-current='page'. Found: {aria_current}")

if __name__ == '__main__':
    unittest.main()
