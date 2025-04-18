const path = require('path');
const {
    CONFIG: BASE_CONFIG,
    ensureDir,
    copyFile,
    syncDir
} = require('./sync-utils');

/**
 * 客户端配置文件反向同步脚本
 * 将客户端的配置文件同步回服务端
 */

// 扩展基础配置
const CONFIG = {
    ...BASE_CONFIG,
    // 源目录配置（客户端）
    src: {
        data: path.resolve(__dirname, '../client/DesignConfig/data'),
        types: path.resolve(__dirname, '../client/DesignConfig/types'),
        docs: path.resolve(__dirname, '../client')
    },
    // 目标目录配置（服务端）
    dest: {
        data: path.resolve(__dirname, '../DesignConfig/data'),
        types: path.resolve(__dirname, '../DesignConfig/types'),
        docs: path.resolve(__dirname, '..')
    },
    // 特定文件映射
    fileMappings: [
        {
            src: 'GAME.md',
            dest: 'README.md'
        }
    ]
};

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