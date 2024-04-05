<template>
  <div class="prompt-display">
    <!-- プロンプトの表示や操作に関するコンテンツ -->
    <p>ここにプロンプトが表示されます。</p>
  </div>
</template>

<script>
export default {
  name: 'PromptDisplay',
  // 必要に応じてpropsやmethodsを追加
}
</script>

<!-- スタイル -->
<style scoped>
.prompt-display {
  padding: 20px;
  border-left: 1px solid #ccc; /* 左側に境界線を追加 */
  height: 100%; /* 親要素に合わせて高さを設定 */
}
</style>
