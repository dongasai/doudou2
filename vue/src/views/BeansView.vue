<script setup lang="ts">
import beansData from '@/DesignConfig/data/beans.json'
</script>

<template>
  <div>
    <h2>豆豆角色列表</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>类型</th>
          <th>生命值</th>
          <th>攻击力</th>
          <th>防御力</th>
          <th>速度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bean in beansData.beans" :key="bean.id">
          <td>{{ bean.id }}</td>
          <td>{{ bean.name }}</td>
          <td>{{ bean.type }}</td>
          <td>{{ bean.stats.hp }}</td>
          <td>{{ bean.stats.attack }}</td>
          <td>{{ bean.stats.defense }}</td>
          <td>{{ bean.stats.speed }}</td>
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