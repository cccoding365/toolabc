<template>
  <router-link
    :to="path"
    class="block p-4 md:p-6 rounded bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition"
  >
    <div class="flex items-center space-x-4 relative">
      <div class="w-12 h-12 grid place-content-center rounded shrink-0" :class="iconBg">
        <span class="text-xl">{{ icon }}</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-800">
          {{ title }}
        </h3>
        <p class="text-sm text-slate-500 line-clamp-1">
          {{ desc }}
        </p>
      </div>
      <div class="absolute -top-2 -right-2">
        <tiny-tag v-if="status === 'new'" type="success"> 新功能 </tiny-tag>
        <tiny-tag v-else-if="status === 'old'" type="info"> 使用中 </tiny-tag>
        <tiny-tag v-else-if="status === 'ing'" type="warning"> 开发中 </tiny-tag>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  path: { type: String, required: true },
  icon: { type: String, required: true },
  iconBg: { type: String, default: "bg-indigo-100 text-indigo-600" },
  title: { type: String, required: true },
  desc: { type: String, default: "" },
  status: { type: String, default: "ing" },
});
</script>
