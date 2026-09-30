# strategy.nu

The Strategy ApS website. Astro 7, plain CSS, static output, no client-side JavaScript for data and no third-party requests. All copy lives in the md and json files under `src/content/`. Components hold no text.

## Run it locally

Node 24 is needed.

```bash
npm ci
npm run dev
```

The dev server runs on http://localhost:4321/strategy.nu/. For the built site, which is what gets released:

```bash
npm run build
npm run preview
```

`npm run build` writes `dist/`. A typo in a content file fails the build with the field name, because the schemas in `src/content.config.ts` (and `src/lib/site.ts` for `site.json`) reject unknown and missing fields.

## Edit content

Commit on `staging`, see [Release flow](#release-flow).

### A team member

`src/content/team/<slug>.md`. The frontmatter holds `name`, `role`, `order`, `photo`, `linkedin`, `languages` and `expertise`. The body is the bio. `photo` is a file name in `src/assets/photos/`, and the build fails if the file is missing. To add a person, copy `felix-johannes.md`, add the photo and set `order`.

### A network entry

`src/content/network/<slug>.md`. The frontmatter holds `name`, `order`, `location`, `url`, `photo` and `expertise`, plus an optional `company`. The body is the description. The link label comes from `url`: "LinkedIn" for profiles, otherwise the bare address. The section intro and the "join the network" link are in `src/content/sections/network.md`.

### A price

`src/content/sections/rates.md`, under `items`. Each item has `name`, `price` (a string such as `DKK 2,000` or `On request`), `unit` (an empty string is allowed), `note` and `subject`, which is the subject line of the prefilled email. The line under the list is `note` at the top of the file.

### A section

One file per section in `src/content/sections/`: `hero`, `field`, `approach`, `team`, `network`, `rates` and `contact`. The frontmatter holds the structured parts (headline lines, segments, steps, rates) and the body holds the prose. Nav labels, the email address, the address, the CVR number and the LinkedIn company page (linked in the footer) are in `src/content/site.json`. The privacy page is `src/content/pages/privacy.md`; set `updated` in its frontmatter when the text changes. The 404 page is `src/content/pages/404.md`.

### Search and discovery

The page title and meta description are `title` and `description` in `site.json`. The JSON-LD on the home page (`src/lib/jsonld.ts`) is built from `site.json`, `rates.md` and the team files; its business facts (type, founding date, area served, further `sameAs` profile links) are under `org` in `site.json`; its `sameAs` starts with `linkedin`. `llms.txt` and `sitemap.xml` are generated at build time from the same files, so they follow any content change. The home page's `lastmod` is the date of the last commit under `src/`, which is why both workflows check out the full history.

Copy rules are in the project's conventions: plain wording, en dashes, prices in DKK, English only.

## Release flow

`main` is production. Every push to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages. `staging` is the work branch. It is not hosted, because Pages serves one site per repository.

1. Work on `staging` and push it. `.github/workflows/build.yml` runs `npm ci` and `npm run build`, with no upload and no deploy.
2. Check the result locally with `npm run build` and `npm run preview`, including a narrow window (375 px wide, no horizontal scroll) and the browser console.
3. Release from `main`:

```bash
git checkout main
git merge --ff-only staging
git push origin main
git checkout staging
```

A fast-forward is the only kind of release. If `--ff-only` refuses, `main` has a commit that `staging` lacks; merge `main` into `staging` first. A repository ruleset blocks force-pushes to `main` and deleting it.

Until the cutover the site is at https://metzelfetz.github.io/strategy.nu/ and is marked `noindex`. The `site` and `base` values in `astro.config.mjs` decide that, and they change when the custom domain goes live.

## Images and fonts

**Images.** Mood images in `src/assets/images/` are illustrative, never of people, and carry `alt` and `credit` in the md frontmatter that references them. The treatment (grayscale, one element in colour, 4:3) is baked into the file by `accent.mjs`, not applied in CSS. The script and its `recipes.json` are kept outside this repository, in `_workspaces/imagery-workspace/` next to the project root. Each recipe names a source, the shapes to keep in colour, the crop and the output. From that folder:

```bash
NODE_PATH=../../strategy.nu/node_modules node accent.mjs recipes.json <recipe-name>
```

The result is written to `out/`. Copy it into `src/assets/images/` and reference it from the section's frontmatter. The sources are Gemini stills and Unsplash photos (Unsplash License).

**Team and network photos.** Real photos only, in `src/assets/photos/`.

**Fonts.** Newsreader and Instrument Sans, self-hosted from `src/assets/fonts/`, so the site makes no request to Google Fonts. They come from Fontsource through the npm registry: `npm pack @fontsource-variable/<name>`, then copy the `*-latin-*.woff2` files and the licence from the `package/` folder. Both are under the SIL Open Font License 1.1, and the licence texts sit next to the files (`LICENSE-newsreader`, `LICENSE-instrument-sans`).
