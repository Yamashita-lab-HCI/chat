<template>
  <div class="user-profile">
    <VaAlert
      color="primary"
      border="top"
      border-color="primary"
      class="mb-6 alert-spacing"
    >
      User Profile
    </VaAlert>
    <VaAlert color="info" class="mb-6 alert-spacing">
      <template #icon>
        <VaIcon name="info" />
      </template>
      Please choose your icon color!
    </VaAlert>
    <div class="icon-container alert-spacing">
      <div class="icon" :style="{ backgroundColor: colorMap[iconColor] }"></div>
    </div>
    <VaButton
      v-for="color in colors"
      :key="color"
      :color="color"
      class="button-spacing mr-6 mb-2"
      @click="changeIconColor(color)"
      >{{ color }}</VaButton
    >
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  data() {
    return {
      iconColor: "primary",
      colors: ["primary", "secondary", "success", "info", "danger", "warning"],
      colorMap: {
        primary: "#154EC1",
        secondary: "#666E75",
        success: "#3D9209",
        info: "#158DE3",
        danger: "#E42222",
        warning: "#FFD43A",
      },
    };
  },
  methods: {
    changeIconColor(color) {
      this.iconColor = color;
    },
  },
};
</script>

<style scoped>
.alert-spacing {
  margin-bottom: 30px; /* ここで各要素間の距離を設定します */
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px; /* Adjust this value as needed */
}

.icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.button-spacing {
  margin-right: 10px;
}
</style>
