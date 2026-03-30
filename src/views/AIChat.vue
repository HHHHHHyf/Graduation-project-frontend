<template>
  <div class="d-flex min-vh-100 bg-white">
    <Sidebar />
    <div class="flex-grow-1 d-flex flex-column" style="margin-left: 280px; height: 100vh;">

      <!-- 头部 -->
      <div class="bg-white px-4 py-3 border-bottom d-flex justify-content-between align-items-center z-1">
        <h4 class="mb-0 fw-bold d-flex align-items-center text-dark">
          <i class="bi bi-robot text-primary me-2 fs-3"></i> AI 助理
        </h4>
        <select v-model="selectedModel" class="form-select form-select-sm w-auto bg-light border-0 fw-bold text-secondary rounded-pill px-3 py-2 shadow-sm">
          <option value="deepseek-chat">DeepSeek Chat</option>
          <option value="deepseek-reasoner">DeepSeek Reasoner</option>
        </select>
      </div>

      <!-- 聊天内容 -->
      <div class="flex-grow-1 overflow-auto p-4 p-md-5 d-flex flex-column" ref="messagesContainer">
        <div class="container-fluid p-0" style="max-width: 900px; margin: 0 auto; width: 100%;">

          <!-- 初始提示页 -->
          <div v-if="messages.length === 0" class="text-center text-muted" style="margin-top: 10vh;">
            <i class="bi bi-stars text-primary mb-3 d-block" style="font-size: 3.5rem;"></i>
            <h2 class="fw-bold mb-3 text-dark">我是您的智能助理</h2>
            <p class="fs-5 mb-5 opacity-75">我可以解答您的问题，或者根据您的文字描述直接生成包含同态加密的调查问卷。</p>
            <div class="d-flex justify-content-center gap-3">
               <button class="btn btn-light rounded-pill px-4 py-2 hover-effect text-dark" @click="inputRaw='请帮我设计一份《学生线上学习情况统计》的调查问卷'">
                  <i class="bi bi-journal-text me-2 text-primary"></i> 设计线上学习情况问卷
               </button>
               <button class="btn btn-light rounded-pill px-4 py-2 hover-effect text-dark" @click="inputRaw='创建一个包含隐私单选题的健康生活习惯调查'">
                  <i class="bi bi-shield-lock me-2 text-success"></i> 测试隐私加密生成
               </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div v-for="(msg, index) in messages" :key="index" class="mb-4">
            <!-- 用户消息 -->
            <div v-if="msg.role === 'user'" class="d-flex justify-content-end mb-3">
              <div class="bg-primary text-white p-3 rounded-4 shadow-sm text-break" style="max-width: 75%; border-bottom-right-radius: 4px !important; font-size: 1.05rem;">
                {{ msg.content }}
              </div>
              <div class="ms-3 flex-shrink-0 mt-auto">
                <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 40px; height: 40px;">
                  <i class="bi bi-person-fill fs-5"></i>
                </div>
              </div>
            </div>

            <!-- AI消息 -->
            <div v-else class="d-flex justify-content-start mb-3">
              <div class="me-3 flex-shrink-0">
                <div class="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary" style="width: 40px; height: 40px;">
                  <i class="bi bi-robot fs-5"></i>
                </div>
              </div>
              <div class="bg-white px-3 py-2 w-100 text-dark" style="max-width: 85%; font-size: 1.05rem; line-height: 1.6;">
                <div class="markdown-body" v-html="renderMarkdown(msg.content)"></div>
              </div>
            </div>
          </div>

          <!-- 加载中动画 -->
          <div v-if="loading" class="d-flex justify-content-start mb-4">
            <div class="me-3 flex-shrink-0">
              <div class="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary" style="width: 40px; height: 40px;">
                <i class="bi bi-robot fs-5"></i>
              </div>
            </div>
            <div class="bg-white px-3 py-2 d-flex align-items-center text-muted">
              <span class="spinner-grow spinner-grow-sm text-primary me-2" role="status" aria-hidden="true"></span>
              正在思考中...
            </div>
          </div>

        </div>
      </div>

      <!-- 输入区 -->
      <div class="p-3 p-md-4 pt-0 z-1 bg-white pb-4">
        <div class="container-fluid p-0" style="max-width: 900px; margin: 0 auto;">
          <form @submit.prevent="sendMessage" class="d-flex flex-column gap-2">
            <textarea
              class="form-control border-0 bg-light text-dark p-3"
              v-model="inputRaw"
              ref="textInput"
              @input="adjustTextareaHeight"
              placeholder="输入对话，或描绘您的问卷需求..."
              rows="1"
              @keydown.enter.prevent="handleEnter"
              style="resize: none; font-size: 1.05rem; overflow-y: auto; max-height: 200px; border-radius: 16px;"
            ></textarea>

            <!-- 按钮操作栏 -->
            <div class="d-flex flex-wrap justify-content-between align-items-center px-1 mt-1">
              <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Shift + Enter 换行，Enter 发送</small>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-success px-4 rounded-pill fw-bold" type="button" @click="generateSurveyViaAI" :disabled="loading || !inputRaw.trim()">
                  <i class="bi bi-magic me-1"></i> AI 智能生成问卷
                </button>
                <button class="btn btn-primary px-4 rounded-pill fw-bold" type="submit" @click="sendMessage" :disabled="loading || !inputRaw.trim()">
                  <i class="bi bi-send-fill me-1"></i> 发送
                </button>
              </div>
            </div>
          </form>

          <div class="text-center mt-3">
             <small class="text-secondary opacity-75">AI 对话内容由深度模型实时生成，请勿输入个人高度隐私信息。</small>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const messages = ref([])
