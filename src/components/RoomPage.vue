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
      <prompt-display v-if="userType === 'NNS'"></prompt-display>
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
    ...mapState([
      "messages",
      "currentRoom",
      "currentUser",
      "iconColor",
      "userType",
    ]),
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
      "closeWebSocket",
    ]),
    async initializeRoom(roomId) {
      await this.closeWebSocket();
      this.$store.commit("setMessages", []);
      await this.$store.commit("setCurrentRoom", roomId);
      await this.fetchMessages(roomId);
      await this.fetchCurrentUser();
      this.initWebSocket();
    },
    sendMessage() {
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
  async created() {
    await this.$store.dispatch("fetchIconColor");
    // ローカルストレージからユーザータイプを取得して設定
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      this.$store.commit("setUserType", storedUserType);
    }
  },
  async mounted() {
    try {
      await this.fetchCurrentUser();
      if (this.currentUser) {
        console.log("Current user:", this.currentUser);
        console.log("User type:", this.userType);
        await this.initializeRoom(this.$route.params.id);
        this.initWebSocket();
      } else {
        console.error("Current user is null");
      }
    } catch (error) {
      console.error("Error in mounted hook:", error);
    }
  },
  beforeUnmount() {
    this.closeWebSocket();
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
