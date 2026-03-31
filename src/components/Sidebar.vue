<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue';

const route = useRoute();
const router = useRouter();

const isActive = (path) => {
    return route.path === path;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    router.push('/login');
};

const username = ref('用户');

watchEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            username.value = user.username || '用户';
        } catch (e) {
            username.value = '用户';
        }
    } else {
        username.value = localStorage.getItem('username') || '用户';
    }
});
</script>

<template>
  <div class="sidebar d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" style="width: 280px; height: 100vh; position: fixed; left: 0; top: 0; z-index: 1000;">
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
       <span class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 40px; height: 40px;">
          <span class="fs-5">🔒</span>
       </span>
      <span class="fs-5 fw-bold text-primary">同态加密问卷</span>
    </a>
    <hr>
    <div class="mb-3 px-2">
        <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 0.05em;">菜单</small>
    </div>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item mb-1">
        <router-link to="/dashboard" class="nav-link" :class="{ 'active': isActive('/dashboard') }">
           <i class="bi bi-card-list me-2"></i>
           我的问卷列表
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link to="/create" class="nav-link" :class="{ 'active': isActive('/create') }">
           <i class="bi bi-plus-circle me-2"></i>
           创建问卷
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link to="/question-bank" class="nav-link" :class="{ 'active': isActive('/question-bank') }">
           <i class="bi bi-collection me-2"></i>
           我的题库
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link to="/my-responses" class="nav-link" :class="{ 'active': isActive('/my-responses') }">
           <i class="bi bi-card-checklist me-2"></i>
           我的填写
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link to="/ai-chat" class="nav-link" :class="{ 'active': isActive('/ai-chat') }">
           <i class="bi bi-robot me-2"></i>
           AI 助理
        </router-link>
      </li>
    </ul>
    <hr>
    <div class="dropdown">
      <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
        <div class="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 32px; height: 32px;">
            {{ username.charAt(0).toUpperCase() }}
        </div>
        <strong>{{ username }}</strong>
      </a>
      <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
        <!-- <li><a class="dropdown-item" href="#">设置</a></li>
        <li><a class="dropdown-item" href="#">个人资料</a></li>
        <li><hr class="dropdown-divider"></li> -->
        <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">退出登录</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
    transition: all 0.3s;
}
.nav-link {
    color: #6c757d;
    font-weight: 500;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: all 0.2s;
}
.nav-link:hover {
    background-color: #e9ecef;
    color: #495057;
}
.nav-link.active {
    background-color: var(--primary-color, #0d6efd);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(13, 110, 253, 0.2);
}
.bi {
    font-size: 1.1em;
    vertical-align: text-bottom;
}
</style>
