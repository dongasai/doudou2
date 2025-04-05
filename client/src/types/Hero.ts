import type { Skill } from './Skill';

export type HeroType = '战士' | '法师' | '射手' | '辅助' | '刺客';

export type SkillType = '伤害' | '治疗' | '控制' | '增益' | '减益' | '召唤' | '位移' | '特殊';

export interface Stats {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
}

export interface BattleStats extends Stats {
    level: number;
    exp: number;
    gold: number;
    equippedItems: string[];
    learnedSkills: number[]; // 已学习技能的索引
}

export interface Hero {
    id: number;
    name: string;
    type: HeroType;
    style: '特长型' | '均衡型';
    specialty: string;
    skills: Skill[];
    stats: Stats;
    battleStats?: BattleStats; // 战斗临时状态
}

export interface HeroesList {
    heroes: Hero[];
}
