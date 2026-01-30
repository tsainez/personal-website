import re
import sys
import os

# Configuration: File path -> List of variables to check
CHECKS = {
    "_layouts/post.html": ["page.author"],
    "_layouts/default.html": ["page.lang"],
    "_layouts/home.html": ["page.title", "page.list_title"],
    "_includes/footer.html": ["site.email"],
}

def check_file(filepath, variables):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    errors = []
    for var in variables:
        # Regex to find usage.
        # We capture the filter chain after the variable name until the closing braces.
        # We handle cases where variable might be part of a larger expression if needed,
        # but here we focus on direct usage like {{ variable ... }}

        # Pattern explanation:
        # \{\{\s*             : Start of tag
        # (?P<var>{re.escape(var)}) : The variable name
        # (?P<filters>.*?)    : The rest of the content inside the tag (filters)
        # \}\}                : End of tag

        pattern = r'\{\{\s*' + re.escape(var) + r'(?P<filters>.*?)\}\}'
        matches = re.finditer(pattern, content)

        found_usage = False
        for match in matches:
            found_usage = True
            filters = match.group('filters')

            # Check if 'escape' is in the filters
            # We also accept 'date_to_xmlschema' for dates, but not relevant for these vars.
            # We also check if it's NOT present.

            if 'escape' not in filters:
                 errors.append(f"Variable '{var}' used without escaping: {match.group(0)}")

        if not found_usage:
            # If variable is not found at all, that's fine (maybe removed),
            # but for this specific test we EXPECT it to be there.
            # However, logic might vary (e.g. if page.title is optional).
            # But let's warn if we expected to verify it and didn't find it.
            # print(f"Warning: Variable '{var}' not found in {filepath}")
            pass

    if errors:
        print(f"Security check failed for {filepath}:")
        for err in errors:
            print(f"  - {err}")
        return False

    return True

def main():
    print("Verifying Output Escaping...")
    failed = False
    for filepath, variables in CHECKS.items():
        if not check_file(filepath, variables):
            failed = True

    if failed:
        print("\nFAIL: Unescaped variables found.")
        sys.exit(1)
    else:
        print("\nPASS: All checked variables are escaped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
