# EOS Astro tool

Implemented using React, Astro and ShadCN.

Supports the following actions:

- buyram
- buyrambytes
- delegatebw
- undelegatebw
- ramtransfer (for wrapping RAM)
- transfer

## Setup instructions

Requires a linux development environment.

Repo currently uses [Bun](https://bun.sh/) for package management and building purposes.

For windows, use the [windows linux subsystem](https://learn.microsoft.com/en-us/windows/wsl/install) to create an ubuntu instance in your terminal to run the following commands:

`bun install`

`bun run dev`

`bun run build`

## Hosting guide

Can be easily deployed to Vercel!

https://vercel.com/changelog/bun-install-is-now-supported-with-zero-configuration

https://docs.astro.build/en/guides/integrations-guide/vercel/
