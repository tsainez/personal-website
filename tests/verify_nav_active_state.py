import os
import re

def verify_header_html():
    header_path = '_includes/header.html'
    if not os.path.exists(header_path):
        print(f"Error: {header_path} not found.")
        return False

    with open(header_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for aria-current logic
    # allowing for some flexibility in whitespace
    pattern = r'{%\s*if\s+my_page\.url\s*==\s*page\.url\s*%}\s*aria-current="page"{%\s*endif\s*%}'
    if re.search(pattern, content):
        print(f"SUCCESS: Found aria-current logic in {header_path}")
        return True
    else:
        print(f"FAILURE: aria-current logic not found in {header_path}")
        # Debug output
        print("Content snippet:")
        print(content)
        return False

def verify_scss():
    scss_path = 'assets/main.scss'
    if not os.path.exists(scss_path):
        print(f"Error: {scss_path} not found.")
        return False

    with open(scss_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for CSS rule
    # .site-nav .page-link[aria-current="page"] {
    #   font-weight: bold;
    # }

    selector_pattern = r'\.site-nav\s+\.page-link\[aria-current="page"\]\s*\{'
    style_pattern = r'font-weight:\s*bold;'

    if re.search(selector_pattern, content) and re.search(style_pattern, content):
        print(f"SUCCESS: Found CSS rule for aria-current in {scss_path}")
        return True
    else:
        print(f"FAILURE: CSS rule not found in {scss_path}")
        return False

if __name__ == "__main__":
    header_ok = verify_header_html()
    scss_ok = verify_scss()

    if header_ok and scss_ok:
        print("All checks passed!")
        exit(0)
    else:
        print("Checks failed.")
        exit(1)
