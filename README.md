# Dropdraft - turn your Dropbox into your website's backend

Publish markdown files and images from your Dropbox to Digitalocean Spaces or S3. Markdown files will be made available as a JSON API, with support for YAML frontmatter.

## How to set up

### 1. Deploy this repo to Netlify
Press the deploy to netlify button below:\
<a href="https://app.netlify.com/start/deploy?repository=https://github.com/dashpilot/dropdraft-spaces"><img src="https://www.netlify.com/img/deploy/button.svg" /></a>

### 2. In Dropbox

-  Go to <https://www.dropbox.com/developers/apps/create> and create a new Dropbox app.\
-  Generate a new access token and copy it
-  Fill in the following webhook: <https://{your-subdomain}.netlify.app/.netlify/functions/webhook>

### 3. In Netlify

Create the following environment variables:

`DBX_ACCESS_TOKEN`: your Dropbox access token (from step 2)\
`S3_ENDPOINT`: your S3/Spaces endpoint (e.g ams3.digitaloceanspaces.com)\
`S3_KEY`: your S3/Spaces key\
`S3_SECRET`: your S3/Spaces secret\
`S3_BUCKET`: your S3/Spaces bucket\
`SITE_URL`: your Netlify site URL (NO trailing slash)

# Todo
- ~~check if file is a markdown file~~ - done
- ~~generate single json file from all content~~ - done
- ~~implement image upload~~ - done
