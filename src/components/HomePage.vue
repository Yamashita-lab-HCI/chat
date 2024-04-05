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
    <div class="chat-container">
      <!-- チャットメッセージのリストとメッセージ入力フィールドを包含するコンテナ -->
      <div class="chat-section">
        <message-list></message-list>
        <message-input @send="addMessage"></message-input>
      </div>
      <!-- プロンプト表示部分 -->
      <prompt-display></prompt-display>
    </div>
  </div>
</template>

<script>
import dummyData from '@/dummyData';
import MessageList from '@/components/MessageList.vue';
import MessageInput from '@/components/MessageInput.vue';
import PromptDisplay from '@/components/PromptDisplay.vue';

export default {
  name: 'HomePage',
  components: {
    MessageList,
    MessageInput,
    PromptDisplay
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

<!-- スタイル -->
<style>
.home {
  /* フレックスコンテナとして設定 */
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: row; /* 横並びにする */
}

.chat-section {
  flex: 1; /* チャットセクションを適切に伸縮させる */
}
</style>
