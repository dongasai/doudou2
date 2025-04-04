import 'phaser';
import { ConfigLoader } from './core/ConfigLoader';
import { BattleScene } from './scenes/BattleScene';

/**
 * 游戏主入口
 */
async function main() {
    try {
        // 加载游戏配置
        await ConfigLoader.getInstance().loadAllConfigs();

        // 创建游戏实例
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: BattleScene
        };

        new Phaser.Game(config);
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
}

// 启动游戏
main(); 