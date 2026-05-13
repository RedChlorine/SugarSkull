# SugarSkull

A Chromium extension that enables UNISA students to customize the appearance of their myUNISA portal.

> **⚠️ BETA VERSION** - This is a work in progress

## Overview

SugarSkull is a browser extension designed specifically for University of South Africa (UNISA) students. It allows you to personalize and enhance the visual appearance of the myUNISA portal with custom themes and styling options.

## Features

- 🎨 **Custom Themes** - Apply different visual themes to the myUNISA portal
- 🎭 **Icon Customization** - Choose from multiple icon sets to personalize your experience
- 💾 **Persistent Settings** - Your theme preferences are saved and restored automatically
- 🔧 **Easy to Use** - Simple popup interface for quick theme switching

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/RedChlorine/SugarSkull.git
   cd SugarSkull
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Load the extension in Chrome/Chromium:
   - Open `chrome://extensions/` in your browser
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `SugarSkull` folder

## Usage

Once installed:
1. Navigate to the myUNISA portal (unisa.ac.za)
2. Click the SugarSkull extension icon in your toolbar
3. Select your preferred theme from the popup menu
4. Your choice will be automatically applied and saved

## Project Structure

```
SugarSkull/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── package.json          # Project metadata
├── package-lock.json     # Dependency lock file
├── SugarSkull_Icons/     # Extension icons (16px, 48px, 128px)
├── Themes/               # Custom theme files
└── node_modules/         # Dependencies
```

## Technology Stack

- **HTML** - Markup for popup interface
- **CSS** - Styling and theming (9816 bytes)
- **JavaScript** - Extension logic and functionality (5166 bytes)
- **Chrome Extensions API** - Scripting, tabs, and storage permissions

## Files

- `manifest.json` - Extension manifest (v3)
- `background.js` - Background service worker
- `popup.html` / `popup.css` / `popup.js` - User interface components
- `SugarSkull_Icons/` - Extension icon assets
- `Themes/` - Theme definitions and resources

## Permissions

The extension requires the following permissions:
- `scripting` - To inject styles into the myUNISA portal
- `tabs` - To detect when you're on the myUNISA site
- `storage` - To save your theme preferences

It only operates on pages matching `*://*.unisa.ac.za/*`

## Development

### Prerequisites
- Node.js and npm
- Chrome/Chromium browser
- Basic knowledge of Chrome Extension APIs

### TypeScript Support
The project includes TypeScript definitions for the Chrome API:
```bash
npm install
```

### Building & Testing
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the SugarSkull extension
4. Test your changes on myUNISA

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs and issues
- Suggest new themes or features
- Submit pull requests with improvements

## Status

**Current Version:** 0.8 (Beta)

This is an active development project. Features and functionality may change as the extension evolves.

## License

This project is currently unlicensed. Please contact the repository owner for licensing information.

## Support

For issues, questions, or feature requests, please open an issue on the [GitHub repository](https://github.com/RedChlorine/SugarSkull/issues).

---

**Note:** This extension is specifically designed for UNISA students and only affects the myUNISA portal.
