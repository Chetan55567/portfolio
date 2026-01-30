# Security Policy

## Supported Versions

This project is actively maintained. Security updates are provided for the latest version.

## Security Considerations

### Authentication & Authorization
- **JWT Tokens**: Admin authentication uses JWT tokens with configurable expiration
- **Password Hashing**: Uses bcrypt for secure password hashing (not SHA-256)
- **Token Storage**: Frontend stores tokens in localStorage (consider httpOnly cookies for production)
- **Default Credentials**: admin/admin123 - **MUST BE CHANGED IN PRODUCTION**

### File Uploads
- **Size Limits**: 
  - Photos: 5MB maximum
  - Resumes: 10MB maximum
- **File Type Validation**: Extension-based validation (consider adding MIME type checking)
- **Unique Filenames**: UUID-based to prevent collisions and path traversal
- **Upload Directory**: Isolated from code execution paths

### Data Storage
- **File-Based**: JSON files stored in `/backend/data/`
- **No Encryption**: Sensitive data (like LLM API keys) stored in plaintext
- **Atomic Writes**: Uses temp file + rename for data integrity
- **No Concurrency Protection**: File locks not implemented

### CORS Configuration
- **Default**: Allows all origins (`*`)
- **Production**: Must be configured to specific domains via `CORS_ORIGINS` environment variable

### Environment Variables
- **SECRET_KEY**: Auto-generated if not provided (store securely!)
- **.env Files**: Should NOT be committed to version control
- **API Keys**: LLM API keys stored in portfolio data (consider encryption)

## Known Security Limitations

### Critical
1. **No Rate Limiting**: Endpoints vulnerable to brute force and DoS attacks
2. **LLM API Keys**: Stored and transmitted in plaintext
3. **No CSRF Protection**: Consider adding for production
4. **localStorage**: JWT tokens vulnerable to XSS attacks

### Medium
1. **File Type Validation**: Only checks extension, not MIME type or magic bytes
2. **No File Scanning**: Uploaded files not scanned for malware
3. **Weak Default Secret**: Although auto-generated, deployment scripts may use weak defaults
4. **No Audit Logging**: Admin actions not logged

### Low
1. **Token Expiration**: Fixed 24-hour expiration, no refresh mechanism
2. **No IP Restrictions**: Admin panel accessible from any IP
3. **Error Messages**: May leak information about system internals

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email the details to the repository owner
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if applicable)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Best Practices for Deployment

### Must Do
1. ✅ Change default admin credentials immediately
2. ✅ Set strong SECRET_KEY in environment variables
3. ✅ Configure CORS_ORIGINS to specific domains
4. ✅ Use HTTPS in production (via Let's Encrypt)
5. ✅ Keep dependencies updated (`pip install -U`, `npm update`)
6. ✅ Use .env files for secrets (not committed to git)

### Should Do
7. ⚠️ Implement rate limiting (e.g., using slowapi)
8. ⚠️ Add IP allowlist for admin panel
9. ⚠️ Encrypt sensitive data at rest
10. ⚠️ Implement audit logging
11. ⚠️ Add CSRF protection
12. ⚠️ Set up automated security scanning

### Consider
13. 💡 Use httpOnly cookies instead of localStorage
14. 💡 Implement file upload scanning
15. 💡 Add Content Security Policy headers
16. 💡 Use database instead of file storage for better concurrency
17. 💡 Implement backup and disaster recovery
18. 💡 Set up monitoring and alerting

## Secure Deployment Checklist

- [ ] Changed default admin password
- [ ] Set random SECRET_KEY in .env
- [ ] Configured CORS_ORIGINS for production domain(s)
- [ ] Enabled HTTPS with valid SSL certificate
- [ ] Restricted file upload directory permissions
- [ ] Set appropriate file size limits
- [ ] Configured firewall rules
- [ ] Updated all dependencies to latest versions
- [ ] Removed .env files from git history
- [ ] Set up regular backups
- [ ] Configured log rotation
- [ ] Tested admin authentication
- [ ] Verified file upload restrictions work
- [ ] Checked that API keys are not exposed in responses

## Dependencies with Known Issues

Check regularly:
```bash
# Python
pip audit

# Node.js  
npm audit
```

Fix non-breaking issues:
```bash
pip install --upgrade $(pip list --outdated --format=freeze | cut -d = -f 1)
npm audit fix
```

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Updates

This security policy was last updated: 2025-01-30

Security updates will be posted in GitHub releases with the `security` tag.
