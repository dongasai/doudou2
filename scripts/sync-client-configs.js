const fs = require('fs');
const path = require('path');

/**
 * 客户端配置文件反向同步脚本
 * 将客户端的配置文件同步回服务端
 */

// 源目录和目标目录配置（与sync-configs.js相反）
const CONFIG = {
    // 源目录配置（客户端）
    src: {
        data: path.resolve(__dirname, '../client/src/data'),
        types: path.resolve(__dirname, '../client/src/types'),
        docs: path.resolve(__dirname, '../client')
    },
    // 目标目录配置（服务端）
    dest: {
        data: path.resolve(__dirname, '../src/data'),
        types: path.resolve(__dirname, '../src/types'),
        docs: path.resolve(__dirname, '..')
    },
    // 需要同步的文件类型
    extensions: {
        data: ['.json', '.yaml', '.yml'],
        types: ['.ts']
    },
    // 特定文件映射
    fileMappings: [
        {
            src: 'GAME.md',
            dest: 'README.md'
        }
    ],
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
        // 确保目标目录存在
        ensureDir(path.dirname(dest));
        
        // 验证路径
        if (!fs.existsSync(src)) {
            throw new Error(`源文件不存在: ${src}`);
        }

        fs.copyFileSync(src, dest);
        console.log(`✅ 已复制: ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`);
    } catch (error) {
        console.error(`❌ 复制失败: ${path.relative(process.cwd(), src)}`, error.message);
        throw error;
    }
}

/**
 * 同步目录
 */
function syncDir(srcDir, destDir, extensions) {
    try {
        // 验证源目录
        if (!fs.existsSync(srcDir)) {
            console.warn(`⚠️ 源目录不存在: ${srcDir}`);
            return;
        }

        ensureDir(destDir);
        const items = fs.readdirSync(srcDir);

        items.forEach(item => {
            // 跳过被排除的项目
            if (CONFIG.exclude.includes(item)) {
                return;
            }

            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);
            
            try {
                const stat = fs.statSync(srcPath);

                if (stat.isDirectory()) {
                    // 如果是目录，递归同步
                    syncDir(srcPath, destPath, extensions);
                } else if (stat.isFile()) {
                    // 如果是文件，检查扩展名
                    const ext = path.extname(item);
                    if (extensions.includes(ext)) {
                        copyFile(srcPath, destPath);
                    }
                }
            } catch (error) {
                console.error(`❌ 处理项目失败: ${item}`, error.message);
            }
        });
    } catch (error) {
        console.error(`❌ 同步目录失败: ${srcDir}`, error.message);
    }
}

/**
 * 同步特定映射的文件
 */
function syncMappedFiles() {
    CONFIG.fileMappings.forEach(mapping => {
        const srcPath = path.join(CONFIG.src.docs, mapping.src);
        const destPath = path.join(CONFIG.dest.docs, mapping.dest);
        
        if (fs.existsSync(srcPath)) {
            copyFile(srcPath, destPath);
        } else {
            console.warn(`⚠️ 源文件不存在: ${srcPath}`);
        }
    });
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始从客户端反向同步文件...');
    
    try {
        // 同步数据文件
        if (fs.existsSync(CONFIG.src.data)) {
            console.log('\n📂 同步数据文件...');
            syncDir(CONFIG.src.data, CONFIG.dest.data, CONFIG.extensions.data);
        } else {
            console.warn(`⚠️ 数据源目录不存在: ${CONFIG.src.data}`);
        }

        // 同步类型文件
        if (fs.existsSync(CONFIG.src.types)) {
            console.log('\n📂 同步类型文件...');
            syncDir(CONFIG.src.types, CONFIG.dest.types, CONFIG.extensions.types);
        } else {
            console.warn(`⚠️ 类型源目录不存在: ${CONFIG.src.types}`);
        }

        // 同步特定映射文件
        console.log('\n📄 同步特定文件...');
        syncMappedFiles();
        
        console.log('\n✨ 文件反向同步完成！');
    } catch (error) {
        console.error('❌ 同步失败:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main();