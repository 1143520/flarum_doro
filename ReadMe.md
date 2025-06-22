# Flarum-twemoji

This extension is a fork of the [https://github.com/flarum/emoji](https://github.com/flarum/emoji), with custom features.

### Highlight

- Able to customize the source of images.
- Able to disable auto complete.
- Support using emoji characters as filenames.

### Install

```
composer require 1143520/flarum_doro
php flarum cache:clear
```

### Settings

The settings of this extension correspond to [twemoji](https://www.npmjs.com/package/@twemoji/api) options:

- **Base**: The base URL for emoji images (e.g., `https://hub.gitmirror.com/raw.githubusercontent.com/1143520/doro/main/`)
- **Folder**: The folder name within the base URL (e.g., `loop`)
- **Extension**: The file extension for emoji images (e.g., `.gif`)
- **Disable Auto Complete**: Option to disable emoji autocomplete in the editor
- **Use emoji character as filename**: Enable this if your emoji files are named with the actual emoji character (e.g., "😀.gif")

### Custom Emoji Mapping

If your emoji files have non-standard names, you can create an `emoji-map.json` file in your repository root to map standard emoji codes to your custom filenames.

Use the included `tools/generate-emoji-map.js` script to help generate this mapping file.
