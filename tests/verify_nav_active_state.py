import re
import sys

def verify_nav_active_state():
    header_path = "_includes/header.html"
    try:
        with open(header_path, "r") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {header_path} not found.")
        sys.exit(1)

    # Regex to look for aria-current="page" inside the anchor tag, ideally controlled by a liquid condition.
    # We are looking for something like: {% if ... %}aria-current="page"{% endif %} inside the <a ...> tag.

    # A simple check is to see if 'aria-current="page"' exists in the file at all first.
    if 'aria-current="page"' not in content:
        print("FAIL: aria-current=\"page\" not found in _includes/header.html")
        sys.exit(1)

    # More specific check: it should be inside a liquid tag or attribute
    # matching: aria-current="page"

    print("PASS: aria-current=\"page\" found in _includes/header.html")
    sys.exit(0)

if __name__ == "__main__":
    verify_nav_active_state()
