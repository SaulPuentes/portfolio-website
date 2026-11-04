---
name: deploying-site
description: Use when asked to deploy, upload or publish the site to the server.
---

# Deploying the site

Target: `hostinger-saulpuentes:domains/saulpuentes.com/public_html/` (SSH alias in `~/.ssh/config`; keep host/user/port out of the repo).

**Never `--delete`**: `public_html` also hosts other sites and files not in `out/`.

1. Real content must exist, else the build publishes sample data:
   `ls content/site.json content/data/{projects,skills,services,experiences,cv-contact}.json`
2. Build: `rm -rf out && pnpm build`. Fails → stop.
3. Dry run, show changes: `rsync -azn -i --exclude .DS_Store out/ <target>`
4. Confirm with user (unless already told to deploy), rerun without `-n`.
5. Verify: `curl -sI https://saulpuentes.com/ | head -1` → `200`.

`out/` needs the trailing slash. The "post-quantum key exchange" warning is harmless.
