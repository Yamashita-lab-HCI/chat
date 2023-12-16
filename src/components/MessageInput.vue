<template>
  <div class="message-input">
    <input type="text" v-model="message" @keyup.enter="sendMessage" placeholder="メッセージを入力...">
    <button @click="sendMessage">送信</button>
  </div>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      message: ''
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        // ここでメッセージを送信するロジックを実装
        console.log('送信されたメッセージ:', this.message);
        // メッセージをクリア
        this.message = '';
      }
    }
  }
};
</script>

<style>
.message-input input {
  width: 70%;
  padding: 10px;
  margin-right: 10px;
}

.message-input button {
  padding: 10px 20px;
}
</style>
