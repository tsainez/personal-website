from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Open the About page which was built by Jekyll
        # file_path = os.path.abspath("_site/about/index.html")
        # page.goto(f"file://{file_path}")
        page.goto("http://localhost:8000/about/")

        # Check if the About link has aria-current="page"
        about_link = page.locator(".site-nav .page-link[href='/about/']")

        # Verify aria-current attribute
        aria_current = about_link.get_attribute("aria-current")
        print(f"aria-current: {aria_current}")

        if aria_current != "page":
            print("ERROR: aria-current attribute missing or incorrect")

        # Verify styling (bold)
        # We can check computed style
        font_weight = about_link.evaluate("element => getComputedStyle(element).fontWeight")
        print(f"font-weight: {font_weight}")

        if font_weight != "700" and font_weight != "bold":
             print("ERROR: font-weight is not bold")

        # Take screenshot of the navigation
        header = page.locator("header.site-header")
        if not os.path.exists("tests/repro/screenshots"):
            os.makedirs("tests/repro/screenshots")
        header.screenshot(path="tests/repro/screenshots/ux_enhancement.png")
        print("Screenshot saved to tests/repro/screenshots/ux_enhancement.png")

        browser.close()

if __name__ == "__main__":
    run()
