<template>
  <div class="login">
    <VaBadge
      text="ログイン画面"
      color="success"
      class="mr-2"
    />
    <img src="@/assets/chat-icon.svg" alt="Chat Icon" />
    <h2>ログイン</h2>
    <form @submit.prevent="onLogin">
      <input type="text" v-model="username" placeholder="ユーザー名">
      <input type="password" v-model="password" placeholder="パスワード">
      <button type="submit">ログイン</button>
    </form>
  </div>
</template>


<script>
import dummyUsers from '@/dummyData'; // ダミーデータをインポート

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    onLogin() {
      const user = dummyUsers.find(u => u.username === this.username && u.password === this.password);
      if (user) {
        // ログイン成功
        localStorage.setItem('isLoggedIn', 'true');
        this.$router.push('/home'); // ホームページに遷移
      } else {
        // ログイン失敗
        alert('ユーザー名またはパスワードが間違っています');
      }
    },
  }
}
</script>


<style>
/* 既存のスタイルを維持 */

.login img {
  width: 100px;
  /* アイコンの幅を設定 */
  height: auto;
  /* 高さを自動調整 */
  margin-bottom: 20px;
  /* フォームとの間隔を設定 */
}

/* 他のスタイル */
</style>

