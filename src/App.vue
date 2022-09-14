<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import TheHeader from './components/the-header.vue'
import TheFooter from './components/the-footer.vue'
</script>

<template>
  <a-layout style="min-height: 100vh">

    <!-- Header 组件 -->
    <TheHeader />
    <!--    router-view 的工作机制-->

    <!-- Sidebar 组件 -->

    <router-view/>

    <!-- Footer 组件 -->
    <TheFooter />
  </a-layout>
</template>