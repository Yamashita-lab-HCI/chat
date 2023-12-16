<template>
  <div class="register">
    <h2>アカウント登録</h2>
    <form @submit.prevent="onRegister">
      <input type="text" placeholder="ユーザー名">
      <input type="email" placeholder="メールアドレス">
      <input type="password" placeholder="パスワード">
      <button type="submit">登録</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  methods: {
    onRegister() {
      // 登録処理
    }
  }
}
</script>

<!-- スタイルは適宜追加 -->
