<template>
  <div class="login">
    <va-card class="login-card">
      <img src="@/assets/chat-icon.svg" alt="Chat Icon" />
      <h2>Welcome to my chat app!</h2>
      <form @submit.prevent="onLogin" class="login-form">
        <div class="form-section">
          <va-input v-model="username" placeholder="Enter your username" />
        </div>
        <div class="form-section">
          <va-input
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />
        </div>
        <div class="form-section">
          <va-select
            v-model="userType"
            :options="userTypes"
            label="User Type"
            placeholder="Select NNS or NS"
            clearable
          />
        </div>
        <div class="form-section">
          <VaButton type="submit" class="mr-6 mb-2" color="primary"
            >Log In</VaButton
          >
        </div>
      </form>
      <div class="register-section">
        <VaBadge
          text="If you don't have an account yet..."
          color="#B3D943"
          class="mr-2"
        />
      </div>
      <VaButton color="danger" class="mr-6 mb-2" @click="goToRegister"
        >Register</VaButton
      >
    </va-card>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { VaSelect } from "vuestic-ui";

export default {
  name: "LoginPage",
  components: {
    VaSelect,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const username = ref("");
    const password = ref("");
    const userType = ref("");
    const csrfToken = ref("");
    const userTypes = reactive([
      { text: "NNS", value: "NNS" },
      { text: "NS", value: "NS" },
    ]);

    onMounted(() => {
      csrfToken.value = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        ?.split("=")[1];
    });

    const onLogin = () => {
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "login/",
          {
            username: username.value,
            password: password.value,
          },
          {
            headers: {
              "X-CSRFToken": csrfToken.value,
            },
          }
        )
        .then((response) => {
          if (response.data && response.data.status == "success") {
            store.commit("setCurrentUser", username.value);
            store.commit("setUserType", userType.value);
            store.dispatch("logIn");
            alert("Login Success!");
            router.push("/home").then(() => {
              location.reload();
            });
          } else {
            alert("Login Failed! " + (response.data?.message || ""));
          }
        })
        .catch((error) => {
          console.error(error);
          alert(
            "Incorrect username or password! " +
              (error.response?.data?.message || "Unknown error")
          );
        });
    };

    const goToRegister = () => {
      router.push("/register");
    };

    return {
      username,
      password,
      userType,
      userTypes,
      onLogin,
      goToRegister,
    };
  },
};
</script>

<style>
.login img {
  width: 100px;
  /* アイコンの幅を設定 */
  height: auto;
  /* 高さを自動調整 */
  margin-bottom: 20px;
  /* フォームとの間隔を設定 */
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 300px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form .form-section {
  margin-bottom: 10px; /* Adjust this value as needed */
}

.login-card .register-section {
  margin-bottom: 10px;
}
</style>
