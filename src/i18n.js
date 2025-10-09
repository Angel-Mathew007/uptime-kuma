import "bootstrap";
import { createApp, h } from "vue";
import contenteditable from "vue-contenteditable";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/app.scss";
import "./assets/vue-datepicker.scss";

// i18n
import { i18n } from "./i18n";

// Mixins
import datetime from "./mixins/datetime";
import mobile from "./mixins/mobile";
import publicMixin from "./mixins/public";
import socket from "./mixins/socket";
import theme from "./mixins/theme";
import lang from "./mixins/lang";

// Router & Utilities
import { router } from "./router";
import { appName } from "./util.ts";
import { loadToastSettings } from "./util-frontend";

// Day.js & plugins
import dayjs from "dayjs";
import timezone from "./modules/dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Create Vue app
const app = createApp({
    mixins: [socket, theme, mobile, datetime, publicMixin, lang],
    data() {
        return {
            appName: appName,
        };
    },
    render: () => h(App),
});

// Use router and i18n
app.use(router);
app.use(i18n);

// Use Toast with settings
app.use(Toast, loadToastSettings());

// Register global components
app.component("Editable", contenteditable);
app.component("FontAwesomeIcon", () => import("./icon.js"));

// Mount the app
app.mount("#app");

// Expose the Vue instance in development
if (process.env.NODE_ENV === "development") {
    console.log("Dev Only: window.app is the vue instance");
    window.app = app._instance;
}
