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
    <message-input @send="addMessage"></message-input>
  </div>
</template>

<script>
import dummyData from '@/dummyData';
import MessageList from '@/components/MessageList.vue';
import MessageInput from '@/components/MessageInput.vue';

export default {
  name: 'HomePage',
  components: {
    MessageList,
    MessageInput
  },
  methods: {
    addMessage(newMessage) {
      dummyData.messages.push({
        id: dummyData.messages.length + 1,
        user: 'currentUser',
        text: newMessage,
        icon: 'mdi-send'
      });
    }
  }
}
</script>

<!-- スタイルは適宜追加 -->
