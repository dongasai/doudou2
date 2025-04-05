import { GameEmojis } from '@/config/emojis';
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
    private healthBar!: Phaser.GameObjects.Rectangle;
    private healthBarBg!: Phaser.GameObjects.Rectangle;
    private type: string;

    constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
        // 根据英雄类型选择对应的 Emoji
        const emoji = GameEmojis.heroes[type as keyof typeof GameEmojis.heroes] || '👤';
        super(scene, x, y, emoji);
        
        this.type = type;
        
        // 设置物理属性
        this.setScale(1.5);
        if (this.body) {
            this.body.setCollideWorldBounds(true);
        }
        
        // 创建血条
        this.createHealthBar();
    }

    private createHealthBar(): void {
        const width = 50;
        const height = 6;
        const padding = 2;
        
        // 创建血条背景
        this.healthBarBg = this.scene.add.rectangle(
            0,
            -30,
            width,
            height,
            0x000000,
            0.8
        );
        
        // 创建血条
        this.healthBar = this.scene.add.rectangle(
            -width/2 + padding,
            -30,
            width - padding * 2,
            height - padding * 2,
            0x00ff00
        );
        this.healthBar.setOrigin(0, 0.5);
        
        // 将血条添加为子对象
        this.add(this.healthBarBg);
        this.add(this.healthBar);
    }

    public takeDamage(damage: number): void {
        // 显示伤害数字
        this.showDamageNumber(damage);
        
        // 显示受击效果
        this.showHitEffect();
    }

    private showDamageNumber(damage: number): void {
        const text = this.scene.add.text(
            this.x,
            this.y - 40,
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
            alpha: 0.5,
            duration: 100,
            yoyo: true
        });

        // 显示受击特效
        const hitEmoji = this.scene.add.text(
            this.x,
            this.y,
            GameEmojis.effects.explosion,
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

    public castSkill(skillType: string): void {
        const skillEmoji = GameEmojis.skills[skillType as keyof typeof GameEmojis.skills] || '✨';
        const skillEffect = this.scene.add.text(
            this.x,
            this.y,
            skillEmoji,
            { fontSize: '32px' }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: skillEffect,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => skillEffect.destroy()
        });
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

    private updateHealthBar() {
        const healthPercentage = this.stats.hp / this.stats.maxHp;
        // TODO: 更新血条宽度
    }
} 