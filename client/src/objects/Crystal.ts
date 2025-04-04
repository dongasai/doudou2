import { GameObject } from './GameObject';

/**
 * 水晶类
 * 作为游戏中的核心防守目标
 * 具有生命值和血条显示，需要被英雄保护
 */
export class Crystal extends GameObject {
    /** 水晶的最大生命值 */
    private maxHealth: number = 1000;
    /** 水晶的当前生命值 */
    private currentHealth: number = 1000;
    /** 水晶的血条显示对象 */
    private healthBar!: Phaser.GameObjects.Rectangle;
    /** 水晶血条的背景显示对象 */
    private healthBarBg!: Phaser.GameObjects.Rectangle;

    /**
     * 创建一个新的水晶实例
     * @param scene - 游戏场景实例
     * @param x - 初始X坐标
     * @param y - 初始Y坐标
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, '💎');  // 使用水晶emoji作为贴图
        
        // 设置物理属性
        this.body.setImmovable(true);  // 设置水晶为不可移动
        this.setScale(3);              // 设置水晶大小

        // 创建血条
        this.createHealthBar();
    }

    /**
     * 创建水晶的血条显示
     * 包括血条背景和血条前景
     */
    private createHealthBar() {
        const barWidth = 200;   // 血条宽度
        const barHeight = 20;   // 血条高度
        const barX = -barWidth / 2;  // 血条X偏移
        const barY = -this.height - 30;  // 血条Y偏移

        // 创建血条背景（黑色）
        this.healthBarBg = this.scene.add.rectangle(
            this.x + barX,
            this.y + barY,
            barWidth,
            barHeight,
            0x000000
        );
        this.healthBarBg.setOrigin(0, 0);  // 设置原点为左上角

        // 创建血条前景（绿色）
        this.healthBar = this.scene.add.rectangle(
            this.x + barX,
            this.y + barY,
            barWidth,
            barHeight,
            0x00ff00
        );
        this.healthBar.setOrigin(0, 0);  // 设置原点为左上角
    }

    /**
     * 水晶受到伤害的处理方法
     * @param amount - 受到的伤害值
     */
    public takeDamage(amount: number) {
        // 更新当前生命值，确保不小于0
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        this.updateHealthBar();

        // 检查是否被摧毁
        if (this.currentHealth <= 0) {
            this.destroy();
            // 触发游戏结束事件（失败）
            this.scene.events.emit('gameOver', false);
        }
    }

    /**
     * 更新血条显示
     * 根据当前生命值比例调整血条长度
     */
    private updateHealthBar() {
        const healthPercentage = this.currentHealth / this.maxHealth;
        this.healthBar.setScale(healthPercentage, 1);
    }

    /**
     * 每帧更新时的处理方法
     * 主要用于更新血条位置
     */
    update() {
        super.update();
        
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
    destroy() {
        this.healthBar.destroy();
        this.healthBarBg.destroy();
        super.destroy();
    }
} 