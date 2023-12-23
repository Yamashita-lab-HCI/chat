<template>
  <div class="login">
    <va-card class="login-card">
      <img src="@/assets/chat-icon.svg" alt="Chat Icon" />
      <h2>ログイン</h2>
      <form @submit.prevent="onLogin">
        <va-input v-model="username" placeholder="ユーザー名" />
        <va-input type="password" v-model="password" placeholder="パスワード" />
        <va-button type="submit" color="primary">ログイン</va-button>
      </form>
    </va-card>
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

.login img {
  width: 100px;
  /* アイコンの幅を設定 */
  height: auto;
  /* 高さを自動調整 */
  margin-bottom: 20px;
  /* フォームとの間隔を設定 */
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 300px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

</style>

