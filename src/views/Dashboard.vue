<template>
  <div class="bg-light min-vh-100">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3">
          <div class="container container-lg">
              <span class="navbar-brand fs-4 fw-bold d-flex align-items-center">
                  <span class="bg-white text-primary rounded-circle d-inline-flex justify-content-center align-items-center me-2" style="width: 40px; height: 40px;">
                      <span class="fs-5">🔒</span>
                  </span>
                  校园同态加密问卷系统
              </span>
              <div class="d-flex align-items-center">
                  <span class="navbar-text text-white me-4 fs-5 opacity-75">
                      欢迎, <span class="fw-bold text-white opacity-100">{{ username }}</span>
                  </span>
                  <button class="btn btn-outline-light px-4 py-2 fw-bold rounded-pill" @click="logout">退出登录</button>
              </div>
          </div>
      </nav>

      <div class="container container-lg mt-5">
          <div class="row mb-5 align-items-center">
              <div class="col">
                  <h2 class="display-6 fw-bold text-dark mb-0">我的问卷列表</h2>
                  <p class="text-muted mt-2 fs-5">管理您发布的所有同态加密问卷</p>
              </div>
              <div class="col-auto">
                  <router-link to="/question-bank" class="btn btn-outline-primary btn-lg px-4 py-3 shadow-sm hover-lift fw-bold me-2">
                    <span class="me-2">📚</span> 我的题库
                  </router-link>
                  <router-link to="/create" class="btn btn-success btn-lg px-5 py-3 shadow-sm hover-lift fw-bold">
                      <span class="me-2">+</span> 创建新问卷
                  </router-link>
              </div>
          </div>

          <!-- Published Surveys -->
          <div class="card shadow border-0 rounded-lg mb-5 overflow-hidden">
              <div class="card-header bg-white py-4 px-4 border-bottom">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 text-primary fw-bold fs-4">
                        <span class="badge bg-primary-subtle text-primary me-2 rounded-pill px-3">发布</span>
                        已发布的问卷
                    </h5>
                    <span class="text-muted small">共 {{ mySurveys.length }} 份</span>
                  </div>
              </div>
              <div class="card-body p-0">
                  <div class="table-responsive">
                      <table class="table table-hover align-middle mb-0" style="font-size: 1.1rem;">
                          <thead class="bg-light">
                              <tr>
                                  <th class="ps-4 py-3 text-uppercase text-secondary fs-6 fw-bold border-0" style="width: 35%;">问卷标题</th>
                                  <th class="py-3 text-uppercase text-secondary fs-6 fw-bold border-0" style="width: 35%;">分享链接</th>
                                  <th class="py-3 text-uppercase text-secondary fs-6 fw-bold border-0 text-end pe-4">操作</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="s in mySurveys" :key="s.id" class="border-bottom">
                                  <td class="ps-4 py-4 fw-medium text-dark">{{ s.title }}</td>
                                  <td class="py-4">
                                      <router-link :to="'/survey/' + s.id" target="_blank" class="d-inline-flex align-items-center text-decoration-none bg-light border rounded px-3 py-2 text-primary hover-shadow transition-all">
                                          <span class="text-truncate" style="max-width: 250px;">/survey/{{ s.id }}</span>
                                          <small class="ms-2 text-muted fst-italic">打开 &nearr;</small>
                                      </router-link>
                                  </td>
                                  <td class="text-end pe-4 py-4">
                                      <router-link :to="'/results/' + s.id" class="btn btn-info text-white me-2 px-3 py-2 shadow-sm fw-medium rounded-pill">
                                          查看统计
                                      </router-link>
                                      <button @click="deleteSurvey(s.id)" class="btn btn-outline-danger px-3 py-2 fw-medium rounded-pill">
                                          删除
                                      </button>
                                  </td>
                              </tr>
                               <tr v-if="mySurveys.length === 0">
                                  <td colspan="3" class="text-center py-5 text-muted">
                                      <div class="py-4">
                                          <p class="fs-4 mb-3 text-secondary">暂无发布问卷</p>
                                          <router-link to="/create" class="btn btn-primary btn-lg shadow-sm px-4">立即创建第一份问卷</router-link>
                                      </div>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          <!-- Responses -->
          <div class="row align-items-center mb-4 mt-5">
              <div class="col">
                  <h3 class="display-6 fw-bold text-dark mb-0">我参与的记录</h3>
                  <p class="text-muted mt-2 fs-5">您参与填写的历史数据</p>
              </div>
          </div>

          <div class="card shadow-sm border-0 rounded-lg mb-5 overflow-hidden">
             <div class="card-header bg-white py-4 px-4 border-bottom">
                  <h5 class="mb-0 text-secondary fw-bold fs-4">
                       <span class="badge bg-secondary-subtle text-secondary me-2 rounded-pill px-3">参与</span>
                      历史填写记录
                  </h5>
              </div>
              <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" style="font-size: 1.1rem;">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4 py-3 text-uppercase text-secondary fs-6 fw-bold border-0">问卷标题</th>
                                <th class="py-3 text-uppercase text-secondary fs-6 fw-bold border-0">提交时间</th>
                                <th class="py-3 text-uppercase text-secondary fs-6 fw-bold border-0 text-end pe-4">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in myResponses" :key="r.id" class="border-bottom">
                                <td class="ps-4 py-4 fw-medium text-dark">{{ r.survey_title || '未知问卷' }}</td>
                                <td class="py-4 text-muted">{{ r.submitted_at || 'N/A' }}</td>
                                <td class="text-end pe-4 py-4">
                                    <span class="badge bg-success-subtle text-success rounded-pill px-3">已提交</span>
                                </td>
                            </tr>
                             <tr v-if="myResponses.length === 0">
                                <td colspan="3" class="text-center py-5 text-muted">
                                     <div class="py-4">
                                        <p class="fs-4 mb-0 text-secondary">您还没有填写过任何问卷</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('User')
const mySurveys = ref([])
const myResponses = ref([])

onMounted(async () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('username')

    if (!token || !user) {
        router.push('/login')
        return
    }
    username.value = user

    // Fetch Surveys
    try {
        const res = await fetch('/api/surveys/my', {
            headers: { 'Authorization': token }
        })
        if (res.ok) {
            const data = await res.json()
            if(data.data) {
                mySurveys.value = data.data || []
            }
        }
    } catch (e) {
        console.error(e)
    }

     // Fetch Responses
    try {
        const res = await fetch('/api/responses/my', {
            headers: { 'Authorization': token }
        })
         if (res.ok) {
            const data = await res.json()
            if(data.data) {
                myResponses.value = data.data || []
            }
        }
    } catch (e) {
        console.error(e)
    }
})

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
}

// TODO: Implement delete
async function deleteSurvey(id) {
    if(!confirm('确定要删除这个问卷吗?')) return;
     const token = localStorage.getItem('token')
     try {
        const res = await fetch(`/api/surveys/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        })
        if (res.ok) {
            mySurveys.value = mySurveys.value.filter(s => s.id !== id)
        }
    } catch (e) {
        console.error(e)
    }
}
</script>

<style scoped>
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
.hover-shadow:hover {
    background-color: #e9ecef!important; /* slightly darker light on hover */
    box-shadow: inset 0 0 0 1px #ced4da;
}
</style>
