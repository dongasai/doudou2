const fs = require('fs');
const path = require('path');

/**
 * 配置文件同步脚本
 * 将服务端的配置文件同步到客户端
 */

// 源目录和目标目录配置
const CONFIG = {
    // 源目录（服务端配置文件目录）
    srcRoot: path.resolve(__dirname, '../src/data'),
    // 目标目录（客户端配置文件目录）
    destRoot: path.resolve(__dirname, '../client/src/data'),
    // 需要同步的配置文件类型
    extensions: ['.json', '.yaml', '.yml'],
    // 需要排除的目录或文件
    exclude: ['.git', 'node_modules', '.DS_Store']
};

/**
 * 确保目录存在，如果不存在则创建
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * 复制文件
 */
function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`✅ 已复制: ${path.relative(CONFIG.srcRoot, src)} -> ${path.relative(CONFIG.destRoot, dest)}`);
    } catch (error) {
        console.error(`❌ 复制失败: ${path.relative(CONFIG.srcRoot, src)}`, error.message);
    }
}

/**
 * 同步目录
 */
function syncDir(srcDir, destDir) {
    ensureDir(destDir);

    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
        // 跳过被排除的项目
        if (CONFIG.exclude.includes(item)) {
            return;
        }

        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // 如果是目录，递归同步
            syncDir(srcPath, destPath);
        } else if (stat.isFile()) {
            // 如果是文件，检查扩展名
            const ext = path.extname(item);
            if (CONFIG.extensions.includes(ext)) {
                copyFile(srcPath, destPath);
            }
        }
    });
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始同步配置文件...');
    
    try {
        // 检查源目录是否存在
        if (!fs.existsSync(CONFIG.srcRoot)) {
            throw new Error(`源目录不存在: ${CONFIG.srcRoot}`);
        }

        // 开始同步
        syncDir(CONFIG.srcRoot, CONFIG.destRoot);
        
        console.log('✨ 配置文件同步完成！');
    } catch (error) {
        console.error('❌ 同步失败:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main(); 