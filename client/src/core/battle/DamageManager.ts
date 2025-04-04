import { EventManager } from './EventManager';

/**
 * 伤害管理器
 * 负责处理战斗中的伤害计算和应用
 */
export class DamageManager {
    private static instance: DamageManager;
    private eventManager: EventManager;

    private constructor() {
        this.eventManager = EventManager.getInstance();
    }

    public static getInstance(): DamageManager {
        if (!DamageManager.instance) {
            DamageManager.instance = new DamageManager();
        }
        return DamageManager.instance;
    }

    /**
     * 处理伤害
     * @param targetType - 目标类型
     * @param targetId - 目标ID
     * @param damage - 伤害值
     * @param currentHealth - 当前生命值
     * @param defense - 防御力
     */
    public handleDamage(params: {
        targetType: 'hero' | 'bean' | 'crystal',
        targetId: string,
        damage: number,
        currentHealth: number,
        defense?: number
    }): number {
        const { targetType, targetId, damage, currentHealth, defense = 0 } = params;
        
        // 计算实际伤害
        const actualDamage = Math.max(0, damage - defense);
        const newHealth = Math.max(0, currentHealth - actualDamage);

        // 发出伤害事件
        this.eventManager.emit('damageDealt', {
            targetType,
            targetId,
            damage: actualDamage,
            currentHealth: newHealth
        });

        // 如果生命值降为0，发出死亡事件
        if (newHealth <= 0) {
            this.handleDeath(targetType, targetId);
        }

        return newHealth;
    }

    /**
     * 处理死亡
     * @param targetType - 目标类型
     * @param targetId - 目标ID
     */
    private handleDeath(targetType: 'hero' | 'bean' | 'crystal', targetId: string): void {
        switch(targetType) {
            case 'hero':
                this.eventManager.emit('heroDied', { heroId: targetId });
                break;
            case 'bean':
                this.eventManager.emit('beanDefeated', { beanId: targetId });
                break;
            case 'crystal':
                this.eventManager.emit('gameOver', { victory: false });
                break;
        }
    }
} 