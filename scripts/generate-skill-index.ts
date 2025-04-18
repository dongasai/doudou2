import fs from 'fs'
import path from 'path'

interface SkillIndex {
  skills: {
    id: string
    name: string
    type: string
    targetType: string
    range: number
    cooldown: number
    emoji?: string
    description?: string
  }[]
}

async function generateSkillIndex() {
  const skillsDir = path.join(__dirname, '../DesignConfig/skill/json')
  const outputFile = path.join(__dirname, '../DesignConfig/skill/generate-skills-index.json')
  
  const files = fs.readdirSync(skillsDir)
  const skillIndex: SkillIndex = { skills: [] }

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    
    const filePath = path.join(skillsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const skillData = JSON.parse(content)

    skillIndex.skills.push({
      id: skillData.id,
      name: skillData.name,
      type: skillData.type,
      targetType: skillData.targetType,
      range: skillData.range,
      cooldown: skillData.cooldown,
      emoji: skillData.emoji,
      description: skillData.description
    })
  }

  fs.writeFileSync(outputFile, JSON.stringify(skillIndex, null, 2))
  console.log(`Successfully generated skill index at ${outputFile}`)
}

generateSkillIndex().catch(console.error)