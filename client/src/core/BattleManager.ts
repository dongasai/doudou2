import { ConfigLoader } from './ConfigLoader';

/**
 * 战斗管理器
 * 负责处理战斗的核心逻辑，与展示层分离
 */
export class BattleManager {
    /** 当前波次 */
    private wave: number = 0;
    /** 当前关卡 */
    private level: number = 1;
    /** 当前章节 */
    private chapter: number = 1;
    /** 战斗状态 */
    private battleState: 'prepare' | 'fighting' | 'pause' | 'victory' | 'defeat' = 'prepare';
    /** 战斗数据 */
    private battleData = {
        heroes: new Map<string, HeroData>(),
        beans: new Map<string, BeanData>(),
        crystal: null as CrystalData | null
    };

    /** 事件监听器 */
    private eventListeners = new Map<string, Function[]>();

    constructor() {
        this.init();
    }

    /**
     * 初始化战斗管理器
     */
    private init() {
        // 初始化战斗数据
        this.resetBattleData();
    }

    /**
     * 重置战斗数据
     */
    private resetBattleData() {
        this.battleData.heroes.clear();
        this.battleData.beans.clear();
        this.battleData.crystal = null;
        this.wave = 0;
        this.battleState = 'prepare';
    }

    /**
     * 创建英雄
     * @param id - 英雄ID
     * @param type - 英雄类型
     * @param position - 英雄位置
     */
    public createHero(id: string, type: string, position: Position): void {
        // 从配置中获取英雄数据
        const heroId = parseInt(type);
        if (isNaN(heroId)) {
            console.error(`无效的英雄类型: ${type}`);
            return;
        }
        
        const heroConfig = ConfigLoader.getInstance().getHeroConfig(heroId);
        
        if (!heroConfig) {
            console.error(`找不到英雄配置: ${type}`);
            return;
        }

        const heroData: HeroData = {
            id,
            type: type,
            position,
            health: heroConfig.stats.hp,
            maxHealth: heroConfig.stats.hp,
            level: 1,
            skills: heroConfig.skills.map((skill: any) => skill.id)
        };
        this.battleData.heroes.set(id, heroData);
        this.emit('heroCreated', heroData);
    }

    /**
     * 创建水晶
     * @param position - 水晶位置
     */
    public createCrystal(position: Position): void {
        const crystalData: CrystalData = {
            position,
            health: 1000,
            maxHealth: 1000
        };
        this.battleData.crystal = crystalData;
        this.emit('crystalCreated', crystalData);
    }

    /**
     * 生成豆豆
     * @param position - 生成位置
     */
    public spawnBean(position: Position): string {
        const id = `bean_${Date.now()}_${Math.random()}`;
        
        // 从配置中随机选择一个豆豆类型
        const beanConfigs = ConfigLoader.getInstance().getAllBeanConfigs();
        const beanConfig = beanConfigs[Math.floor(Math.random() * beanConfigs.length)];
        
        const beanData: BeanData = {
            id,
            position,
            health: beanConfig.stats.hp,
            maxHealth: beanConfig.stats.hp,
            type: beanConfig.type,
            damage: beanConfig.stats.attack,
            speed: beanConfig.stats.speed
        };
        this.battleData.beans.set(id, beanData);
        this.emit('beanSpawned', beanData);
        return id;
    }

    /**
     * 处理伤害
     * @param targetType - 目标类型
     * @param targetId - 目标ID
     * @param damage - 伤害值
     */
    public handleDamage(targetType: 'hero' | 'bean' | 'crystal', targetId: string, damage: number): void {
        let target: any = null;
        
        switch(targetType) {
            case 'hero':
                target = this.battleData.heroes.get(targetId);
                break;
            case 'bean':
                target = this.battleData.beans.get(targetId);
                break;
            case 'crystal':
                target = this.battleData.crystal;
                break;
        }

        if (target) {
            target.health = Math.max(0, target.health - damage);
            this.emit('damageDealt', { targetType, targetId, damage, currentHealth: target.health });

            if (target.health <= 0) {
                this.handleDeath(targetType, targetId);
            }
        }
    }

    /**
     * 处理死亡
     * @param targetType - 目标类型
     * @param targetId - 目标ID
     */
    private handleDeath(targetType: 'hero' | 'bean' | 'crystal', targetId: string): void {
        switch(targetType) {
            case 'hero':
                this.battleData.heroes.delete(targetId);
                this.emit('heroDied', { heroId: targetId });
                break;
            case 'bean':
                this.battleData.beans.delete(targetId);
                this.emit('beanDefeated', { beanId: targetId });
                break;
            case 'crystal':
                this.battleState = 'defeat';
                this.emit('gameOver', { victory: false });
                break;
        }
    }

    /**
     * 更新战斗
     * @param deltaTime - 时间增量
     */
    public update(deltaTime: number): void {
        if (this.battleState !== 'fighting') return;

        // 更新所有实体的位置和状态
        this.updateEntities(deltaTime);
        
        // 检查胜利条件
        this.checkVictoryCondition();
    }

    /**
     * 更新所有实体
     * @param deltaTime - 时间增量
     */
    private updateEntities(deltaTime: number): void {
        // 更新豆豆移动
        for (const [id, bean] of this.battleData.beans) {
            if (this.battleData.crystal) {
                // 计算豆豆朝向水晶的移动
                const direction = this.calculateDirection(
                    bean.position,
                    this.battleData.crystal.position
                );
                
                // 更新豆豆位置
                bean.position.x += direction.x * bean.speed * deltaTime;
                bean.position.y += direction.y * bean.speed * deltaTime;
                
                this.emit('beanMoved', { beanId: id, position: bean.position });
            }
        }
    }

    /**
     * 计算方向向量
     */
    private calculateDirection(from: Position, to: Position): Position {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        return {
            x: dx / length,
            y: dy / length
        };
    }

    /**
     * 检查胜利条件
     */
    private checkVictoryCondition(): void {
        if (this.battleData.beans.size === 0 && this.wave >= 10) {
            this.battleState = 'victory';
            this.emit('gameOver', { victory: true });
        }
    }

    /**
     * 注册事件监听器
     */
    public on(event: string, callback: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)?.push(callback);
    }

    /**
     * 触发事件
     */
    private emit(event: string, data: any): void {
        const callbacks = this.eventListeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }
}

/**
 * 位置接口
 */
interface Position {
    x: number;
    y: number;
}

/**
 * 英雄数据接口
 */
interface HeroData {
    id: string;
    type: string;
    position: Position;
    health: number;
    maxHealth: number;
    level: number;
    skills: string[];
}

/**
 * 豆豆数据接口
 */
interface BeanData {
    id: string;
    position: Position;
    health: number;
    maxHealth: number;
    type: string;
    damage: number;
    speed: number;
}

/**
 * 水晶数据接口
 */
interface CrystalData {
    position: Position;
    health: number;
    maxHealth: number;
} 