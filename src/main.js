import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuestic } from 'vuestic-ui';
import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/styles/grid.css';
import 'vuestic-ui/styles/reset.css';
import 'vuestic-ui/styles/typography.css';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
// import 'vuestic-admin/src/scss/icon-fonts/fontelico/fontelico.scss';


createApp(App)
  .use(mdiVue, {
    icons: mdijs
  })
  .use(router)
  .use(createVuestic({
    config: {
      colors: {
        variables: {
          primary: "#154EC1",
          secondary: "#666E75",
          success: "#3D9209",
          info: "#158DE3",
          danger: "#E42222",
          warning: "#FFD43A",
          backgroundPrimary: "#FFFFFF",
          backgroundSecondary: "#FFFFFF",
          backgroundElement: "#ECF0F1",
          backgroundBorder: "#DEE5F2",
          textPrimary: "#262824",
          textInverted: "#FFFFFF",
          shadow: "rgba(0, 0, 0, 0.12)",
          focus: "#49A8FF",
          transparent: "rgba(0, 0, 0, 0)",
          backgroundLanding: "#f4f9fc",
          backgroundLandingBorder: "rgba(155, 179, 206, 0.8)",
          button: "#000",
        },
      },
      components: {
        VaButton: {
          color: "button",
        },
      },
    }
  }))
  .mount('#app');
