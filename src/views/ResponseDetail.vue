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
                                      <div v-if="ans.is_encrypted" class="alert alert-secondary border-0 d-flex align-items-center">
                                          <span class="fs-4 me-3">🔒</span>
                                          <div>
                                              <strong>隐私保护数据</strong>
                                              <p class="mb-0 small opacity-75">您的回答已通过同态加密技术提交，仅用于统计分析，无法查看明文详情。</p>
                                          </div>
                                      </div>
                                      <div v-else class="p-3 bg-white border rounded">
                                          <p class="mb-0 fs-5" style="white-space: pre-wrap;">{{ ans.value }}</p>
                                      </div>
                                  </div>
                              </div>

                              <div class="pt-4 text-center border-top">
                                  <router-link to="/dashboard" class="btn btn-outline-primary btn-lg px-5 rounded-pill">返回列表</router-link>
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
const surveyId = route.params.id // 注意这里我们用 survey_id 来作为路由参数，但实际后端叫它 id
// 在 Dashboard 中是 response/:survey_id
// 所以这里 route.params.id 即为 survey_id

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
      const res = await fetch(`/api/responses/details/${surveyId}`, {
          headers: { 'Authorization': token }
      })

      if (!res.ok) {
          const data = await res.json()
          error.value = data.error || '加载失败'
          return
      }

      const data = await res.json()
      title.value = data.survey_title
      submittedAt.value = new Date(data.submitted_at).toLocaleString()
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

