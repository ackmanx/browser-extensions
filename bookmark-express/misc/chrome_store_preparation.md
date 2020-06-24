##Preparing for a new release in the Chrome Store

_Verify that any development changes made to `manifest.json` were applied to `manifest-prod.json`_

_Did you test on Windows?_

Do not commit dev changes with the Chrome Store prep changes.


1. Update the version in `manifest.json` and `manifest-prod.json`
1. Update `CHANGELOG.md`
1. Run `misc/build.sh` to generate a zip file for the Chrome Store
1. Take new screenshot
   * Must be exactly 1280x800
1. Commit and tag the commit `version_X.X`

You can now go to the Chrome Store developer portal, update the screenshots and upload the new zip file.

