# Upstream Sync — sst/opencode → nservers-code

This repository is a fork of [`sst/opencode`](https://github.com/sst/opencode) (MIT license, see `LICENSE`).

## Remotes

- `upstream` — `https://github.com/sst/opencode.git` (read-only, synced periodically)
- `origin` — `git@github.com:nservers/nservers-code.git` (our fork, set when the repo is pushed)

## Sync procedure

```bash
git fetch upstream --tags
git checkout -b sync-upstream-vX.Y.Z
git merge upstream/dev        # upstream default branch is `dev`
# resolve conflicts — nServers patches are listed in NSERVERS_FORK.md
git push origin sync-upstream-vX.Y.Z
```

## Conflict policy

nServers-specific changes are kept deliberately small and isolated so upstream
merges stay clean:

1. **New files over edits** — `packages/opencode/src/config/nservers.ts`,
   docs at repo root (`NSERVERS_FORK.md`, this file). Never touch upstream
   files when a new module can carry the change.
2. **Single-line injections** — the only upstream file edit is the preset
   merge in `packages/opencode/src/config/config.ts` (`loadGlobal`), marked
   with a `nServers fork:` comment. Search for that marker before merging.
3. **No renames of upstream files/packages yet** — binary/package rename to
   `nservers-code` happens at release-packaging time, not in the source tree,
   to keep merges trivial.

## Cadence

Upstream moves fast; sync on every upstream **tagged release** rather than
tracking `dev` head. Record the last synced tag here:

- Last synced: `aa481b8` (dev head, initial fork — no tag pinned yet)

## License

MIT — keep `LICENSE` intact. Do not remove upstream copyright notices or
upstream `README*` files until the public branding pass; the plan is to
prepend our branding, not replace attribution.
