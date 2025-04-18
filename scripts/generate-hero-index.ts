import * as fs from 'fs';
import * as path from 'path';
import type { Hero } from 'DesignConfig/types/GameHero';

interface HeroIndex {
  heroes: Omit<Hero, 'skills' | 'stats' | 'battleStats'>[];
  byId: Record<number, Omit<Hero, 'skills' | 'stats' | 'battleStats'>>;
  byType: Record<string, Omit<Hero, 'skills' | 'stats' | 'battleStats'>[]>;
  byStyle: Record<string, Omit<Hero, 'skills' | 'stats' | 'battleStats'>[]>;
}


const HEROES_DIR = path.join(__dirname, '../DesignConfig/data/heroes');
const OUTPUT_FILE = path.join(__dirname, '../DesignConfig/data/generate-heroes-index.json');

async function generateHeroIndex() {
  const files = fs.readdirSync(HEROES_DIR);
  const heroes: Hero[] = [];
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(HEROES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    heroes.push({
      id: data.id,
      name: data.name,
      emoji: data.emoji,
      type: data.type,
      style: data.style,
      specialty: data.specialty,
      skills: [] // 添加空数组以满足接口要求
    });
  }

  const index: HeroIndex = {
    heroes,
    byId: {},
    byType: {},
    byStyle: {}
  };

  // Build indexes
  heroes.forEach(hero => {
    index.byId[hero.id] = hero;
    
    if (!index.byType[hero.type]) {
      index.byType[hero.type] = [];
    }
    index.byType[hero.type].push(hero);
    
    if (!index.byStyle[hero.style]) {
      index.byStyle[hero.style] = [];
    }
    index.byStyle[hero.style].push(hero);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Hero index generated at ${OUTPUT_FILE}`);
}

generateHeroIndex().catch(console.error);