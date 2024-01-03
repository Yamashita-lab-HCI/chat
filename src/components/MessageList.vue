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
.user-icon {
  font-size: 24px;
  /* アイコンのサイズを調整 */
  margin-right: 8px;
  vertical-align: middle;
}
</style>
