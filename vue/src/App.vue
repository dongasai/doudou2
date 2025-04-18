<script setup lang="ts">
</script>

<template>
  <div class="container">
    <h1>游戏配置可视化</h1>
    <nav>
      <router-link to="/beans">豆豆角色</router-link>
      <router-link to="/heroes">英雄角色</router-link>
      <router-link to="/skills">技能列表</router-link>
      <router-link to="/chapters">关卡管理</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  margin: 20px 0;
}

nav a {
  margin-right: 10px;
  padding: 8px 16px;
  text-decoration: none;
  color: #2c3e50;
  border: 1px solid #ddd;
  border-radius: 4px;
}

nav a.router-link-exact-active {
  color: white;
  background-color: #42b983;
}
</style>
