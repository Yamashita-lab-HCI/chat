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
        <div class="icon" :style="{ backgroundColor: iconColor }"></div>
        <div>Icon Color: {{ iconColor }}</div>
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
import CommandPalette from "./CommandPalette.vue"; // CommandPaletteをインポート
import { useStore, mapState } from "vuex";
import { reactive, toRefs, watch, onMounted, ref } from "vue";

export default {
  name: "MessageList",
  components: {
    Return32,
    CommandPalette,
  },
  props: {
    messages: Array,
  },
  computed: {
    ...mapState(["iconColor"]),
  },
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      showQuoteButton: ref({}),
      quotedMessage: "",
      isAuthenticated: false,
    });

    const { isAuthenticated, currentUser } = mapState({
      isAuthenticated: (state) => state.isLoggedIn,
      currentUser: (state) => state.currentUser,
    });

    onMounted(() => {
      props.messages.forEach((msg) => {
        state.showQuoteButton[msg.id] = false;
      });
    });

    watch(
      () => props.messages,
      (newMessages) => {
        newMessages.forEach((message) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              state.showQuoteButton,
              message.id
            )
          ) {
            state.showQuoteButton = {
              ...state.showQuoteButton,
              [message.id]: false,
            };
          }
        });
      },
      { immediate: true }
    );

    function getIconName() {
      return currentUser.icon;
    }

    function getIconColor() {
      return currentUser.iconColor;
    }

    function handleMouseOver(id) {
      state.showQuoteButton[id] = true;
    }

    function handleMouseLeave(id) {
      state.showQuoteButton[id] = false;
    }

    function quoteMessage(messageText, id) {
      state.quotedMessage = messageText;
      context.emit("quote", messageText);
      state.showQuoteButton[id] = false;
    }

    function clearQuotedMessage() {
      state.quotedMessage = "";
    }

    function handleSend(content) {
      if (!content || content.trim() === "") {
        return;
      }
      store.dispatch("addMessage", content).then((newMessage) => {
        console.log("newMessage:", newMessage); // デバッグログを追加
        if (newMessage && newMessage.id) {
          context.emit("update-messages", [newMessage, ...props.messages]);
          state.showQuoteButton[newMessage.id] = false;
          Object.keys(state.showQuoteButton).forEach((key) => {
            if (key !== newMessage.id) {
              state.showQuoteButton[key] = false;
            }
          });
        } else {
          console.error("newMessage does not have an id:", newMessage);
        }
      });
    }

    return {
      ...toRefs(state),
      quoteMessage,
      clearQuotedMessage,
      handleSend,
      isAuthenticated,
      getIconName,
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
