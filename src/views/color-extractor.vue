<template>
  <div>
    <!-- 上传/拖拽区域 -->
    <label
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="onDrop"
      class="block border rounded p-6 text-center cursor-pointer transition-colors bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50"
    >
      <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
      <div class="flex flex-col items-center gap-2">
        <IconAddPicture class="text-3xl"></IconAddPicture>
        <p class="text-gray-700">点击选择图片或拖拽图片到此处</p>
        <p class="text-xs text-gray-500">支持常见图片格式（JPG/PNG/WebP 等）</p>
      </div>
    </label>

    <!-- 预览与控制 -->
    <div v-if="imageUrl" class="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
      <div class="md:col-span-3">
        <div class="relative rounded overflow-hidden border border-gray-200 bg-white">
          <img
            :src="imageUrl"
            alt="预览"
            class="w-full h-auto object-contain max-h-[60vh]"
            @load="onPreviewLoaded"
          />
          <div
            v-if="isExtracting"
            class="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div class="flex items-center gap-2 text-gray-700">
              <svg
                class="animate-spin h-5 w-5 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>正在提取颜色…</span>
            </div>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 flex flex-col gap-3">
        <div>
          <div class="text-lg mb-1">提取设置</div>
          <div class="text-sm text-gray-400">提示：修改以下参数将重新提取颜色。</div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-gray-600">显示格式</span>
          <tiny-radio-group v-model="format">
            <tiny-radio label="hex">HEX</tiny-radio>
            <tiny-radio label="rgb">RGB</tiny-radio>
          </tiny-radio-group>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-gray-600">颜色数量</label>
          <tiny-numeric
            class="max-w-50"
            v-model="numColors"
            mouse-wheel
            :min="1"
            :max="12"
            @change="onColorsCountChange"
          ></tiny-numeric>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-gray-600">忽略透明像素</label>
          <tiny-switch v-model="ignoreTransparent" @change="reextract"></tiny-switch>
        </div>
      </div>
    </div>

    <!-- 颜色面板 -->
    <div v-if="palette.length" class="mt-6">
      <div class="text-lg mb-3">点击色块复制颜色值</div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <button
          v-for="(c, idx) in palette"
          :key="idx"
          class="overflow-hidden border rounded border-gray-200 group relative"
          @click="copyColor(idx)"
          :aria-label="`复制颜色 ${displayColor(c)}`"
        >
          <div class="h-20 w-full" :style="{ backgroundColor: c.hex }"></div>
          <div class="px-3 py-2 flex items-center justify-between bg-white">
            <div
              class="text-sm font-mono flex justify-between items-center w-full"
              :class="{
                'text-gray-900': c.textOnChip === 'dark',
                'text-white': c.textOnChip === 'light',
              }"
              :style="{ color: c.textOnChip === 'dark' ? '#111827' : '#f9fafb' }"
            >
              <span class="text-gray-800">{{ displayColor(c) }}</span>
              <div v-if="copiedIndex === idx" class="text-xs text-red-500">复制成功</div>
            </div>
            <div class="text-xs text-gray-500 flex items-center gap-2 absolute right-3 top-2">
              <span class="rounded bg-gray-100 px-1.5 py-0.5">
                {{ Math.round(c.percent * 100) }}%
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 隐藏画布用于像素采样 -->
    <canvas ref="hiddenCanvas" class="hidden"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { iconAddPicture } from "@opentiny/vue-icon";

const IconAddPicture = iconAddPicture();

const imageUrl = ref("");
const isExtracting = ref(false);
const numColors = ref(10);
const format = ref("hex"); // 'hex' | 'rgb'
const palette = ref([]); // { r,g,b, hex, count, percent, textOnChip }
const hiddenCanvas = ref(null);
const ignoreTransparent = ref(true);
const copiedIndex = ref(null);
let revokeTimer = null;
let copyTimer = null;

function onFileChange(ev) {
  const files = ev.target.files;
  if (!files || !files[0]) return;
  handleFile(files[0]);
  // 清空同一文件重复选择
  ev.target.value = "";
}

function onDrop(ev) {
  const file = ev.dataTransfer?.files?.[0];
  if (file) handleFile(file);
}

function handleFile(file) {
  if (!file.type.startsWith("image/")) return;
  if (revokeTimer) {
    URL.revokeObjectURL(imageUrl.value);
    clearTimeout(revokeTimer);
  }
  imageUrl.value = URL.createObjectURL(file);
  // 安全起见，稍后释放 URL（图片加载完成后重新计时）
  revokeTimer = setTimeout(() => {
    try {
      URL.revokeObjectURL(imageUrl.value);
    } catch {}
  }, 60_000);
}

function onPreviewLoaded() {
  reextract();
  if (revokeTimer) {
    clearTimeout(revokeTimer);
    revokeTimer = setTimeout(() => {
      try {
        URL.revokeObjectURL(imageUrl.value);
      } catch {}
    }, 60_000);
  }
}

function onColorsCountChange() {
  reextract();
}

