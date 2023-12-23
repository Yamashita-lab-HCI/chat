<template>
  <div id="app">
    <header v-if="isLoggedIn">
      <!-- ログイン時のみヘッダーを表示 -->
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/user-profile">Profile</router-link>
        <button @click="logout">Logout</button>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>2023 Keita Suga</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      // ローカルストレージからログイン状態をチェック
      return localStorage.getItem('isLoggedIn') === 'true';
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn'); // ログイン状態をローカルストレージから削除
      this.$router.push('/login'); // ログインページにリダイレクト
    }
  }
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
