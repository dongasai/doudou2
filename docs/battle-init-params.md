# 战斗引擎初始化参数文档(最终版)

## 接口定义
```typescript
import type { BattleStats } from '../src/types/GameHero';
import type { CharacterBean } from '../src/types/CharacterBean';

interface BattleInitParams {
  // 玩家配置
  heroes: {
    id: number;          // 英雄ID(1-30)
    stats: BattleStats;  // 使用标准战斗状态接口
    position: number;    // 固定站位点(1-5)
  }[];
  
  // 关卡配置
  level: {
    chapter: number;     // 章节(1-10)
    stage: number;       // 关卡(1-10)
    waves: number;       // 波次(固定10)
    map: {
      type: "plain";     // 地图类型(大平原)
      centerRadius: number; // 中心活动区域半径
    };
  };
  
  // 豆豆配置
  beans: {
    wave: number;        // 所属波次(1-10)
    bean: CharacterBean; // 使用标准豆豆类型
    count: number;       // 生成数量
    spawnGroup: number;  // 出生点分组(1-8)
  }[];
  
  // 战斗规则
  rules: {
    fps: 10;             // 战斗帧率
    syncDelay: 1000;     // 指令同步延迟(ms)
    crystalHP: number;   // 水晶初始血量
  };
}
```

## 关键修改说明
1. **英雄站位**:
   - 改为数字类型(1-5)表示固定站位点
   - 对应水晶周围的5个固定位置

2. **地图配置**:
   - 简化中心区域为单个半径值
   - 移除冗余的坐标定义

3. **豆豆出生点**:
   - 使用分组编号(1-8)替代具体坐标
   - 对应地图8个方向的出生区域