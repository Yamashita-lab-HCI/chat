<template>
  <div class="login">
    <h2>ログイン</h2>
    <form @submit.prevent="onLogin">
      <input type="text" placeholder="ユーザー名">
      <input type="password" placeholder="パスワード">
      <button type="submit">ログイン</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  methods: {
    onLogin() {
      // ログイン処理
    }
  }
}
</script>

<!-- スタイルは適宜追加 -->
