<template>
  <div class="home">
    <VaAlert
      color="primary"
      border="top"
      border-color="primary"
      class="mb-6 alert-full-width"
    >
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
  components: {
    MessageList,
    PromptDisplay,
  },
  data() {
    return {
      inputMessage: "",
    };
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      async handler(newId) {
        await this.$store.commit("setCurrentRoom", newId);
        this.$store.dispatch("fetchMessages", newId);
        this.$store.dispatch("fetchCurrentUser", newId);
      },
    },
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    currentRoom() {
      return this.$store.state.currentRoom;
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

.alert-full-width {
  width: 100%; /* VaAlertコンポーネントの幅を100%に設定 */
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
