import re

def verify_nav_active_state():
    with open('_includes/header.html', 'r') as f:
        content = f.read()

    # Look for the page-link anchor tag
    # We want to see if there is any logic that adds aria-current or class="active" based on page url

    # The current line is:
    # <a class="page-link" href="{{ my_page.url | relative_url }}">{{ my_page.title | escape }}</a>

    pattern = r'<a class="page-link" href="\{\{ my_page.url \| relative_url \}}"(.*?)>\{\{ my_page.title \| escape \}\}</a>'

    match = re.search(pattern, content)
    if not match:
        print("Could not find the navigation link pattern. It might be already modified.")
        return

    attributes = match.group(1)

    if 'aria-current="page"' in content and '{% if my_page.url == page.url %}' in content:
         print("✅ aria-current logic found.")
    else:
         print("❌ aria-current logic MISSING.")

if __name__ == "__main__":
    verify_nav_active_state()
