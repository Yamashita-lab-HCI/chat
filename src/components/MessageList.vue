<template>
  <div class="message-list">
    <va-card v-for="msg in messages" :key="msg.id" class="mb-2" outlined color="primary" gradient>
      <va-card-title>
        <va-icon :name="msg.icon" class="user-icon" />{{ msg.user }}
      </va-card-title>
      <va-card-content>
        {{ msg.text }}
      </va-card-content>
    </va-card>
  </div>
</template>

<script>
import dummyData from '@/dummyData'
export default {
  name: 'MessageList',
  data() {
    return {
      messages: dummyData.messages
    };
  }
};
</script>

<style>
.va-card-title {
  display: flex; /* Flexbox を有効化 */
  align-items: center; /* 垂直方向の中央揃え */
}

.user-icon {
  font-size: 30px;
  margin-right: 30px;
}
</style>
