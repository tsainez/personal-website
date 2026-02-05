import os
import unittest
from bs4 import BeautifulSoup

class TestUXEnhancement(unittest.TestCase):
    def test_current_page_aria(self):
        # Assumes jekyll build has been run
        if not os.path.exists('_site/about/index.html'):
             self.skipTest("_site/about/index.html does not exist. Run jekyll build first.")

        with open('_site/about/index.html', 'r') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # Find the link to "About"
        # The URL structure in Jekyll usually results in /about/ for the about page
        # The header links are typically relative URLs.
        # In _includes/header.html: href="{{ my_page.url | relative_url }}"
        # For about.markdown, url is /about/, relative_url is /about/ (if baseurl is empty)

        nav_link = soup.find('a', attrs={'href': '/about/'})

        self.assertIsNotNone(nav_link, "Could not find About link in About page")
        self.assertEqual(nav_link.get('aria-current'), 'page', "About link on About page should have aria-current='page'")

        # Check that other links do NOT have aria-current="page"
        # Since I don't know exactly what other pages are there, I'll search for all page-links
        # and ensure any that isn't the About link doesn't have the attribute.

        other_links = soup.select('.site-nav .page-link')
        for link in other_links:
            if link['href'] != '/about/':
                self.assertNotEqual(link.get('aria-current'), 'page', f"Link to {link['href']} should not have aria-current='page' on About page")

    def test_css_styling(self):
        if not os.path.exists('_site/assets/main.css'):
             self.skipTest("_site/assets/main.css does not exist.")

        with open('_site/assets/main.css', 'r') as f:
            css_content = f.read()

        # Check for the selector. It might be minified or slightly different, so I'll be flexible.
        # But generally verifying the string is present is good enough for now.
        # Sass/Minifier might strip quotes
        self.assertTrue('[aria-current="page"]' in css_content or '[aria-current=page]' in css_content, f"CSS should contain style for aria-current='page'. Content sample: {css_content[:100]}...")
        # Sass/Minifier might strip spaces
        self.assertTrue('font-weight: bold' in css_content or 'font-weight:bold' in css_content, "CSS should apply font-weight: bold to current page")

if __name__ == '__main__':
    unittest.main()
