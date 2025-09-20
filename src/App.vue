<template>
  <div class="app">
    <header class="header">
      <h1 class="title">日期计算工具</h1>
      <p class="subtitle">轻松计算日期差值和推算日期</p>
    </header>

    <main class="main">
      <div class="container">
        <!-- 日期差值计算 -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">计算日期差值</h2>
            <p class="card-description">选择两个日期，计算它们之间的天数差</p>
          </div>
          <div class="card-content">
            <div class="date-inputs">
              <div class="input-group">
                <label for="start-date">开始日期</label>
                <input id="start-date" v-model="startDate" type="date" class="date-input" />
              </div>
              <div class="input-group">
                <label for="end-date">结束日期</label>
                <input id="end-date" v-model="endDate" type="date" class="date-input" />
              </div>
            </div>
            <tiny-button type="primary" @click="calculateDateDifference"> 开始计算 </tiny-button>
            <div v-if="dateDifference !== null" class="result">
              <div class="result-card">
                <span class="result-label">相差天数：</span>
                <span class="result-value" :class="{ negative: dateDifference < 0 }">
                  {{ Math.abs(dateDifference) }} 天
                </span>
              </div>
              <div v-if="dateDifference !== 0" class="result-note">
                {{ dateDifference > 0 ? "结束日期晚于开始日期" : "结束日期早于开始日期" }}
              </div>
            </div>
          </div>
        </div>

        <!-- 日期推算 -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">日期推算</h2>
            <p class="card-description">选择一个日期，向前或向后推算指定天数</p>
          </div>
          <div class="card-content">
            <div class="date-inputs">
              <div class="input-group">
                <label for="base-date">基准日期</label>
                <input id="base-date" v-model="baseDate" type="date" class="date-input" />
              </div>
              <tiny-date-picker v-model="baseDate" placeholder="请选择日期"></tiny-date-picker>
              <div class="input-group">
                <label for="offset-days">推算天数</label>
                <input
                  id="offset-days"
                  v-model.number="offsetDays"
                  type="number"
                  class="number-input"
                  placeholder="输入天数"
                />
              </div>
              <div class="input-group">
                <label>推算方向</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input v-model="offsetDirection" type="radio" value="forward" />
                    <span>向前推算</span>
                  </label>
                  <label class="radio-label">
                    <input v-model="offsetDirection" type="radio" value="backward" />
                    <span>向后推算</span>
                  </label>
                </div>
              </div>
            </div>
            <tiny-button type="primary" @click="calculateDateOffset"> 开始推算 </tiny-button>
            <div v-if="calculatedDate" class="result">
              <div class="result-card">
                <span class="result-label">推算结果：</span>
                <span class="result-value">{{ calculatedDate }}</span>
              </div>
              <div class="result-note">
                {{ offsetDirection === "forward" ? "向前" : "向后" }}推算
                {{ Math.abs(offsetDays) }} 天
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>© 2024 日期计算工具 - 让日期计算更简单</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 日期差值计算相关
const startDate = ref("");
const endDate = ref("");
const dateDifference = ref(null);

// 日期推算相关
const baseDate = ref("");
const offsetDays = ref(0);
const offsetDirection = ref("forward");
const calculatedDate = ref("");

// 计算日期差值
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

// 计算日期推算
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

// 设置默认日期为今天
const today = new Date().toISOString().split("T")[0];
startDate.value = today;
endDate.value = today;
baseDate.value = today;
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  padding: 2rem 1rem;
  color: white;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.main {
  padding: 0 1rem 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.card-description {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.9;
}

.card-content {
  padding: 2rem;
}

.date-inputs {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.date-input,
.number-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: #fafbfc;
}

.date-input:focus,
.number-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.radio-group {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #555;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.result {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.result-label {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

.result-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-value.negative {
  color: #e53e3e;
}

.result-note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.footer {
  text-align: center;
  padding: 2rem 1rem;
  color: white;
  opacity: 0.8;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .date-inputs {
    gap: 1rem;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .result-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .main {
    padding: 0 0.5rem 1.5rem;
  }

  .card-content {
    padding: 1rem;
  }

  .result {
    padding: 1rem;
  }

  .result-value {
    font-size: 1.3rem;
  }
}
</style>