function reextract() {
  if (!imageUrl.value) return;
  isExtracting.value = true;
  // 等待下一帧，确保 img 已渲染
  requestAnimationFrame(async () => {
    try {
      const colors = await extractColorsFromImage(
        imageUrl.value,
        numColors.value,
        ignoreTransparent.value,
      );
      palette.value = colors;
    } catch (e) {
      console.error(e);
    } finally {
      isExtracting.value = false;
    }
  });
}

function displayColor(c) {
  if (format.value === "hex") return c.hex;
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

async function extractColorsFromImage(url, k, skipTransparent) {
  const img = await loadImage(url);

  const maxSide = 300;
  const { canvas, ctx, scaleW, scaleH } = ensureCanvas(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    maxSide,
  );
  ctx.drawImage(img, 0, 0, scaleW, scaleH);

  const { data } = ctx.getImageData(0, 0, scaleW, scaleH);
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (skipTransparent && a < 125) continue;
    pixels.push([r, g, b]);
  }
  if (pixels.length === 0) return [];

  const { centers, counts } = kmeans(pixels, k);
  const total = counts.reduce((s, v) => s + v, 0);
  const list = centers
    .map((rgb, i) => {
      const [r, g, b] = rgb.map(v => Math.max(0, Math.min(255, Math.round(v))));
      const hex = rgbToHex(r, g, b);
      return {
        r,
        g,
        b,
        hex,
        count: counts[i],
        percent: counts[i] / (total || 1),
        textOnChip: getContrastTextColor(r, g, b),
      };
    })
    .filter(c => c.count > 0);

  list.sort((a, b) => b.count - a.count);
  return list;
}

function ensureCanvas(imgW, imgH, maxSide) {
  const canvas = hiddenCanvas.value || document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const ratio = imgW / imgH;
  let scaleW = imgW;
  let scaleH = imgH;
  if (Math.max(imgW, imgH) > maxSide) {
    if (ratio >= 1) {
      scaleW = maxSide;
      scaleH = Math.round(maxSide / ratio);
    } else {
      scaleH = maxSide;
      scaleW = Math.round(maxSide * ratio);
    }
  }
  canvas.width = scaleW;
  canvas.height = scaleH;
  return { canvas, ctx, scaleW, scaleH };
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function kmeans(pixels, k) {
  const maxIterations = 20;
  const tol = 1; // 收敛容差（欧氏距离平方近似）

  // 初始化中心（随机像素）
  const centers = [];
  const used = new Set();
  const pickIndex = () => Math.floor(Math.random() * pixels.length);
  for (let i = 0; i < k; i++) {
    let idx = pickIndex();
    // 避免重复索引
    let tries = 0;
    while (used.has(idx) && tries < 10) {
      idx = pickIndex();
      tries++;
    }
    used.add(idx);
    centers.push(pixels[idx].slice());
  }

  let assignments = new Array(pixels.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    // 分配
    let moved = 0;
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      let bestJ = 0;
      let bestD = Infinity;
      for (let j = 0; j < k; j++) {
        const c = centers[j];
        const d = dist2(p, c);
        if (d < bestD) {
          bestD = d;
          bestJ = j;
        }
      }
      if (assignments[i] !== bestJ) {
        assignments[i] = bestJ;
        moved++;
      }
    }

    // 重新计算中心
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array(k).fill(0);
    for (let i = 0; i < pixels.length; i++) {
      const j = assignments[i];
      const p = pixels[i];
      sums[j][0] += p[0];
      sums[j][1] += p[1];
      sums[j][2] += p[2];
      counts[j]++;
    }
    for (let j = 0; j < k; j++) {
      if (counts[j] === 0) {
        // 避免空簇：随机重置
        const idx = Math.floor(Math.random() * pixels.length);
        centers[j] = pixels[idx].slice();
        continue;
      }
      const newC = [sums[j][0] / counts[j], sums[j][1] / counts[j], sums[j][2] / counts[j]];
      if (dist2(newC, centers[j]) > tol) {
        centers[j] = newC;
      }
    }

    if (moved === 0) break;
  }

  // 最终计数
  const finalCounts = new Array(k).fill(0);
  for (let i = 0; i < assignments.length; i++) finalCounts[assignments[i]]++;

  return { centers, counts: finalCounts };
}

function dist2(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function rgbToHex(r, g, b) {
  const toHex = n => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function getContrastTextColor(r, g, b) {
  // WCAG 近似感知亮度计算
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? "dark" : "light";
}

async function copyColor(idx) {
  const c = palette.value[idx];
  if (!c) return;
  const text = displayColor(c);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {}
    document.body.removeChild(ta);
  }
  copiedIndex.value = idx;
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copiedIndex.value = null;
  }, 1200);
}

watch(numColors, () => {
  // 已通过 onColorsCountChange 节流，这里确保外部更改时也会重算
  reextract();
});

onBeforeUnmount(() => {
  if (revokeTimer) clearTimeout(revokeTimer);
  if (copyTimer) clearTimeout(copyTimer);
  try {
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
  } catch {}
});
</script>

<style scoped>
.tiny-numeric {
  width: initial;
}
</style>
