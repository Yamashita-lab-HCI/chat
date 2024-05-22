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
        <MdIcon
          :name="getIconName()"
          color="red"
          class="message-icon"
          size="24"
        />
        <span class="message-user">{{ msg.user__username }}</span>
      </VaCardTitle>
      <VaCardContent>
        <div v-if="msg.text" v-html="msg.text"></div>
        <VaButton
          v-show="showQuoteButton[msg.id]"
          @click="quoteMessage(msg.text, msg.id)"
        >
          <Return32 />
        </VaButton>
      </VaCardContent>
    </VaCard>
    <CommandPalette
      v-if="isAuthenticated"
      :quotedMessage="quotedMessage"
      @send="handleSend"
      @clear-quote="clearQuotedMessage"
    />
  </div>
</template>

<script>
import { MdIcon } from "mdi-vue";
import { Return32 } from "@carbon/icons-vue";
import CommandPalette from "./CommandPalette.vue"; // CommandPaletteをインポート
import { useStore, mapState } from "vuex";
import { reactive, toRefs, watch, onMounted, ref } from "vue";

export default {
  name: "MessageList",
  components: {
    MdIcon,
    Return32,
    CommandPalette,
  },
  props: {
    messages: Array,
  },
  setup(props, context) {
    const store = useStore();
    const state = reactive({
      showQuoteButton: ref({}),
      quotedMessage: "",
      isAuthenticated: false,
    });

    const { isAuthenticated } = mapState({
      isAuthenticated: (state) => state.isLoggedIn,
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
      return "mdi-home";
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

.message-card:hover .va-button {
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
</style>
