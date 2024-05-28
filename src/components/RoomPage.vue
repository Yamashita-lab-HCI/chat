<template>
  <div class="home">
    <VaAlert color="primary" border="top" border-color="primary" class="mb-6">
      Chatting Room
    </VaAlert>
    <div class="chat-container">
      <div class="chat-section">
        <message-list
          :messages="messages"
          @quote="quoteMessage"
          @update-messages="updateMessages"
        ></message-list>
        <message-input :value="inputMessage" @send="addMessage"></message-input>
      </div>
      <prompt-display></prompt-display>
    </div>
  </div>
</template>

<script>
import MessageList from "@/components/MessageList.vue";
import PromptDisplay from "@/components/PromptDisplay.vue";

export default {
  name: "RoomPage",
  props: ["id"], // ルームIDをpropsとして追加
  components: {
    MessageList,
    PromptDisplay,
  },
  data() {
    return {
      inputMessage: "",
    };
  },
  mounted() {
    // ルームIDを使用してメッセージとユーザー情報を取得
    this.$store.dispatch("fetchMessages", this.id);
    this.$store.dispatch("fetchCurrentUser", this.id);
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
    updateMessages(newMessages) {
      this.$store.commit("SET_MESSAGES", newMessages);
    },
  },
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: row;
}

.chat-section {
  max-height: 500px;
  flex: 1;
}
</style>
