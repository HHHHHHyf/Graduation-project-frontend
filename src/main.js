import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/custom.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 配置 axios 拦截器处理 Token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

createApp(App).use(router).mount('#app')
