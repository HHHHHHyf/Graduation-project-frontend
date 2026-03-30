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
                                            :class="{
                                                'bg-primary-subtle text-primary': ans.question_type === 'single_choice' || ans.question_type === 'multi_choice',
                                                'bg-success-subtle text-success': ans.question_type === 'score_he' || ans.question_type === 'single_choice_he' || ans.question_type === 'multiple_choice_he',
                                                'bg-secondary-subtle text-secondary': ans.question_type === 'text'
                                            }">
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

                              <!-- AI 分析结果区域 -->
                              <div v-if="aiResult" class="card shadow-sm border-0 mt-4 fade-in">
                                <div class="card-body p-4">
                                  <h4 class="fw-bold mb-3 d-flex align-items-center">
                                      <i class="bi bi-stars text-primary me-2"></i>
                                      AI 分析建议
                                  </h4>
                                  <div class="p-3 bg-white rounded markdown-body" style="font-size: 1.1rem; line-height: 1.6;">
                                      <div v-html="aiResultHtml"></div>
                                  </div>
                                </div>
                              </div>

                              <div class="mt-4 text-center">
                                <button @click="analyzeWithAI" :disabled="aiLoading" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm hover-lift">
                                    <span v-if="aiLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    <i v-else class="bi bi-robot me-2"></i>AI 智能分析
                                </button>
                                <router-link to="/my-responses" class="btn btn-outline-secondary btn-lg px-5 rounded-pill shadow-sm hover-lift ms-3">
                                    <i class="bi bi-arrow-left me-2"></i>返回列表
                                </router-link>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const responseId = route.params.id

const surveyTitle = ref('')
const submittedAt = ref('')
const answers = ref([])
const loading = ref(true)
const error = ref('')

const aiLoading = ref(false)
const aiResult = ref('')

const fetchResponseDetails = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
      router.push('/login')
      return
  }

  try {
      const res = await fetch(`/api/responses/details/${responseId}`, {
          headers: { 'Authorization': token }
      })

      if (res.ok) {
          const data = await res.json()
          surveyTitle.value = data.survey_title
          // 直接使用后端返回的格式化时间字符串
          submittedAt.value = data.submitted_at
          answers.value = data.answers
      } else {
          const data = await res.json()
          error.value = data.error || '获取详情失败'
      }

  } catch (e) {
      console.error(e)
      error.value = '网络错误'
  } finally {
      loading.value = false
  }
}

const title = computed(() => surveyTitle.value)

const aiResultHtml = computed(() => {
    return marked(aiResult.value || '')
})

onMounted(fetchResponseDetails)

function getTypeName(type) {
  if (type === 'text') return '文本'
  if (type === 'single_choice') return '单选'
  if (type === 'multi_choice') return '多选'
  if (type === 'score_he') return '隐私评分'
  if (type === 'single_choice_he') return '隐私单选'
  if (type === 'multiple_choice_he') return '隐私多选'
  return type
}

async function analyzeWithAI() {
    aiLoading.value = true
    aiResult.value = ''

    // 构建分析的上下文文本
    let contextText = `问卷标题：${title.value}\n\n我的回答记录如下：\n`

    answers.value.forEach((ans, index) => {
        let answerText = "未作答"
        if (ans.options && ans.options.length > 0) {
            if (ans.selected_indices && ans.selected_indices.length > 0) {
                const selectedOpts = ans.selected_indices.map(i => ans.options[i]?.text).filter(Boolean)
                if (selectedOpts.length > 0) {
                    answerText = selectedOpts.join(', ')
                }
            } else {
                 if (ans.value && !ans.is_encrypted) {
                     answerText = ans.value // Maybe plain text value fallback
                 }
            }
        } else if (ans.value) {
            answerText = ans.value
        }

        // 截断过长文本，避免 prompt 过大导致 AI 分析超时
        if (answerText.length > 150) {
            answerText = answerText.substring(0, 150) + "..."
        }

        contextText += `\n${index + 1}. ${ans.question_text}\n回答：${answerText}\n`
    })

    // 这是 AI 分析问卷答案的 Prompt 模板：
    const prompt = `你是一个问卷分析助手。
以下是我填写的问卷记录：
${contextText}
请根据我的作答进行深度分析，给出整体评价与针对性建议。
要求：
1. 你的回答中**绝对不能**重复或复述我的任何具体答案，只能输出基于这些答案得出的分析结论和建议，以避免隐私泄露。
2. 排版使用Markdown格式，力求结构清晰。`

    try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                message: prompt,
                model: 'deepseek-chat'
            })
        })

        if (res.ok) {
            const data = await res.json()
            if (data.reply) {
              aiResult.value = data.reply
            } else {
              alert(data.error || 'AI 分析失败')
            }
        } else {
            const data = await res.json()
            alert(data.error || '请求AI分析失败')
        }

    } catch (err) {
        console.error('AI analysis error:', err)
        alert('请求 AI 分析出错')
    } finally {
        aiLoading.value = false
    }
}

const getBadgeClass = (type) => {
  return {
    'bg-primary-subtle text-primary': type === 'single_choice' || type === 'multi_choice',
    'bg-success-subtle text-success': type === 'score_he' || type === 'single_choice_he' || type === 'multiple_choice_he',
    'bg-secondary-subtle text-secondary': type === 'text'
  }
}
</script>

<style scoped>
/* Add some basic markdown styling */
.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
}
.markdown-body :deep(h3) {
    font-size: 1.25em;
}
.markdown-body :deep(p) {
    margin-top: 0;
    margin-bottom: 16px;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) {
    margin-top: 0;
    margin-bottom: 16px;
    padding-left: 2em;
}
.markdown-body :deep(li) {
    margin-top: 0.25em;
}
.markdown-body :deep(strong) {
    font-weight: 600;
}
</style>
