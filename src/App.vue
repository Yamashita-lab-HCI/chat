<template>
  <div id="app">
    <div class="container">
      <va-sidebar v-model:collapsed="isCollapsed" v-if="isAuthenticated">
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
          <va-sidebar-item @click="createNewRoom">
            <va-sidebar-item-content>
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
  computed: {
    ...mapState(["isAuthenticated"]),
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  created() {
    this.fetchAuthentication();
  },
  methods: {
    ...mapActions(["logOut", "selectRoom", "addRoom", "fetchAuthentication"]),
    goToHome() {
      this.$router.push("/home");
    },
    goToProfile() {
      this.$router.push("/user-profile");
    },
    logout() {
      const csrfToken = this.getCookie("csrftoken");
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "logout/",
          {},
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        )
        .then(() => {
          this.logOut();
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Failed to log out:", error);
          alert(
            `Logout failed: ${error.response.data.detail || "Please try again."}`
          );
        });
    },
    getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },
    createNewRoom() {
      const roomName = prompt("Enter a name for the new chat room:");
      if (roomName) {
        this.addRoom({ name: roomName });
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}
.container {
  display: flex;
}
.sidebar {
  flex: 0 0 250px;
}
.main-content {
  flex: 1;
}
</style>
