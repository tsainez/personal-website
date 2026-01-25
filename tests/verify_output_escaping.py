import re
import os
import sys

CHECKS = [
    {
        "file": "_layouts/post.html",
        "var": "page.author",
        "description": "Post author escaping"
    },
    {
        "file": "_layouts/home.html",
        "var": "page.title",
        "description": "Home page title escaping"
    },
    {
        "file": "_layouts/home.html",
        "var": "page.list_title",
        "description": "Home page list title escaping"
    },
    {
        "file": "_includes/footer.html",
        "var": "site.email",
        "description": "Footer email escaping"
    }
]

def check_file(check):
    filepath = check["file"]
    var = check["var"]

    if not os.path.exists(filepath):
        print(f"ERROR: File {filepath} not found.")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    # Find all {{ ... var ... }} blocks
    # This regex looks for {{, anything, var, anything, }}
    # It captures the inside content.
    pattern = r'\{\{\s*[^}]*' + re.escape(var) + r'[^}]*\}\}'
    matches = re.findall(pattern, content)

    if not matches:
        print(f"WARNING: No usage of {var} found in {filepath}. Maybe it was removed?")
        return True # Not a failure if not used, but suspicious.

    passed = True
    for match in matches:
        # Check if | escape is present
        if "escape" not in match:
            print(f"FAIL: Unescaped usage in {filepath}: {match}")
            passed = False
        else:
            # print(f"PASS: Escaped usage in {filepath}: {match}")
            pass

    return passed

def main():
    all_passed = True
    for check in CHECKS:
        print(f"Checking {check['description']}...")
        if not check_file(check):
            all_passed = False

    if all_passed:
        print("ALL CHECKS PASSED")
        sys.exit(0)
    else:
        print("SOME CHECKS FAILED")
        sys.exit(1)

if __name__ == "__main__":
    main()
