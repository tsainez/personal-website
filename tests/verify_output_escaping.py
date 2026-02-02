import re
import sys
import os

def verify_escaping(filepath, variable):
    """
    Verifies that the given variable is escaped in the file when output.
    """
    if not os.path.exists(filepath):
        print(f"Error: File {filepath} not found.")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to match {{ ... variable ... }} tags
    # We want to match the whole tag to inspect filters.
    # We look for the variable being the primary thing, but it might be preceded by nothing or whitespace.
    # Simplification: match {{ <variable> <filters> }}
    # But sometimes it is {{ <something> | default: <variable> }}. That is rare for these top-level vars.
    # Usually it is {{ variable | filter }}.

    # We use a pattern that finds the variable inside {{ }}.
    # We assume standard usage {{ variable ... }}

    pattern = r"\{\{\s*" + re.escape(variable) + r"\b(.*?)\}\}"

    matches = re.finditer(pattern, content)

    issues_found = 0

    # Regex to ensure 'escape' is used as a filter, not just present in a string
    # It should be preceded by a pipe '|'.
    escape_filter_pattern = r"\|\s*(?:cgi_|xml_)?escape\b"

    for match in matches:
        full_match = match.group(0)
        rest_of_tag = match.group(1)

        # Check if escaped
        if not re.search(escape_filter_pattern, rest_of_tag):
             print(f"FAIL: {variable} is not escaped in {filepath}")
             print(f"  Match: {full_match}")
             issues_found += 1

    return issues_found == 0

def main():
    checks = [
        ('_layouts/default.html', 'page.lang'),
        ('_layouts/post.html', 'page.author'),
        ('_layouts/home.html', 'page.title'),
        ('_layouts/home.html', 'page.list_title'),
        ('_includes/footer.html', 'site.email'),
    ]

    all_passed = True
    print("Verifying output escaping...")
    for filepath, variable in checks:
        if not verify_escaping(filepath, variable):
            all_passed = False

    if all_passed:
        print("All checks passed! No unescaped variables found.")
        sys.exit(0)
    else:
        print("Verification failed: Unescaped variables found.")
        sys.exit(1)

if __name__ == "__main__":
    main()
