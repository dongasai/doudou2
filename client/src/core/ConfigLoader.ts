/**
 * 游戏配置加载器
 * 负责加载和管理游戏中的各种配置数据
 */
export class ConfigLoader {
    private static instance: ConfigLoader;
    private heroesConfig: any;
    private beansConfig: any;

    private constructor() {
        // 私有构造函数，使用单例模式
    }

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
            this.loadHeroesConfig(),
            this.loadBeansConfig()
        ]);
    }

    /**
     * 加载英雄配置
     */
    private async loadHeroesConfig(): Promise<void> {
        try {
            const response = await fetch('/src/data/heroes-1.json');
            this.heroesConfig = await response.json();
        } catch (error) {
            console.error('加载英雄配置失败:', error);
            throw error;
        }
    }

    /**
     * 加载豆豆配置
     */
    private async loadBeansConfig(): Promise<void> {
        try {
            const response = await fetch('/src/data/beans.json');
            this.beansConfig = await response.json();
        } catch (error) {
            console.error('加载豆豆配置失败:', error);
            throw error;
        }
    }

    /**
     * 获取英雄配置
     * @param heroId - 英雄ID
     */
    public getHeroConfig(heroId: number): any {
        if (!this.heroesConfig) {
            throw new Error('英雄配置尚未加载');
        }
        return this.heroesConfig.heroes.find((hero: any) => hero.id === heroId);
    }

    /**
     * 获取所有英雄配置
     */
    public getAllHeroConfigs(): any[] {
        if (!this.heroesConfig) {
            throw new Error('英雄配置尚未加载');
        }
        return this.heroesConfig.heroes;
    }

    /**
     * 获取豆豆配置
     * @param beanId - 豆豆ID
     */
    public getBeanConfig(beanId: number): any {
        if (!this.beansConfig) {
            throw new Error('豆豆配置尚未加载');
        }
        return this.beansConfig.beans.find((bean: any) => bean.id === beanId);
    }

    /**
     * 获取所有豆豆配置
     */
    public getAllBeanConfigs(): any[] {
        if (!this.beansConfig) {
            throw new Error('豆豆配置尚未加载');
        }
        return this.beansConfig.beans;
    }
} 