import * as fs from 'fs';
import * as path from 'path';
import { LevelIndex } from '../src/types/Level';

const LEVELS_DIR = path.join(__dirname, '../src/data/level-1');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generate-levels-index.json');

async function generateLevelIndex() {
  const files = fs.readdirSync(LEVELS_DIR);
  const levels: LevelIndex['levels'] = [];
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(LEVELS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const id = file.replace('.json', '');
    levels.push({
      id,
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      background: data.background,
      availableHeroSlots: data.availableHeroSlots,
      victoryCondition: data.victoryCondition.type,
      defeatCondition: data.defeatCondition.type
    });
  }

  const index: LevelIndex = {
    levels,
    byDifficulty: {},
    byBackground: {},
    byVictoryCondition: {}
  };

  // Build indexes
  levels.forEach(level => {
    // By difficulty
    const difficultyKey = Math.floor(level.difficulty).toString();
    if (!index.byDifficulty[difficultyKey]) {
      index.byDifficulty[difficultyKey] = [];
    }
    index.byDifficulty[difficultyKey].push({
      id: level.id,
      name: level.name,
      description: level.description,
      difficulty: level.difficulty
    });

    // By background
    if (!index.byBackground[level.background]) {
      index.byBackground[level.background] = [];
    }
    index.byBackground[level.background].push({
      id: level.id,
      name: level.name,
      description: level.description,
      background: level.background
    });

    // By victory condition
    if (!index.byVictoryCondition[level.victoryCondition]) {
      index.byVictoryCondition[level.victoryCondition] = [];
    }
    index.byVictoryCondition[level.victoryCondition].push({
      id: level.id,
      name: level.name,
      description: level.description,
      victoryCondition: level.victoryCondition
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Level index generated at ${OUTPUT_FILE}`);
}

generateLevelIndex().catch(console.error);