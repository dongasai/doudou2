import { BattleManager } from '@/core/BattleManager';
import { Hero } from '@/objects/Hero';
import { Crystal } from '@/objects/Crystal';
import { Bean } from '@/objects/Bean';

/** 事件数据类型 */
interface EventData {
    heroCreated: {
        id: string;
        type: string;
        position: { x: number; y: number };
    };
    crystalCreated: {
        position: { x: number; y: number };
    };
    beanSpawned: {
        id: string;
        position: { x: number; y: number };
    };
    damageDealt: {
        targetType: 'hero' | 'bean' | 'crystal';
        targetId: string;
        damage: number;
        currentHealth: number;
    };
    beanMoved: {
        beanId: string;
        position: { x: number; y: number };
    };
    heroDied: {
        heroId: string;
    };
    beanDefeated: {
        beanId: string;
    };
    gameOver: {
        victory: boolean;
    };
}

/**
 * 战斗场景
 * 负责战斗的视觉展示、动画效果和用户输入处理
 */
export class BattleScene extends Phaser.Scene {
    /** 战斗管理器实例 */
    private battleManager: BattleManager;
    
    /** 游戏对象映射 */
    private gameObjects = {
        heroes: new Map<string, Hero>(),
        beans: new Map<string, Bean>(),
        crystal: null as Crystal | null
    };

    constructor() {
        super({ key: 'Battle' });
        this.battleManager = new BattleManager();
        this.setupEventListeners();
    }

    /**
     * 设置事件监听器
     */
    private setupEventListeners(): void {
        // 监听英雄创建事件
        this.battleManager.on('heroCreated', (data: EventData['heroCreated']) => {
            const hero = new Hero(this, data.position.x, data.position.y, data.type);
            this.gameObjects.heroes.set(data.id, hero);
        });

        // 监听水晶创建事件
        this.battleManager.on('crystalCreated', (data: EventData['crystalCreated']) => {
            this.gameObjects.crystal = new Crystal(this, data.position.x, data.position.y);
        });

        // 监听豆豆生成事件
        this.battleManager.on('beanSpawned', (data: EventData['beanSpawned']) => {
            const bean = new Bean(this, data.position.x, data.position.y);
            this.gameObjects.beans.set(data.id, bean);
        });

        // 监听伤害事件
        this.battleManager.on('damageDealt', (data: EventData['damageDealt']) => {
            let target = null;
            switch(data.targetType) {
                case 'hero':
                    target = this.gameObjects.heroes.get(data.targetId);
                    break;
                case 'bean':
                    target = this.gameObjects.beans.get(data.targetId);
                    break;
                case 'crystal':
                    target = this.gameObjects.crystal;
                    break;
            }
            if (target && 'takeDamage' in target) {
                target.takeDamage(data.damage);
            }
        });

        // 监听实体移动事件
        this.battleManager.on('beanMoved', (data: EventData['beanMoved']) => {
            const bean = this.gameObjects.beans.get(data.beanId);
            if (bean) {
                bean.x = data.position.x;
                bean.y = data.position.y;
            }
        });

        // 监听实体死亡事件
        this.battleManager.on('heroDied', (data: EventData['heroDied']) => {
            const hero = this.gameObjects.heroes.get(data.heroId);
            if (hero) {
                hero.destroy();
                this.gameObjects.heroes.delete(data.heroId);
            }
        });

        this.battleManager.on('beanDefeated', (data: EventData['beanDefeated']) => {
            const bean = this.gameObjects.beans.get(data.beanId);
            if (bean) {
                bean.destroy();
                this.gameObjects.beans.delete(data.beanId);
            }
        });

        // 监听游戏结束事件
        this.battleManager.on('gameOver', (data: EventData['gameOver']) => {
            this.showGameOverScreen(data.victory);
        });
    }

