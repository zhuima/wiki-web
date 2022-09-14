import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
// import store from './store'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import './style.css';

import * as Icons from '@ant-design/icons-vue';
import axios from 'axios';


axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER



const app = createApp(App);

app.use(router).use(Antd).mount('#app');

// 全局使用图标
const icons: any = Icons;
for (const icon in icons) {
    app.component(icon, icons[icon]);
}