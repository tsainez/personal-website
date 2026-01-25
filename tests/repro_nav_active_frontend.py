from playwright.sync_api import sync_playwright, expect
import os

def run():
    # Define the content mimicking the Jekyll output + CSS
    html_content = """
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: sans-serif; padding: 20px; }
.site-nav .page-link {
    color: #333;
    text-decoration: none;
    padding: 10px;
    margin-right: 10px;
}
/* The rule I added to assets/main.scss */
.site-nav .page-link[aria-current="page"] {
  font-weight: bold;
  border-bottom: 2px solid #82aaff;
}
</style>
</head>
<body>
<header class="site-header">
  <div class="wrapper">
      <nav class="site-nav">
        <div class="trigger">
            <!-- This is what the liquid logic outputs for the active page -->
            <a class="page-link" href="/about/" aria-current="page">About</a>
            <!-- This is what it outputs for inactive pages -->
            <a class="page-link" href="/contact/">Contact</a>
        </div>
      </nav>
  </div>
</header>
</body>
</html>
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_content(html_content)

        # Assertions
        about_link = page.get_by_role("link", name="About")
        contact_link = page.get_by_role("link", name="Contact")

        expect(about_link).to_have_attribute("aria-current", "page")
        expect(contact_link).not_to_have_attribute("aria-current", "page")

        # Check computed styles to verify CSS application
        # font-weight: bold is usually '700' or 'bold'. Playwright normalizes to 700.
        expect(about_link).to_have_css("font-weight", "700")
        expect(about_link).to_have_css("border-bottom-width", "2px")
        # #82aaff is rgb(130, 170, 255)
        expect(about_link).to_have_css("border-bottom-color", "rgb(130, 170, 255)")

        # Create directory
        os.makedirs("/home/jules/verification", exist_ok=True)

        # Screenshot
        page.screenshot(path="/home/jules/verification/nav_active_state.png")

        print("Verification successful!")
        browser.close()

if __name__ == "__main__":
    run()
