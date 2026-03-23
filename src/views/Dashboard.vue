<template>
  <div class="h-100 py-4 px-4">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
           <h2 class="display-6 fw-bold text-dark mb-0">我的问卷列表</h2>
           <p class="text-muted mt-2 fs-5">管理您发布的所有同态加密问卷</p>
        </div>
        <div>
           <!-- Action buttons for main actions -->
           <router-link to="/create" class="btn btn-primary btn-lg px-5 py-2 shadow-sm fw-bold">
               <i class="bi bi-plus-lg me-2"></i> 创建新问卷
           </router-link>
        </div>
      </div>

      <div class="container-fluid p-0">
          <!-- Published Surveys -->
          <div class="card shadow border-0 rounded-lg mb-5 overflow-hidden">
              <div class="card-header bg-white py-4 px-4 border-bottom">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 text-primary fw-bold fs-4">
                        <span class="badge bg-primary-subtle text-primary me-2 rounded-pill px-3">发布</span>
                        已发布的问卷
                    </h5>
                    <span class="text-muted small">共 {{ pagination.total }} 份</span>
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
              <div class="card-footer bg-white py-3">
                   <nav aria-label="Page navigation" v-if="pagination.total > 0">
                      <ul class="pagination justify-content-end mb-0">
                          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                              <button class="page-link" @click="changePage(pagination.page - 1)">上一页</button>
                          </li>

                          <template v-for="p in totalPages" :key="p">
                               <li v-if="shouldShowPage(p)" class="page-item" :class="{ active: pagination.page === p }">
                                  <button class="page-link" @click="changePage(p)">{{ p }}</button>
                              </li>
                          </template>

                          <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
                              <button class="page-link" @click="changePage(pagination.page + 1)">下一页</button>
                          </li>
                      </ul>
                  </nav>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mySurveys = ref([])
const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0,
    offset: 0
});

const totalPages = computed(() => {
    return Math.ceil(pagination.total / pagination.limit);
});

const shouldShowPage = (p) => {
    if (p === 1 || p === totalPages.value) return true;
    return p >= pagination.page - 2 && p <= pagination.page + 2;
};

const fetchMySurveys = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        router.push('/login')
        return
    }

    try {
        const res = await fetch(`/api/surveys/my?page=${pagination.page}&pageSize=${pagination.limit}`, {
            headers: { 'Authorization': token }
        })
        if (res.ok) {
            const data = await res.json()
            if(data.data) {
                mySurveys.value = data.data || []
                pagination.total = data.total
                pagination.limit = data.limit
                pagination.page = data.page
                pagination.offset = (pagination.page - 1) * pagination.limit
            }
        }
    } catch (e) {
        console.error(e)
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        pagination.page = newPage;
        fetchMySurveys();
    }
};


onMounted(async () => {
    fetchMySurveys()
})

async function deleteSurvey(id) {
    if(!confirm('确定要删除这个问卷吗?')) return;
     const token = localStorage.getItem('token')
     try {
        const res = await fetch(`/api/surveys/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        })
        if (res.ok) {
           fetchMySurveys() // Refresh list to handle pagination correctly
        }
    } catch (e) {
        console.error(e)
    }
}
</script>

<style scoped>
.hover-shadow:hover {
    background-color: #e9ecef!important; /* slightly darker light on hover */
    box-shadow: inset 0 0 0 1px #ced4da;
}
</style>
