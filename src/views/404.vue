<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-slate-50  text-slate-700 px-6"
  >
    <!-- 文字 -->
    <h1 class="text-5xl font-extrabold text-indigo-500">404</h1>
    <p class="mt-2 text-lg">抱歉，页面飞走了~</p>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">您访问的地址不存在，或已移除。</p>

    <!-- 操作区 -->
    <div class="mt-8 flex gap-3">
      <button
        @click="$router.back()"
        class="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition"
      >
        返回上一页
      </button>
      <router-link
        to="/"
        class="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
      >
        回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 如需 SEO，可在此加 onMounted 改 document.title
</script>
