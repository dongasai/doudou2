/**
 * 技能类型定义
 * 统一描述英雄和豆豆的技能属性
 */
interface Skill {
  /** 技能名称 */
  name: string;
  /** 技能类型(伤害/治疗/控制/增益/减益/召唤/位移) */
  type: string;
  /** 技能描述 */
  description: string;
  /** 冷却时间(回合数) */
  cooldown: number;
  /** 能量/资源消耗(可选) */
  cost?: number;
  /** 基础伤害值(可选) */
  damage?: number;
  /** 防御增益值(可选) */
  defense_buff?: number;
  /** 减速效果百分比(0-100)(可选) */
  slow?: number;
  /** 治疗量(可选) */
  heal?: number;
  /** 伤害反弹百分比(0-100)(可选) */
  reflect?: number;
  /** 眩晕回合数(可选) */
  stun?: number;
  /** 吸血百分比(0-100)(可选) */
  lifesteal?: number;
  /** 速度增益值(可选) */
  speed_buff?: number;
  /** 攻击增益值(可选) */
  attack_buff?: number;
  /** 召唤物数量(可选) */
  summon_count?: number;
  /** 持续时间(回合数)(可选) */
  duration?: number;
}

// 导出技能类型
export type { Skill };
