<template>
  <div class="register-wrapper container-fluid p-0 min-vh-100 overflow-hidden">
      <div class="row g-0 h-100 min-vh-100">
          <!-- Left Side: Fancy Background -->
          <div class="col-lg-7 d-none d-lg-flex flex-column justify-content-start align-items-start position-relative bg-dark-blue overflow-hidden">
              <div class="bg-abstract w-100 h-100 position-absolute start-0 top-0">
                  <!-- Deep Blue Gradient Base -->
                  <div class="bg-base w-100 h-100 position-absolute"></div>

                  <!-- Tech Lines SVG -->
                  <svg class="tech-lines position-absolute w-100 h-100" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                      <defs>
                          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stop-color="rgba(110, 160, 255, 0)" />
                              <stop offset="50%" stop-color="rgba(110, 160, 255, 0.9)" />
                              <stop offset="100%" stop-color="rgba(110, 160, 255, 0)" />
                          </linearGradient>
                          <filter id="glow-strong">
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                          </filter>
                          <!-- Glitch Filter -->
                          <filter id="noise">
                              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                              <feColorMatrix type="saturate" values="0" />
                          </filter>
                      </defs>

                      <!-- Background Grid (Cyberpunk Mesh) -->
                      <g class="cyber-grid" opacity="0.4">
                          <path d="M0 200 L1000 200 M0 400 L1000 400 M0 600 L1000 600 M0 800 L1000 800" stroke="rgba(110, 160, 255, 0.4)" stroke-width="1" />
                          <path d="M200 0 L200 1000 M400 0 L400 1000 M600 0 L600 1000 M800 0 L800 1000" stroke="rgba(110, 160, 255, 0.4)" stroke-width="1" />
                      </g>

                      <!-- Chaos Layer 1: Random Intersecting Rays -->
                      <g class="chaos-rays">
                          <path d="M-100 100 L1100 900" stroke="rgba(110, 160, 255, 0.3)" stroke-width="2" />
                          <path d="M-100 500 L1100 500" stroke="rgba(110, 160, 255, 0.15)" stroke-width="1" />
                          <path d="M500 -100 L500 1100" stroke="rgba(110, 160, 255, 0.15)" stroke-width="1" />
                          <path d="M1100 100 L-100 900" stroke="rgba(110, 160, 255, 0.3)" stroke-width="2" />
                      </g>

                      <!-- Main Design Group (Chevron Flow) -->
                      <g transform="rotate(-165 500 500)">

                          <!-- Layer 1: Structural Complexity -->
                          <g class="structure-lines" opacity="0.7">
                              <!-- Primary Chevrons -->
                              <path d="M-300 900 L500 100 L1300 900" stroke="rgba(110, 160, 255, 0.25)" stroke-width="25" fill="none" />
                              <path d="M-280 900 L500 120 L1280 900" stroke="rgba(110, 160, 255, 0.3)" stroke-width="2" fill="none" />

                              <!-- Dense Parallel Lines for Tech Feel -->
                              <path d="M-220 900 L500 180 L1220 900" stroke="rgba(110, 160, 255, 0.35)" stroke-width="1" fill="none" stroke-dasharray="10 10"/>
                              <path d="M-210 900 L500 190 L1210 900" stroke="rgba(110, 160, 255, 0.35)" stroke-width="1" fill="none" />

                              <path d="M-150 900 L500 250 L1150 900" stroke="rgba(110, 160, 255, 0.4)" stroke-width="4" fill="none" />
                              <path d="M-100 900 L500 300 L1100 900" stroke="rgba(110, 160, 255, 0.2)" stroke-width="20" fill="none" />
                              <path d="M-50 900 L500 350 L1050 900" stroke="rgba(110, 160, 255, 0.3)" stroke-width="1" fill="none" stroke-dasharray="5 5"/>
                          </g>

                          <!-- Layer 2: Glowing Edges -->
                          <g class="glowing-edges" filter="url(#glow-strong)">
                             <path d="M-300 900 L500 100 L1300 900" stroke="rgba(110, 160, 255, 0.4)" stroke-width="2" fill="none" />
                             <path d="M-220 900 L500 180 L1220 900" stroke="rgba(110, 160, 255, 0.5)" stroke-width="1" fill="none" />
                             <path d="M-150 900 L500 250 L1150 900" stroke="rgba(110, 160, 255, 0.3)" stroke-width="3" fill="none" />
                          </g>

                          <!-- Layer 3: High Speed Energy Flow -->
                          <g class="energy-flow">
                              <path d="M-300 900 L500 100 L1300 900" stroke="url(#flowGradient)" stroke-width="4" fill="none" class="flow-line-1" filter="url(#glow-strong)"/>
                              <path d="M-280 900 L500 120 L1280 900" stroke="url(#flowGradient)" stroke-width="1" fill="none" class="flow-line-micro" />
                              <path d="M-220 900 L500 180 L1220 900" stroke="url(#flowGradient)" stroke-width="2" fill="none" class="flow-line-2" />
                              <path d="M-150 900 L500 250 L1150 900" stroke="url(#flowGradient)" stroke-width="3" fill="none" class="flow-line-3" />
                              <path d="M-50 900 L500 350 L1050 900" stroke="url(#flowGradient)" stroke-width="1" fill="none" class="flow-line-4" />

                              <!-- Glitch/Data Packets -->
                              <path d="M-250 900 L500 150 L1250 900" stroke="#a5b4fc" stroke-width="4" fill="none" class="data-packet" opacity="0.9"/>
                          </g>
                      </g>

                      <!-- Chaos Layer 2: Floating Digital Geometry -->
                      <g class="digital-geo" stroke="rgba(110, 160, 255, 0.5)" fill="none" stroke-width="1.5">
                         <rect x="700" y="200" width="100" height="100" transform="rotate(45 750 250)" class="float-rect"/>
                         <circle cx="200" cy="800" r="150" stroke-dasharray="20 10" class="rotate-ring"/>
                         <path d="M200 100 L100 200 L200 300" opacity="0.6" />
                      </g>

                      <!-- Dense Particles -->
                      <g class="particles">
                          <circle cx="85%" cy="35%" r="2" fill="#a5b4fc" class="blink-1" />
                          <circle cx="15%" cy="85%" r="2" fill="#a5b4fc" class="blink-2" />
                          <circle cx="55%" cy="15%" r="2" fill="#a5b4fc" class="blink-3" />
                          <circle cx="35%" cy="65%" r="3" fill="#a5b4fc" class="blink-fast" />
                          <circle cx="75%" cy="75%" r="1" fill="#a5b4fc" class="blink-random" />
                      </g>
                  </svg>
              </div>
              <div class="z-2 text-white p-5 text-start w-100 position-relative">
                  <h1 class="fs-3 fw-bold mb-2">校园同态加密<br>问卷系统</h1>
                  <p class="fs-6 opacity-75">安全、隐私、高效的数据收集平台</p>
              </div>
          </div>

          <!-- Right Side: Register Form -->
          <div class="col-lg-5 bg-white d-flex flex-column justify-content-center align-items-center position-relative scrollable-y">
              <div class="w-100 px-5 py-4" style="max-width: 480px;">

                  <!-- Header -->
                  <div class="mb-3">
                      <div class="d-flex justify-content-between align-items-baseline mb-1">
                        <h2 class="fw-bold fs-2 text-dark m-0">注册新账号</h2>
                      </div>
                      <p class="text-muted small mb-0">系统将自动为您生成同态加密密钥对</p>
                  </div>

                  <!-- Form -->
                  <form @submit.prevent="handleRegister">
                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 设定用户名</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <span class="input-group-text bg-transparent border-0 ps-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-person" viewBox="0 0 16 16">
                                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                </svg>
                              </span>
                              <input type="text" class="form-control bg-transparent border-0 shadow-none ps-2 fs-6" v-model="form.username" required>
                          </div>
                      </div>

                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 邮箱地址</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <span class="input-group-text bg-transparent border-0 ps-3">
                                📧
                              </span>
                              <input type="email" class="form-control bg-transparent border-0 shadow-none ps-2 fs-6" v-model="form.email" placeholder="example@email.com" required>
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
                          <label class="form-label fw-bold text-dark small">* 设定密码</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <span class="input-group-text bg-transparent border-0 ps-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-lock" viewBox="0 0 16 16">
                                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                                </svg>
                              </span>
                              <input type="password" class="form-control bg-transparent border-0 shadow-none ps-2 fs-6" v-model="form.password" required>
                          </div>
                      </div>

                      <div class="mb-3">
                          <label class="form-label fw-bold text-dark small">* 确认密码</label>
                          <div class="input-group input-group-lg border rounded-3 overflow-hidden bg-light-input">
                              <span class="input-group-text bg-transparent border-0 ps-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-check2-square" viewBox="0 0 16 16">
                                  <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                                  <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                </svg>
                              </span>
                              <input type="password" class="form-control bg-transparent border-0 shadow-none ps-2 fs-6" v-model="form.confirmPassword" required placeholder="请再次输入密码">
                          </div>
                      </div>

                      <div class="d-grid mb-3">
                          <button type="submit" class="btn btn-primary btn-lg py-2 fw-bold shadow-lg-primary border-0" :disabled="loading" style="background-color: #5355E6;">
                              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              <span v-else>立即注册</span>
                          </button>
                      </div>

                      <div class="text-center mb-0">
                        <span class="text-muted small">已有账号?</span>
                        <router-link to="/login" class="text-primary text-decoration-none fw-bold small ms-1">
                            直接登录 <span class="fs-6">&rsaquo;</span>
                        </router-link>
                      </div>

                      <div v-if="loading" class="mt-4 text-center text-muted small">
                          <div class="d-flex align-items-center justify-content-center">
                              <div class="spinner-grow spinner-grow-sm me-2 text-primary" role="status"></div>
                              <span>正在生成安全密钥对，请稍候...</span>
                          </div>
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
const form = reactive({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)

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

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
  }
  loading.value = true
  try {
      const res = await fetch('http://localhost:8080/api/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(form)
      });

      const result = await res.json();
      if (res.ok) {
          alert('注册成功，请登录');
          router.push('/login');
      } else {
          alert(result.error);
      }
  } catch (err) {
      alert('注册失败，请重试');
  } finally {
      loading.value = false;
  }
}
</script>

