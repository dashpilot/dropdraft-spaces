# dropdraft-spaces

Publish markdown files from your Dropbox to Digitalocean Spaces or S3

## How to set up

### In Dropbox

1.  Go to <https://www.dropbox.com/developers/apps/create> and create a new Dropbox app.\\
2.  Generate a new access token and copy it
3.  Fill in the following webhook: <https://{your-subdomain}.netlify.app/.netlify/functions/webhook>

### In Netlify

4.  Create the following environment variables:

`DBX_ACCESS_TOKEN`: your Dropbox access token (from step 2)\
`S3_ENDPOINT`: your S3/Spaces endpoint (e.g ams3.digitaloceanspaces.com)\
`S3_KEY`: your S3/Spaces key\
`S3_SECRET`: your S3/Spaces secret\
`S3_BUCKET`: your S3/Spaces bucket\
`SITE_URL`: your Netlify site URL (NO trailing slash)
