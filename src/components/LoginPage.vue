<template>
  <div class="login">
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
        this.$router.push('/home'); // ホームページに遷移
      } else {
        // ログイン失敗
        alert('ユーザー名またはパスワードが間違っています');
      }
    }
  }
}
</script>


<!-- スタイルは適宜追加 -->
