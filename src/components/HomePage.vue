<template>
  <div class="home">
    <h2>チャットルーム</h2>
    <!-- チャットメッセージのリスト -->
    <message-list></message-list>
    <!-- メッセージ入力フィールド -->
    <message-input></message-input>
  </div>
</template>

<script>
import MessageList from '@/components/MessageList.vue';
import MessageInput from '@/components/MessageInput.vue';

export default {
  name: 'HomePage',
  components: {
    MessageList,
    MessageInput
  }
}
</script>

<!-- スタイルは適宜追加 -->
