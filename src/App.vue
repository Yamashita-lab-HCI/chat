<template>
  <div id="app">
    <header v-if="loggedIn">
      <!-- ログイン時のみヘッダーを表示 -->
      <nav>
        <div class="button-wrapper">
          <VaButton color="info" class="mr-6 mb-2" @click="goToHome">Home</VaButton>
        </div>
        <div class="button-wrapper">
          <VaButton color="danger" class="mr-6 mb-2" @click="goToRegister">Register</VaButton>
        </div>
        <div class="button-wrapper">
          <VaButton color="warning" class="mr-6 mb-2" @click="goToProfile">Profile</VaButton>
        </div>
        <div class="button-wrapper">
          <VaButton @click="logout">Logout</VaButton>
        </div>
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

.button-wrapper {
  display: inline-block;
  /* インラインブロック要素として表示 */
  margin: 0 10px;
  /* 左右に10ピクセルのマージン */
}

nav {
  /* ナビゲーションバーのスタイリング */
}

footer {
  margin-top: 20px;
}
</style>
