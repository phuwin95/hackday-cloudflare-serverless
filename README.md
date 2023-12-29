## Hackday cloudflare serverless

This is a simple serverless function that works in conjunction with an R2 Cloudflare storage bucket.

The function is triggered from an HTTP request and will return the current content of the Seiska frontpage content in text format.

There is a cron running in a certain interval that will fetch the content from the Seiska frontpage and store it in the R2 Cloudflare storage bucket.

The function will then return the content from the storage bucket. If there is no content in the bucket, the function will fetch the content from the Seiska frontpage and store it in the bucket, then return the content.

## Deploy workflow

The function is deployed using Wrangler API with Wrangler Github Action. Deployment is triggered when there is a new push to the `main` branch.