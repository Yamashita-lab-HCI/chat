<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Logout</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/user-profile">Profile</router-link>
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
