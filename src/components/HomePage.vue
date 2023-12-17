<template>
  <div class="home">
    <VaAlert
      color="primary"
      border="top"
      border-color="primary"
      class="mb-6"
    >
    Chatting Room
    </VaAlert>
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
