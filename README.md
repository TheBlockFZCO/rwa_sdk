# The Block Indexer SDK

Lightweight SDK scaffold for building and publishing an indexer client as an npm package.

## Install

```bash
npm install the-block-indexer-sdk
```

## Usage

```ts
import { createClient } from "the-block-indexer-sdk";

const client = createClient({ baseUrl: "https://api.example.com" });
console.log(client.getHealth()); // "ok"
```

## Development

Commands:

- `npm run build` – bundle to `dist/` (ESM + CJS) and generate types
- `npm run dev` – watch mode
- `npm run typecheck` – TypeScript type-check only
- `npm run clean` – remove `dist/`

## Release

1. Ensure you are logged in: `npm login`
2. Build and typecheck: `npm run build && npm run typecheck`
3. Publish: `npm publish --access public`

You may want to set the package name/scope in `package.json` before publishing.

