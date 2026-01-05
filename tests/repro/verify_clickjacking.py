import http.server
import socketserver
import threading
import time
from playwright.sync_api import sync_playwright

PORT_TARGET = 8002
PORT_ATTACKER = 8003
Handler = http.server.SimpleHTTPRequestHandler

def start_server(port):
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    # Bind to 0.0.0.0 so we can access via 127.0.0.1 and localhost
    with socketserver.TCPServer(("0.0.0.0", port), Handler) as httpd:
        print(f"Serving at port {port}")
        httpd.serve_forever()

def run_test():
    # Start servers in background
    t1 = threading.Thread(target=start_server, args=(PORT_TARGET,), daemon=True)
    t2 = threading.Thread(target=start_server, args=(PORT_ATTACKER,), daemon=True)
    t1.start()
    t2.start()
    time.sleep(2) # Give it a second to start

    with sync_playwright() as p:
        browser = p.chromium.launch()

        # We simulate Cross-Origin by using localhost vs 127.0.0.1
        # Target (Victim) on 127.0.0.1
        target_url = f"http://127.0.0.1:{PORT_TARGET}/tests/repro/target.html"
        # Attacker on localhost (Different origin in some contexts, but let's be sure)
        # Actually, different ports on same IP are Cross-Origin.
        attacker_url = f"http://localhost:{PORT_ATTACKER}/tests/repro/attacker_cross_origin.html"

        # Creates a modified attacker page that points to the full URL of target
        import os
        with open("tests/repro/attacker.html", "r") as f:
            content = f.read()

        # Replace the src with the full cross-origin URL
        content_cross = content.replace('src="target.html"', f'src="{target_url}"')
        with open("tests/repro/attacker_cross_origin.html", "w") as f:
            f.write(content_cross)


        # TEST 1: Framed (Attacker) - Cross Origin
        print("\n--- Test 1: Framed Site (Attacker - Cross Origin) ---")
        page = browser.new_page()
        try:
            page.goto(attacker_url)
            page.wait_for_timeout(2000)

            # The target is in the iframe.
            # Since it's cross-origin, we can't easily access its content via page.frames[1].content()
            # But we can check if the frame *navigated* the top page.
            # If navigation succeeded, page.url should be target_url

            # Wait a bit more for potential navigation
            page.wait_for_timeout(1000)

            current_url = page.url
            print(f"Current URL: {current_url}")

            # In sandbox="allow-scripts", navigation is BLOCKED.
            # So the URL should still be attacker_url.
            # But the content inside the frame should be HIDDEN.

            if "attacker" in current_url:
                print("Navigation blocked (expected for sandbox). Checking visibility...")
                # To check visibility inside a cross-origin frame, Playwright is tricky.
                # But we can try locating the frame.
                frame = page.frames[1]

                # frame.evaluate will throw if cross-origin? No, Playwright handles it via CDP usually.
                try:
                    display_style = frame.evaluate("document.documentElement.style.display")
                    print(f"Iframe document display style: '{display_style}'")

                    if display_style == 'none':
                         print("SUCCESS: Site is hidden inside cross-origin sandboxed frame.")
                    else:
                         print("FAILURE: Site is visible inside cross-origin sandboxed frame.")
                except Exception as e:
                    print(f"Could not evaluate inside frame (SOP?): {e}")
                    # If we can't inspect it, we might assume protection if we trust Test 1.

            else:
                 print("Navigation succeeded! (Unexpected for sandbox='allow-scripts' only)")

        except Exception as e:
            print(f"Test 1 Error: {e}")
        finally:
            page.close()

        # TEST 2: Direct Access (Normal User)
        print("\n--- Test 2: Direct Access (Normal User) ---")
        page = browser.new_page()
        try:
            page.goto(target_url)
            page.wait_for_timeout(1000)

            display_style = page.evaluate("document.documentElement.style.display")
            is_visible = page.is_visible("h1")

            print(f"Main document display style: '{display_style}'")
            print(f"Main content visible: {is_visible}")

            if display_style != 'none' and is_visible:
                print("SUCCESS: Site is visible when accessed directly.")
            else:
                print("FAILURE: Site is hidden when accessed directly!")
        except Exception as e:
            print(f"Test 2 Error: {e}")
        finally:
            page.close()
            browser.close()

if __name__ == "__main__":
    run_test()
