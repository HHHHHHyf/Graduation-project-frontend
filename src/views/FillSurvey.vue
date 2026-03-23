<template>
  <div class="bg-light min-vh-100 py-5">
      <div class="container container-sm">
          <div class="row justify-content-center">
              <div class="col-lg-8">
                  <div class="card shadow rounded-lg border-0 mb-5 overflow-hidden">
                      <div class="card-header bg-primary text-white pt-5 pb-4 px-5 border-0 text-center">
                          <h2 v-if="loading" class="fw-light">请稍候...</h2>
                          <template v-else>
                               <h1 class="display-5 fw-bold mb-3">{{ survey.title }}</h1>
                               <p class="lead opacity-75 mb-0">{{ survey.description }}</p>
                          </template>
                      </div>

                      <div class="card-body p-md-5 p-4 bg-white">
                           <div v-if="notFound" class="text-center py-5">
                              <h3 class="text-muted fw-light">问卷不存在或已被删除</h3>
                          </div>

                          <form v-else @submit.prevent="handleSubmit">
                              <div v-for="(q, index) in survey.questions" :key="q.id" class="mb-5 p-4 bg-light rounded-lg shadow-sm">
                                  <div class="d-flex align-items-baseline mb-4">
                                      <span class="fs-3 fw-bold text-primary me-3 font-monospace">{{ (index + 1).toString().padStart(2, '0') }}.</span>
                                      <h4 class="fw-bold text-dark flex-grow-1 mb-0">{{ q.text }}</h4>
                                  </div>

                                  <div class="ps-md-5">
                                      <!-- Text Type -->
                                      <div v-if="q.type === 'text'">
                                          <textarea class="form-control form-control-lg border-2" rows="4" v-model="answersMap[q.id]" required placeholder="在此输入您的详细回答..."></textarea>
                                      </div>

                                      <!-- Single Choice Type -->
                                      <div v-else-if="q.type === 'single_choice' || q.type === 'single_choice_he'" class="d-grid gap-3">
                                          <div v-for="(opt, idx) in q.options" :key="opt.id" class="position-relative">
                                              <!-- Custom Radio Button Styling -->
                                              <input type="radio" class="btn-check" :name="'q_' + q.id" :id="'opt_' + opt.id" :value="opt.text" v-model="answersMap[q.id]" required>
                                              <label class="btn btn-outline-secondary w-100 text-start p-3 fs-5 border-2 rounded-lg transition-all hover-shadow" :for="'opt_' + opt.id">
                                                  <span class="fw-bold me-2">{{ String.fromCharCode(65 + idx) }}.</span> {{ opt.text }}
                                              </label>
                                          </div>
                                      </div>

                                      <!-- Multiple Choice Type (HE) -->
                                      <div v-else-if="q.type === 'multiple_choice_he'" class="d-grid gap-3">
                                          <div class="mb-2 text-success opacity-75 small fw-medium d-flex align-items-center">
                                              <span class="fs-5 me-2">🔒</span> 隐私多选 (服务器仅统计总数)
                                          </div>
                                          <div v-for="(opt, idx) in q.options" :key="opt.id" class="position-relative">
                                              <input type="checkbox" class="btn-check" :name="'q_' + q.id" :id="'opt_' + opt.id" :value="opt.text" v-model="answersMap[q.id]">
                                              <label class="btn btn-outline-secondary w-100 text-start p-3 fs-5 border-2 rounded-lg transition-all hover-shadow" :for="'opt_' + opt.id">
                                                  <span class="fw-bold me-2">{{ String.fromCharCode(65 + idx) }}.</span> {{ opt.text }}
                                              </label>
                                          </div>
                                      </div>

                                      <!-- Encrypted Score Type -->
                                      <div v-else-if="q.type === 'score_he'" class="card bg-success-subtle border-0 overflow-hidden">
                                          <div class="card-body p-4 text-center">
                                              <div class="mb-3 text-success d-flex justify-content-center align-items-center">
                                                  <span class="fs-2 me-2">🔒</span>
                                                  <span class="fw-bold fs-5 text-uppercase ls-1">隐私加密评分 (0-100)</span>
                                              </div>
                                              <input type="number" class="form-control form-control-lg fw-bold text-success text-center display-4 border-0 shadow-none bg-transparent py-3"
                                                     v-model="answersMap[q.id]" min="0" max="100" placeholder="--" required>
                                              <div class="mt-2 text-success opacity-75 small fw-medium">您的评分将在提交前加密，服务器无法解密查看单个数值。</div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="mt-5 pt-4 text-center border-top">
                                  <button type="submit" class="btn btn-primary btn-lg px-5 py-3 fs-4 fw-bold rounded-pill shadow-lg hover-scale w-100 w-md-auto" :disabled="submitting">
                                      <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                                      <span v-else>提交问卷</span>
                                  </button>
                                  <p class="mt-3 text-muted small">点击提交即表示您确认所填信息真实有效</p>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Advice Modal -->
      <div class="modal fade" id="adviceModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
          <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content border-0 shadow-lg">
                  <div class="modal-header bg-success text-white">
                      <h5 class="modal-title fw-bold">✨ 智能分析建议</h5>
                      <button type="button" class="btn-close btn-close-white" @click="closeAdviceModal"></button>
                  </div>
                  <div class="modal-body p-5">
                      <div class="text-center mb-4">
                          <div class="display-1 mb-3">🤖</div>
                          <h4 class="fw-bold text-dark">感谢您的参与！</h4>
                          <p class="text-muted">根据您的回答，我们要为您提供以下建议：</p>
                      </div>
                      <div class="bg-light p-4 rounded-3 border">
                          <p class="mb-0 fs-5 lh-lg" style="white-space: pre-wrap;">{{ adviceResult }}</p>
                      </div>
                  </div>
                  <div class="modal-footer justify-content-center border-0 pb-4">
                      <button type="button" class="btn btn-primary px-5 py-2 rounded-pill" @click="closeAdviceModal">我知道了</button>
                  </div>
              </div>
          </div>
      </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const route = useRoute()
