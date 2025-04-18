<script setup lang="ts">
import { ref } from 'vue'
import skillsData from '@/DesignConfig/skill/json/battle_cry.json'
</script>

<template>
  <div>
    <h2>技能列表</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>描述</th>
          <th>冷却</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ skillsData.name }}</td>
          <td>{{ skillsData.type }}</td>
          <td>{{ skillsData.description }}</td>
          <td>{{ skillsData.cooldown }}</td>
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
}

.data-table th {
  background-color: #f2f2f2;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>