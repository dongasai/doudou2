import type { Skill } from './Skill';
import type { Stats } from './Stats';

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

export type { Bean };