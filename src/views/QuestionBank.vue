<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Side -->
      <div class="col-md-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>我的题库</h4>
          <button class="btn btn-primary btn-sm" @click="openCreateBankModal">
            <i class="bi bi-plus-lg"></i> 新建
          </button>
        </div>
        <div class="list-group">
          <a
            v-for="bank in banks"
            :key="bank.id"
            href="#"
            class="list-group-item list-group-item-action"
            :class="{ active: currentBank && currentBank.id === bank.id }"
            @click.prevent="selectBank(bank)"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">{{ bank.name }}</h5>
            </div>
            <p class="mb-1 small">{{ bank.description }}</p>
            <div class="mt-2">
              <button class="btn btn-sm btn-light me-1" @click.stop="openEditBankModal(bank)">编辑</button>
              <button class="btn btn-sm btn-danger" @click.stop="deleteBank(bank.id)">删除</button>
            </div>
          </a>
          <div v-if="banks.length === 0" class="text-center text-muted mt-5">
            暂无题库，请创建
          </div>
        </div>
      </div>
      <!-- Right Side Placeholder -->
      <div class="col-md-9">        <div v-if="currentBank" class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ currentBank.name }} - 题目列表</h5>
            <button class="btn btn-success btn-sm" @click="openAddQuestionModal">
              <i class="bi bi-plus-lg"></i> 添加题目
            </button>
          </div>
          <div class="card-body">
            <div v-if="currentBank.questions && currentBank.questions.length > 0">
              <div v-for="(q, index) in currentBank.questions" :key="q.id" class="card mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <h6 class="card-title">
                      {{ index + 1 }}. {{ q.text }}
                      <span class="badge bg-secondary ms-2">{{ getTypeName(q.type) }}</span>
                    </h6>
                    <div>
                      <button class="btn btn-sm btn-outline-primary me-2" @click="openEditQuestionModal(q)">编辑</button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteQuestion(q.id)">删除</button>
                    </div>
                  </div>

                  <ul v-if="q.options && q.options.length > 0" class="list-group list-group-flush mt-2">
                    <li v-for="opt in q.options" :key="opt.id" class="list-group-item">
                      {{ opt.text }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted py-5">
              该题库还没有题目，去添加一个吧！
            </div>
          </div>
        </div>
        <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted border rounded p-5 bg-light">
          <h4><i class="bi bi-arrow-left"></i> 请选择或创建一个题库</h4>
        </div></div>
    </div>
    <!-- Modals Placeholder -->
        <div class="modal fade" id="bankModal" tabindex="-1" aria-hidden="true" ref="bankModalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditingBank ? '编辑题库' : '新建题库' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">题库名称</label>
              <input type="text" class="form-control" v-model="bankForm.name">
            </div>
            <div class="mb-3">
              <label class="form-label">描述</label>
              <textarea class="form-control" v-model="bankForm.description"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveBank">保存</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="questionModal" tabindex="-1" aria-hidden="true" ref="questionModalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditingQuestion ? '编辑题目' : '添加题目' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">题目内容</label>
              <input type="text" class="form-control" v-model="questionForm.text">
            </div>
            <div class="mb-3">
              <label class="form-label">题目类型</label>
              <select class="form-select" v-model="questionForm.type">
                <option value="single_choice">单选题</option>
                <option value="text">填空题</option>
                <option value="score_he">评分题 (同态加密)</option>
                <option value="multi_choice_he">多选题 (同态加密)</option>
                <option value="single_choice_privacy">隐私单选题</option>
              </select>
            </div>

            <div v-if="['single_choice', 'multi_choice_he', 'single_choice_privacy'].includes(questionForm.type)" class="mb-3">
              <label class="form-label">选项列表</label>
              <div v-for="(opt, idx) in questionForm.options" :key="idx" class="input-group mb-2">
                <span class="input-group-text">{{ String.fromCharCode(65 + idx) }}</span>
                <input type="text" class="form-control" v-model="opt.text" placeholder="选项内容">
                <button class="btn btn-outline-danger" @click="removeOption(idx)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button class="btn btn-sm btn-outline-secondary mt-2" @click="addOption">
                <i class="bi bi-plus"></i> 添加选项
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveQuestion">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';

const banks = ref([]);
const currentBank = ref(null);
const bankModalRef = ref(null);
const questionModalRef = ref(null);
let bankModal = null;
let questionModal = null;

const isEditingBank = ref(false);
const bankForm = reactive({ id: null, name: '', description: '' });

const isEditingQuestion = ref(false);
const questionForm = reactive({
  id: null,
  text: '',
  type: 'single_choice',
  options: []
});

const typeMap = {
  single_choice: '单选题',
  text: '填空题',
  score_he: '评分题(加密)',
  multi_choice_he: '多选题(加密)',
  single_choice_privacy: '隐私单选题'
};

const getTypeName = (type) => typeMap[type] || type;

const fetchBanks = async () => {
  try {
    const res = await axios.get('/api/question-banks/my');
    banks.value = res.data;
    if (currentBank.value) {
        const exists = banks.value.find(b => b.id === currentBank.value.id);
        if(exists) selectBank(exists);
        else currentBank.value = null;
    }
  } catch (error) {
    console.error('Failed to fetch banks', error);
  }
};

const selectBank = async (bank) => {
  try {
    const res = await axios.get(`/api/question-banks/${bank.id}`);
    currentBank.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

const openCreateBankModal = () => {
  isEditingBank.value = false;
  bankForm.id = null;
  bankForm.name = '';
  bankForm.description = '';
  bankModal.show();
};

const openEditBankModal = (bank) => {
  isEditingBank.value = true;
  bankForm.id = bank.id;
  bankForm.name = bank.name;
  bankForm.description = bank.description;
  bankModal.show();
};

const saveBank = async () => {
  try {
    if (isEditingBank.value) {
      await axios.put(`/api/question-banks/${bankForm.id}`, bankForm);
    } else {
      await axios.post('/api/question-banks', bankForm);
    }
    await fetchBanks();
    bankModal.hide();
  } catch (error) {
    alert('保存失败: ' + (error.response?.data?.error || error.message));
  }
};

const deleteBank = async (id) => {
  if (!confirm('确定删除吗？')) return;
  try {
    await axios.delete(`/api/question-banks/${id}`);
    currentBank.value = null;
    await fetchBanks();
  } catch (error) {
    alert('删除失败');
  }
};

const openAddQuestionModal = () => {
  isEditingQuestion.value = false;
  questionForm.id = null;
  questionForm.text = '';
  questionForm.type = 'single_choice';
  questionForm.options = [{ text: '' }, { text: '' }];
  questionModal.show();
};

const openEditQuestionModal = (q) => {
  isEditingQuestion.value = true;
  questionForm.id = q.id;
  questionForm.text = q.text;
  questionForm.type = q.type;
  questionForm.options = q.options ? JSON.parse(JSON.stringify(q.options)) : [];
  if (['single_choice', 'multi_choice_he', 'single_choice_privacy'].includes(q.type) && (!questionForm.options || questionForm.options.length === 0)) {
    questionForm.options = [{ text: '' }, { text: '' }];
  }
  questionModal.show();
};

const addOption = () => {
  questionForm.options.push({ text: '' });
};

const removeOption = (idx) => {
  questionForm.options.splice(idx, 1);
};

const saveQuestion = async () => {
    // 构造 payload
    const payload = {
        bank_id: currentBank.value.id, // Only used for Create, ignored for Update
        text: questionForm.text,
        type: questionForm.type,
        options: questionForm.options
    };

    try {
        if (isEditingQuestion.value) {
             await axios.put(`/api/question-banks/questions/${questionForm.id}`, payload);
        } else {
             await axios.post('/api/question-banks/questions', payload);
        }
        await selectBank(currentBank.value);
        questionModal.hide();
    } catch (e) {
        alert('保存题目失败');
    }
}

const deleteQuestion = async (id) => {
    if(!confirm("确定删除题目?")) return;
    try {
        await axios.delete(`/api/question-banks/questions/${id}`);
        await selectBank(currentBank.value);
    } catch(e) {
        alert("删除失败");
    }
}

onMounted(() => {
  bankModal = new Modal(bankModalRef.value);
  questionModal = new Modal(questionModalRef.value);
  fetchBanks();
});
</script>

<style scoped>
.list-group-item.active {
    z-index: 2;
    color: #fff;
    background-color: #0d6efd;
    border-color: #0d6efd;
}
</style>

