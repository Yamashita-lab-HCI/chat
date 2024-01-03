<template>
  <div class="message-input">
    <VaInput
      v-model="message"
      @keyup.enter="sendMessage"
      preset="bordered"
      label="Type your message"
    />
    <VaButton @click="sendMessage">Send</VaButton>
  </div>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      message: ''
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() !== '') {
        this.$emit('send', this.message);
        // メッセージをクリア
        this.message = '';
      }
    }
  }
};
</script>

<style>
.message-input input {
  width: 70%;
  padding: 10px;
  margin-right: 10px;
}

.message-input button {
  padding: 10px 20px;
}
</style>
