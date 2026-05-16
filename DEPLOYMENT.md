# Deployment Setup (One Time)

This project auto deploys to your live server when you push to `main`.

## 1. Server Preparation

Run these commands on your live server (replace values):

```bash
# install rsync if not installed
sudo apt update
sudo apt install -y rsync

# create target folder (example)
sudo mkdir -p /var/www/rrtradeglobal
sudo chown -R $USER:$USER /var/www/rrtradeglobal
```

If you use shared hosting/cPanel, use your real web root path (for example `public_html`).

## 2. Create Deploy SSH Key

Run on your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/rrtradeglobal_deploy -N ""
```

## 3. Add Public Key to Server

Copy public key:

```bash
cat ~/.ssh/rrtradeglobal_deploy.pub
```

Then add that full line to server user file:

`~/.ssh/authorized_keys`

## 4. Add GitHub Repository Secrets

GitHub repo -> `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Add these secrets:

- `DEPLOY_HOST` = your server IP/domain
- `DEPLOY_PORT` = `22` (or custom SSH port)
- `DEPLOY_USER` = SSH username
- `DEPLOY_PATH` = live site path (example: `/var/www/rrtradeglobal`)
- `DEPLOY_SSH_KEY` = content of `~/.ssh/rrtradeglobal_deploy` (private key file)
- `DEPLOY_POST_CMD` (optional) = command to run after deploy

Get private key content:

```bash
cat ~/.ssh/rrtradeglobal_deploy
```

## 5. Test Deployment

Push any small change to `main`:

```bash
git add .
git commit -m "test: deploy workflow"
git push
```

Then check:

- GitHub -> `Actions` tab -> workflow success
- Live URL reflects the update

## Notes

- Files are synced with `rsync --delete`, so removed files in git will also be removed from server.
- Keep `DEPLOY_SSH_KEY` secret private.

