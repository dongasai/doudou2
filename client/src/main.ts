import 'phaser';
import { ConfigLoader } from './core/ConfigLoader';
import { MainMenuScene } from './scenes/MainMenuScene';
import { SelectScene } from './scenes/SelectScene';
import { BattleScene } from './scenes/BattleScene';

/**
 * 游戏主入口
 */
async function main() {
    try {
        // 加载游戏配置
        await ConfigLoader.getInstance().loadAllConfigs();

        // 创建游戏实例
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 390,  // iPhone 12/13/14 的标准宽度
            height: 844, // iPhone 12/13/14 的标准高度
            parent: 'game',
            backgroundColor: '#000000',
            scene: [MainMenuScene, SelectScene, BattleScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: 'game',
                width: 390,
                height: 844
            }
        };

        new Phaser.Game(config);
    } catch (error) {
        console.error('游戏初始化失败:', error);
    }
}

// 启动游戏
main(); 