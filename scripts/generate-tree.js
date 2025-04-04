const fs = require('fs');
const path = require('path');

// 需要忽略的目录和文件
const IGNORE_DIRS = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage'
];

// 只关注的文件扩展名
const CODE_EXTENSIONS = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.vue',
    '.proto'
];

function generateTree(dir, prefix = '', isLast = true) {
    let output = '';
    const files = fs.readdirSync(dir);
    const filteredFiles = files.filter(file => {
        const fullPath = path.join(dir, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        if (isDirectory) {
            return !IGNORE_DIRS.includes(file);
        }
        return CODE_EXTENSIONS.includes(path.extname(file));
    });

    filteredFiles.forEach((file, index) => {
        const isLastItem = index === filteredFiles.length - 1;
        const fullPath = path.join(dir, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        const connector = isLastItem ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        if (isDirectory) {
            output += `${prefix}${connector}📂 ${file}\n`;
            output += generateTree(fullPath, newPrefix, isLastItem);
        } else {
            output += `${prefix}${connector}📄 ${file}\n`;
        }
    });

    return output;
}

function main() {
    const rootDir = path.resolve(__dirname, '..');
    const treeContent = `# 项目代码文件结构\n\n\`\`\`\n${generateTree(rootDir)}\`\`\`\n`;
    fs.writeFileSync(path.join(rootDir, 'CODE_TREE.md'), treeContent);
    console.log('代码树已生成到 CODE_TREE.md');
}

main(); 