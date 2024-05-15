<template>
  <div class="home">
    <VaAlert color="primary" border="top" border-color="primary" class="mb-6">
      Chatting Room
    </VaAlert>
    <div class="chat-container">
      <!-- チャットメッセージのリストとメッセージ入力フィールドを包含するコンテナ -->
      <div class="chat-section">
        <message-list :messages="messages" @quote="quoteMessage"></message-list>
        <message-input :value="inputMessage" @send="addMessage"></message-input>
      </div>
      <!-- プロンプト表示部分 -->
      <prompt-display></prompt-display>
    </div>
  </div>
</template>

<script>
// import dummyData from '@/dummyData';
import MessageList from "@/components/MessageList.vue";
import MessageInput from "@/components/MessageInput.vue";
import PromptDisplay from "@/components/PromptDisplay.vue";
// import axios from "axios";

export default {
  name: "HomePage",
  components: {
    MessageList,
    MessageInput,
    PromptDisplay,
  },
  data() {
    return {
      inputMessage: "",
    };
  },
  mounted() {
    this.$store.dispatch("fetchMessages");
    this.$store.dispatch("fetchCurrentUser");
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  methods: {
    addMessage() {
      this.$store.dispatch("addMessage", this.inputMessage);
      this.inputMessage = "";
    },
    quoteMessage(message) {
      this.inputMessage = `> ${message}\n`;
    },
  },
};
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
  max-height: 500px;
  flex: 1; /* チャットセクションを適切に伸縮させる */
}
</style>
