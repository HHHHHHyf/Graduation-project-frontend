<template>
  <div class="bg-light min-vh-100 py-5">
      <div class="container container-sm">
          <div class="row justify-content-center">
              <div class="col-lg-8">
                  <div class="card shadow rounded-lg border-0 mb-5 overflow-hidden">
                      <div class="card-header bg-primary text-white pt-5 pb-4 px-5 border-0 text-center">
                          <h2 v-if="loading" class="fw-light">请稍候...</h2>
                          <template v-else>
                               <h1 class="display-5 fw-bold mb-3">{{ title }}</h1>
                               <p class="lead opacity-75 mb-0">提交时间: {{ submittedAt }}</p>
                          </template>
                      </div>

                      <div class="card-body p-md-5 p-4 bg-white">
                           <div v-if="error" class="text-center py-5">
                              <h3 class="text-muted fw-light">{{ error }}</h3>
                              <router-link to="/dashboard" class="btn btn-primary mt-3">返回仪表盘</router-link>
                          </div>

                          <div v-else>
                              <div v-for="(ans, index) in answers" :key="ans.question_id" class="mb-5 p-4 bg-light rounded-lg shadow-sm">
                                  <div class="d-flex align-items-baseline mb-4">
                                      <span class="fs-3 fw-bold text-primary me-3 font-monospace">{{ (index + 1).toString().padStart(2, '0') }}.</span>
                                      <h4 class="fw-bold text-dark flex-grow-1 mb-0">{{ ans.question_text }}</h4>
                                      <span class="badge rounded-pill fw-normal ms-2"
                                            :class="{'bg-primary-subtle text-primary': ans.question_type === 'single_choice', 'bg-success-subtle text-success': ans.question_type === 'score_he', 'bg-secondary-subtle text-secondary': ans.question_type === 'text'}">
                                          {{ getTypeName(ans.question_type) }}
                                      </span>
                                  </div>

                                  <div class="ps-md-5">
                                      <!-- 如果有问题选项，显示选项列表（用于单选/多选） -->
                                      <div v-if="ans.options && ans.options.length > 0">
                                          <div v-for="(opt, optIndex) in ans.options" :key="opt.id"
                                               class="p-3 mb-2 rounded border transition-all"
                                               :class="{'bg-primary-subtle border-primary text-primary fw-bold': ans.selected_indices && ans.selected_indices.includes(optIndex), 'bg-white border-light-subtle': !ans.selected_indices || !ans.selected_indices.includes(optIndex)}">
                                              <div class="d-flex align-items-center">
                                                  <div class="flex-shrink-0 me-3">
                                                      <!-- 模拟选中状态图标 -->
                                                      <i v-if="ans.selected_indices && ans.selected_indices.includes(optIndex)" class="bi bi-check-circle-fill fs-5"></i>
                                                      <i v-else class="bi bi-circle text-muted fs-5"></i>
                                                  </div>
                                                  <div>{{ opt.text }}</div>
                                              </div>
                                          </div>
                                          <!-- 隐私保护提示 -->
                                          <div v-if="ans.is_encrypted" class="mt-3 p-3 bg-secondary-subtle rounded text-secondary d-flex align-items-center">
                                              <span class="fs-5 me-2">🔒</span>
                                              <small>此题为隐私保护题目，且无法解密您的选择（可能是密钥丢失或数据问题）。</small>
                                          </div>
                                      </div>

                                      <!-- 文本或评分题，且已解密或非加密 -->
                                      <div v-else-if="!ans.is_encrypted" class="p-3 bg-white border rounded">
                                          <p class="mb-0 fs-5" style="white-space: pre-wrap;">{{ ans.value }}</p>
                                      </div>

                                      <!-- 纯加密数据（无选项，且无法解密） -->
                                      <div v-else class="alert alert-secondary border-0 d-flex align-items-center">
                                          <span class="fs-4 me-3">🔒</span>
                                          <div>
                                              <strong>隐私保护数据</strong>
                                              <p class="mb-0 small opacity-75">您的回答已通过同态加密技术提交，无法查看明文详情。</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="pt-4 text-center border-top">
                                  <router-link to="/my-responses" class="btn btn-outline-primary btn-lg px-5 rounded-pill">返回列表</router-link>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const responseId = route.params.id

const title = ref('')
const submittedAt = ref('')
const answers = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
      router.push('/login')
      return
  }

  try {
      const res = await fetch(`/api/responses/details/${responseId}`, {
          headers: { 'Authorization': token }
      })

      if (!res.ok) {
          const data = await res.json()
          error.value = data.error || '加载失败'
          return
      }

      const data = await res.json()
      title.value = data.survey_title
      // 直接使用后端返回的格式化时间字符串
      submittedAt.value = data.submitted_at
      answers.value = data.answers

  } catch (e) {
      console.error(e)
      error.value = '网络错误'
  } finally {
      loading.value = false
  }
})

function getTypeName(type) {
  if (type === 'text') return '文本'
  if (type === 'single_choice') return '单选'
  if (type === 'score_he') return '隐私评分'
  if (type === 'single_choice_he') return '隐私单选'
  if (type === 'multiple_choice_he') return '隐私多选'
  return type
}
</script>
