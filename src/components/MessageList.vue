<template>
  <div class="message-list">
    <VaCard
      v-for="msg in messages"
      :key="msg.id"
      class="mb-2 message-card"
      @mouseover="showQuoteButton[msg.id] = true"
      @mouseleave="showQuoteButton[msg.id] = false"
    >
      <VaCardTitle>
        <MdIcon
          :name="getIconName(msg.user__username)"
          class="message-icon"
          size="24"
        />
        <span class="message-user">{{ msg.user__username }}</span>
      </VaCardTitle>
      <VaCardContent>
        <div v-if="msg.text" v-html="msg.text"></div>
        <VaButton
          v-if="showQuoteButton[msg.id]"
          @click="quoteMessage(msg.text)"
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
import { mapState, mapActions } from "vuex";

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
  data() {
    return {
      showQuoteButton: {},
      quotedMessage: "",
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: (state) => state.isLoggedIn,
    }),
  },
  created() {
    this.initializeShowQuoteButton();
  },
  watch: {
    messages: {
      immediate: true,
      handler() {
        this.initializeShowQuoteButton();
      },
    },
  },
  methods: {
    ...mapActions(["addMessage"]),
    initializeShowQuoteButton() {
      this.messages.forEach((msg) => {
        this.showQuoteButton[msg.id] = false;
      });
    },
    getIconName(username) {
      if (!username) {
        return "mdi-home";
      }
      const iconName = "mdi-" + username.toLowerCase();
      return iconName;
    },
    quoteMessage(messageText) {
      this.quotedMessage = messageText;
    },
    clearQuotedMessage() {
      this.quotedMessage = "";
    },
    handleSend(content) {
      this.addMessage(content).then(() => {
        this.$emit("update-messages", [...this.messages, content].reverse());
      });
    },
  },
};
</script>

<style>
.message-card {
  display: flex;
  align-items: center;
  padding: 16px;
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
