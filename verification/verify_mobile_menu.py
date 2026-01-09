import sys
import threading
import http.server
import socketserver
import os
import time
from playwright.sync_api import sync_playwright

PORT = 4001
DIRECTORY = "_site"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    # allow_reuse_address must be set on the class or configured before bind
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

def verify_mobile_menu_a11y():
    if not os.path.exists(DIRECTORY):
        print(f"Error: {DIRECTORY} not found. Please run 'bundle exec jekyll build' first.")
        sys.exit(1)

    # Start server in a separate thread
    thread = threading.Thread(target=start_server)
    thread.daemon = True
    thread.start()

    # Give server a moment to start
    time.sleep(2)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Mobile viewport to trigger the hamburger menu
        page = browser.new_page(viewport={"width": 375, "height": 667})
        page.goto(f"http://localhost:{PORT}")

        try:
            # Check for the nav trigger label
            label_locator = page.locator('label[for="nav-trigger"]')

            if label_locator.count() == 0:
                print("FAIL: Mobile menu trigger label not found.")
                sys.exit(1)

            # Take a screenshot
            screenshot_path = "verification/mobile_menu.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

            accessible_name = label_locator.get_attribute("aria-label")
            text_content = label_locator.text_content()

            print(f"Label text content: '{text_content.strip()}'")
            print(f"Label aria-label: '{accessible_name}'")

            if accessible_name == "Toggle navigation":
                 print("SUCCESS: Mobile menu trigger has correct aria-label.")
            else:
                 print(f"FAIL: Mobile menu trigger has name: '{accessible_name}'")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mobile_menu_a11y()
