<template>
  <div class="bg-light min-vh-100 pb-5">
      <!-- Header -->
      <div class="bg-white border-bottom shadow-sm mb-5">
          <div class="container container-lg py-4">
              <div class="d-flex justify-content-between align-items-center">
                  <div>
                      <h6 class="text-uppercase text-muted fw-bold small mb-2">数据统计仪表盘</h6>
                      <h2 class="display-6 fw-bold mb-0 text-dark">{{ survey.title }}</h2>
                  </div>
                  <router-link to="/dashboard" class="btn btn-outline-secondary px-4 py-2 fw-medium rounded-pill border-2">
                       &larr; 返回列表
                  </router-link>
              </div>
          </div>
      </div>

      <div class="container container-lg">
          <!-- Overview Card -->
          <div class="row justify-content-center mb-5">
              <div class="col-lg-12">
                  <div class="card border-0 shadow rounded-lg overflow-hidden bg-white text-center">
                      <div class="card-body p-5">
                          <h6 class="text-uppercase text-muted fw-bold ls-1 mb-3">问卷回收总量</h6>
                          <div class="display-1 fw-bold text-primary mb-2 line-height-1">
                              {{ loading ? '...' : totalCount }}
                          </div>
                          <p class="text-muted mb-0">份有效答卷</p>
                      </div>
                  </div>
              </div>
          </div>

          <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
              <p class="mt-3 text-muted">正在解密同态数据，请稍候...</p>
          </div>

          <!-- Questions Stats -->
          <div v-else class="row g-4">
              <div v-for="(q, idx) in survey.questions" :key="q.id" class="col-12">
                  <div class="card border-0 shadow-sm rounded-lg h-100">
                      <div class="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                              <span class="badge bg-light text-dark border me-3 fs-6">Q{{ idx + 1 }}</span>
                              <h5 class="mb-0 fw-bold text-dark">{{ q.text }}</h5>
                          </div>
                          <span class="badge rounded-pill px-3 py-2 fw-normal"
                                :class="{'bg-primary-subtle text-primary': q.type === 'single_choice', 'bg-success-subtle text-success': q.type === 'score_he', 'bg-secondary-subtle text-secondary': q.type === 'text'}">
                              {{ getTypeName(q.type) }}
                          </span>
                      </div>

                      <div class="card-body p-4">
                          <!-- Encrypted Score Stats -->
                          <div v-if="q.type === 'score_he'">
                              <div class="alert alert-success border-0 d-flex align-items-center mb-4">
                                  <span class="fs-4 me-3">🔒</span>
                                  <div>
                                      <strong>同态解密成功</strong>
                                      <p class="mb-0 small opacity-75">数据已在云端通过私钥安全解密，展示聚合结果。</p>
                                  </div>
                              </div>
                              <div class="row text-center g-3">
                                  <div class="col-md-4">
                                      <div class="p-3 bg-light rounded-3 h-100 border">
                                          <div class="display-6 fw-bold text-dark">{{ getStat(q.id).sum || 0 }}</div>
                                          <div class="small text-uppercase fw-bold text-muted mt-2">总分累计</div>
                                      </div>
                                  </div>
                                  <div class="col-md-4">
                                      <div class="p-3 bg-success text-white rounded-3 h-100 shadow-sm">
                                          <div class="display-6 fw-bold">{{ (getStat(q.id).average || 0).toFixed(2) }}</div>
                                          <div class="small text-uppercase fw-bold text-white-50 mt-2">平均得分</div>
                                      </div>
                                  </div>
                                  <div class="col-md-4">
                                      <div class="p-3 bg-light rounded-3 h-100 border">
                                          <div class="display-6 fw-bold text-dark">{{ getStat(q.id).count || 0 }}</div>
                                          <div class="small text-uppercase fw-bold text-muted mt-2">有效样本</div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <!-- Single Choice Stats -->
                          <div v-else-if="['single_choice', 'single_choice_he', 'multiple_choice_he'].includes(q.type)">
                              <div v-if="q.type === 'single_choice_he' || q.type === 'multiple_choice_he'" class="alert alert-info border-0 d-flex align-items-center mb-4">
                                  <span class="fs-4 me-3">🔒</span>
                                  <div>
                                      <strong>同态解密成功</strong>
                                      <p class="mb-0 small opacity-75">选项计数是通过私钥对加密向量进行同态聚合解密得到的。</p>
                                  </div>
                              </div>
                              <div class="table-responsive">
                                  <table class="table table-hover align-middle mb-0">
                                      <thead class="bg-light">
                                          <tr>
                                              <th class="border-0 ps-3 text-secondary text-uppercase py-3">选项</th>
                                              <th class="border-0 text-end pe-3 text-secondary text-uppercase py-3" style="width: 150px;">计数</th>
                                              <th class="border-0 text-end pe-3 text-secondary text-uppercase py-3" style="width: 150px;">占比</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr v-for="(count, option) in getStat(q.id)" :key="option">
                                              <td class="ps-3 fw-medium">{{ option }}</td>
                                              <td class="text-end pe-3 fs-5 fw-bold">{{ count }}</td>
                                              <td class="text-end pe-3 text-muted">
                                                  <div class="progress" style="height: 6px; width: 100px; margin-left: auto;">
                                                      <div class="progress-bar bg-primary" role="progressbar" :style="{width: ((count / (totalCount || 1)) * 100) + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                  </div>
                                                  <small class="d-block mt-1">{{ ((count / (totalCount || 1)) * 100).toFixed(1) }}%</small>
                                              </td>
                                          </tr>
                                          <tr v-if="Object.keys(getStat(q.id) || {}).length === 0">
                                              <td colspan="3" class="text-center py-4 text-muted fst-italic">暂无数据</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>

                          <!-- Text Answers -->
                          <div v-else>
                              <div class="bg-light rounded p-3" style="max-height: 300px; overflow-y: auto;">
                                  <ul class="list-unstyled mb-0" v-if="getStat(q.id) && getStat(q.id).length > 0">
                                      <li v-for="(ans, i) in getStat(q.id)" :key="i" class="bg-white p-3 mb-2 rounded border shadow-sm">
                                          {{ ans }}
                                      </li>
                                  </ul>
                                  <div v-else class="text-center py-4 text-muted fst-italic">
                                      暂无回答数据
                                  </div>
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
const surveyId = route.params.id
const survey = ref({})
const stats = ref({}) // Using simple ref object
const totalCount = ref(0)
const loading = ref(true)

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
      alert('请先登录');
      router.push('/');
      return;
  }

  try {
      // 1. Fetch Structure
      const structRes = await fetch('/api/public/surveys/' + surveyId);
      const structData = await structRes.json();
      survey.value = structData.data;

      // 2. Fetch Stats
      const resRes = await fetch('/api/surveys/' + surveyId + '/results', {
          headers: {'Authorization': 'Bearer ' + token}
      });

      if (!resRes.ok) {
          alert('无法获取数据，您可能不是创建者');
          router.push('/dashboard');
          return;
      }

      const resData = await resRes.json();
      stats.value = resData.survey;
      totalCount.value = resData.totalDataCount;
  } catch (e) {
      console.error(e);
      alert('数据加载失败');
  } finally {
      loading.value = false;
  }
})

function getTypeName(type) {
  if (type === 'text') return '文本';
  if (type === 'single_choice') return '单选';
  if (type === 'score_he') return '隐私评分';
  if (type === 'single_choice_he') return '隐私单选';
  if (type === 'multiple_choice_he') return '隐私多选';
  return type;
}

function getStat(qId) {
  return stats.value[qId] || {};
}
</script>

