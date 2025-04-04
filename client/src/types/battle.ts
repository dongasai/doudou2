/**
 * 位置类型
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * 英雄数据类型
 */
export interface HeroData {
    id: string;
    type: number;
    position: Position;
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
}

/**
 * 豆豆数据类型
 */
export interface BeanData {
    id: string;
    type: number;
    position: Position;
    health: number;
    maxHealth: number;
    damage: number;
    speed: number;
}

/**
 * 水晶数据类型
 */
export interface CrystalData {
    position: Position;
    health: number;
    maxHealth: number;
} 