<template>
  <div class="message-list">
    <VaCard v-for="msg in messages" :key="msg.id" class="mb-2 message-card">
      <VaCardTitle>
        <!-- Use mdicon component from mdi-vue -->
        <MdIcon
          :name="getIconName(msg.user__username)"
          class="message-icon"
          size="24"
        />
        <span class="message-user">{{ msg.user__username }}</span>
      </VaCardTitle>
      <VaCardContent>
        {{ msg.text }}
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import { MdIcon } from "mdi-vue";

export default {
  name: "MessageList",
  components: {
    MdIcon,
  },
  props: {
    messages: Array,
  },
  methods: {
    getIconName(username) {
      if (!username) {
        return "mdi-home";
      }
      const iconName = "mdi-" + username.toLowerCase();
      return iconName;
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

.message-icon {
  margin-right: 10px;
}

.message-user {
  font-weight: bold;
  margin-right: 10px;
}
</style>
