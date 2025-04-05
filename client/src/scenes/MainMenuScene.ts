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
            this.cameras.main.height * 0.2, // 调整到屏幕顶部20%位置
            '豆豆大作战 🎮',
            {
                fontSize: '40px', // 减小字体大小
                color: '#ffffff',
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
            }
        ).setOrigin(0.5);

        // 创建开始按钮
        const startButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.5, // 调整到屏幕中间
            '开始游戏 ▶️',
            {
                fontSize: '28px', // 减小字体大小
                color: '#ffffff',
                backgroundColor: '#4CAF50',
                padding: { x: 30, y: 15 }, // 增加按钮内边距
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
            this.scene.start('SelectScene');
        });

        // 添加版本号
        this.add.text(
            10,
            this.cameras.main.height - 40,
            'v1.0.0 🎯',
            {
                fontSize: '14px', // 减小字体大小
                color: '#999999',
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif'
            }
        );

        // 添加装饰性 Emoji
        this.createEmojiDecorations();
    }

    private createEmojiDecorations(): void {
        const decorativeEmojis = ['🎮', '🎯', '🎪', '✨', '🌟', '💫', '🎲', '🎨'];
        
        for (let i = 0; i < 15; i++) { // 减少装饰性emoji的数量
            const x = Phaser.Math.Between(20, this.cameras.main.width - 20); // 添加边距
            const y = Phaser.Math.Between(20, this.cameras.main.height - 20); // 添加边距
            const emoji = decorativeEmojis[Phaser.Math.Between(0, decorativeEmojis.length - 1)];
            
            const emojiText = this.add.text(x, y, emoji, {
                fontSize: '20px' // 减小emoji大小
            }).setAlpha(0.3);
            
            this.emojis.push(emojiText);
            
            // 添加浮动动画
            this.tweens.add({
                targets: emojiText,
                y: y - 15, // 减小浮动距离
                alpha: 0.1,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1
            });
        }
    }
} 