/**
 * 基础属性类型
 * 描述战斗单位的属性
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

export type { Stats };