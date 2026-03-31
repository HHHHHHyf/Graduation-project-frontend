<template>
  <div class="p-4 h-100">
      <div class="row justify-content-center">
          <div class="col-12 col-xl-10">
              <div class="d-flex justify-content-between align-items-center mb-5">
                  <h2 class="display-6 fw-bold">创建新问卷</h2>
              </div>

              <form @submit.prevent="handleSubmit">
                      <!-- Survey Info -->
                      <div class="card shadow-sm border-0 rounded-lg mb-4 p-4">
                          <div class="card-body">
                              <h4 class="card-title fw-bold mb-4 text-primary">基本信息</h4>
                              <div class="mb-4">
                                  <label class="form-label text-muted">问卷标题</label>
                                  <input type="text" class="form-control form-control-lg fw-bold" v-model="form.title" required placeholder="请输入问卷标题">
                              </div>
                              <div class="mb-4">
                                  <label class="form-label text-muted">问卷类型</label>
                                  <select class="form-select form-select-lg" v-model="form.type">
                                      <option value="normal">普通问卷</option>
                                      <option value="psychology">心理调查问卷</option>
                                      <option value="disease">疾病调查问卷</option>
                                  </select>
                                  <div class="form-text text-muted">特殊类型问卷（如心理、疾病）在用户提交后，系统将使用 AI 进行智能分析并提供建议。</div>
                              </div>
                              <div class="mb-2">
                                  <label class="form-label text-muted">问卷描述</label>
                                  <textarea class="form-control" rows="3" v-model="form.description" placeholder="请输入问卷描述说明..."></textarea>
                              </div>
                          </div>
                      </div>

                      <!-- Questions Loop -->
                      <div v-for="(q, index) in form.questions" :key="index" class="card shadow-sm border-0 rounded-lg mb-4 question-card position-relative overflow-hidden">
                          <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                              <span class="fw-bold text-secondary">问题 {{ index + 1 }} - {{ getTypeName(q.type) }}</span>
                              <button type="button" class="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" @click="removeQuestion(index)" title="删除此题">
                                  &times;
                              </button>
                          </div>

                          <div class="card-body p-4">
                              <div class="mb-4">
                                  <label class="form-label small text-uppercase text-muted fw-bold mb-2">题目内容</label>
                                  <input type="text" class="form-control form-control-lg" v-model="q.text" placeholder="请输入问题内容" required>
                              </div>

                              <div v-show="['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(q.type)" class="mb-3 p-3 bg-light rounded border">
                                  <label class="form-label small text-uppercase text-muted fw-bold mb-2">选项设置列表</label>
                                  <div v-for="(_, idx) in q.optionsList" :key="idx" class="input-group mb-2">
                                      <span class="input-group-text bg-white border-end-0 text-muted fw-bold">{{ String.fromCharCode(65 + idx) }}.</span>
                                      <input type="text" class="form-control border-start-0 ps-0" v-model="q.optionsList[idx]" :placeholder="'请输入选项 ' + String.fromCharCode(65 + idx) + ' 内容...'" required>
                                      <button type="button" class="btn btn-outline-danger" @click="removeOption(q, idx)" :disabled="q.optionsList.length <= 2" title="删除此选项"> &times; </button>
                                  </div>
                                  <div class="d-flex justify-content-start mt-2">
                                      <button type="button" class="btn btn-sm btn-outline-primary" @click="addOption(q)">
                                          <span class="me-1">+</span> 添加更多选项
                                      </button>
                                  </div>
                              </div>

                              <div v-if="['score_he', 'single_choice_he', 'multiple_choice_he'].includes(q.type)" class="alert alert-success border-0 d-flex align-items-center mt-3 mb-0">
                                  <span class="fs-4 me-3">🔒</span>
                                  <div>
                                      <strong>同态加密保护</strong>
                                      <p class="mb-0 small opacity-75">此题数据将加密存储，仅在统计时通过同态运算得出结果，无法查看单个用户的具体选择。</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <!-- Empty State -->
                      <div v-if="form.questions.length === 0" class="text-center py-5 mb-5 border rounded-lg border-dashed text-muted bg-white">
                          <p class="fs-5 mb-0 opacity-50">还没有添加任何问题，请从下方选择题型添加。</p>
                      </div>

                      <!-- Add Question Buttons -->
                      <div class="text-center mb-5 pb-5">
                          <div class="mb-3 text-muted fw-bold text-uppercase small">添加新问题</div>
                          <div class="btn-group gap-2 d-flex justify-content-center flex-wrap" role="group">
                              <button type="button" class="btn btn-outline-primary btn-lg px-4 py-2 fw-medium rounded-pill border-2" @click="addQuestion('text')">
                                  <span class="me-2">📝</span> 文本题
                              </button>
                              <button type="button" class="btn btn-outline-primary btn-lg px-4 py-2 fw-medium rounded-pill border-2" @click="addQuestion('single_choice')">
                                  <span class="me-2">🔘</span> 单选题
                              </button>
                              <button type="button" class="btn btn-outline-success btn-lg px-4 py-2 fw-medium rounded-pill border-2" @click="addQuestion('single_choice_he')">
                                  <span class="me-2">🔒</span> 隐私单选题
                              </button>
                              <button type="button" class="btn btn-outline-success btn-lg px-4 py-2 fw-medium rounded-pill border-2" @click="addQuestion('multiple_choice_he')">
                                  <span class="me-2">🔒</span> 隐私多选题
                              </button>
                              <button type="button" class="btn btn-outline-success btn-lg px-4 py-2 fw-medium rounded-pill border-2" @click="addQuestion('score_he')">
                                  <span class="me-2">🔒</span> 隐私评分题
                              </button>
                          </div>
                      </div>

                      <!-- Question Bank Section -->
                      <div class="mb-5">
                          <div class="card shadow-sm border-0 rounded-lg">
                              <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                  <h5 class="mb-0 fw-bold">题库</h5>
                                  <button type="button" class="btn btn-primary btn-sm rounded-pill" @click="openBankModal">
                                      从题库添加
                                  </button>
                              </div>
                              <div class="card-body">
                                  <p class="text-muted mb-0 small">您可以从题库中选择已有的问题，或添加新问题到题库。</p>
                              </div>
                          </div>
                      </div>

                      <!-- Submit Button -->
                      <div :class="['fixed-bottom py-3', { 'with-sidebar-bottom': true }]" style="z-index: 1000;">
                        <div class="row justify-content-center m-0">
                          <div class="col-lg-6 text-center">
                            <button type="submit" class="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-lg">
                              发布问卷
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style="height: 100px;"></div>
                    </form>

                  <!-- Question Bank Modal -->
                  <div class="modal fade" tabindex="-1" ref="bankModalRef">
                      <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <h5 class="modal-title">选择题目</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                                  <div class="mb-3">
                                      <label class="form-label">我的题库</label>
                                      <div class="list-group">
                                          <a v-for="bank in banks" :key="bank.id" href="#" class="list-group-item list-group-item-action" @click="selectBank(bank)">
                                              {{ bank.name }}
                                          </a>
                                      </div>
                                  </div>

                                  <div v-if="currentBank" class="mb-3">
                                      <h6 class="fw-bold">题目列表</h6>
                                      <div v-for="(q, idx) in currentBank.questions" :key="idx"
                                           class="border rounded p-3 mb-2 cursor-pointer transition-all"
                                           :class="{'border-primary bg-primary-subtle': selectedBankQuestions.includes(q)}"
                                           @click="toggleBankQuestionSelection(q)">
                                          <div class="d-flex justify-content-between align-items-center">
                                              <div class="d-flex align-items-center">
                                                  <input class="form-check-input me-3 mt-0" type="checkbox" :checked="selectedBankQuestions.includes(q)" @click.stop="toggleBankQuestionSelection(q)">
                                                  <span class="badge rounded-pill text-bg-primary me-2">{{ getTypeName(q.type) }}</span>
                                                  <strong>{{ q.text }}</strong>
                                              </div>
                                              <span class="text-muted small">{{ q.options ? q.options.length : 0 }} 个选项</span>
                                          </div>
                                          <div class="mt-2 small text-muted ms-4 ps-2" v-if="q.options && q.options.length > 0">
                                              <template v-for="(option, oidx) in q.options" v-if="oidx < 2">
                                                  <span class="badge rounded-pill text-bg-light text-muted me-1">{{ option.text }}</span>
                                              </template>
                                              <span v-if="q.options.length > 2" class="text-muted">...等 {{ q.options.length }} 个选项</span>
                                          </div>
                                      </div>
                                  </div>

                                  <div v-else class="text-center text-muted py-5">
                                      <p class="mb-0">点击左侧题库加载题目</p>
                                  </div>
                              </div>
                              <div class="modal-footer">
                                  <div class="me-auto text-muted small" v-if="selectedBankQuestions.length > 0">
                                      已选择 {{ selectedBankQuestions.length }} 道题目
                                  </div>
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                                  <button type="button" class="btn btn-primary" @click="confirmAddBankQuestions" :disabled="selectedBankQuestions.length === 0">
                                      确定选择
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue' // Add ref, onMounted
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap' // Add Modal

