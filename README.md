# How Well Does Your Browser Know You?

**Discover how much your browser reveals about your device.**

How Well Does Your Browser Know You? is an interactive browser fingerprinting experiment that explores the information a browser makes available to websites. It collects a range of browser, device, display, graphics, audio, and system signals, then combines selected values into a fingerprint hash.

The result is visualized as a set of generative SVG rings, offering a visual representation of your browser's fingerprint.

## Features

- **Browser information** — User-Agent, platform, language preferences, time zone, and storage capabilities.
- **Screen and display** — Screen resolution, available screen area, pixel ratio, color depth, orientation, and color scheme.
- **Hardware signals** — Logical processor count, approximate device memory, and touch support.
- **Canvas fingerprinting** — Generates a canvas image and calculates a hash of its output.
- **WebGL inspection** — Examines available graphics capabilities and GPU information where supported.
- **Audio fingerprinting** — Uses offline audio processing to derive a browser-dependent signal.
- **Font detection** — Checks which fonts from a predefined list appear to be available.
- **Browser API support** — Inspects media devices, supported codecs, permissions, and other browser capabilities.
- **Network information** — Examines connection timing and attempts to retrieve network-related information through WebRTC and an external IP information service.
- **Generative SVG visualization** — Transforms the resulting fingerprint hash into a unique-looking pattern of rings.
- **Fingerprint recalculation** — Repeats the collection process to observe changes in the generated fingerprint.
- **JSON export** — Copies the collected data to the clipboard.

Some signals may be unavailable, restricted, or intentionally reduced by the browser.

## How It Works

The application uses JavaScript and browser APIs to collect information exposed by the current browsing environment.

Certain signals, such as canvas output and offline audio processing, are hashed using SHA-256 when the Web Crypto API is available. The application then combines selected values into a JSON representation and calculates a fingerprint hash.

That hash is used to generate the SVG ring visualization.

The page separates collected values from the subset used in the fingerprint calculation. This helps illustrate how different browser signals can affect fingerprint stability.

### Is the Fingerprint Unique?

Not necessarily.

Different devices may produce the same or similar fingerprints, while a single device may produce different fingerprints after browser updates, configuration changes, privacy interventions, or changes in available APIs.

A browser fingerprint is not proof of a person's identity. It is a combination of observable signals that may help distinguish one browsing environment from another.

## Project Structure

```
index.html
assets/
  style.css
  js/
    main.js               entry point: collect, render, hash, copy
    core/
      collect.js          runs every group and returns raw values
      fingerprint.js      stable-value selection, SHA-256 digest, FP_VERSION
      groups/             one module per signal group (browser, screen, graphics, ...)
    ui/                   rendering and the SVG rings
    i18n/
      index.js            language detection and the t() helper
      locales/            en, tr, es, zh, hi (one file per language, keyed by id)
    lib/                  small helpers (SHA-256, timeouts, DOM)
```

- **Add a signal:** add a row object (`id`, `type`, `get`) to a group in `core/groups/`, then add its label to every file in `i18n/locales/`. Bump `FP_VERSION` in `core/fingerprint.js`, because the hash input changes.
- **Add a language:** copy `i18n/locales/en.js`, translate the values and register it in `i18n/index.js`. Missing keys fall back to English.
- Rows flagged `volatile: true` are shown but left out of the fingerprint hash.
- The code uses ES modules, so open the page through a web server (GitHub Pages, `npx serve`, ...). Opening `index.html` directly from disk is blocked by browsers.

## Privacy Considerations

This project is intended for educational and experimental purposes.

**Not using cookies does not mean that no information is exposed or transmitted.**

Depending on browser support and the execution environment, the application may:

- Read browser and device characteristics exposed through web APIs.
- Generate canvas and audio-derived signals.
- Inspect available fonts and graphics capabilities.
- Query certain browser permission states.
- Attempt to discover network addresses through WebRTC.

The external IP information service receives the request and may process connection metadata, including the visitor's IP address.

The project should therefore not be described as entirely offline or as guaranteeing that no personal information leaves the device.

Review the JavaScript and any external services before deploying the application publicly.
