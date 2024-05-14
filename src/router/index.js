import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import UserProfile from "@/components/UserProfile.vue";

const routes = [
  { path: "/", component: LoginPage }, // ルートパスをLoginPageに変更
  { path: "/home", component: HomePage }, // HomePageへの新しいパスを追加
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/user-profile", component: UserProfile },
];

const router = createRouter({
  history: createWebHistory(process.env.STARIC_URL),
  routes,
});

export default router;
