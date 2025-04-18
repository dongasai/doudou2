<script setup lang="ts">
import { ref } from 'vue'
import beansData from '@/DesignConfig/data/beans.json'
import heroData from '@/DesignConfig/data/heroes/1.json'

const activeTab = ref('beans')
</script>

<template>
  <div class="container">
    <h1>游戏配置可视化</h1>
    <nav>
      <button @click="activeTab = 'beans'">豆豆角色</button>
      <button @click="activeTab = 'heroes'">英雄角色</button>
    </nav>

    <div v-if="activeTab === 'beans'">
      <h2>豆豆角色列表</h2>
      <div class="grid">
        <div v-for="bean in beansData.beans" :key="bean.id" class="card">
          <h3>{{ bean.name }}</h3>
          <p>类型: {{ bean.type }}</p>
          <p>生命值: {{ bean.stats.hp }}</p>
          <p>攻击力: {{ bean.stats.attack }}</p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'heroes'">
      <h2>英雄角色详情</h2>
      <div class="hero-card">
        <h3>{{ heroData.name }}</h3>
        <p>类型: {{ heroData.type }}</p>
        <div v-for="skill in heroData.skills_desc" :key="skill.id">
          <h4>{{ skill.name }}</h4>
          <p>{{ skill.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}

.hero-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
}
</style>
