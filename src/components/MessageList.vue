<template>
  <div class="message-list">
    <VaCard
      v-for="msg in messages"
      :key="msg.id"
      class="mb-2 message-card"
      @mouseover="handleMouseOver(msg.id)"
      @mouseleave="handleMouseLeave(msg.id)"
    >
      <VaCardTitle>
        <div
          class="icon"
          :style="{ backgroundColor: getIconColor(msg.user__username) }"
        ></div>
        <span class="message-user">{{ msg.user__username }}</span>
      </VaCardTitle>
      <VaCardContent>
        <div v-if="msg.text" v-html="msg.text"></div>
        <VaButton
          v-show="showQuoteButton[msg.id]"
          @click="quoteMessage(msg.text, msg.id)"
          class="quote-button"
        >
          <Return32 />
        </VaButton>
      </VaCardContent>
    </VaCard>
  </div>
  <div class="command-palette-wrapper">
    <CommandPalette
      v-if="isAuthenticated"
      :quotedMessage="quotedMessage"
      @send="handleSend"
      @clear-quote="clearQuotedMessage"
    />
  </div>
</template>

<script>
import { Return32 } from "@carbon/icons-vue";
import CommandPalette from "./CommandPalette.vue";
// import { mapState } from "vuex";
import {
  reactive,
  toRefs,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import { useStore } from "vuex";

export default {
  name: "MessageList",
  components: {
    Return32,
    CommandPalette,
  },
  props: {
    roomName: String,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      showQuoteButton: {},
      quotedMessage: "",
      messages: [],
    });
    const iconColors = reactive({});

    const isAuthenticated = computed(() => store.state.isLoggedIn);
    // const currentUser = computed(() => store.state.currentUser);
    const currentRoom = computed(() => store.state.currentRoom);

    onMounted(() => {
      if (currentRoom.value) {
        store.dispatch("initWebSocket");
      }
    });

    onBeforeUnmount(() => {
      if (
        store.state.socket &&
        store.state.socket.readyState === WebSocket.OPEN
      ) {
        store.state.socket.close();
        store.commit("setSocket", null);
      }
    });

    watch(currentRoom, (newRoom, oldRoom) => {
      if (newRoom !== oldRoom) {
        if (
          store.state.socket &&
          store.state.socket.readyState === WebSocket.OPEN
        ) {
          store.state.socket.close();
          store.commit("setSocket", null);
        }
        store.dispatch("initWebSocket");
      }
    });

    /*function connectWebSocket() {
      if (!currentRoom.value) {
        console.error("Cannot connect WebSocket: Room is not set");
        return;
      }

      const wsUrl =
        `${process.env.VUE_APP_WS_URL}/ws/chat/${currentRoom.value}/`.replace(
          /\/\//g,
          "/"
        );
      state.websocket = new WebSocket(wsUrl);

      state.websocket.onopen = () => {
        console.log("WebSocket connected");
      };

      state.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          state.messages.unshift(data.message);
          updateIconColor(data.message.user__username);
        }
      };

      state.websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      state.websocket.onclose = () => {
        console.log("WebSocket disconnected");
      };
    }

    function disconnectWebSocket() {
      if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
        state.websocket.close();
        console.log("WebSocket is safely closed.");
      }
    }
    */

    /*async function updateIconColor(username) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}get_icon_color/`,
          {
            params: { username: username },
          }
        );
        if (response.data && response.data.color) {
          iconColors[username] = response.data.color;
        }
      } catch (error) {
        console.error(`Error fetching icon color for ${username}:`, error);
      }
    }
*/
    function getIconColor(username) {
      return iconColors[username] || "#000000";
    }

    function handleMouseOver(id) {
      state.showQuoteButton[id] = true;
    }

    function handleMouseLeave(id) {
      state.showQuoteButton[id] = false;
    }

    function quoteMessage(messageText, id) {
      state.quotedMessage = messageText;
      state.showQuoteButton[id] = false;
    }

    function clearQuotedMessage() {
      state.quotedMessage = "";
    }

    function handleSend(content) {
      if (!content || content.trim() === "") {
        return;
      }
      store.dispatch("sendMessage", content);
    }

    return {
      ...toRefs(state),
      quoteMessage,
      clearQuotedMessage,
      handleSend,
      isAuthenticated,
      getIconColor,
      handleMouseOver,
      handleMouseLeave,
    };
  },
};
</script>

<style>
.message-card {
  display: flex;
  align-items: center;
  padding: 16px;
  position: relative;
  z-index: 1;
}

.icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.quote-button {
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  padding: 5px;
}

.message-card:hover .quote-button {
  display: block;
}

.message-card ul {
  list-style-type: disc;
  padding-left: 20px;
}

.message-card li {
  margin-bottom: 10px;
}

.message-card ol {
  list-style-type: decimal;
  padding-left: 20px;
}

/* 引用のスタイル */
.message-card blockquote {
  border-left: 4px solid #ddd;
  padding-left: 15px;
  color: #666;
}

.message-icon {
  margin-right: 10px;
}

.message-user {
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.message-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  position: relative;
}
.command-palette-wrapper {
  position: sticky;
  bottom: 0;
}

.command-palette {
  width: 100%;
  height: 100px;
  z-index: 2;
}
</style>
