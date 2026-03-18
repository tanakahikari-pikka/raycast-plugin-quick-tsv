# Quick TSV

A Raycast plugin for quickly handling and formatting TSV (Tab-Separated Values) data from your clipboard.

## Features

- **Clipboard Integration**: Automatically load TSV data from clipboard
- **Live Validation**: Parse and validate TSV structure in real-time
- **Multiple Format Export**:
  - JSON (array of objects)
  - Markdown (table format)
  - CSV (comma-separated values)
  - Original TSV
- **Data Preview**: View headers and row samples
- **Error Detection**: Identify rows with inconsistent column counts

## Usage

1. Copy TSV data to your clipboard
2. Open Quick TSV in Raycast
3. The plugin automatically loads and parses your clipboard data
4. Convert to desired format and copy back to clipboard

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
