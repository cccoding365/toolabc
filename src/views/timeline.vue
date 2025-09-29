<template>
  <div>
    <div class="bg-white rounded-xl shadow-md">
      <!-- 日期星期时间 -->
      <section
        class="shadow-md text-center space-y-2 py-8 rounded-xl text-white bg-gradient-to-bl from-blue-600 to-sky-400 relative"
      >
        <!-- 时制切换 -->
        <header class="flex justify-end gap-2 md:gap-4 absolute right-4 top-4">
          <tiny-tag
            class="cursor-pointer"
            type="info"
            :value="`${is24 ? '24' : '12'}小时制`"
            @click="is24 = !is24"
          ></tiny-tag>
          <tiny-tag
            class="cursor-pointer"
            type="success"
            :value="`${isLunar ? '农历' : '新历'}`"
            @click="isLunar = !isLunar"
          ></tiny-tag>
        </header>

        <div class="text-2xl font-bold">{{ dateStr }}</div>
        <div class="text-xl font-bold">{{ weekDay }}</div>
        <div class="text-3xl font-mono font-bold">{{ timeStr }}</div>
      </section>

      <!-- 进度 -->
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
        <!-- 今天进度 -->
        <section>
          <div class="flex justify-between items-center mb-1 text-sm">
            <div class="text-gray-600">
              <span>今天的第</span>
              <span class="font-semibold text-black mx-1">{{ hourOfDay }}</span>
              <span>小时</span>
            </div>
            <div class="text-gray-600">
              <span>日进度</span>
              <span class="font-semibold text-black mx-1">{{ dayPercent }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all"
              :style="{ width: dayPercent + '%' }"
            />
          </div>
        </section>

        <!-- 本周进度 -->
        <section>
          <div class="flex justify-between items-center mb-1 text-sm">
            <div class="text-gray-600">
              <span>本周的第</span>
              <span class="font-semibold text-black mx-1">{{ dayOfWeek }}</span>
              <span>天</span>
            </div>
            <div class="text-gray-600">
              <span>周进度</span>
              <span class="font-semibold text-black mx-1">{{ weekPercent }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
              :style="{ width: weekPercent + '%' }"
            />
          </div>
        </section>

        <!-- 本月进度 -->
        <section>
          <div class="flex justify-between items-center mb-1 text-sm">
            <div class="text-gray-600">
              <span>本月的第</span>
              <span class="font-semibold text-black mx-1">{{ dayOfMonth }}</span>
              <span>天</span>
            </div>
            <div class="text-gray-600">
              <span>月进度</span>
              <span class="font-semibold text-black mx-1">{{ monthPercent }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
              :style="{ width: monthPercent + '%' }"
            />
          </div>
        </section>

        <!-- 年度进度 -->
        <section>
          <div class="flex justify-between items-center mb-1 text-sm">
            <div class="text-gray-600">
              <span>今年的第</span>
              <span class="font-semibold text-black mx-1">{{ dayOfYear }}</span>
              <span>天</span>
            </div>
            <div class="text-gray-600">
              <span>年进度</span>
              <span class="font-semibold text-black mx-1">{{ yearPercent }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
              :style="{ width: yearPercent + '%' }"
            />
          </div>
        </section>
      </div>
    </div>
    <!-- 事件 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 gap-6">
      <div
        v-for="(item, index) in sortedEvents"
        :key="item.id"
        :class="`rounded-xl shadow-md p-3 text-white ${
          item.duration === 0
            ? ' bg-red-500'
            : item.duration > 0
            ? ' bg-green-500'
            : ' bg-amber-500'
        }`"
      >
        <div class="text-2xl font-bold flex justify-between items-center">
          <span>{{ item.date }}</span>
          <span v-if="item.type === 'ChineseFestival'" class="text-xs">{{ item.cDate }}</span>
        </div>
        <div class="mb-1">{{ item.name }}</div>
        <div>
          <div v-html="daysDiffStr(item.duration)" class="text-xs text-right"></div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow-md p-4 md:p-8 flex flex-col justify-center items-center"
        @click="addOrEditEventDialogVisible = true"
      >
        <div class="text-2xl">+</div>
        <div class="font-bold text-sm">添加事件</div>
      </div>
    </div>

    <tiny-dialog-box v-model:visible="addOrEditEventDialogVisible" title="添加事件">
      <div class="mb-2">
        <tiny-input v-model="eventForm.name" placeholder="请输入事件名称"></tiny-input>
      </div>
      <div class="mb-2">
        <tiny-date-picker
          v-model="eventForm.date"
          :editable="false"
          placeholder="请选择日期"
        ></tiny-date-picker>
      </div>
      <template #footer>
        <tiny-button type="primary" @click="handleAddOrEditEvent">确 定</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import dayjs from "dayjs";
import { Solar, Lunar } from "lunar-javascript";

/* ---------- 静态数据 ---------- */
const FESTIVALS = [
  { id: 1, name: "元旦", date: "01-01" },
  { id: 2, name: "情人节", date: "02-14" },
  { id: 3, name: "妇女节", date: "03-08" },
  { id: 4, name: "植树节", date: "03-12" },
  { id: 5, name: "消费者权益日", date: "03-15" },
  { id: 6, name: "愚人节", date: "04-01" },
  { id: 7, name: "地球日", date: "04-22" },
  { id: 8, name: "劳动节", date: "05-01" },
  { id: 9, name: "青年节", date: "05-04" },
  { id: 11, name: "儿童节", date: "06-01" },
  { id: 12, name: "环境日", date: "06-05" },
  { id: 14, name: "建党节", date: "07-01" },
  { id: 15, name: "建军节", date: "08-01" },
  { id: 16, name: "教师节", date: "09-10" },
  { id: 17, name: "国庆节", date: "10-01" },
  { id: 18, name: "万圣节", date: "10-31" },
  { id: 20, name: "圣诞节", date: "12-25" },
];

/* ---------- 基础响应式 ---------- */
const is24 = ref(true);
const isLunar = ref(false);
const now = ref(new Date());

let timer = null;
onMounted(() => (timer = setInterval(() => (now.value = new Date()), 1000)));
onBeforeUnmount(() => clearInterval(timer));

/* ---------- 工具 ---------- */
const ms = (h, m = 0, s = 0) => (h * 3600 + m * 60 + s) * 1000;
// 天毫秒
const dayMs = 24 * 60 * 60 * 1000;
// 判断是否为闰年
const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
// 获取某年某月天数
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const padStart = n => String(n).padStart(2, "0");

/* ---------- 显示字符串 ---------- */
const dateStr = computed(() => {
  const d = dayjs(),
    lunar = Solar.fromYmd(d.year(), d.month() + 1, d.date()).getLunar(),
    cY = lunar.getYearInChinese(),
    cM = lunar.getMonthInChinese(),
    cD = lunar.getDayInChinese();
  return isLunar.value ? `${cY}年${cM}月${cD}` : d.format("YYYY年MM月DD日");
});
const timeStr = computed(() =>
  now.value.toLocaleTimeString("zh-CN", {
    hour12: !is24.value,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
);
const weekDay = computed(
  () => ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.value.getDay()],
);

/* ---------- 进度计算 ---------- */
const dayPassed = computed(() => {
  const t = now.value;
  return ms(t.getHours(), t.getMinutes(), t.getSeconds()) + t.getMilliseconds();
});
const dayPercent = computed(() => ((dayPassed.value / dayMs) * 100).toFixed(2));

const weekPassed = computed(() => {
  const t = now.value;
  const mondayMidnight = +t - (t.getDay() === 0 ? 6 : t.getDay() - 1) * dayMs - dayPassed.value;
  return +t - mondayMidnight;
});
const weekPercent = computed(() => ((weekPassed.value / (7 * dayMs)) * 100).toFixed(2));

const monthPassed = computed(() => {
  const t = now.value;
  return +t - +new Date(t.getFullYear(), t.getMonth(), 0, 0, 0, 0, 0);
});
const monthTotal = computed(
  () => daysInMonth(now.value.getFullYear(), now.value.getMonth()) * dayMs,
);
const monthPercent = computed(() => ((monthPassed.value / monthTotal.value) * 100).toFixed(2));

const dayOfYear = computed(() => {
  const y = now.value.getFullYear();
  const start = new Date(y, 0, 0);
  return Math.floor((now.value - start) / dayMs);
});
const yearPercent = computed(() =>
  ((dayOfYear.value / (isLeap(now.value.getFullYear()) ? 366 : 365)) * 100).toFixed(2),
);

/* ---------- 额外信息 ---------- */
const hourOfDay = computed(() => now.value.getHours() + 1);
const dayOfWeek = computed(() => (now.value.getDay() === 0 ? 7 : now.value.getDay()));
const dayOfMonth = computed(() => now.value.getDate());

const events = ref([]);

const sortedEvents = computed(() =>
  events.value.sort((a, b) => {
    const aDur = a.duration;
    const bDur = b.duration;

    if (aDur === 0 && bDur === 0) return 0;
    if (aDur === 0) return -1;
    if (bDur === 0) return 1;

    if (aDur > 0 && bDur > 0) return aDur - bDur;
    if (aDur > 0) return -1;
    if (bDur > 0) return 1;

    return bDur - aDur;
  }),
);

function daysDiff(date1, date2 = null) {
  if (!date2) {
    date2 = dayjs().format("YYYY-MM-DD");
  }
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc1 - utc2) / dayMs);
}

const daysDiffStr = n => {
  return n === 0
    ? "就是今天"
    : n < 0
    ? `已过<span class="mx-1 font-bold text-lg">${Math.abs(n)}</span>天`
    : `还有<span class="mx-1 font-bold text-lg">${Math.abs(n)}</span>天`;
};

const setFestivalEvents = () => {
  const y = dayjs().year();
  events.value.push(
    ...FESTIVALS.map((item, index) => ({
      ...item,
      date: item.date.replace("-", "."),
      type: "Festival",
      duration: daysDiff(`${y}-${item.date}`),
    })),
  );
  generateDatesAroundToday();
};

function generateDatesAroundToday() {
  const today = new Date(dayjs().format("YYYY-MM-DD"));
  for (let i = 0; i <= 365; i++) {
    const target = new Date(today.getTime() + i * dayMs);
    const y = target.getFullYear();
    const m = target.getMonth() + 1;
    const d = target.getDate();
    const lunar = Solar.fromYmd(y, m, d).getLunar(),
      cY = lunar.getYearInChinese(),
      cM = lunar.getMonthInChinese(),
      cD = lunar.getDayInChinese();
    const cFestivals = Solar.fromYmd(y, m, d).getLunar().getFestivals();
    if (cFestivals.length) {
      const date = `${padStart(m)}-${padStart(d)}`;
      events.value.push({
        id: `${y}-${date}`,
        name: cFestivals.join("、"),
        date: date.replace("-", "."),
        cDate: `${cM}月${cD}`,
        type: "ChineseFestival",
        duration: daysDiff(`${y}-${date}`),
      });
      if (cFestivals.includes("春节")) {
        break;
      }
    }
  }
}

setFestivalEvents();

const addOrEditEventDialogVisible = ref(false);
const eventForm = ref({
  name: "",
  date: "",
});

const handleAddOrEditEvent = () => {
  if (!eventForm.value.name.trim()) return;
  const date = dayjs(eventForm.value.date).format("MM-DD");
  const y = dayjs(eventForm.value.date).year();
  events.value.push({
    id: date,
    name: eventForm.value.name,
    date,
    type: "Custom",
    duration: daysDiff(`${y}-${date}`),
  });
  addOrEditEventDialogVisible.value = false;
};
</script>
