# Privacy Chick: Deployment Guide

## Current setup

- Repository: `privacychick/privacychick.io`
- Primary website: `https://privacychick.com`
- Hosting: GitHub Pages, published from `main` and `/(root)`
- DNS, proxy, TLS protection, and domain redirects: Cloudflare
- Contact form: `https://formspree.io/f/mvzdngnp`
- Email: Proton Mail, with both `.com` and `.io` domains retained

The repository name remains `privacychick.io`. It does not need to match the primary website domain. This is a static HTML, CSS, and JavaScript site, with no PHP, application backend, or database.

## Updating website content

1. Pull the latest `main` before making changes. Preserve any unrelated unpublished work before pulling.
2. Edit only the files required for the approved change. Keep existing navigation, images, styles, and unrelated pages intact.
3. Review the exact diff and obtain explicit approval before committing or pushing.
4. Commit only the approved files and push normally to `main`. Do not force-push or stage every file indiscriminately.
5. Wait for the GitHub Pages deployment to succeed, then verify the published pages at `https://privacychick.com`.

Do not delete the existing site, create a replacement repository, or change the Pages source as part of ordinary content updates.

## GitHub Pages custom domain

In the existing repository's **Settings → Pages**, the custom domain is `privacychick.com`. For branch-based publishing, GitHub updates the root `CNAME` file when the custom domain is saved.

The file must contain one domain only:

```text
privacychick.com
```

Pull GitHub's generated domain-change commit before preparing a later content commit. Do not publish an older local CNAME, add a second domain to it, or rename the repository.

Enable **Enforce HTTPS** when GitHub makes it available. An unchecked enforcement option is separate from whether a valid HTTPS certificate is already serving the domain.

## Cloudflare website DNS and TLS

The serving `.com` apex uses four GitHub Pages A records:

```text
@  185.199.108.153
@  185.199.109.153
@  185.199.110.153
@  185.199.111.153
```

The `www` CNAME points directly to `privacychick.github.io`, without a repository path.

These website records are **Proxied** in the finished configuration. Cloudflare uses **Full (strict)** with a valid GitHub origin certificate and an active Cloudflare edge certificate covering the apex and `www`. Do not use Flexible SSL.

If a future domain change requires certificate provisioning, temporary DNS-only website records may be used while the origin certificate is obtained. Restore proxying only after trusted origin HTTPS succeeds. DNS-only requests bypass Cloudflare's edge protections.

Keep mail-related records separate from website DNS. Proton's DKIM CNAMEs remain **DNS only**, even when website A records and `www` are proxied.

## Old-domain forwarding

In the `privacychick.io` Cloudflare zone, the redirect matches:

```text
(http.host in {"privacychick.io" "www.privacychick.io"})
```

Its dynamic destination is:

```text
concat("https://privacychick.com", http.request.uri.path)
```

Enable **Preserve query string**. Use 302 during migration testing, then 301 after final acceptance. Both old hostnames must have proxied DNS and valid edge HTTPS.

Keep the reverse `.com → .io` forwarding disabled. HTTP website redirects do not forward email.

## Contact form and security headers

Keep the existing Formspree endpoint and AJAX submission code unchanged. The current form is not a Netlify form and does not require EmailJS or a replacement service.

The existing Formspree email action should notify verified `contact@privacychick.com`. Keep the `.io` mailbox active. Formspree account email and form-notification recipient are separate settings.

The Content Security Policy must permit the site's existing scripts and styles and the AJAX connection to `https://formspree.io`. Preserve a compatible Referrer-Policy if Formspree domain restrictions are configured. Replace the existing CSP header rather than adding overlapping policies.

After a domain, form, or CSP change, verify browser success, the Formspree dashboard submission, and actual notification delivery to the intended recipient. A successful page load alone is not a complete form test.

## Email continuity

Keep `contact@privacychick.io`, `security@privacychick.io`, and `privacy@privacychick.io` active alongside their `.com` equivalents in the intended Proton users' mailboxes.

Do not remove either Proton domain or change working MX, SPF, DKIM, or DMARC records during a website-only update. Preserve an independently accessible Proton recovery address.

## Final checks

Verify trusted HTTPS, the primary hostname, old-domain path/query redirects, desktop and mobile navigation, guide tabs, images, the contact form, `robots.txt`, and `.well-known/security.txt` after deployment. Preserve existing AI-crawler restrictions. Do not advertise a sitemap unless a real sitemap is published.
