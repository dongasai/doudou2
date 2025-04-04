import { EventManager } from '../../core/battle/EventManager';

/**
 * 英雄等级类
 * 管理英雄的等级和经验值系统
 */
export class HeroLevel {
    private eventManager: EventManager;
    
    /** 当前等级 */
    private _level: number = 1;
    /** 当前经验值 */
    private _experience: number = 0;
    /** 升级所需经验值 */
    private _nextLevelExp: number = 100;

    constructor() {
        this.eventManager = EventManager.getInstance();
    }

    // Getters
    get level() { return this._level; }
    get experience() { return this._experience; }
    get nextLevelExp() { return this._nextLevelExp; }

    /**
     * 获取升级所需经验值
     * @param level - 目标等级
     */
    private getRequiredExp(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    /**
     * 增加经验值
     * @param amount - 经验值数量
     * @returns 是否升级
     */
    public addExperience(amount: number): boolean {
        this._experience += amount;
        
        if (this._experience >= this._nextLevelExp) {
            this.levelUp();
            return true;
        }
        
        return false;
    }

    /**
     * 升级
     */
    private levelUp(): void {
        this._level++;
        this._experience -= this._nextLevelExp;
        this._nextLevelExp = this.getRequiredExp(this._level + 1);
        
        this.eventManager.emit('heroLevelUp', {
            level: this._level,
            experience: this._experience,
            nextLevelExp: this._nextLevelExp
        });
    }

    /**
     * 获取等级信息
     */
    public getLevelInfo() {
        return {
            level: this._level,
            experience: this._experience,
            nextLevelExp: this._nextLevelExp
        };
    }
} 