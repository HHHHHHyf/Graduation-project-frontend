import { createRouter, createWebHistory } from 'vue-router'

import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Dashboard from './views/Dashboard.vue'
import CreateSurvey from './views/CreateSurvey.vue'
import FillSurvey from './views/FillSurvey.vue'
import Results from './views/Results.vue'
import QuestionBank from './views/QuestionBank.vue' // Add import

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/create', component: CreateSurvey },
  { path: '/question-bank', component: QuestionBank }, // Add route
  { path: '/survey/:id', component: FillSurvey },
  { path: '/results/:id', component: Results },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
