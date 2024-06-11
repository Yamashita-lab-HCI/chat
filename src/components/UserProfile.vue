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
      <div class="icon" :style="{ backgroundColor: cssColor }"></div>
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
import { ref, computed } from "vue";
import axios from "axios";

export default {
  name: "UserProfile",
  setup() {
    const store = useStore();
    const iconColor = ref("primary");
    const username = store.state.currentUser.username;
    const initializeIconColor = async () => {
      try {
        const response = await axios.get(
          process.env.VUE_APP_BASE_URL + "get_icon_color/",
          {
            params: {
              username: username,
            },
          }
        );
        if (response.data && response.data.color) {
          iconColor.value = response.data.color;
        } else {
          console.error(
            `Unexpected response format for ${username}:`,
            response.data
          );
        }
      } catch (error) {
        console.error(`Error fetching icon color for ${username}:`, error);
      }
    };

    initializeIconColor();
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

    const fetchIconColor = async () => {
      const fetchedColor = await store.dispatch("fetchIconColor");
      console.log(fetchedColor);
      if (fetchedColor) {
        iconColor.value = fetchedColor;
      }
    };
    fetchIconColor();
    const cssColor = computed(() => getColor(iconColor.value));

    return {
      iconColor,
      colors,
      changeIconColor,
      cssColor,
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
