# Easy Dua
Easy Dua is a progressive web application. You can read on web page and install on your mobile device.

After installing without internet connection it can run offline.

## Features
- Easy to read
- Easy to use
- Scrolls top-to-bottom (Not left-to-right)
- Runs on web and mobile (Responsive)
- Installable
- Runs offline
- Lightweight (About 200KB)
- Lightning fast
- Goto paragraph
- Font family selection
- Font size selection
- Color selection
- Background color selection
- Multi language
- Printable (Press Ctrl+P)

For feature requests or any bug reports please send email to info at fklavye dot net

That is an open source project. You can contribute on github [github](https://github.com/obozdag/dua)

## PWA maintenance
`app_config.json` is the canonical metadata source for the application name, version, color, canonical URL, and repository URL.

When the version changes, keep the manifest link, manifest icon `?v=`, app script query string, and service worker cache revision synchronized with the same version. Normal manifest icons use `purpose: "any"`, maskable icons use separate files with an opaque white canvas and safe-area padding, and the iOS touch icon remains a separate 180x180 PNG.

Application content and caches update through the normal service worker flow. Existing home screen launcher icon refresh timing is controlled by Android/iOS; removing and reinstalling the shortcut should only be needed for testing or as a last resort.

PWA update banner text comes from `js/app/data/translations.js`. The automatic reload flow does not show a manual Reload button; `reload_update` may remain for older manual flows, but the automatic banner uses `updating_app`.
