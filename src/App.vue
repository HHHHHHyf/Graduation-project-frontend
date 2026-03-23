<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();

const showSidebar = computed(() => {
  const publicRoutes = ['/login', '/register', '/'];
  if (publicRoutes.includes(route.path)) return false;
  // If route starts with /survey/ (filling survey), hide sidebar
  if (route.path.startsWith('/survey/')) return false;
  return true;
});
</script>

<template>
  <div class="app-container">
    <Sidebar v-if="showSidebar" />
    <div :class="['main-content', { 'with-sidebar': showSidebar }]">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.fullPath" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
      </router-view>
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  transition: margin-left 0.3s;
  width: 100%;
}

.with-sidebar {
  margin-left: 280px; /* Width of sidebar */
  background-color: #f8f9fa; /* Ensure background color matches dashboard */
}
</style>
