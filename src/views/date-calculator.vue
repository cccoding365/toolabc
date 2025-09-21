<template>
  <footer class="mb-3">
    <tiny-card auto-width title="日期计算器">
      <p>
        欢迎使用「日期计算器」，现在是北京时间
        <span class="text-red-500 font-semibold">{{ currentTime }}</span
        >，祝您生活愉快！
      </p>
    </tiny-card>
  </footer>
  <main class="mb-3 flex flex-wrap justify-center gap-3">
    <tiny-card title="计算日期差值" custom-class="md:flex-1">
      <div class="mb-2">
        <div class="mb-1">开始日期</div>
        <tiny-date-picker
          v-model="startDate"
          :editable="false"
          label="选择日期"
          placeholder="请选择日期"
          @change="calculateDateDifference"
        ></tiny-date-picker>
      </div>
      <div class="mb-2">
        <div class="mb-1">结束日期</div>
        <tiny-date-picker
          v-model="endDate"
          :editable="false"
          label="选择日期"
          placeholder="请选择日期"
          @change="calculateDateDifference"
        ></tiny-date-picker>
      </div>
      <div>
        <div class="mb-1">计算结果</div>
        <div class="text-black">
          两个日期相差
          <span class="font-semibold text-red-500">{{ Math.abs(dateDifference) }}</span> 天
        </div>
      </div>
    </tiny-card>

    <tiny-card title="日期推算" custom-class="md:flex-1">
      <div class="mb-2">
        <div class="mb-1">基准日期</div>
        <tiny-date-picker
          v-model="baseDate"
          :editable="false"
          label="选择日期"
          placeholder="请选择日期"
          @change="calculateDateOffset"
        ></tiny-date-picker>
      </div>
      <div class="mb-2">
        <div class="mb-1">推算天数</div>
        <tiny-numeric
          v-model="offsetDays"
          :min="0"
          placeholder="请输入非空数值"
          @change="calculateDateOffset"
        ></tiny-numeric>
      </div>
      <div class="mb-2">
        <div class="mb-1">推算方向</div>
        <tiny-radio-group v-model="offsetDirection" @change="calculateDateOffset">
          <tiny-radio label="forward">未来</tiny-radio>
          <tiny-radio label="backward">过去</tiny-radio>
        </tiny-radio-group>
      </div>

      <div>
        <div class="mb-1">推算结果</div>
        <div class="text-black">
          当前日期
          <span class="font-semibold text-red-500">{{ Math.abs(offsetDays) }} </span> 天<span>{{
            offsetDirection === "forward" ? "后" : "前"
          }}</span
          >是
          <span class="font-semibold text-red-500">{{ calculatedDate }}</span>
        </div>
      </div>
    </tiny-card>
  </main>
  <footer class="">
    <tiny-card auto-width title="关于">
      <p>
        此计算器可以帮您计算出两个日期之间相差多少天、推算 N
        天前（后）是什么日期，用于推算出生天数、纪念日、倒数日、节假日等场景十分便利。
      </p>
    </tiny-card>
  </footer>
</template>

<script setup>
import dayjs from "dayjs";
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");

let timer = null;

const updateTime = () => {
  currentTime.value = dayjs().format("YYYY年MM月DD日 HH时mm分ss秒");
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const startDate = ref("");
const endDate = ref("");
const dateDifference = ref(null);

const baseDate = ref("");
const offsetDays = ref(1);
const offsetDirection = ref("forward");
const calculatedDate = ref("");

const calculateDateDifference = () => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = end.getTime() - start.getTime();
    dateDifference.value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else {
    dateDifference.value = null;
  }
};

const calculateDateOffset = () => {
  if (baseDate.value && offsetDays.value !== "") {
    const base = new Date(baseDate.value);
    const days = offsetDirection.value === "forward" ? offsetDays.value : -offsetDays.value;
    const result = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
    calculatedDate.value = result.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } else {
    calculatedDate.value = "";
  }
};

function nextYearSafe(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y + 1, m - 1, d);
  if (date.getDate() !== d) {
    date.setMonth(date.getMonth(), 0);
  }
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const today = new Date().toISOString().split("T")[0];
startDate.value = today;
endDate.value = nextYearSafe(today);
baseDate.value = today;
calculateDateDifference();
calculateDateOffset();
</script>

<style scoped>
.tiny-card.tiny-card--medium-width {
  width: 100%;
}
</style>
