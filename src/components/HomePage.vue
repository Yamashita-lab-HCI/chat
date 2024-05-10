<template>
  <div class="home">
    <VaAlert color="primary" border="top" border-color="primary" class="mb-6">
      Chatting Room
    </VaAlert>
    <div class="chat-container">
      <!-- チャットメッセージのリストとメッセージ入力フィールドを包含するコンテナ -->
      <div class="chat-section">
        <message-list :messages="messages"></message-list>
        <message-input @send="addMessage"></message-input>
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
import axios from "axios";

export default {
  name: "HomePage",
  components: {
    MessageList,
    MessageInput,
    PromptDisplay,
  },
  mounted() {
    this.fetchMessages();
    this.fetchCurrentUser();
  },
  methods: {
    addMessage(newMessage) {
      const username = localStorage.getItem("username");
      axios
        .post(process.env.VUE_APP_BASE_URL + "messages/", {
          username: username,
          message: newMessage,
        })
        .then(() => {
          console.log("Message posted successfully");
        })
        .catch((error) => {
          console.error("Failed to post message:", error);
          console.error("Detailed error:", error.response.data); // エラーの詳細情報をログに記録
          alert(`Error: ${error.response.data.message}`);
        });
      /*
      dummyData.messages.push({
        id: dummyData.messages.length + 1,
        user: 'currentUser',
        text: newMessage,
        icon: 'mdi-send'
      });
      */
    },
    fetchMessages() {
      axios
        .get(process.env.VUE_APP_BASE_URL + "messages/")
        .then((response) => {
          this.messages = response.data;
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    },
    fetchCurrentUser() {
      axios
        .get(process.env.VUE_APP_BASE_URL + "get_current_user/")
        .then((response) => {
          this.currentUser = response.data;
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
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
  flex: 1; /* チャットセクションを適切に伸縮させる */
}
</style>
