# Quick TSV

A Raycast plugin for quickly creating and managing TSV (Tab-Separated Values) data directly within Raycast.

## Features

- **Create TSV in Raycast**: Build TSV data directly without leaving Raycast
- **Dynamic Table Management**:
  - Add/remove columns
  - Add/remove rows
  - Edit headers and cell values
- **Real-time Preview**: See TSV output as you type
- **One-Click Copy**: Copy generated TSV directly to clipboard
- **Keyboard Shortcuts**:
  - `Cmd+N`: Add new row
  - `Cmd+Shift+N`: Add new column

## Usage

1. Open Quick TSV in Raycast
2. Edit column headers as needed
3. Fill in your data row by row
4. Use keyboard shortcuts to add more rows/columns
5. Press `Cmd+C` or use the Copy action to send TSV to clipboard
6. Paste directly into your management system

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Development

This plugin is built with React and the Raycast API.

### Project Structure

- `src/index.tsx` - Main plugin component
- `package.json` - Project configuration
- `tsconfig.json` - TypeScript configuration

## Notes

The plugin expects properly formatted TSV data with:
- Headers as the first row
- Tab-separated columns
- Consistent column count across all rows
