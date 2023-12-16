<template>
  <div class="message-list">
    <div v-for="msg in messages" :key="msg.id" class="message">
      <strong>{{ msg.user }}:</strong> {{ msg.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  data() {
    return {
      // ダミーのメッセージデータ
      messages: [
        { id: 1, user: 'ユーザー1', text: 'こんにちは！' },
        { id: 2, user: 'ユーザー2', text: '今日はいい天気ですね。' },
        { id: 3, user: 'ユーザー3', text: 'そうですね！' }
      ]
    };
  }
};
</script>

<style>
.message-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.message {
  padding: 5px;
  border-bottom: 1px solid #eee;
}
</style>
