from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to home page...")
        page.goto("http://localhost:4000/")

        # Initial screenshot
        page.screenshot(path="tests/repro/1_initial.png")
        print("Initial screenshot taken.")

        # Type Konami Code
        # Up, Up, Down, Down, Left, Right, Left, Right, b, a
        print("Typing Konami code...")
        keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
        for key in keys:
            page.keyboard.press(key)
            time.sleep(0.1)

        # Wait for animation to start
        print("Waiting for effects...")
        time.sleep(2)

        # Check for background color change (deep space: #050510)
        bg_color = page.evaluate("document.body.style.backgroundColor")
        print(f"Background color: {bg_color}")

        # Take screenshot of effect
        page.screenshot(path="tests/repro/2_effect.png")
        print("Effect screenshot taken.")

        # Check if rocket exists
        rocket = page.locator("#rocket")
        if rocket.count() > 0:
            print("Rocket found!")
        else:
            print("Rocket NOT found.")

        browser.close()

if __name__ == "__main__":
    run()
