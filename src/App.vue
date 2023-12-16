<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">ホーム</router-link>
        <router-link to="/login">ログイン</router-link>
        <router-link to="/register">登録</router-link>
        <router-link to="/user-profile">プロファイル</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© 2023 マイチャットアプリ</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* グローバルなスタイリング */
#app {
  text-align: center;
}

nav {
  /* ナビゲーションバーのスタイリング */
}

nav a {
  margin: 0 10px;
}

footer {
  margin-top: 20px;
}
</style>
