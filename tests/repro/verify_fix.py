from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with reduced motion preference
        context = browser.new_context(
            color_scheme='dark',
            forced_colors='none',
            reduced_motion='reduce'
        )
        page = context.new_page()

        print("Navigating to home page (Reduced Motion Mode)...")
        page.goto("http://localhost:4000/")

        # Type Konami Code
        print("Typing Konami code...")
        keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
        for key in keys:
            page.keyboard.press(key)
            time.sleep(0.05)

        # Wait for potential effects
        time.sleep(1)

        # 1. Verify Background Changed (Safe Mode should still do this)
        bg_color = page.evaluate("document.body.style.backgroundColor")
        print(f"Background color: {bg_color}")
        # Expected: rgb(5, 5, 16) or similar
        assert "rgb(5, 5, 16)" in bg_color or "#050510" in bg_color, "Background did not change in Safe Mode"

        # 2. Verify Rocket is MISSING
        rocket = page.locator("#rocket")
        count = rocket.count()
        if count == 0:
            print("SUCCESS: Rocket not found in Reduced Motion mode.")
        else:
            print(f"FAILURE: Rocket found! Count: {count}")
            exit(1)

        # 3. Verify Stars are MISSING
        stars = page.locator(".star")
        star_count = stars.count()
        if star_count == 0:
             print("SUCCESS: Stars not found in Reduced Motion mode.")
        else:
             print(f"FAILURE: Stars found! Count: {star_count}")
             exit(1)

        # 4. Verify Indicator Text
        indicator = page.get_by_text("Zero Gravity (Reduced Motion Mode)")
        expect(indicator).to_be_visible()
        print("SUCCESS: Reduced Motion indicator visible.")

        # Screenshot
        page.screenshot(path="tests/repro/3_reduced_motion.png")
        print("Screenshot taken.")

        # 5. Verify Escape Key Reload
        # We need to detect reload. One way is to check if 'isZeroGravityActive' state is lost or styles are reverted.
        # But 'reload' is hard to test unless we check navigation.

        print("Pressing Escape...")
        with page.expect_navigation():
            page.keyboard.press("Escape")

        print("Navigation happened (Reload).")

        # Verify background is back to normal (or at least not the forced style)
        # On reload, the inline style on body should be gone.
        bg_style = page.evaluate("document.body.getAttribute('style')")
        print(f"Body style after reload: {bg_style}")

        if not bg_style or "background-color" not in bg_style:
             print("SUCCESS: Page reloaded, styles reset.")
        else:
             print("WARNING: Body style might persist? " + str(bg_style))

        browser.close()

if __name__ == "__main__":
    run()
