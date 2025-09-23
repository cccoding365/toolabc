<template>
  <div>
    <label
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="onDrop"
      class="block border rounded p-6 text-center cursor-pointer transition-colors bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50"
    >
      <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
      <div class="flex flex-col items-center gap-2">
        <IconAddPicture class="text-3xl"></IconAddPicture>
        <p class="text-gray-700">点击选择图片或拖拽图片到此处</p>
        <p class="text-xs text-gray-500">支持常见图片格式（JPG/PNG/WebP 等）</p>
      </div>
    </label>

    <div v-if="imageUrl" class="space-y-6 mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">原始图片</h2>
          <img :src="imageUrl" alt="Original" class="w-full h-auto rounded shadow-md" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">处理后</h2>
          <img
            :src="imageUrl"
            :style="{ filter: filterStyle }"
            alt="Filtered"
            class="w-full h-auto rounded shadow-md"
          />
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">预设滤镜</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div v-for="preset in presetFilters" :key="preset.name">
            <tiny-button class="w-full" @click="applyPreset(preset)">
              {{ preset.name }}
            </tiny-button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">参数调整</h3>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="filter in filters" :key="filter.name">
            <label :for="filter.name" class="block text-sm font-medium text-gray-700 mb-1">
              {{ filter.label }} ({{ filter.value }}{{ filter.unit }})
            </label>
            <tiny-numeric
              mouse-wheel
              v-model="filter.value"
              :min="filter.min"
              :max="filter.max"
              :step="filter.step"
              placeholder="请输入非空数值"
            ></tiny-numeric>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-3">CSS样式代码</h3>
        <div class="bg-gray-100 p-3 rounded relative">
          <span class="text-sm text-gray-800 font-mono">{{ cssCode }}</span>
          <IconCopy class="absolute right-3 top-3" @click="copyCssCode"></IconCopy>
        </div>
      </div>

      <tiny-button class="w-full" type="primary" @click="downloadImage">下载图片</tiny-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { iconAddPicture, iconCopy } from "@opentiny/vue-icon";

const IconAddPicture = iconAddPicture();
const IconCopy = iconCopy();

const imageUrl = ref(null);
const filters = ref([
  { name: "hue-rotate", label: "Hue", value: 0, min: 0, max: 360, step: 1, unit: "deg" },
  { name: "saturate", label: "Saturation", value: 100, min: 0, max: 200, step: 1, unit: "%" },
  { name: "brightness", label: "Brightness", value: 100, min: 0, max: 200, step: 1, unit: "%" },
  { name: "contrast", label: "Contrast", value: 100, min: 0, max: 200, step: 1, unit: "%" },
  { name: "grayscale", label: "Grayscale", value: 0, min: 0, max: 100, step: 1, unit: "%" },
  { name: "sepia", label: "Sepia", value: 0, min: 0, max: 100, step: 1, unit: "%" },
  { name: "blur", label: "Blur", value: 0, min: 0, max: 10, step: 0.1, unit: "px" },
]);

const presetFilters = [
  {
    name: "Normal",
    values: {
      "hue-rotate": 0,
      saturate: 100,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      blur: 0,
    },
  },
  {
    name: "Vintage",
    values: {
      "hue-rotate": 0,
      saturate: 120,
      brightness: 105,
      contrast: 85,
      grayscale: 10,
      sepia: 30,
      blur: 0,
    },
  },
  {
    name: "Black & White",
    values: {
      "hue-rotate": 0,
      saturate: 0,
      brightness: 100,
      contrast: 120,
      grayscale: 100,
      sepia: 0,
      blur: 0,
    },
  },
  {
    name: "Warm",
    values: {
      "hue-rotate": 30,
      saturate: 130,
      brightness: 105,
      contrast: 110,
      grayscale: 0,
      sepia: 20,
      blur: 0,
    },
  },
  {
    name: "Cool",
    values: {
      "hue-rotate": 180,
      saturate: 110,
      brightness: 100,
      contrast: 105,
      grayscale: 0,
      sepia: 0,
      blur: 0,
    },
  },
  {
    name: "High Contrast",
    values: {
      "hue-rotate": 0,
      saturate: 130,
      brightness: 110,
      contrast: 150,
      grayscale: 0,
      sepia: 0,
      blur: 0,
    },
  },
  {
    name: "Soft Focus",
    values: {
      "hue-rotate": 0,
      saturate: 90,
      brightness: 110,
      contrast: 90,
      grayscale: 0,
      sepia: 10,
      blur: 2,
    },
  },
  {
    name: "Dramatic",
    values: {
      "hue-rotate": 0,
      saturate: 140,
      brightness: 90,
      contrast: 140,
      grayscale: 0,
      sepia: 0,
      blur: 0,
    },
  },
];

const filterStyle = computed(() => {
  return filters.value.map(filter => `${filter.name}(${filter.value}${filter.unit})`).join(" ");
});

const cssCode = computed(() => {
  return `filter: ${filterStyle.value};`;
});

const handleImageUpload = event => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  }
};

const applyPreset = preset => {
  filters.value.forEach(filter => {
    filter.value = preset.values[filter.name];
  });
};

const copyCssCode = () => {
  navigator.clipboard.writeText(cssCode.value);
};

const downloadImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.filter = filterStyle.value;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "filtered_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  img.src = imageUrl.value;
};
</script>
