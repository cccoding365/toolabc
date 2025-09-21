<template>
  <header class="mb-3">
    <tiny-card auto-width title="浏览器信息检测工具">
      <p>获取当前浏览器的详细参数信息，方便前端开发调试</p>
    </tiny-card>
  </header>

  <div class="mb-3">
    <tiny-card auto-width title="用户代理">
      <div class="text-gray-900">
        {{ browserInfo.userAgent }}
      </div>
    </tiny-card>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <tiny-card auto-width title="基本信息">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">浏览器名称</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.browserName }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">浏览器版本</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.browserVersion }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">操作系统</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.os }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">设备类型</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.deviceType }}
        </span>
      </div>
    </tiny-card>

    <tiny-card auto-width title="屏幕信息">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">屏幕宽高</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.screenWidth} ✖️ ${browserInfo.screenHeight}px` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">可用宽高</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.availWidth} ✖️ ${browserInfo.availHeight}px` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">颜色深度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.colorDepth}位` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">像素比</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.pixelRatio }}
        </span>
      </div>
    </tiny-card>

    <tiny-card auto-width title="视口信息">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">视口宽度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.viewportWidth}px` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">视口高度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.viewportHeight}px` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">滚动宽度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.scrollWidth}px` }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">滚动高度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ `${browserInfo.scrollHeight}px` }}
        </span>
      </div>
    </tiny-card>

    <tiny-card auto-width title="网络信息">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">连接状态</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.connectionType || "未知" }}
          {{ browserInfo.online ? "在线" : "离线" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">连接速度</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.connectionSpeed || "未知" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">语言</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.language }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">时区</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.timezone }}
        </span>
      </div>
    </tiny-card>

    <tiny-card auto-width title="功能支持">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">Cookie支持</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.cookieEnabled ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">本地存储</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.localStorage ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">会话存储</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.sessionStorage ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">地理位置</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.geolocation ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">通知API</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.notification ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">WebRTC</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.webRTC ? "✅ 支持" : "❌ 不支持" }}
        </span>
      </div>
    </tiny-card>

    <tiny-card auto-width title="性能信息">
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">内存使用</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.memoryUsage || "不可用" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">硬件并发</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.hardwareConcurrency || "未知" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">设备内存</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.deviceMemory || "未知" }}
        </span>
      </div>
      <div class="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span class="text-gray-600 font-medium">连接数</span>
        <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 rounded">
          {{ browserInfo.connectionCount || "未知" }}
        </span>
      </div>
    </tiny-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 响应式数据
const browserInfo = ref({});

// 获取浏览器信息
const getBrowserInfo = () => {
  const info = {
    // 基本信息
    userAgent: navigator.userAgent,
    browserName: getBrowserName(),
    browserVersion: getBrowserVersion(),
    os: getOperatingSystem(),
    deviceType: getDeviceType(),

    // 屏幕信息
    screenWidth: screen.width,
    screenHeight: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,

    // 视口信息
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,

    // 网络信息
    online: navigator.onLine,
    connectionType: getConnectionType(),
    connectionSpeed: getConnectionSpeed(),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    // 功能支持
    cookieEnabled: navigator.cookieEnabled,
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    geolocation: !!navigator.geolocation,
    notification: !!window.Notification,
    webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),

    // 性能信息
    memoryUsage: getMemoryUsage(),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    connectionCount: getConnectionCount(),
  };

  return info;
};

// 获取浏览器名称
const getBrowserName = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("Opera")) return "Opera";
  return "未知";
};

// 获取浏览器版本
const getBrowserVersion = () => {
  const ua = navigator.userAgent;
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+\.\d+)/);
  return match ? match[2] : "未知";
};

// 获取操作系统
const getOperatingSystem = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS")) return "iOS";
  return "未知";
};

// 获取设备类型
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "移动设备";
  if (/Tablet|iPad/i.test(ua)) return "平板设备";
  return "桌面设备";
};

// 获取连接类型
const getConnectionType = () => {
  if (navigator.connection) {
    return navigator.connection.effectiveType || navigator.connection.type || "未知";
  }
  return "未知";
};

// 获取连接速度
const getConnectionSpeed = () => {
  if (navigator.connection) {
    const downlink = navigator.connection.downlink;
    return downlink ? `${downlink} Mbps` : "未知";
  }
  return "未知";
};

// 获取内存使用情况
const getMemoryUsage = () => {
  if (performance.memory) {
    const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    const total = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
    return `${used}MB / ${total}MB`;
  }
  return "不可用";
};

// 获取连接数
const getConnectionCount = () => {
  if (navigator.connection) {
    return navigator.connection.downlinkMax || "未知";
  }
  return "未知";
};

// 监听窗口大小变化
const handleResize = () => {
  browserInfo.value.viewportWidth = window.innerWidth;
  browserInfo.value.viewportHeight = window.innerHeight;
  browserInfo.value.scrollWidth = document.documentElement.scrollWidth;
  browserInfo.value.scrollHeight = document.documentElement.scrollHeight;
};

// 组件挂载时获取信息
onMounted(() => {
  browserInfo.value = getBrowserInfo();
  window.addEventListener("resize", handleResize);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