<style scoped>
.bg-dark-blue {
    background-color: #0c1221;
}

.bg-base {
    background: radial-gradient(circle at 90% 80%, #1e2a4a 0%, #0c1221 80%);
}

.tech-lines {
    pointer-events: none;
}

.cyber-grid {
    transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(2);
    animation: grid-move 20s linear infinite;
    transform-origin: 50% 50%;
}

@keyframes grid-move {
    0% { transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(2); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(0px) scale(2); }
}

/* Chaos Elements Animation */
.rotate-ring { animation: spin 30s linear infinite; transform-origin: 200px 800px; }
.float-rect { animation: float-rotate 20s ease-in-out infinite; transform-origin: 750px 250px; }

@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes float-rotate {
    0% { transform: rotate(45deg) translate(0,0); }
    50% { transform: rotate(90deg) translate(20px, -20px); }
    100% { transform: rotate(45deg) translate(0,0); }
}

/* Base structural glow */
.glowing-edges {
    animation: pulse-glow 3s infinite ease-in-out alternate;
}

/* Complex Flow Animations */
.flow-line-1 { stroke-dasharray: 400 1200; stroke-dashoffset: 1600; animation: flow-anim 2.5s linear infinite; opacity: 1; }
.flow-line-micro { stroke-dasharray: 50 400; stroke-dashoffset: 450; animation: flow-anim 4s linear infinite; opacity: 0.6; }
.flow-line-2 { stroke-dasharray: 200 800; stroke-dashoffset: 1000; animation: flow-anim 3.5s linear infinite; animation-delay: 0.2s; opacity: 0.8; }
.flow-line-3 { stroke-dasharray: 300 1000; stroke-dashoffset: 1300; animation: flow-anim 5s linear infinite; animation-delay: 0.5s; opacity: 0.5; }
.flow-line-4 { stroke-dasharray: 100 600; stroke-dashoffset: 700; animation: flow-anim 4s linear infinite; animation-delay: 1s; opacity: 0.4; }

.data-packet {
    stroke-dasharray: 20 1000;
    stroke-dashoffset: 1020;
    animation: data-zip 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
    filter: url(#glow-strong);
}

@keyframes data-zip {
    0% { stroke-dashoffset: 1020; opacity: 0; }
    10% { opacity: 1; }
    80% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
}

@keyframes flow-anim { to { stroke-dashoffset: 0; } }
@keyframes pulse-glow { 0% { opacity: 0.6; filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); } 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(255,255,255,0.8)); } }

/* Particles */
.blink-1 { animation: blink 3s infinite; }
.blink-2 { animation: blink 5s infinite; animation-delay: 2s; }
.blink-3 { animation: blink 4s infinite; animation-delay: 1s; }
.blink-fast { animation: blink 0.5s infinite alternate; }
.blink-random { animation: blink 2s infinite; animation-delay: 0.3s; }

@keyframes blink { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.9; } }

.z-2 {
    z-index: 2; /* 确保文字在背景层之上 */
}

/* 输入框样式 */
.bg-light-input {
    background-color: #ffffff;
    border-color: #e2e8f0 !important;
}

.input-group:focus-within {
    border-color: #5355E6 !important;
    box-shadow: 0 0 0 3px rgba(83, 85, 230, 0.15);
}

.shadow-lg-primary {
    box-shadow: 0 10px 25px -5px rgba(83, 85, 230, 0.4);
}

/* Custom placeholder visibility */
::placeholder {
    color: #ced4da;
    font-size: 0.9em;
}

.z-1 {
    z-index: 1;
}
</style>