const router = useRouter()
const form = reactive({
  title: '',
  description: '',
  type: 'normal',
  questions: []
})

// Bank Modal Logic
const bankModalRef = ref(null)
let bankModal = null
const banks = ref([])
const currentBank = ref(null)
const selectedBankQuestions = ref([])

onMounted(() => {
    if (bankModalRef.value) {
        bankModal = new Modal(bankModalRef.value)
    }
})

async function openBankModal() {
    selectedBankQuestions.value = [] // clear selections when reopening
    bankModal.show()
    if (banks.value.length === 0) {
        await fetchBanks()
    }
}

async function fetchBanks() {
    try {
        const res = await fetch('/api/question-banks/my', {
             headers: { 'Authorization': localStorage.getItem('token') }
        })
        if (res.ok) {
            banks.value = await res.json()
        }
    } catch (e) {
        console.error(e)
    }
}

async function selectBank(bank) {
    try {
        const res = await fetch(`/api/question-banks/${bank.id}`, {
             headers: { 'Authorization': localStorage.getItem('token') }
        })
        if (res.ok) {
            currentBank.value = await res.json()
            selectedBankQuestions.value = [] // clear selections when switching banks
        }
    } catch (e) {
        console.error(e)
    }
}

function toggleBankQuestionSelection(q) {
    const index = selectedBankQuestions.value.indexOf(q)
    if (index > -1) {
        selectedBankQuestions.value.splice(index, 1)
    } else {
        selectedBankQuestions.value.push(q)
    }
}

