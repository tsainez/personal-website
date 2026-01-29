import sys
import subprocess
import time
# requests is unused
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sync_playwright = None

def run_test():
    if sync_playwright is None:
        print("Playwright not installed. Skipping test.")
        return

    # 1. Start Jekyll Server
    print("Starting Jekyll server...")
    jekyll_process = subprocess.Popen(
        ["bundle", "exec", "jekyll", "serve", "--port", "4000", "--skip-initial-build"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # 2. Serve the attacker page (simple python http server)
    print("Starting Attacker server...")
    attacker_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8000", "--directory", "tests/repro"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    try:
        # Wait for servers to start
        time.sleep(5)

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            # Capture console logs
            page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
            page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

            print("Navigating to Attacker Page...")
            try:
                page.goto("http://localhost:8000/attacker.html")
            except Exception as e:
                print(f"Error navigating: {e}")
                return False

            # Allow some time for scripts to run
            time.sleep(2)

            # Get the iframe
            frame_element = page.query_selector("#victim-frame")
            if not frame_element:
                print("Error: Iframe element not found.")
                return False

            frame = frame_element.content_frame()
            if not frame:
                print("Error: Iframe content not accessible.")
                return False

            # Check if the body inside the frame is visible
            is_visible = False
            try:
                # We check if 'body' is visible.
                # If display:none on html, body is not visible.
                body_handle = frame.wait_for_selector("body", state="attached", timeout=2000)
                if body_handle:
                    is_visible = body_handle.is_visible()
            except Exception as e:
                print(f"Error checking visibility: {e}")

            print(f"Frame Body Visible: {is_visible}")

            current_url = page.url
            print(f"Current URL: {current_url}")

            if "localhost:8000" in current_url and is_visible:
                print("VULNERABILITY CONFIRMED: Site is framed and visible.")
            elif "localhost:8000" in current_url and not is_visible:
                 print("PROTECTION CONFIRMED: Site is framed but HIDDEN.")
            elif "localhost:4000" in current_url:
                 print("REDIRECT SUCCESSFUL: Frame busting worked.")

            browser.close()

    finally:
        jekyll_process.terminate()
        attacker_process.terminate()

if __name__ == "__main__":
    run_test()
