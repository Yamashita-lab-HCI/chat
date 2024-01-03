<template>
  <div id="app">
    <header v-if="loggedIn">
      <!-- ログイン時のみヘッダーを表示 -->
      <nav>
        <router-link to="/home">Home</router-link>
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

  data() {
    return {
      loggedIn: localStorage.getItem('isLoggedIn') === 'true',
    };
  },

  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn');
      this.loggedIn = false;
      this.$router.push('/login');
    },
  },
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
