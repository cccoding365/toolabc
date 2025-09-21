<template>
  <div>
    <div v-if="!isFullscreen">
      <header class="mb-3 hidden sm:block">
        <tiny-card auto-width title="文字跑马灯">
          <p>欢迎使用「文字跑马灯」</p>
        </tiny-card>
      </header>
      <tiny-card auto-width title="设置滚动内容" class="overflow-visible">
        <div class="mb-2">
          <div class="mb-1">滚动文本</div>
          <tiny-input
            v-model="currentText"
            placeholder="请输入要滚动的文本内容"
            type="textarea"
            :maxlength="20"
          >
          </tiny-input>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div>
            <div class="mb-1">背景颜色</div>
            <div class="flex items-center gap-1">
              <tiny-color-picker class="shrink-0" v-model="backgroundColor" />
              <tiny-input v-model="backgroundColor"> </tiny-input>
            </div>
          </div>
          <div>
            <div class="mb-1">文字颜色</div>
            <div class="flex items-center gap-1">
              <tiny-color-picker class="shrink-0" v-model="textColor" />
              <tiny-input v-model="textColor"> </tiny-input>
            </div>
          </div>
          <div>
            <div class="mb-1">文字大小（px）</div>
            <tiny-numeric v-model="fontSize" placeholder="请输入非空数值"></tiny-numeric>
          </div>
          <div>
            <div class="mb-1">滚动周期（s）</div>
            <div class="flex items-center gap-1">
              <tiny-slider class="flex-1" v-model="scrollSpeed" show-tip :min="1" :max="20">
              </tiny-slider>
              <span>{{ scrollSpeed }}s</span>
            </div>
          </div>
        </div>
        <tiny-button type="primary" @click="startMarquee" class="w-full"> 开始滚动 </tiny-button>
      </tiny-card>
    </div>

    <!-- 全屏滚动显示 -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 flex items-center justify-center overflow-hidden"
      :style="{ backgroundColor: backgroundColor }"
    >
      <!-- 退出按钮 -->
      <div class="absolute top-4 right-4 z-10">
        <tiny-button circle :icon="IconClose" @click="exitFullscreen"></tiny-button>
      </div>

      <!-- 滚动文本 -->
      <div
        class="whitespace-nowrap text-center"
        :style="{
          color: textColor,
          fontSize: fontSize + 'px',
          animation: `marquee ${scrollSpeed}s linear infinite`,
        }"
      >
        {{ currentText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { iconClose } from "@opentiny/vue-icon";
const IconClose = iconClose();

const isFullscreen = ref(false);
const currentText = ref("");
const backgroundColor = ref("#000000");
const textColor = ref("#FFFFFF");
const fontSize = ref(100);
const scrollSpeed = ref(10);

const startMarquee = () => {
  if (!currentText.value.trim()) return;
  isFullscreen.value = true;

  if (isMobile()) {
    requestFullscreen();
  }
};

const exitFullscreen = () => {
  isFullscreen.value = false;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

// 检测是否为移动端
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const requestFullscreen = () => {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

const handleKeydown = e => {
  if (e.key === "Escape" && isFullscreen.value) {
    exitFullscreen();
  }
};

// 生命周期
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style>
.tiny-numeric {
  width: 100%;
}

.tiny-card.tiny-card--default {
  overflow: visible;
}

.tiny-color-select-panel {
  z-index: 99;
  min-width: 280px !important;
  max-width: 100% !important;
}
.tiny-color-select-panel__display {
  display: none;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.fixed.inset-0 {
  z-index: 9999;
}

@media screen and (max-width: 768px) {
  .fixed.inset-0 {
    width: 100vw;
    height: 100vh;
  }

  .fixed.inset-0 div {
    max-width: 90vw;
    word-break: keep-all;
  }
}

/* 横屏时的特殊处理 */
@media screen and (orientation: landscape) and (max-width: 768px) {
  .fixed.inset-0 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
