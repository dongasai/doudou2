<template>
  <div class="home">
    <h1>游戏配置管理系统</h1>
    <nav>
      <router-link to="/heroes">英雄管理</router-link> |
      <router-link to="/beans">基础配置</router-link> |
      <router-link to="/chapters">关卡管理</router-link> |
      <router-link to="/skills">技能管理</router-link>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

nav {
  margin: 20px 0;
}

nav a {
  margin: 0 10px;
  color: #42b983;
}
</style>