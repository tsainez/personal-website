import re
import sys

def verify_escaping(filepath, variables):
    """
    Verifies that the specified variables are escaped in the given file.
    """
    with open(filepath, 'r') as f:
        content = f.read()

    errors = []
    for var in variables:
        # Regex to find unescaped usage: {{ var }} or {{ var | default: ... }}
        # We want to ensure it has | escape or | xml_escape before the closing }}
        # But wait, filters can be chained. {{ var | default: "x" | escape }} is valid.
        # {{ var | escape }} is valid.
        # So we look for {{ ... var ... }} and check if 'escape' is in the pipeline.

        # Simple regex: find all occurrences of {{ ... var ... }}
        # Then check if each occurrence has 'escape'

        # Pattern to match {{ ... var ... }}
        # We need to be careful not to match other variables that start with var name
        # e.g. matching 'site.title' should not match 'site.title_something'

        pattern = re.compile(r'\{\{.*?' + re.escape(var) + r'.*?\}\}')
        matches = pattern.findall(content)

        for match in matches:
            # check if it is the variable we are looking for (word boundary)
            # and not part of another variable name
            if not re.search(re.escape(var) + r'\b', match):
                continue

            # Check if 'escape' or 'xml_escape' is present
            if 'escape' not in match and 'xml_escape' not in match:
                errors.append(f"Unescaped variable '{var}' found in {filepath}: {match}")

    return errors

def main():
    checklist = [
        ('_layouts/home.html', ['page.title', 'page.list_title']),
        ('_layouts/post.html', ['page.author']),
        ('_includes/footer.html', ['site.email']),
        ('_layouts/default.html', ['page.lang', 'site.lang'])
    ]

    all_errors = []
    for filepath, vars_to_check in checklist:
        try:
            errors = verify_escaping(filepath, vars_to_check)
            all_errors.extend(errors)
        except FileNotFoundError:
            print(f"Warning: File {filepath} not found.")

    if all_errors:
        print("Security Verification Failed:")
        for error in all_errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("Security Verification Passed: All checked variables are escaped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