const inputRaw = ref('')
const loading = ref(false)
const selectedModel = ref('deepseek-chat')
const messagesContainer = ref(null)
const textInput = ref(null)

const adjustTextareaHeight = () => {
    if (textInput.value) {
        textInput.value.style.height = 'auto'
        textInput.value.style.height = (textInput.value.scrollHeight < 200 ? textInput.value.scrollHeight : 200) + 'px'
    }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
  }
})

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text)
}

const handleEnter = (e) => {
    if (e.shiftKey) {
        // Shift + Enter 换行
        return
    }
    // Enter 发送
    sendMessage()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  const message = inputRaw.value.trim()
  if (!message || loading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message
  })

  inputRaw.value = ''
  if (textInput.value) {
      textInput.value.style.height = 'auto'
  }
  loading.value = true
  scrollToBottom()

  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        message: message,
        model: selectedModel.value
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || '请求失败')
    }

    const data = await res.json()
    messages.value.push({
      role: 'assistant',
      content: data.reply
    })
  } catch (err) {
    messages.value.push({
      role: 'assistant',
      content: '❌ 抱歉，发生错误: ' + err.message
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const generateSurveyViaAI = async () => {
  const requirement = inputRaw.value.trim()
  if (!requirement || loading.value) return

  messages.value.push({
    role: 'user',
    content: `【指令已发出：根据以下需求生成并创建问卷】\n\n${requirement}`
  })

  inputRaw.value = ''
  if (textInput.value) {
      textInput.value.style.height = 'auto'
  }
  loading.value = true
  scrollToBottom()

  try {
    const prompt = `
请你作为一个专业的问卷设计专家，根据用户的需求生成一份完整的问卷，并以严格的 JSON 格式输出。
请注意，返回的结果**只能**是合法的 JSON 字符串，不能包含任何 markdown 代码块（如 \`\`\`json 等），也不能有任何其他解释性的文字。

用户的需求是："${requirement}"

特别注意：
1. 如果用户的需求中提到“隐私”、“安全”、“加密”、“同态加密”或类似字眼，或者明确要求使用隐私题型，那么你**必须**使用以下隐私相关题型（不要使用普通的选择题）：
   - 隐私单选题请使用：single_choice_he
   - 隐私多选题请使用：multiple_choice_he
   - 隐私打分题请使用：score_he
2. 这些带有 "_he" 后缀的题型对用户来讲代表着结果将被同态加密。如果不强调隐私，可以正常使用普通题型。

请输出以下 JSON 结构：
{
  "title": "问卷标题",
  "description": "问卷描述",
  "type": "normal", // 或者 "psychology", "disease"
  "questions": [
    {
      "text": "问题内容",
      "type": "single_choice", // 可选类型: text, single_choice, score_he, single_choice_he, multiple_choice_he
      "options": ["选项1", "选项2"] // 如果是选择题(single_choice, single_choice_he, multiple_choice_he)，请确保至少有两项。如果**不是选择题** (例如 score_he, text)，此数组**必须为空**。
    }
  ]
}
`

    const token = localStorage.getItem('token')
    const chatRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        message: prompt,
        model: selectedModel.value
      })
    })

    if (!chatRes.ok) {
        throw new Error('AI 生成失败')
    }
    const chatData = await chatRes.json()
    const replyText = chatData.reply.trim()

    // 尝试解析JSON
    let surveyData = null
    try {
        // 去除可能的markdown包装
        const jsonStr = replyText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim()
        surveyData = JSON.parse(jsonStr)
    } catch(e) {
        throw new Error('AI返回的格式不正确: ' + replyText)
    }

    // 调用创建问卷API
    const createRes = await fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(surveyData)
    })

    if (!createRes.ok) {
        const errorData = await createRes.json()
        throw new Error('问卷创建失败 API错误: ' + (errorData.error || ''))
    }

    messages.value.push({
      role: 'assistant',
      content: `✅ 恭喜！问卷“${surveyData.title}”已成功由 AI 为您生成并创建。\n您可以前往“我的问卷列表”查看。`
    })

  } catch (err) {
    messages.value.push({
      role: 'assistant',
      content: '❌ 生成并创建问卷失败: ' + err.message
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.chat-messages {
  scroll-behavior: smooth;
  background-color: #ffffff;
}

.focus-ring-container:focus-within {
    background-color: #fff !important;
    border-color: #86b7fe !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.hover-effect:hover {
    background-color: #f8f9fa !important;
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
}

textarea:focus {
    outline: none;
    box-shadow: none !important;
}

/* Markdown styling inside AI messages */
.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) {
    margin-top: 1.2em;
    margin-bottom: 0.6em;
    font-weight: 600;
}
.markdown-body :deep(h1) { font-size: 1.5em; }
.markdown-body :deep(h2) { font-size: 1.3em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
.markdown-body :deep(h3) { font-size: 1.1em; }
.markdown-body :deep(p) {
    margin-top: 0;
    margin-bottom: 1em;
}
.markdown-body :deep(ul), .markdown-body :deep(ol) {
    margin-bottom: 1em;
    padding-left: 2em;
}
.markdown-body :deep(li) {
    margin-top: 0.25em;
}
.markdown-body :deep(pre), .markdown-body :deep(code) {
    background-color: #f6f8fa;
    border-radius: 6px;
}
.markdown-body :deep(code) {
    padding: 0.2em 0.4em;
    font-size: 85%;
}
.markdown-body :deep(pre) {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
}
.markdown-body :deep(pre) :deep(code) {
    padding: 0;
    background-color: transparent;
}
.markdown-body :deep(strong) {
    font-weight: 600;
}
</style>
