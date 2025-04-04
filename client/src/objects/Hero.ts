import { GameObject } from './GameObject';
import { Skill } from '@/types/hero';

export class Hero extends GameObject {
    private name: string;
    private skills: Skill[] = [];
    private currentLevel: number = 1;
    private experience: number = 0;
    private stats = {
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5
    };

    constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
        super(scene, x, y, '🦸');  // 使用英雄emoji作为贴图
        this.name = name;
        
        // 设置物理属性
        this.body.setImmovable(true);
        this.setScale(2);

        // 创建血条
        this.createHealthBar();
    }

    private createHealthBar() {
        const barWidth = 100;
        const barHeight = 8;
        const barX = -barWidth / 2;
        const barY = -this.height;

        // 血条背景
        const healthBarBg = this.scene.add.rectangle(
            this.x + barX,
            this.y + barY,
            barWidth,
            barHeight,
            0x000000
        );
        healthBarBg.setOrigin(0, 0);

        // 血条
        const healthBar = this.scene.add.rectangle(
            this.x + barX,
            this.y + barY,
            barWidth,
            barHeight,
            0xff0000
        );
        healthBar.setOrigin(0, 0);
    }

    public takeDamage(amount: number) {
        this.stats.hp = Math.max(0, this.stats.hp - Math.max(0, amount - this.stats.defense));
        // 更新血条显示
        this.updateHealthBar();

        if (this.stats.hp <= 0) {
            this.die();
        }
    }

    private updateHealthBar() {
        const healthPercentage = this.stats.hp / this.stats.maxHp;
        // TODO: 更新血条宽度
    }

    public heal(amount: number) {
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
        this.updateHealthBar();
    }

    public gainExperience(amount: number) {
        this.experience += amount;
        const requiredExp = this.currentLevel * 100;  // 简单的等级经验计算

        if (this.experience >= requiredExp) {
            this.levelUp();
        }
    }

    private levelUp() {
        this.currentLevel++;
        this.experience = 0;

        // 提升属性
        this.stats.maxHp += 20;
        this.stats.hp = this.stats.maxHp;
        this.stats.attack += 5;
        this.stats.defense += 2;
        this.stats.speed += 1;

        // 显示升级效果
        this.showLevelUpEffect();
    }

    private showLevelUpEffect() {
        // 创建一个升级特效
        const levelUpText = this.scene.add.text(
            this.x,
            this.y - 50,
            'LEVEL UP!',
            { fontSize: '24px', color: '#ffff00' }
        );

        // 让文字向上飘动并消失
        this.scene.tweens.add({
            targets: levelUpText,
            y: this.y - 100,
            alpha: 0,
            duration: 1000,
            onComplete: () => levelUpText.destroy()
        });
    }

    private die() {
        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 0,
            duration: 1000,
            onComplete: () => this.destroy()
        });
    }

    update() {
        super.update();
        // 更新英雄的逻辑
    }

    // 技能相关方法
    public learnSkill(skill: Skill) {
        if (this.skills.length < 4) {
            this.skills.push(skill);
        }
    }

    public useSkill(index: number) {
        if (index >= 0 && index < this.skills.length) {
            const skill = this.skills[index];
            // TODO: 实现技能效果
            console.log(`${this.name} 使用技能: ${skill.name}`);
        }
    }
} 