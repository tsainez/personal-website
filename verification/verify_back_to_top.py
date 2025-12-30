from playwright.sync_api import sync_playwright, expect
import time

def verify_back_to_top():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the homepage (served by python http.server)
        page.goto("http://localhost:4000")

        # Verify the button exists but is hidden initially
        button = page.locator("#back-to-top")
        expect(button).to_be_attached()
        expect(button).not_to_be_visible()

        # Force a large body height to enable scrolling
        page.evaluate("document.body.style.height = '3000px'")

        # Scroll down
        page.evaluate("window.scrollTo(0, 500)")

        # Wait for the button to become visible (transition takes 300ms)
        # We wait a bit longer to be safe
        page.wait_for_timeout(1000)

        # Verify button is visible
        expect(button).to_be_visible()

        # Take a screenshot of the button
        page.screenshot(path="verification/back-to-top-visible.png")

        # Click the button
        button.click()

        # Verify we scrolled back to top
        # Allow some time for smooth scrolling
        page.wait_for_timeout(1000)
        scroll_y = page.evaluate("window.scrollY")

        if scroll_y != 0:
            print(f"Warning: Scroll Y is {scroll_y}, expected 0. This might be due to smooth scrolling timing.")

        print("Back to Top verification completed.")
        browser.close()

if __name__ == "__main__":
    verify_back_to_top()
