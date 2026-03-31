<template>
  <div class="login-wrapper container-fluid p-0 min-vh-100 overflow-hidden">
      <div class="row g-0 h-100 min-vh-100">
          <!-- Left Side (Same as Login) -->
          <div class="col-lg-7 d-none d-lg-flex flex-column justify-content-start align-items-start position-relative bg-dark-blue overflow-hidden">
              <div class="bg-abstract w-100 h-100 position-absolute start-0 top-0">
                  <div class="bg-base w-100 h-100 position-absolute"></div>
              </div>
              <div class="z-1 text-white p-5 text-start w-100 position-relative">
                  <h1 class="fs-3 fw-bold mb-2">找回密码</h1>
                  <p class="fs-6 opacity-75">通过邮箱验证码重置您的账户密码</p>
              </div>
          </div>

          <!-- Right Side: Reset Form -->
          <div class="col-lg-5 bg-white d-flex flex-column justify-content-center align-items-center position-relative">
              <div class="w-100 px-5 py-4" style="max-width: 480px;">
                  <div class="mb-3">
                      <h2 class="fw-bold fs-2 text-dark m-0">重置密码</h2>
                  </div>

                  <form @submit.prevent="handleReset">
                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 注册邮箱</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <input type="email" class="form-control bg-transparent border-0 shadow-none ps-3 fs-6" v-model="form.email" placeholder="请输入您的注册邮箱" required>
                          </div>
                      </div>

                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 验证码</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <input type="text" class="form-control bg-transparent border-0 shadow-none ps-3 fs-6" v-model="form.code" placeholder="6位数字" required>
                              <button type="button" class="btn btn-outline-primary btn-xs border-0 px-2" :disabled="countdown > 0" @click="sendCode" style="font-size: 0.75rem; white-space: nowrap;">
                                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                              </button>
                          </div>
                      </div>

                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 新密码</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <input type="password" class="form-control bg-transparent border-0 shadow-none ps-3 fs-6" v-model="form.newPassword" placeholder="请输入新密码" required>
                          </div>
                      </div>

                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 确认新密码</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <input type="password" class="form-control bg-transparent border-0 shadow-none ps-3 fs-6" v-model="form.confirmPassword" placeholder="请再次输入新密码" required>
                          </div>
                      </div>

                      <div class="d-grid mb-3">
                          <button type="submit" class="btn btn-primary btn-lg py-2 fw-bold shadow-lg-primary border-0" :disabled="loading" style="background-color: #5355E6;">
                              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              <span v-else>重置密码</span>
                          </button>
                      </div>

                      <div class="text-center">
                        <router-link to="/login" class="text-primary text-decoration-none fw-bold small">
                            返回登录
                        </router-link>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(0)
const loading = ref(false)
const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

async function sendCode() {
  if (!form.email || !form.email.includes('@')) {
    alert('请输入有效的邮箱地址')
    return
  }

  try {
    const res = await fetch('http://localhost:8080/api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    })
    const result = await res.json()
    if (res.ok) {
      alert(result.message)
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) clearInterval(timer)
      }, 1000)
    } else {
      alert(result.error)
    }
  } catch (err) {
    alert('发送失败，请重试')
  }
}

async function handleReset() {
  if (form.newPassword !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const result = await res.json()
    if (res.ok) {
      alert('密码重置成功，请登录')
      router.push('/login')
    } else {
      alert(result.error)
    }
  } catch (err) {
    alert('重置失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-dark-blue { background-color: #0c1221; }
.bg-base { background: radial-gradient(circle at 10% 20%, #1e2a4a 0%, #0c1221 80%); }
.bg-light-input { background-color: #ffffff; border-color: #e2e8f0 !important; }
.input-group:focus-within { border-color: #5355E6 !important; box-shadow: 0 0 0 3px rgba(83, 85, 230, 0.15); }
.shadow-lg-primary { box-shadow: 0 10px 25px -5px rgba(83, 85, 230, 0.4); }
.z-1 { z-index: 1; }
</style>
