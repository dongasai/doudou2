import type { Skill } from './Skill';

/**
 * 基础属性类型
 * 描述豆豆的战斗属性
 */
interface Stats {
  /** 生命值 */
  hp: number;
  /** 攻击力 */
  attack: number;
  /** 防御力 */
  defense: number;
  /** 速度 */
  speed: number;
}

/**
 * 豆豆类型定义
 * 描述游戏中的豆豆角色
 */
interface Bean {
  /** 唯一ID */
  id: number;
  /** 豆豆名称 */
  name: string;
  /** 豆豆类型(近战/远程/防御等) */
  type: string;
  /** 技能配置 */
  skill: Skill;
  /** 基础属性 */
  stats: Stats;
}

// 导出类型
export type { Bean, Stats };
