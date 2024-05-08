<template>
  <div id="app">
    <div class="container">
      <va-sidebar v-model:collapsed="isCollapsed" v-if="loggedIn">
        <va-list>
          <va-sidebar-item @click="goToHome">
            <va-sidebar-item-content>
              <va-icon name="home" size="large" />
              <va-sidebar-item-title>Home</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item @click="goToProfile">
            <va-sidebar-item-content>
              <va-icon name="person" size="large" />
              <va-sidebar-item-title>Profile</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item>
            <va-sidebar-item-content @click="createNewRoom">
              <va-icon name="add" size="large" />
              <va-sidebar-item-title>Create New Room</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item
            v-for="room in rooms"
            :key="room.name"
            @click="selectRoom(room)"
          >
            <va-sidebar-item-content>
              <va-icon name="chat" size="large" />
              <va-sidebar-item-title>{{ room.name }}</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
          <va-sidebar-item @click="logout">
            <va-sidebar-item-content>
              <va-icon name="logout" size="large" />
              <va-sidebar-item-title>Log Out</va-sidebar-item-title>
            </va-sidebar-item-content>
          </va-sidebar-item>
        </va-list>
      </va-sidebar>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",

  data() {
    return {
      loggedIn: localStorage.getItem("isLoggedIn") === "true",
    };
  },

  computed: {
    ...mapState(["rooms", "currentRoom", "filteredMessages"]),
  },

  methods: {
    ...mapActions(["selectRoom", "addRoom"]),
    goToHome() {
      this.$router.push("/home");
    },
    goToProfile() {
      this.$router.push("/user-profile");
    },
    logout() {
      axios
        .post("/api/logout")
        .then(() => {
          this.loggedIn = false;
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Failed to log out:", error);
        });
    },
    createNewRoom() {
      const roomName = prompt("新しいチャットルームの名前を入力してください");
      if (roomName) {
        this.addRoom(roomName);
      }
    },
  },
  created() {
    // 初期ログイン状態のチェック
    this.loggedIn =
      this.$route.meta.requiresAuth && this.$store.getters.isAuthenticated;
  },
};
</script>

<style>
/* グローバルなスタイリング */
#app {
  text-align: center;
}

.container {
  display: flex;
}

.sidebar {
  flex: 0 0 250px; /* サイドバーの幅を250pxに設定 */
  /* サイドバーのスタイリング */
}

.main-content {
  flex: 1; /* 残りのスペースを利用 */
  /* 本文のスタイリング */
}

header {
  text-align: left; /* Align header content to the left */
  width: 100%; /* Full width */
}

footer {
  margin-top: 20px;
}
</style>
