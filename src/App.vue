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
    ...mapState({
      isAuthenticated: (state) => state.isLoggedIn,
      rooms: (state) => state.rooms,
    }),
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  created() {
    this.initializeApp();
  },
  methods: {
    ...mapActions([
      "logOut",
      "addRoom",
      "fetchAuthentication",
      "fetchRooms",
      "fetchMessages",
      "initWebSocket",
      "initRoomListWebSocket",
      "initRoomListWebSocket",
      "selectRoom",
    ]),
    async initializeApp() {
      await this.fetchAuthentication();
      if (this.isAuthenticated) {
        await this.fetchRooms();
        this.initRoomListWebSocket();
        if (this.$route.params.roomId) {
          this.selectRoom({ id: this.$route.params.roomId });
        }
      }
    },
    goToHome() {
      this.$router.push("/home").then(() => {
        location.reload();
      });
    },
    goToProfile() {
      this.$router.push("/user-profile");
    },
    selectRoom(room) {
      this.$router.push(`/room/${room.id}`);
      this.$store.commit("setCurrentRoom", room.id);
      this.initWebSocket(); // WebSocket接続を初期化
      // this.fetchMessages();
    },
    logout() {
      const csrfToken = this.getCookie("csrftoken");
      console.log("CSRF Token:", csrfToken);
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "logout/",
          {},
          {
            headers: {
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        )
        .then(() => {
          if (this.$store.state.socket) {
            this.$store.state.socket.close();
          }
          this.$store.dispatch("logOut");
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
        axios
          .post(
            process.env.VUE_APP_BASE_URL + "create-room/",
            { roomName: roomName },
            {
              headers: {
                "X-CSRFToken": window.csrfToken,
              },
            }
          )
          .then((response) => {
            const roomId = response.data.roomId;
            this.addRoom({ name: roomName, id: roomId });
            this.selectRoom({ id: roomId });
            this.$router.push(`/room/${roomId}`);
          })
          .catch((error) => {
            console.error("Failed to create room:", error);
            console.error("Server response:", error.response.data);
            alert(
              `Room creation failed: ${error.response.data.detail || "Please try again."}`
            );
          });
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
