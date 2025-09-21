<template>
  <main>
    <h2 class="text-xl font-semibold mb-6 text-slate-700">功能大厅</h2>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        path="/date-calculator"
        icon="📅"
        icon-bg="bg-purple-100 text-purple-600"
        title="日期计算器"
        desc="提供日期差值计算和日期推算功能"
        status="new"
      />
      <FeatureCard
        path="/sys/user"
        icon="🙎"
        icon-bg="bg-green-100 text-green-600"
        title="用户管理"
        desc="系统核心账户模块"
        status="old"
      />
      <FeatureCard
        path="/stats"
        icon="📈"
        icon-bg="bg-orange-100 text-orange-600"
        title="数据报表"
        desc="可视化图表中心"
        status="ing"
      />
      <!-- 继续加卡片即可 -->
    </div>
  </main>
</template>

<script setup>
defineOptions({ route: { layout: "home" } });
</script>
