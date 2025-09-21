<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <router-link
          to="/home"
          class="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600"
        >
          <span class="text-xl">←</span>
          <span class="text-sm font-medium">返回功能大厅</span>
        </router-link>
        <slot name="extra" />
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
