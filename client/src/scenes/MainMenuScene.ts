import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
    private emojis: Phaser.GameObjects.Text[] = [];

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create(): void {
        // 创建标题
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            '豆豆大作战 🎮',
            {
                fontSize: '64px',
                color: '#ffffff',
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
            }
        ).setOrigin(0.5);

        // 创建开始按钮
        const startButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            '开始游戏 ▶️',
            {
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#4CAF50',
                padding: { x: 20, y: 10 },
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
            }
        )
        .setOrigin(0.5)
        .setInteractive();

        // 添加按钮悬停效果
        startButton.on('pointerover', () => {
            startButton.setStyle({ color: '#4CAF50', backgroundColor: '#ffffff' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ color: '#ffffff', backgroundColor: '#4CAF50' });
        });

        // 添加点击事件
        startButton.on('pointerdown', () => {
            this.scene.start('BattleScene');
        });

        // 添加版本号
        this.add.text(
            10,
            this.cameras.main.height - 30,
            'v1.0.0 🎯',
            {
                fontSize: '16px',
                color: '#999999',
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
            }
        );

        // 添加装饰性 Emoji
        this.createEmojiDecorations();
    }

    private createEmojiDecorations(): void {
        const decorativeEmojis = ['🎮', '🎯', '🎪', '✨', '🌟', '💫', '🎲', '🎨'];
        
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const emoji = decorativeEmojis[Phaser.Math.Between(0, decorativeEmojis.length - 1)];
            
            const emojiText = this.add.text(x, y, emoji, {
                fontSize: '24px'
            }).setAlpha(0.3);
            
            this.emojis.push(emojiText);
            
            // 添加浮动动画
            this.tweens.add({
                targets: emojiText,
                y: y - 20,
                alpha: 0.1,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1
            });
        }
    }
} 