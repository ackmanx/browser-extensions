## Preparing for a new release in the Chrome Store

_Did you test on Windows?_

1. Update the version in `manifest.json`
1. Update `CHANGELOG.md`
1. Take new screenshots if needed
1. Run a production build with `yarn build`
1. Change directory into the `build` folder and generate a zip file for the Chrome Store
   * `zip -r ../zip-for-chrome-store.zip *`
1. Commit and tag the commit `bookmark-express-next_vx.x`

You can now go to the Chrome Store developer portal, update the screenshots and upload the new zip file.
