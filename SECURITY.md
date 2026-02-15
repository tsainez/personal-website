# Security Policy

## Supported Versions

Only the latest version of this project is currently supported.

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this project seriously. If you have found a vulnerability, please do not open a public issue. Instead, please follow these steps:

1. **Email us**: Send a detailed description of the vulnerability to [tsainez@gmail.com](mailto:tsainez@gmail.com).
2. **Include details**: Please provide as much information as possible, including:
   - Type of vulnerability.
   - Steps to reproduce.
   - Potential impact.
3. **Response**: We will make a best effort to respond within 48 hours to acknowledge your report.

You can also find our security contact information in our [`security.txt`](.well-known/security.txt) file (deployed at `/.well-known/security.txt`).

## Security Best Practices used in this project

- **Content Security Policy (CSP)**: We enforce a strict CSP to mitigate XSS and other injection attacks.
- **Frame Busting**: We implement defenses against Clickjacking.
- **Dependency Management**: We regularly update dependencies to patch known vulnerabilities.
- **Static Analysis**: We use automated tools to scan for security issues.
- **Automated Link Protection**: All external links opening in a new tab (`target="_blank"`) are automatically secured with `rel="noopener noreferrer"`.