function confirmAddBankQuestions() {
    for (const q of selectedBankQuestions.value) {
        addQuestionFromBank(q)
    }
    bankModal.hide()
    selectedBankQuestions.value = []
}

function addQuestionFromBank(q) {
    let type = q.type;
    // Map QuestionBank types to CreateSurvey types
    if (type === 'single_choice_privacy') type = 'single_choice_he';
    if (type === 'multi_choice_he') type = 'multiple_choice_he';

    const newQuestion = {
        text: q.text,
        type: type,
        optionsList: q.options ? q.options.map(o => o.text) : []
    }

    // Ensure optionsList has at least 2 empty strings if it's empty but required
    if (['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(type)) {
         if (!newQuestion.optionsList || newQuestion.optionsList.length < 2) {
             const len = newQuestion.optionsList ? newQuestion.optionsList.length : 0;
             for(let i=len; i<2; i++) {
                 // Clone array if needed or push
                 if(!newQuestion.optionsList) newQuestion.optionsList = [];
                 newQuestion.optionsList.push('');
             }
         }
    }

    form.questions.push(newQuestion)
    // Optional: Close modal or keep open to add more?
    // Keep open.
    // alert('已添加题目: ' + q.text)
    // Show toast or something less intrusive? Alert is fine for now but maybe annoying.
    // Just add silently and maybe scroll to bottom?
}

function getTypeName(type) {
  const map = {
      'text': '文本题',
      'single_choice': '单选题',
      'score_he': '隐私评分题 (0-100)',
      'single_choice_he': '隐私单选题',
      'multiple_choice_he': '隐私多选题'
  };
  return map[type] || type;
}

function addQuestion(type) {
  const q = {
      type: type,
      text: '',
      // Initialize with 2 empty options for choice questions
      optionsList: (['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(type)) ? ['', ''] : []
  };
  form.questions.push(q);
}

function addOption(q) {
    if (!q.optionsList) q.optionsList = [];
    q.optionsList.push('');
}

function removeOption(q, index) {
    if (q.optionsList && q.optionsList.length > 1) {
        q.optionsList.splice(index, 1);
    }
}

function removeQuestion(index) {
  form.questions.splice(index, 1);
}

async function handleSubmit() {
  const token = localStorage.getItem('token');
  if (!token) {
      alert('请先登录');
      return;
  }

  if (form.questions.length === 0) {
      alert('请至少添加一个问题');
      return;
  }

  // Validate options
  for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(q.type)) {
          const validOptions = q.optionsList.filter(o => o.trim());
          if (validOptions.length < 2) {
              alert(`第 ${i+1} 题是选择题，请至少填写两个选项`);
              return;
          }
      }
  }

  // Prepare payload
  const payload = {
      title: form.title,
      description: form.description,
      questions: form.questions.map(q => {
          let options = [];
          if (['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(q.type) && q.optionsList) {
              options = q.optionsList.map(s => s.trim()).filter(s => s);
          }
          return {
              text: q.text,
              type: q.type,
              options: options
          };
      })
  };

  const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
  });

  if (res.ok) {
      alert('问卷发布成功！');
      router.push('/dashboard');
  } else {
      alert('发布失败');
  }
}
</script>

<style scoped>
/* Ensure the fixed bottom bar respects the sidebar width */
.fixed-bottom.with-sidebar-bottom {
  left: 280px; /* Width of sidebar */
  width: calc(100% - 280px);
}

/* Responsive adjustment for mobile (if sidebar is hidden) */
@media (max-width: 991.98px) {
  .fixed-bottom.with-sidebar-bottom {
    left: 0;
    width: 100%;
  }
}

.question-card {
  /* Your existing styles */
}
</style>