    create() {
        // 创建水晶
        this.battleManager.createCrystal({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY
        });

        // 创建英雄位置
        const positions = [
            { x: this.cameras.main.centerX, y: this.cameras.main.centerY - 200 }, // 北
            { x: this.cameras.main.centerX + 200, y: this.cameras.main.centerY }, // 东
            { x: this.cameras.main.centerX, y: this.cameras.main.centerY + 200 }, // 南
            { x: this.cameras.main.centerX - 200, y: this.cameras.main.centerY }, // 西
            { x: this.cameras.main.centerX, y: this.cameras.main.centerY }        // 中
        ];

        // 创建英雄
        positions.forEach((pos, index) => {
            this.battleManager.createHero(
                `hero_${index}`,
                `${index + 1}`,
                pos
            );
        });

        // 设置定时生成豆豆
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnBean,
            callbackScope: this,
            loop: true
        });

        // 设置碰撞检测
        this.setupCollisions();
    }

    /**
     * 设置碰撞检测
     */
    private setupCollisions(): void {
        // 设置英雄和豆豆的碰撞
        const heroSprites = Array.from(this.gameObjects.heroes.values());
        const beanSprites = Array.from(this.gameObjects.beans.values());

        this.physics.add.collider(
            heroSprites as unknown as Phaser.GameObjects.GameObject[],
            beanSprites as unknown as Phaser.GameObjects.GameObject[],
            (obj1, obj2) => {
                const hero = obj1 as unknown as Hero;
                const bean = obj2 as unknown as Bean;
                this.handleHeroBeanCollision(hero, bean);
            }
        );

        // 设置水晶和豆豆的碰撞
        if (this.gameObjects.crystal) {
            this.physics.add.collider(
                this.gameObjects.crystal as unknown as Phaser.GameObjects.GameObject,
                beanSprites as unknown as Phaser.GameObjects.GameObject[],
                (obj1, obj2) => {
                    const crystal = obj1 as unknown as Crystal;
                    const bean = obj2 as unknown as Bean;
                    this.handleCrystalBeanCollision(crystal, bean);
                }
            );
        }
    }

    /**
     * 处理英雄和豆豆的碰撞
     */
    private handleHeroBeanCollision(hero: Hero, bean: Bean): void {
        const heroId = Array.from(this.gameObjects.heroes.entries())
            .find(([_, h]) => h === hero)?.[0];
        const beanId = Array.from(this.gameObjects.beans.entries())
            .find(([_, b]) => b === bean)?.[0];

        if (heroId && beanId) {
            this.battleManager.handleDamage('bean', beanId, 20); // 英雄攻击豆豆
            this.battleManager.handleDamage('hero', heroId, bean.getDamage()); // 豆豆反击英雄
        }
    }

    /**
     * 处理水晶和豆豆的碰撞
     */
    private handleCrystalBeanCollision(crystal: Crystal, bean: Bean): void {
        const beanId = Array.from(this.gameObjects.beans.entries())
            .find(([_, b]) => b === bean)?.[0];

        if (beanId) {
            this.battleManager.handleDamage('crystal', 'crystal', bean.getDamage());
            this.battleManager.handleDamage('bean', beanId, 1000); // 豆豆碰到水晶后消失
        }
    }

    /**
     * 生成豆豆
     */
    private spawnBean(): void {
        // 从四个角随机选择一个生成豆豆
        const spawnPoints = [
            { x: 0, y: 0 },
            { x: this.cameras.main.width, y: 0 },
            { x: 0, y: this.cameras.main.height },
            { x: this.cameras.main.width, y: this.cameras.main.height }
        ];

        const spawnPoint = Phaser.Math.RND.pick(spawnPoints);
        this.battleManager.spawnBean(spawnPoint);
    }

    /**
     * 显示游戏结束画面
     */
    private showGameOverScreen(victory: boolean): void {
        const text = victory ? '胜利！' : '失败！';
        const color = victory ? '#00ff00' : '#ff0000';

        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            text,
            {
                fontSize: '64px',
                color: color
            }
        ).setOrigin(0.5);
    }

    update(time: number, delta: number): void {
        // 更新战斗管理器
        this.battleManager.update(delta / 1000); // 转换为秒

        // 更新所有游戏对象
        for (const hero of this.gameObjects.heroes.values()) {
            hero.update();
        }
        for (const bean of this.gameObjects.beans.values()) {
            bean.update();
        }
        if (this.gameObjects.crystal) {
            this.gameObjects.crystal.update();
        }
    }
} 