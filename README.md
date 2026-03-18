# Quick TSV

A Raycast plugin for quickly creating TSV (Tab-Separated Values) data directly within Raycast.

## Features

- **TextArea direct input**: Type data with 2+ spaces or tabs as column separators
- **Real-time table preview**: Markdown table preview updates as you type
- **One-click copy**: Copy generated TSV to clipboard (`Enter`)
- **Clipboard paste**: Paste existing TSV data (`Cmd+Shift+V`)

## Setup

### Prerequisites

- [Raycast](https://raycast.com/) installed
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)

### Install & Run

```bash
pnpm install
pnpm dev
```

`pnpm dev` を実行すると、拡張機能がRaycastに自動的にインポートされます。**開発サーバーを停止した後もRaycastに永続インストールされ**、そのまま使い続けられます。アンインストールするにはRaycastの設定 > Extensions から手動で削除してください。

## Usage

1. Raycastで「Quick TSV」を検索して開く
2. TextAreaにデータを入力（2つ以上のスペースまたはタブで列を区切り、Enterで改行）
3. 下部のプレビューでテーブル形式を確認
4. `Enter` でTSVをクリップボードにコピー
5. スプレッドシート等に貼り付け

## Project Structure

- `src/index.tsx` - Main plugin component
- `package.json` - Raycast extension manifest
- `tsconfig.json` - TypeScript configuration
