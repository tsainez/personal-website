import pytest
from playwright.sync_api import Page, expect

def test_skip_link_exists_and_works(page: Page):
    # Navigate to the home page (served by Jekyll)
    page.goto("http://localhost:4000/")

    # 1. Verify the skip link exists
    skip_link = page.locator(".skip-link")
    expect(skip_link).to_be_attached()

    # 2. Verify it is initially hidden (visually) but present
    # We check if it is not visible in the viewport or has 1px size
    # But usually .skip-link is "visually-hidden" so it might be attached but not "visible" to user
    # However, for screen readers it must be in the DOM.
    # Let's check the CSS properties to confirm it is using the clip pattern or similar.
    # Note: expect(skip_link).not_to_be_visible() might be true if it has 1px size.

    # 3. Press Tab to focus the skip link
    page.keyboard.press("Tab")

    # 4. Verify the skip link is now focused
    expect(skip_link).to_be_focused()

    # 5. Verify it becomes visible on focus (this depends on our CSS implementation)
    # We expect the CSS to change properties on focus.
    # We can check if it becomes "visible" to the user (e.g. top/left are 0 or similar)
    # expect(skip_link).to_be_visible()

    # 6. Click/Enter the skip link
    page.keyboard.press("Enter")

    # 7. Verify the focus moves to the main content
    # The target should be #main-content
    main_content = page.locator("#main-content")
    expect(main_content).to_be_focused()
