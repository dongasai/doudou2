<script setup lang="ts">
import { ref } from 'vue'
import skillIndex from '@/DesignConfig/skill/generate-skills-index.json'
import { ElTable, ElTableColumn } from 'element-plus'

const skills = ref<any[]>(skillIndex.skills)
const selectedSkill = ref<any>(null)

async function loadSkillDetails(skillId: string) {
  try {
    const response = await import(`@/DesignConfig/skill/json/${skillId}.json`)
    selectedSkill.value = response.default
  } catch (error) {
    console.error('加载技能详情失败:', error)
    selectedSkill.value = null
  }
}
</script>

<template>
  <div class="skills-container">
    <h2>技能列表</h2>
    
    <el-table :data="skills" @row-click="loadSkillDetails" style="width: 100%">
      <el-table-column prop="name" label="技能名称" width="180" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="targetType" label="目标类型" width="120" />
      <el-table-column prop="range" label="范围" width="100" />
      <el-table-column prop="cooldown" label="冷却时间(ms)" width="150" />
      <el-table-column label="图标" width="80">
        <template #default="{row}">
          <span v-if="row.emoji">{{ row.emoji }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="selectedSkill" class="skill-details">
      <h3>{{ selectedSkill.name }} 详情</h3>
      <div v-if="selectedSkill.emoji" class="skill-emoji">{{ selectedSkill.emoji }}</div>
      <p v-if="selectedSkill.description">{{ selectedSkill.description }}</p>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="冷却时间">{{ selectedSkill.cooldown }}ms</el-descriptions-item>
        <el-descriptions-item label="范围">{{ selectedSkill.range }}</el-descriptions-item>
        <el-descriptions-item label="基础伤害" v-if="selectedSkill.baseDamage">{{ selectedSkill.baseDamage }}</el-descriptions-item>
        <el-descriptions-item label="基础治疗" v-if="selectedSkill.baseHeal">{{ selectedSkill.baseHeal }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="selectedSkill.effects" class="skill-effects">
        <h4>效果:</h4>
        <el-table :data="Object.entries(selectedSkill.effects)" style="width: 100%">
          <el-table-column prop="0" label="效果名称" width="180" />
          <el-table-column prop="1.type" label="类型" width="120" />
          <el-table-column prop="1.duration" label="持续时间(ms)" width="150" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-container {
  padding: 20px;
}

.skill-details {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.skill-emoji {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>