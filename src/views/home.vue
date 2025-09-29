<template>
  <main>
    <h2 class="text-xl font-semibold mb-6 text-slate-700">功能大厅</h2>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      <FeatureCard
        path="/timeline"
        icon="📅"
        icon-bg="bg-blue-200 text-blue-600"
        title="时间轴"
        desc="历史事件纪念日&未来事件倒数日"
        status="new"
      />
      <FeatureCard
        path="/image-filter"
        icon="🎨"
        icon-bg="bg-purple-200 text-purple-600"
        title="图片CSS滤镜"
        desc="使用CSS样式给图片加滤镜"
        status="new"
      />
      <FeatureCard
        path="/color-extractor"
        icon="🌇"
        icon-bg="bg-red-200 text-red-600"
        title="颜色提取器"
        desc="获取图片中的主要颜色"
        status="new"
      />
      <FeatureCard
        path="/date-calculator"
        icon="📅"
        icon-bg="bg-purple-100 text-purple-600"
        title="日期计算器"
        desc="提供日期差值计算和日期推算功能"
        status="new"
      />
      <FeatureCard
        path="/browser-info"
        icon="🖥️"
        icon-bg="bg-green-100 text-green-600"
        title="浏览器检测"
        desc="获取当前浏览器各项参数信息"
        status="new"
      />
      <FeatureCard
        path="/marquee"
        icon="🐎"
        icon-bg="bg-yellow-200 text-yellow-600"
        title="跑马灯"
        desc="将输入内容进行全屏滚动展示"
        status="new"
      />
      <FeatureCard
        path="/sys/user"
        icon="🙎"
        icon-bg="bg-blue-100 text-blue-600"
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
