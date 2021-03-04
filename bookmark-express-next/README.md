## Preparing for a new release in the Chrome Store

_Did you test on Windows?_

1. Update the version in `manifest.json`
1. Update `CHANGELOG.md`
1. Commit and tag the commit `bookmark-express-next_vx.x`
1. Run `yarn prep` to build an archive to upload to Chrome Store

You can now go to the Chrome Store developer portal, update the screenshots and upload the new zip file.
