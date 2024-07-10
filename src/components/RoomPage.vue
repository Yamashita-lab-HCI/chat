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
import { mapState, mapActions } from "vuex";

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
  computed: {
    ...mapState(["messages", "currentRoom", "currentUser"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        this.initializeRoom(newId);
      },
    },
  },
  methods: {
    ...mapActions([
      "fetchMessages",
      "fetchCurrentUser",
      "initWebSocket",
      "addMessage",
    ]),
    async initializeRoom(roomId) {
      await this.$store.commit("setCurrentRoom", roomId);
      await this.fetchMessages(roomId);
      await this.fetchCurrentUser();
      this.initWebSocket();
    },
    addMessage() {
      if (this.inputMessage.trim()) {
        this.addMessage(this.inputMessage);
        this.inputMessage = "";
      }
    },
    quoteMessage(message) {
      this.inputMessage = `> ${message}\n`;
    },
    updateMessages(newMessages) {
      this.$store.commit("SET_MESSAGES", newMessages);
    },
  },
  created() {
    this.$store.dispatch("fetchIconColor");
  },
  mounted() {
    this.initializeRoom(this.$route.params.id);
  },
  beforeUnmount() {
    // WebSocket接続をクローズ
    if (this.$store.state.socket) {
      this.$store.state.socket.close();
    }
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
