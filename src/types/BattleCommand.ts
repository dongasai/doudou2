/**
 * 战斗指令类型
 */
export type BattleCommandType = 
  | 'learnSkill'    // 学习技能
  | 'changePosition' // 更换位置
  | 'useItem'       // 使用道具
  | 'castSkill';    // 施放技能

/**
 * 基础战斗指令接口
 */
export interface BaseBattleCommand {
  /** 生效帧号(每秒10帧) */
  frame: number;
  /** 玩家ID */
  playerId: string;
  /** 指令类型 */
  type: BattleCommandType;
}

/**
 * 学习技能指令
 */
export interface LearnSkillCommand extends BaseBattleCommand {
  type: 'learnSkill';
  data: {
    heroId: number;    // 英雄ID
    skillId: number;   // 技能ID  
  };
}

/**
 * 更换位置指令 
 */
export interface ChangePositionCommand extends BaseBattleCommand {
  type: 'changePosition';
  data: {
    heroId: number;    // 英雄ID
    newPos: number;    // 新位置(1-5)
  };
}

/**
 * 战斗指令联合类型
 */
export type BattleCommand = 
  | LearnSkillCommand
  | ChangePositionCommand;