# vendor/videojs-*-10.0.0-beta.24-561a2f2.tgz

Unofficial build of `@videojs/react` (plus its runtime deps `@videojs/core`,
`@videojs/spf`, `@videojs/store`, `@videojs/utils`) from `videojs/v10` @
commit `561a2f2778f7eba93cee13f256719a12fec8f3a4` (main tip as of
2026-07-01), which includes the quality selector menu (PR #1694, merged
2026-06-17) — not yet in any published npm release (`10.0.0-beta.24`,
2026-05-19, predates that PR).

The quality menu ships in `@videojs/skins`, a private workspace package only
bundled into `@videojs/react`'s own build output — there's no way to depend
on it via a normal git/npm reference, so this is a `pnpm build:packages &&
npm pack --ignore-scripts` snapshot of that commit for each package in the
dependency chain (`react` → `core` → `spf`/`store` → `utils`).

Each tarball's `package.json` has its `workspace:*` cross-deps rewritten to
relative `file:../../../vendor/...` paths pointing at the sibling tarballs in
this directory. npm resolves a nested dependency's `file:` specifier relative
to where that package ends up inside `node_modules` (e.g.
`node_modules/@videojs/react/`), not relative to the project root — hence
the `../../../` climbing back up to the repo root before descending into
`vendor/` again. This only holds because npm hoists each of these packages
to a single top-level `node_modules/@videojs/<name>/` (no version
conflicts); it would break if that ever stopped being the case.

**Note**: the exact component name churns between commits — this snapshot
uses `HlsJsVideo` from `@videojs/react/media/hlsjs-video` (renamed from
`HlsVideo`/`hls-video` between the earlier PR-merge commit and current
main). If you re-vendor from a newer commit, check
`node_modules/@videojs/react/dist/dev/media/` for the current name.

**Replace this with the official npm release as soon as one ships** — check
`npm view @videojs/react dist-tags` for a version newer than
`10.0.0-beta.24`, then swap the `file:./vendor/...` dependency in
package.json back to a normal npm version range and delete this directory.
