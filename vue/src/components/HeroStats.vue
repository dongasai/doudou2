<script setup lang="ts">
defineProps<{
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
    critical: number
  }
}>()
</script>

<template>
  <div class="hero-stats">

    <el-descriptions :column="2" border>
      <el-descriptions-item label="生命值">{{ stats.hp }}</el-descriptions-item>
      <el-descriptions-item label="魔法值">{{ stats.mp }}</el-descriptions-item>

      <el-descriptions-item label="攻击力">{{ stats.attack }}</el-descriptions-item>
      <el-descriptions-item label="防御力">{{ stats.defense }}</el-descriptions-item>
      <el-descriptions-item label="魔法攻击力">{{ stats.magicAttack }}</el-descriptions-item>
      <el-descriptions-item label="魔法防御力">{{ stats.magicDefense }}</el-descriptions-item>
      <el-descriptions-item label="速度">{{ stats.speed }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.hero-stats {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>