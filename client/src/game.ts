import 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { BattleScene } from './scenes/BattleScene';

// 游戏配置
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 390,  // iPhone 12/13/14 的标准宽度
    height: 844, // iPhone 12/13/14 的标准高度
    parent: 'game',
    backgroundColor: '#000000',
    scene: [MainMenuScene, BattleScene],
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

// 创建游戏实例
export const game = new Phaser.Game(config); 