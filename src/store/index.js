import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      messages: [],
      rooms: [],
      currentRoom: null,
      currentUser: null,
      filteredMessages: [],
      isUsernameValid: false,
      isPasswordValid: false,
      isLoggedIn: false,
      socket: null,
      roomId: null,
      iconColor: "primary",
      chatSocket: null,
      roomListSocket: null,
      userType: "",
    };
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType;
    },
    setIconColor(state, color) {
      state.iconColor = color;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
    setRoomListSocket(state, socket) {
      state.roomListSocket = socket;
    },
    addRoom(state, room) {
      state.rooms = [...state.rooms, room];
    },
    addMessage(state, message) {
      if (!state.messages.some((m) => m.id === message.id)) {
        state.messages.push(message);
      }
    },
    updateUsernameValidation(state, isValid) {
      state.isUsernameValid = isValid;
    },
    updatePasswordValidation(state, isValid) {
      state.isPasswordValid = isValid;
    },
    SET_ROOM_ID(state, roomId) {
      state.roomId = roomId;
    },
    SET_CHAT_SOCKET(state, socket) {
      if (state.chatSocket) {
        state.chatSocket.close();
      }
      state.chatSocket = socket;
    },
    SET_ROOM_LIST_SOCKET(state, socket) {
      if (state.roomListSocket) {
        state.roomListSocket.close();
      }
      state.roomListSocket = socket;
    },
  },
  actions: {
    fetchIconColor({ commit, state }) {
      return axios
        .get(process.env.VUE_APP_BASE_URL + "get_icon_color/", {
          params: { username: state.currentUser.username },
        })
        .then((response) => {
          commit("setIconColor", response.data.color);
          return response.data.color;
        })
        .catch((error) => {
          console.error("Error fetching icon color:", error);
        });
    },
    updateIconColor({ commit, state }, color) {
      const username = state.currentUser.username;
      return axios
        .post(process.env.VUE_APP_BASE_URL + "update_icon_color/", {
          username: username,
          color: color,
        })
        .then(() => {
          commit("setIconColor", color);
        })
        .catch((error) => {
          console.error("Error updating icon color:", error);
        });
    },
    fetchRooms({ commit }) {
      return axios
        .get(process.env.VUE_APP_BASE_URL + "room/")
        .then((response) => {
          const rooms = response.data.map((room) => ({
            id: room.id,
            name: room.name,
          }));
          commit("setRooms", rooms);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        });
    },
    fetchAuthentication({ commit }) {
      return axios
        .get(process.env.VUE_APP_BASE_URL + "check_login_status/")
        .then((response) => {
          commit("setLoggedIn", response.data.isLoggedIn);
        })
        .catch((error) => {
          console.error("Error fetching authentication status:", error);
          commit("setLoggedIn", false);
        });
    },
    fetchCurrentUser({ commit }) {
      return axios
        .get(process.env.VUE_APP_BASE_URL + "get_current_user/")
        .then((response) => {
          commit("setCurrentUser", response.data);
          localStorage.setItem("username", response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    },
    fetchMessages({ state, commit }) {
      if (state.currentRoom === null) {
        console.error("currentRoom is not set");
        return Promise.reject("currentRoom is not set");
      }
      return axios
        .get(process.env.VUE_APP_BASE_URL + "messages/", {
          params: { room_id: state.currentRoom },
        })
        .then((response) => {
          commit("setMessages", response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    },
    initRoomListWebSocket({ commit, dispatch }) {
      const wsUrl = `${process.env.VUE_APP_WS_URL}ws/room_list/`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Room List WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "room_list_update") {
          dispatch("updateRoomList", data.rooms);
        }
      };

      socket.onclose = () => {
        console.log("Room List WebSocket disconnected");
        setTimeout(() => dispatch("initRoomListWebSocket"), 3000);
      };

      commit("SET_ROOM_LIST_SOCKET", socket);
    },

    updateRoomList({ commit }, rooms) {
      commit("setRooms", rooms);
    },

    closeWebSocket({ state, commit }) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.close();
      }
      commit("setSocket", null);
    },

    initWebSocket({ state, commit }) {
      if (!state.currentUser) {
        console.error("Cannot initialize WebSocket: User not authenticated");
        return;
      }
      if (state.currentRoom === null) {
        console.error("Cannot initialize WebSocket: Room not selected");
        return;
      }

      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.close();
      }

      const wsUrl = `${process.env.VUE_APP_WS_URL}ws/chat/${state.currentRoom}/`;
      console.log("Connecting to WebSocket:", wsUrl);

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected successfully");
      };

      socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === "chat_message") {
            store.dispatch("addMessage", data.message);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = (event) => {
        console.log(
          "WebSocket closed. Code:",
          event.code,
          "Reason:",
          event.reason
        );
        commit("setSocket", null);
        /*
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          store.dispatch("initWebSocket");
        }, 5000);
        */
      };
      commit("setSocket", socket);
    },
    switchRoom({ commit, state }, newRoomId) {
      if (state.chatSocket) {
        state.chatSocket.close();
        commit("SET_CHAT_SOCKET", null);
      }

      if (state.roomListSocket) {
        state.roomListSocket.close();
        commit("SET_ROOM_LIST_SOCKET", null);
      }

      commit("SET_ROOM_ID", newRoomId);

      store.dispatch("initChatWebSocket", newRoomId);

      store.dispatch("initRoomListWebSocket");
    },
    addMessage({ commit }, message) {
      commit("addMessage", message);
    },
    sendMessage({ state }, messageData) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        const message = {
          type: "chat_message",
          message: messageData,
          username: state.currentUser.username,
          room: state.currentRoom,
        };
        state.socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not open. Unable to send message.");
      }
    },
    logIn({ commit }) {
      commit("setLoggedIn", true);
    },
    logOut({ commit }) {
      commit("setLoggedIn", false);
    },
    addRoom({ commit }, room) {
      commit("addRoom", room);
    },
    selectRoom({ commit, dispatch }, room) {
      commit("setCurrentRoom", room);
      dispatch("initWebSocket");
    },
    updateUsernameValidation({ commit }, isValid) {
      commit("updateUsernameValidation", isValid);
    },
    updatePasswordValidation({ commit }, isValid) {
      commit("updatePasswordValidation", isValid);
    },
    setRoomId({ commit }, roomId) {
      commit("SET_ROOM_ID", roomId);
    },
  },
});

export default store;
