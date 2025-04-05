/**
 * 游戏配置加载器
 * 负责加载和管理游戏中的各种配置数据
 */
export interface HeroConfig {
    id: number;
    name: string;
    type: string;
    style: string;
    specialty: string;
    skills: {
        name: string;
        type: string;
        description: string;
        cooldown: number;
        cost: number;
    }[];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
}

export interface LevelConfig {
    name: string;
    description: string;
    difficulty: number;
    crystal: {
        maxHp: number;
    };
    beanRatios: {
        type: string;
        weight: number;
    }[];
    totalBeans: number;
    spawnInterval: number;
    attrFactors: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
    victoryCondition: {
        type: string;
    };
    defeatCondition: {
        type: string;
    };
    background: string;
    availableHeroSlots: number;
}

export class ConfigLoader {
    private static instance: ConfigLoader;
    private heroes: Map<number, HeroConfig> = new Map();
    private levels: Map<number, LevelConfig> = new Map();

    private constructor() {}

    /**
     * 获取配置加载器实例
     */
    public static getInstance(): ConfigLoader {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = new ConfigLoader();
        }
        return ConfigLoader.instance;
    }

    /**
     * 加载所有配置
     */
    public async loadAllConfigs(): Promise<void> {
        await Promise.all([
            this.loadHeroes(),
            this.loadLevels()
        ]);
    }

    private async loadHeroes(): Promise<void> {
        try {
            for (let i = 1; i <= 30; i++) {
                const response = await fetch(`/src/data/heroes/${i}.json`);
                if (response.ok) {
                    const hero = await response.json();
                    this.heroes.set(hero.id, hero);
                }
            }
        } catch (error) {
            console.error('加载英雄配置失败:', error);
        }
    }

    private async loadLevels(): Promise<void> {
        try {
            for (let i = 1; i <= 10; i++) {
                const response = await fetch(`/src/data/level-1/level-1-${i}.json`);
                if (response.ok) {
                    const level = await response.json();
                    this.levels.set(i, level);
                }
            }
        } catch (error) {
            console.error('加载关卡配置失败:', error);
        }
    }

    public getHero(id: number): HeroConfig | undefined {
        return this.heroes.get(id);
    }

    public getAllHeroes(): HeroConfig[] {
        return Array.from(this.heroes.values());
    }

    public getLevel(id: number): LevelConfig | undefined {
        return this.levels.get(id);
    }

    public getAllLevels(): LevelConfig[] {
        return Array.from(this.levels.values());
    }
} 
} 