# XMTP PIN Server

A simple Next.js app that allows you to define secrets and POST requests to it which, if given a valid secret, will return a 4-digit pin that expires after N seconds. See `.env.example` and `secrets.js` for configuration.

## Setup

This server is designed to be set up locally with secrets that you can query against on deploy. Secrets can be set up in `.env` or `secrets.js`. They both act in the same way.

Make sure you when you deploy, you add environment variables to wherever you deploy if you're using the `.env` secret setup. You don't need to do that if your secrets are stored in `secrets.js`.

## Future

This repo also has Airtable support as a backend for your secrets and will come online in the near future.
