import os
import re

def verify_header_includes_aria_current():
    filepath = "_includes/header.html"
    if not os.path.exists(filepath):
        print(f"❌ {filepath} not found.")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    # Check for the conditional aria-current logic
    # Look for: if my_page.url == page.url ... aria-current="page"
    # We use a broad pattern to catch multiline or spacing variations,
    # but specific enough to be correct.
    pattern = r'if\s+my_page\.url\s*==\s*page\.url.*aria-current="page"'
    match = re.search(pattern, content, re.DOTALL)

    if match:
        print(f"✅ {filepath} contains aria-current logic.")
        return True
    else:
        print(f"❌ {filepath} missing aria-current logic.")
        return False

def verify_scss_includes_active_style():
    filepath = "assets/main.scss"
    if not os.path.exists(filepath):
        print(f"❌ {filepath} not found.")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    # Check for the selector
    selector = r'\.site-nav \.page-link\[aria-current="page"\]'
    match = re.search(selector, content)

    if match:
        print(f"✅ {filepath} contains active link style.")
        return True
    else:
        print(f"❌ {filepath} missing active link style.")
        return False

if __name__ == "__main__":
    header_ok = verify_header_includes_aria_current()
    scss_ok = verify_scss_includes_active_style()

    if header_ok and scss_ok:
        print("🎉 Verification passed!")
        exit(0)
    else:
        print("💀 Verification failed.")
        exit(1)
