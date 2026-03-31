import { createRouter, createWebHistory } from 'vue-router'

import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import Dashboard from './views/Dashboard.vue'
import CreateSurvey from './views/CreateSurvey.vue'
import FillSurvey from './views/FillSurvey.vue'
import Results from './views/Results.vue'
import QuestionBank from './views/QuestionBank.vue'
import AIChat from './views/AIChat.vue'
import ResponseDetail from './views/ResponseDetail.vue'
import MyResponses from './views/MyResponses.vue' // Add import

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/create', component: CreateSurvey },
  { 
    path: '/my-responses', 
    component: MyResponses,
    meta: { keepAlive: true }
  }, // Add route
  { path: '/ai-chat', component: AIChat },
  { path: '/question-bank', component: QuestionBank },
  { path: '/survey/:id', component: FillSurvey },
  { path: '/results/:id', component: Results },
  { path: '/response/:id', component: ResponseDetail },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
