<template>
  <div class="stages">
    <h1>关卡管理</h1>
    <table class="stages-table">
      <thead>
        <tr>
          <th>关卡ID</th>
          <th>名称</th>
          <th>描述</th>
          <th>背景</th>
          <th>敌人类型</th>
          <th>属性加成</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stage in stages" :key="stage.id">
          <td>{{ stage.id }}</td>
          <td>{{ stage.name }}</td>
          <td>{{ stageDetails[stage.id]?.description }}</td>
          <td>{{ stageDetails[stage.id]?.background }}</td>
          <td>
            <span v-for="bean in stageDetails[stage.id]?.beanRatios" :key="bean.type">
              {{ bean.type }} ({{ ((bean.weight / totalWeight(stageDetails[stage.id]?.beanRatios)) * 100).toFixed(3) }}%)
            </span>
          </td>
          <td>
            HP: {{ stageDetails[stage.id]?.attrFactors.hp }},
            攻击: {{ stageDetails[stage.id]?.attrFactors.attack }},
            防御: {{ stageDetails[stage.id]?.attrFactors.defense }},
            速度: {{ stageDetails[stage.id]?.attrFactors.speed }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
// 动态导入关卡详情文件
const stageFiles = import.meta.glob('@/DesignConfig/data/stage/*.json', { eager: true });

// 整合关卡数据
const stageDetails = reactive({});
Object.entries(stageFiles).forEach(([path, module]) => {
  const stageId = path.match(/stage-(\d+-\d+)\.json$/)[1];
  stageDetails[stageId] = module.default;
});

export default defineComponent({
  name: 'StagesView',
  setup() {
    // 自定义排序函数
    const sortStageIds = (ids) => {
      return ids.sort((a, b) => {
        const [a1, a2] = a.split('-').map(Number);
        const [b1, b2] = b.split('-').map(Number);
        return a1 === b1 ? a2 - b2 : a1 - b1;
      });
    };

    const sortedStageIds = sortStageIds(Object.keys(stageDetails));
    const stages = ref(sortedStageIds.map(id => ({ id, name: stageDetails[id].name })));

    // 计算敌人权重总和
    const totalWeight = (beanRatios) => {
      return beanRatios.reduce((sum, bean) => sum + bean.weight, 0);
    };

    return { stages, stageDetails, totalWeight };
  }
});
</script>

<style scoped>
.stages {
  padding: 20px;
  text-align: center;
}

.stage-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stage-info span {
  margin-right: 10px;
}

.stage-id {
  font-weight: bold;
}

.stages-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.stages-table th,
.stages-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.stages-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.stages-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.stages-table tr:hover {
  background-color: #f1f1f1;
}
</style>