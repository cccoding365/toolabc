<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-indigo-500">Toolabc</h1>
        <div class="text-sm text-slate-500">
          尊敬的 <span class="font-semibold">{{ userName }}</span> ，欢迎回来！
        </div>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-6 py-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
const userName = ref("Admin"); // 实际可换成 pinia
</script>
