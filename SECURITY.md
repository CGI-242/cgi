# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| main    | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in CGI-242, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please send an email to: **contact@normx-ai.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a timeline for resolution.

## Security Measures

- All secrets managed via GitHub Secrets (never committed to repo)
- HTTPS enforced with modern TLS 1.2/1.3 cipher suites
- CSP strict (no unsafe-inline/unsafe-eval)
- Rate limiting on all API endpoints
- Docker containers run as non-root
- Audit logging on sensitive operations
- MFA support with encrypted secrets
