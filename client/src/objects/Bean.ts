/// <reference types="phaser" />

import * as Phaser from 'phaser';

/**
 * 豆豆类
 * 作为游戏中的基础敌人单位，从四面八方攻击水晶
 * 具有生命值、伤害值和移动速度属性
 */
export class Bean extends Phaser.Physics.Arcade.Sprite {
    /** 豆豆的生命值 */
    private health: number = 50;
    /** 豆豆的攻击伤害 */
    private damage: number = 10;
    /** 豆豆的移动速度上限 */
    private speed: number = 100;

    /**
     * 创建一个新的豆豆实例
     * @param scene - 游戏场景实例
     * @param x - 初始X坐标
     * @param y - 初始Y坐标
     */
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, '🟤');  // 使用豆豆emoji作为贴图
        scene.add.existing(this);   // 将豆豆添加到场景中
        scene.physics.add.existing(this);  // 为豆豆启用物理系统
        
        // 设置物理属性
        this.setBounce(1, 1);           // 设置完全弹性碰撞
        this.setCollideWorldBounds(true);  // 设置不能离开游戏世界
        this.setScale(1.5);             // 设置豆豆大小
    }

    /**
     * 豆豆受到伤害的处理方法
     * @param amount - 受到的伤害值
     */
    public takeDamage(amount: number): void {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.die();  // 生命值降至0时死亡
        } else {
            // 受伤时的闪烁效果
            this.scene.tweens.add({
                targets: this,
                alpha: 0.5,      // 透明度变化
                duration: 100,    // 持续时间
                yoyo: true       // 来回闪烁
            });
        }
    }

    /**
     * 豆豆死亡时的处理方法
     * 播放死亡动画并发出死亡事件
     */
    private die(): void {
        // 死亡消失动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,     // 逐渐消失
            scale: 0,     // 逐渐缩小
            duration: 200, // 动画持续时间
            onComplete: () => this.destroy()  // 动画结束后销毁对象
        });

        // 发出豆豆被击败的事件，携带位置和经验值信息
        this.scene.events.emit('beanDefeated', {
            x: this.x,
            y: this.y,
            experience: 10  // 击败豆豆获得的经验值
        });
    }

    /**
     * 每帧更新时的处理方法
     * 主要用于控制豆豆的移动速度
     */
    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            // 计算当前速度
            const velocity = this.body.velocity;
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            
            // 如果速度超过上限，则等比例缩小
            if (speed > this.speed) {
                const scale = this.speed / speed;
                this.body.velocity.x *= scale;
                this.body.velocity.y *= scale;
            }
        }
    }

    /**
     * 获取豆豆的攻击伤害值
     * @returns 豆豆的攻击伤害值
     */
    public getDamage(): number {
        return this.damage;
    }
} 