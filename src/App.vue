<template>
  <div id="app">
    <header v-if="loggedIn">
      <!-- ログイン時のみヘッダーを表示 -->
      <nav>
        <VaButton @click="goToHome">Home</VaButton>
        <VaButton @click="goToRegister">Register</VaButton>
        <VaButton @click="goToProfile">Profile</VaButton>
        <VaButton @click="logout">Logout</vaButton>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>©️2023 Keita Suga</p>
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
    goToHome() {
      this.$router.push('/home');
    },
    goToRegister() {
      this.$router.push('/register');
    },
    goToProfile() {
      this.$router.push('/user-profile');
    },
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
