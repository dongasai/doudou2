import * as fs from 'fs';
import * as path from 'path';

interface StageIndex {
  stages: Record<string, {
    name: string;
    description: string;
    difficulty: number;
    background: string;
    availableHeroSlots: number;
    victoryCondition: string;
    defeatCondition: string;
  }>;
}

const STAGES_DIR = path.join(__dirname, '../DesignConfig/data/stage');
const OUTPUT_FILE = path.join(__dirname, '../DesignConfig/data/generate-stages-index.json');

async function generateStageIndex() {
  const files = fs.readdirSync(STAGES_DIR);
  const stages: Array<{
    id: string;
    name: string;
    description: string;
    difficulty: number;
    background: string;
    availableHeroSlots: number;
    victoryCondition: string;
    defeatCondition: string;
  }> = [];
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const filePath = path.join(STAGES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    stages.push({
      id: data.id,
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      background: data.background,
      availableHeroSlots: data.availableHeroSlots,
      victoryCondition: data.victoryCondition.type,
      defeatCondition: data.defeatCondition.type
    });
  }

  const index: StageIndex = {
    stages: {}
  };

  stages.forEach(stage => {
    index.stages[stage.id] = {
      name: stage.name,
      description: stage.description,
      difficulty: stage.difficulty,
      background: stage.background,
      availableHeroSlots: stage.availableHeroSlots,
      victoryCondition: stage.victoryCondition,
      defeatCondition: stage.defeatCondition
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Stage index generated at ${OUTPUT_FILE}`);
}

generateStageIndex().catch(console.error);