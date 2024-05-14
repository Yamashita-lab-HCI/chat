# chat

# プロジェクトのディレクトリ構造

```
src/
|-- assets/ # 静的リソース (画像、スタイルシート、フォントなど)
|-- components/ # 再利用可能なVueコンポーネント
| |-- ChatMessage.vue
| |-- ChatInput.vue
| |-- UserList.vue
| |-- ...
|-- views/ # ページのVueコンポーネント (各ルートに対応)
| |-- Home.vue
| |-- ChatRoom.vue
| |-- UserProfile.vue
| |-- ...
|-- router/ # Vue Routerに関する設定
| |-- index.js
|-- store/ # Vuexに関する状態管理
| |-- index.js
| |-- modules/
| |-- chat.js
| |-- user.js
| |-- ...
|-- App.vue # メインのVueコンポーネント
|-- main.js # アプリケーションのエントリポイント
```

# 実行

yarnに切り替えたので、

```bash
yarn build
```

にしてください。
ローカルでのツールを見ているときは、

```bash
yarn serve
```

# フロントエンド

**Vue**を使用する．UIはVuestic-UIを使用．
[こちら](https://ui.vuestic.dev/)を参照すること．

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
node server.js
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
