const fs = require('fs');
const path = require('path');

// 公共配置
const CONFIG = {
    // 需要同步的文件类型
    extensions: {
        data: ['.json', '.yaml', '.yml'],
        types: ['.ts']
    },
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
        ensureDir(path.dirname(dest));
        
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
        if (!fs.existsSync(srcDir)) {
            console.warn(`⚠️ 源目录不存在: ${srcDir}`);
            return;
        }

        ensureDir(destDir);
        const items = fs.readdirSync(srcDir);

        items.forEach(item => {
            if (CONFIG.exclude.includes(item)) {
                return;
            }

            const srcPath = path.join(srcDir, item);
            const destPath = path.join(destDir, item);
            
            try {
                const stat = fs.statSync(srcPath);

                if (stat.isDirectory()) {
                    syncDir(srcPath, destPath, extensions);
                } else if (stat.isFile()) {
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

module.exports = {
    CONFIG,
    ensureDir,
    copyFile,
    syncDir
};