import { GameEmojis } from '@/config/emojis';

/**
 * 水晶类
 * 作为游戏中的核心防守目标
 * 具有生命值和血条显示，需要被英雄保护
 */
export class Crystal extends Phaser.GameObjects.Text {
    /** 水晶的最大生命值 */
    private maxHealth: number = 1000;
    /** 水晶的当前生命值 */
    private health: number = 1000;
    /** 水晶的血条显示对象 */
    private healthBar!: Phaser.GameObjects.Rectangle;
    /** 水晶血条的背景显示对象 */
    private healthBarBg!: Phaser.GameObjects.Rectangle;
    private shieldActive: boolean = false;

    /**
     * 创建一个新的水晶实例
     * @param scene - 游戏场景实例
     * @param x - 初始X坐标
     * @param y - 初始Y坐标
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, '💎', { fontSize: '48px' });
        scene.add.existing(this);
        
        // 设置物理属性
        this.setScale(2);              // 设置水晶大小

        // 创建血条
        this.createHealthBar();
        
        // 添加发光效果
        this.createGlowEffect();
    }

    /**
     * 创建水晶的血条显示
     * 包括血条背景和血条前景
     */
    private createHealthBar(): void {
        const width = 100;
        const height = 8;
        const padding = 2;
        
        // 创建血条背景
        this.healthBarBg = this.scene.add.rectangle(
            this.x,
            this.y - 40,
            width,
            height,
            0x000000,
            0.8
        );
        
        // 创建血条
        this.healthBar = this.scene.add.rectangle(
            this.x - width/2 + padding,
            this.y - 40,
            width - padding * 2,
            height - padding * 2,
            0x00ffff
        );
        this.healthBar.setOrigin(0, 0.5);
    }

    private createGlowEffect(): void {
        // 添加发光效果
        const glow = this.scene.add.text(
            this.x,
            this.y,
            '✨',
            { fontSize: '32px' }
        ).setOrigin(0.5);
        
        // 发光动画
        this.scene.tweens.add({
            targets: glow,
            alpha: 0.5,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * 水晶受到伤害的处理方法
     * @param amount - 受到的伤害值
     */
    public takeDamage(damage: number): void {
        if (this.shieldActive) {
            damage *= 0.5; // 护盾激活时减少50%伤害
        }
        
        this.health = Math.max(0, this.health - damage);
        this.updateHealthBar();
        
        // 显示伤害数字
        this.showDamageNumber(damage);
        
        // 显示受击效果
        this.showHitEffect();
        
        // 在血量低时激活护盾
        if (this.health < this.maxHealth * 0.3 && !this.shieldActive) {
            this.activateShield();
        }

        // 检查是否被摧毁
        if (this.health <= 0) {
            this.destroy();
            // 触发游戏结束事件（失败）
            this.scene.events.emit('gameOver', false);
        }
    }

    /**
     * 更新血条显示
     * 根据当前生命值比例调整血条长度
     */
    private updateHealthBar(): void {
        const healthPercentage = this.health / this.maxHealth;
        const width = this.healthBarBg.width - 4;
        this.healthBar.width = width * healthPercentage;
    }

    private showDamageNumber(damage: number): void {
        const text = this.scene.add.text(
            this.x,
            this.y - 50,
            `-${damage}`,
            {
                fontSize: '20px',
                color: '#ff0000'
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    private showHitEffect(): void {
        // 闪烁效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0.7,
            duration: 100,
            yoyo: true
        });

        // 显示受击特效
        const hitEmoji = this.scene.add.text(
            this.x,
            this.y,
            this.shieldActive ? GameEmojis.effects.sparkle : GameEmojis.effects.explosion,
            { fontSize: '32px' }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: hitEmoji,
            scale: 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => hitEmoji.destroy()
        });
    }

    private activateShield(): void {
        this.shieldActive = true;
        
        // 显示护盾效果
        const shield = this.scene.add.text(
            this.x,
            this.y,
            GameEmojis.skills.shield,
            { fontSize: '48px' }
        ).setOrigin(0.5);
        
        // 护盾动画
        this.scene.tweens.add({
            targets: shield,
            alpha: 0.7,
            scale: 1.2,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * 每帧更新时的处理方法
     * 主要用于更新血条位置
     */
    update() {
        // 更新血条位置，使其跟随水晶
        const barX = this.x - this.healthBar.width / 2;
        const barY = this.y - this.height - 30;
        
        this.healthBar.setPosition(barX, barY);
        this.healthBarBg.setPosition(barX, barY);
    }

    /**
     * 销毁水晶及其相关对象
     * 包括血条和血条背景
     */
    public destroy(): void {
        // 清理血条
        if (this.healthBar) {
            this.healthBar.destroy();
        }
        if (this.healthBarBg) {
            this.healthBarBg.destroy();
        }
        
        super.destroy();
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public setPosition(x: number, y: number): this {
        super.setPosition(x, y);
        
        // 更新血条位置
        if (this.healthBar && this.healthBarBg) {
            this.healthBarBg.setPosition(x, y - 40);
            this.healthBar.setPosition(x - this.healthBarBg.width/2 + 2, y - 40);
        }
        
        return this;
    }
} 