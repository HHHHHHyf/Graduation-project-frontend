<template>
  <div class="h-100 py-4 px-4 bg-light">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
         <h2 class="display-6 fw-bold text-dark mb-0">我的填写记录</h2>
         <p class="text-muted mt-2 fs-5">查看您参与过的所有问卷调查</p>
      </div>
    </div>

    <div class="card shadow border-0 rounded-lg overflow-hidden">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="font-size: 1.1rem;">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4 py-3 text-uppercase text-secondary small fw-bold" style="width: 5%;">#</th>
                            <th class="py-3 text-uppercase text-secondary small fw-bold" style="width: 50%;">问卷标题</th>
                            <th class="py-3 text-uppercase text-secondary small fw-bold">提交时间</th>
                            <th class="py-3 text-uppercase text-secondary small fw-bold text-end pe-4">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(response, index) in responses" :key="response.id" class="border-bottom">
                            <td class="ps-4 py-4 fw-bold text-muted">{{ pagination.offset + index + 1 }}</td>
                            <td>
                                <span class="fw-bold text-dark">{{ response.survey_title }}</span>
                            </td>
                            <td class="text-muted">
                                <i class="bi bi-clock me-1"></i> {{ response.submitted_at }}
                            </td>
                            <td class="text-end pe-4">
                                <router-link :to="`/response/${response.survey_id}`" class="btn btn-outline-primary btn-sm rounded-pill fw-bold">
                                    查看详情
                                </router-link>
                            </td>
                        </tr>
                        <tr v-if="responses.length === 0">
                            <td colspan="4" class="text-center py-5">
                                <span class="text-muted fs-5">暂无填写记录</span>
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

const responses = ref([]);
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
    // Logic to show a window of pages, e.g., current-2 to current+2, plus first and last
    if (p === 1 || p === totalPages.value) return true;
    return p >= pagination.page - 2 && p <= pagination.page + 2;
};

const fetchResponses = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/responses/my?page=${pagination.page}&pageSize=${pagination.limit}`, {
            headers: { 'Authorization': token }
        });
        if (res.ok) {
            const data = await res.json();
            responses.value = data.data || [];
            pagination.total = data.total;
            pagination.limit = data.limit;
            pagination.page = data.page;
            pagination.offset = (pagination.page - 1) * pagination.limit;
        }
    } catch (e) {
        console.error("Failed to fetch responses", e);
    }
};

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        pagination.page = newPage;
        fetchResponses();
    }
};

onMounted(() => {
    fetchResponses();
});
</script>
