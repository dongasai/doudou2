<script setup lang="ts">
import { ref, onMounted } from 'vue'
import heroIndex from '@/DesignConfig/data/generate-heroes-index.json'

const heroes = ref<any[]>([])

onMounted(async () => {
  try {
    // 预加载所有英雄数据
    const heroPromises = heroIndex.heroes.map(async hero => {
      const response = await import(`@/DesignConfig/data/heroes/${hero.id}.json`)
      return {
        ...hero,
        details: response.default
      }
    })
    
    heroes.value = await Promise.all(heroPromises)
  } catch (error) {
    console.error('加载英雄数据失败:', error)
  }
})
</script>

<template>
  <div>
    <h2>英雄角色</h2>
    
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>类型</th>
          <th>风格</th>
          <th>特长</th>
          <th>属性</th>
          <th>技能</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hero in heroes" :key="hero.id">
          <td>{{ hero.id }}</td>
          <td>{{ hero.emoji }} {{ hero.name }}</td>
          <td>{{ hero.type }}</td>
          <td>{{ hero.style }}</td>
          <td>{{ hero.specialty }}</td>
          <td>
            <div v-for="(value, key) in hero.details.stats" :key="key">
              {{ key }}: {{ value }}
            </div>
          </td>
          <td>
            <div v-for="skill in hero.details.skills_desc" :key="skill.id">
              {{ skill.name }} ({{ skill.type }})
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  vertical-align: top;
}

.data-table th {
  background-color: #f2f2f2;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>