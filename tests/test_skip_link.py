import os
import pytest
from playwright.sync_api import Page, expect

def test_skip_link_navigation(page: Page):
    """
    Test that the skip link is present, focuses on tab, and navigates to main content.
    """
    # The site is running on localhost:4000
    page.goto("http://localhost:4000/")

    # Press Tab to focus the first element
    page.keyboard.press("Tab")

    # Check if the focused element is the skip link
    skip_link = page.locator(".skip-link")
    expect(skip_link).to_be_focused()
    expect(skip_link).to_be_visible() # It should be visible when focused (top: 0)

    # Press Enter to activate the link
    page.keyboard.press("Enter")

    # Check if the URL fragment is updated
    assert "main-content" in page.url

    # Check if the focus is moved to the main content
    # Note: Focus might not be visually set on the main element in all browsers unless tabindex="-1" is set,
    # but the viewport should scroll.
    # We can check if the main content is in view.
    main_content = page.locator("#main-content")
    expect(main_content).to_be_in_viewport()
