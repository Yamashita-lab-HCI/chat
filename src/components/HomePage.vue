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
      <!-- チャットメッセージのリストとメッセージ入力フィールドを包含するコンテナ -->
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
import axios from "axios";

export default {
  name: "HomePage",
  components: {
    MessageList,
    PromptDisplay,
  },
  data() {
    return {
      inputMessage: "",
    };
  },
  async mounted() {
    try {
      await this.$store.dispatch("fetchCurrentUser");
      if (this.currentUser) {
        console.log("Current user:", this.currentUser);
        console.log("User type:", this.userType);
        // ローカルストレージからユーザータイプを取得して設定
        const storedUserType = localStorage.getItem("userType");
        if (storedUserType) {
          this.$store.commit("setUserType", storedUserType);
        }
        await this.$store.dispatch("fetchIconColor");
        const csrfToken = this.getCookie("csrftoken");
        await this.createDefaultRoom(csrfToken);
        // メッセージを取得
        await this.$store.dispatch("fetchMessages");
      } else {
        console.error("Current user is null");
      }
    } catch (error) {
      console.error("Error in mounted hook:", error);
    }
  },

  computed: {
    messages() {
      return this.$store.state.messages;
    },
    currentRoom() {
      return this.$store.state.currentRoom;
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    userType() {
      return this.$store.state.userType;
    },
  },

  created() {
    this.$store.dispatch("fetchIconColor");
  },
  methods: {
    initWebSocket() {
      const wsUrl = "YOUR_WEBSOCKET_ENDPOINT";
      this.socket = new WebSocket(wsUrl);

      // WebSocket接続が開かれた時のイベントハンドラ
      this.socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      // メッセージを受信した時のイベントハンドラ
      this.socket.onmessage = (event) => {
        console.log("Message from server ", event.data);
        const receivedMessage = JSON.parse(event.data);
        // 受信したメッセージを処理
        this.updateMessages(receivedMessage);
      };

      // WebSocket接続が閉じられた時のイベントハンドラ
      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      // エラーが発生した時のイベントハンドラ
      this.socket.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
    },
    beforeUnmount() {
      // WebSocket接続をクローズ
      if (this.socket) {
        this.socket.close();
      }
    },
    sendMessage() {
      if (this.inputMessage.trim() && this.socket) {
        // メッセージをサーバーに送信
        this.socket.send(JSON.stringify({ message: this.inputMessage }));
        this.inputMessage = ""; // 入力フィールドをクリア
      }
    },
    async createDefaultRoom(csrfToken) {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}create_default_room/`,
          {
            room_name: "HomePage",
            room_id: 1,
          },
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        );
        console.log(response.data);
        this.$store.commit("setCurrentRoom", 0);
        await this.$store.dispatch("fetchMessages");
      } catch (error) {
        console.error("Error creating default room:", error);
      }
    },
    getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },
    async addMessage() {
      if (!this.currentRoom) {
        console.error("currentRoom is not set");
        return;
      }
      console.log(this.inputMessage);
      const messageData = this.inputMessage;
      try {
        await this.$store.dispatch("addMessage", messageData);
        this.inputMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

<!-- スタイル -->
<style>
.home {
  /* フレックスコンテナとして設定 */
  display: flex;
  flex-direction: column;
}

.alert-full-width {
  width: 100%; /* VaAlertコンポーネントの幅を100%に設定 */
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
