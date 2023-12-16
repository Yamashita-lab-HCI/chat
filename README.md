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

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
