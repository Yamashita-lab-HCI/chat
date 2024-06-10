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
      <div class="icon" :style="{ backgroundColor: iconColor }"></div>
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
import { mapActions, useStore } from "vuex";
import { useColors } from "vuestic-ui";
import { ref, onMounted } from "vue";

export default {
  name: "UserProfile",
  setup() {
    const store = useStore();
    const iconColor = ref("primary");
    const colors = ref([
      "primary",
      "secondary",
      "success",
      "info",
      "danger",
      "warning",
    ]);

    const { getColor } = useColors();

    const changeIconColor = (colorName) => {
      const color = getColor(colorName);
      if (!color) {
        console.error(`Color "${colorName}" not found in Vuestic config.`);
        return;
      }
      store
        .dispatch("updateIconColor", color)
        .then(() => {
          iconColor.value = color;
        })
        .catch((error) => {
          console.error("Error updating icon color:", error);
        });
    };

    onMounted(async () => {
      const fetchedColor = await store.dispatch("fetchIconColor");
      if (fetchedColor) {
        iconColor.value = fetchedColor;
      }
    });

    return {
      iconColor,
      colors,
      changeIconColor,
    };
  },
  methods: {
    ...mapActions(["updateIconColor"]),
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
