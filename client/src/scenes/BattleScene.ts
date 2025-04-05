import { BattleManager } from '@/core/BattleManager';
import { Hero } from '@/objects/Hero';
import { Crystal } from '@/objects/Crystal';
import { Bean } from '@/objects/Bean';
import { GameEmojis } from '@/config/emojis';

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
        type: string;
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
        super({ key: 'BattleScene' });
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
        // 设置背景
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.3);

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

        // 创建英雄（使用英雄ID而不是类型字符串）
        const heroIds = [1, 2, 3, 4, 5]; // 对应配置文件中的英雄ID
        positions.forEach((pos, index) => {
            this.battleManager.createHero(
                `hero_${index}`,
                heroIds[index].toString(),
                pos
            );
        });

        // 设置定时生成豆豆
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnBean,
            callbackScope: this,
            loop: true
        });

        // 设置碰撞检测
        this.setupCollisions();

        // 添加UI
        this.createUI();
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
            // 创建一个不可见的物理区域来处理水晶的碰撞
            const crystalHitArea = this.add.rectangle(
                this.gameObjects.crystal.x,
                this.gameObjects.crystal.y,
                50,
                50,
                0x000000,
                0
            );
            this.physics.add.existing(crystalHitArea, true);

            this.physics.add.collider(
                crystalHitArea,
                beanSprites as unknown as Phaser.GameObjects.GameObject[],
                (obj1, obj2) => {
                    const bean = obj2 as unknown as Bean;
                    this.handleCrystalBeanCollision(this.gameObjects.crystal!, bean);
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
     * 创建UI界面
     */
    private createUI(): void {
        // 添加暂停按钮
        const pauseButton = this.add.text(
            this.cameras.main.width - 50,
            20,
            GameEmojis.status.pause,
            { fontSize: '32px' }
        )
        .setInteractive()
        .on('pointerdown', () => {
            // TODO: 实现暂停功能
        });

        // 添加得分显示
        this.add.text(
            20,
            20,
            `${GameEmojis.ui.coin} 0`,
            { 
                fontSize: '24px',
                color: '#ffffff'
            }
        );
    }

    /**
     * 显示游戏结束画面
     */
    private showGameOverScreen(victory: boolean): void {
        const emoji = victory ? GameEmojis.status.victory : GameEmojis.status.defeat;
        const text = victory ? '胜利！' : '失败！';
        const color = victory ? '#00ff00' : '#ff0000';

        const container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);

        container.add(this.add.text(0, -50, emoji, { fontSize: '64px' }).setOrigin(0.5));
        container.add(this.add.text(0, 50, text, {
            fontSize: '48px',
            color: color,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
        }).setOrigin(0.5));

        // 添加返回按钮
        const backButton = this.add.text(0, 150, `${GameEmojis.ui.back} 返回主菜单`, {
            fontSize: '24px',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 },
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        container.add(backButton);
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