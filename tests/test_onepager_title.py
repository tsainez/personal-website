import re
import os
import sys

# Define the path to the layout file relative to the repo root
# Assuming this script is run from the repo root or we can find it.
LAYOUT_FILE = "_layouts/onepager.html"

def verify_title_logic():
    if not os.path.exists(LAYOUT_FILE):
        print(f"FAIL: Layout file '{LAYOUT_FILE}' does not exist.")
        return False

    with open(LAYOUT_FILE, 'r') as f:
        content = f.read()

    # Regex to find the <title> tag
    title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL)

    if not title_match:
        print("FAIL: <title> tag not found.")
        return False

    title_content = title_match.group(1).strip()

    # We want to see something that checks page.title
    # It should look something like: {% if page.title %}{{ page.title | escape }} | {% endif %}{{ site.title | escape }}
    # We will check for "page.title" and optionally "escape"

    if "page.title" not in title_content:
        print(f"FAIL: <title> tag content '{title_content}' does not include 'page.title'.")
        return False

    if "escape" not in title_content:
         print(f"WARNING: <title> tag content '{title_content}' does not seem to use 'escape' filter.")
         # We won't fail strictly on this unless required, but it is good practice.

    print(f"SUCCESS: <title> tag logic seems correct: {title_content}")
    return True

if __name__ == "__main__":
    # Ensure we are in the root or can access the file
    if not os.path.exists(LAYOUT_FILE) and os.path.exists(os.path.join("..", LAYOUT_FILE)):
        # If running from tests/ directory
        LAYOUT_FILE = os.path.join("..", LAYOUT_FILE)

    if verify_title_logic():
        sys.exit(0)
    else:
        sys.exit(1)
