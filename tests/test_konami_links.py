import pytest
from playwright.sync_api import Page, expect

def test_konami_links_color(page: Page):
    """
    Verifies that triggering the Konami code (Zero Gravity Mode)
    changes the link color to ensure visibility against the dark background.
    """
    # Load the homepage
    page.goto("http://localhost:4000/")

    # Enter Konami Code
    konami_code = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "b", "a"
    ]

    for key in konami_code:
        page.keyboard.press(key)
        page.wait_for_timeout(50)

    # Wait for zero gravity to activate.
    # Check for the link color change to #66ccff (rgb(102, 204, 255))
    # We check the site title which is usually a link, or the first link found.
    link = page.locator(".site-title").first
    if not link.count():
        link = page.locator("a").first

    # Ensure at least one link exists
    expect(link).to_be_visible()

    # Verify link color changes to light blue
    expect(link).to_have_css("color", "rgb(102, 204, 255)", timeout=5000)

    # Verify body background changes to dark space color #050510 (rgb(5, 5, 16))
    expect(page.locator("body")).to_have_css("background-color", "rgb(5, 5, 16)", timeout=5000)