const router = useRouter()
const surveyId = route.params.id
const survey = ref({})
const answersMap = reactive({})
const loading = ref(true)
const notFound = ref(false)
const submitting = ref(false)
const adviceResult = ref('')
let adviceModalInstance = null

onMounted(async () => {
  await loadSurvey();
  const modalEl = document.getElementById('adviceModal')
  if (modalEl) {
      adviceModalInstance = new Modal(modalEl)
  }
})

async function loadSurvey() {
  try {
      const res = await fetch('/api/public/surveys/' + surveyId);
      if (!res.ok) {
          notFound.value = true;
          return;
      }
      const data = await res.json();
      survey.value = data.data; // questions are in survey.questions

      // Initialize multiple choice answers as arrays
      if (survey.value.questions) {
          survey.value.questions.forEach(q => {
              if (q.type === 'multiple_choice_he') {
                  answersMap[q.id] = [];
              }
          });
      }
  } catch (e) {
      notFound.value = true;
  } finally {
      loading.value = false;
  }
}

async function handleSubmit() {
  submitting.value = true;
  // transform map to array
  const answers = [];
  for (const [qId, val] of Object.entries(answersMap)) {
      let finalVal = val;
      if (typeof val === 'object') {
          finalVal = JSON.stringify(val);
      } else {
          finalVal = val.toString();
      }
      answers.push({
          question_id: parseInt(qId),
          value: finalVal
      });
  }

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
      headers['Authorization'] = 'Bearer ' + token;
  }

  try {
      const res = await fetch('/api/public/surveys/submit', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
              survey_id: parseInt(surveyId),
              answers: answers
          })
      });

      if (res.ok) {
          const data = await res.json();
          if (data.advice) {
              adviceResult.value = data.advice;
              adviceModalInstance.show();
          } else {
              alert('提交成功！感谢您的参与。');
              finishSubmission();
          }
      } else {
          const err = await res.json();
          alert('提交失败: ' + err.error);
      }
  } catch (e) {
       alert('提交异常');
  } finally {
      submitting.value = false;
  }
}

function closeAdviceModal() {
    if (adviceModalInstance) {
        adviceModalInstance.hide();
    }
    finishSubmission();
}

function finishSubmission() {
    const token = localStorage.getItem('token');
    if (token) {
        router.push('/dashboard');
    } else {
        router.go(0); // Reload
    }
}
</script>
