# 战斗引擎初始化参数文档(最终版)

## 接口定义
```typescript
import type { BattleStats } from '../src/types/GameHero';
import type { Crystal } from '../src/types/Crystal';

interface BattleInitParams {
  // 核心防御目标
  crystal: Crystal;      // 水晶配置
  
  // 玩家配置(1-5人)
  players: {
    id: string;         // 玩家唯一ID
    name: string;       // 玩家昵称
    hero: {            // 玩家选择的英雄
      id: number;       // 英雄ID(1-30)
      stats: BattleStats; 
      position: number; // 固定站位(1-5)
    };
  }[];
  
  // 关卡配置
  level: {
    chapter: number;    // 章节(1-10)
    stage: number;      // 关卡(1-10)
  };
  
  // 战斗规则
  rules: {
    fps: 10;            // 战斗帧率
    syncDelay: 1000;    // 同步延迟(ms)
  };
}
```

## 最终优化点
1. **单人单英雄**:
   - 每个玩家只能控制1个英雄
   - 总英雄数1-5个对应玩家数

2. **简化结构**:
   - 移除heroes数组改为单hero对象
   - 保持核心功能不变

3. **兼容性**:
   - 仍支持1-5人组队
   - 与关卡availableHeroSlots匹配