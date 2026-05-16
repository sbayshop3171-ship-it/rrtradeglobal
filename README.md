# RRTradeGlobal Website

Static HTML website project.

## Project Path

`/Users/muhammadrasel/Documents/mailk/Bricknet HTML/bricknet-html`

## Daily Git Workflow

Use these commands after each completed task:

```bash
cd "/Users/muhammadrasel/Documents/mailk/Bricknet HTML/bricknet-html"
git add .
git commit -m "feat: short update message"
git push
```

## Live Deployment

This repo includes GitHub Actions auto deploy:

- Workflow file: `.github/workflows/deploy.yml`
- Trigger: every push to `main`
- Method: SSH + rsync file sync to live server

Setup instructions are in `DEPLOYMENT.md`.

## Local Preview

```bash
cd "/Users/muhammadrasel/Documents/mailk/Bricknet HTML/bricknet-html"
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

