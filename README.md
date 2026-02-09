# Speed Meter

A lightweight, always-on-top Internet speed meter application for Windows. Monitor your download and upload speeds in real-time with a minimalist floating widget.

**Note**: This is an offline application - no data is sent to external servers.

## Features

- **Real-time Speed Monitoring**: Display current download and upload speeds
- **Always-on-Top Window**: Compact floating widget that stays visible
- **Position Memory**: Remembers window position between sessions
- **Minimal UI**: Clean, distraction-free design
- **System Tray Integration**: Easy access from system tray
- **Windows Installer**: Simple installation with NSIS
- **Offline**: Completely offline, no data collection or external dependencies

## Screenshots

The app displays:
- Download speed (⬇)
- Upload speed (⬆)
- Compact 200x80px window
- Draggable interface

## Installation

### From Release
Download the latest installer from the [Releases](../../releases) page and run the `.exe` file.

### Development Build

1. Clone the repository:
```bash
git clone https://github.com/theKunalPrashant/speed-meter-pc.git
cd speed-meter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development app:
```bash
npm start
```

## Building

To create a Windows installer:

```bash
npm run build
```

The installer will be generated in the `dist/` folder.

## Project Structure

```
speed-meter/
├── main.js              # Main Electron process
├── preload.js           # Preload script for IPC
├── package.json         # Project metadata & dependencies
├── renderer/
│   ├── index.html       # Main UI
│   ├── app.js           # Renderer process logic
│   └── style.css        # Styling
└── icon.ico             # Application icon
```

## Technologies Used

- **Electron** - Desktop application framework
- **systeminformation** - System info retrieval
- **electron-store** - Persistent storage
- **electron-builder** - App packaging & distribution

## Dependencies

- `electron` - v40.2.1
- `electron-builder` - v23.6.0
- `systeminformation` - v5.30.7
- `electron-store` - v8.1.0

## Development

### Requirements
- Node.js (v14 or higher)
- npm or yarn

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development app |
| `npm run build` | Build Windows installer |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [KunalPrashant2](https://github.com/theKunalPrashant)

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## Roadmap

- [ ] macOS support
- [ ] Linux support
- [ ] Custom themes
- [ ] Speed history graph
- [ ] Notifications for speed changes
- [ ] Settings panel

## Support

If you encounter any issues, please open an [Issue](../../issues) on GitHub.
