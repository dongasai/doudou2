const fs = require('fs');
const path = require('path');
const {
    CONFIG: BASE_CONFIG,
    ensureDir,
    copyFile,
    syncDir
} = require('./sync-utils');

/**
 * 配置文件同步脚本
 * 将服务端的配置文件同步到客户端
 */

// 扩展基础配置
const CONFIG = {
    ...BASE_CONFIG,
    // 源目录配置
    src: {
        data: path.resolve(__dirname, '../DesignConfig/data'),
        types: path.resolve(__dirname, '../DesignConfig/types'),
        skill: path.resolve(__dirname, '../DesignConfig/skill'),

        docs: path.resolve(__dirname, '..')
    },
    // 目标目录配置
    dest: {
        data: path.resolve(__dirname, '../vue/src/DesignConfig/data'),
        types: path.resolve(__dirname, '../vue/src/DesignConfig/types'),
        skill: path.resolve(__dirname, '../vue/src/DesignConfig/skill')

    },
    // 特定文件映射
    fileMappings: [
        {
            src: 'README.md',
            dest: 'GAME.md'
        }
    ]
};

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始同步文件...');
    
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
        // 同步 Skill 文件
        if (fs.existsSync(CONFIG.src.skill)) {
            console.log('\n📂 同步类型文件...');
            syncDir(CONFIG.src.skill, CONFIG.dest.skill, CONFIG.extensions.skill);
        } else {
            console.warn(`⚠️ 类型源目录不存在: ${CONFIG.src.skill}`);
        }

        // 同步特定映射文件
        console.log('\n📄 同步特定文件...');

        
        console.log('\n✨ 文件同步完成！');
    } catch (error) {
        console.error('❌ 同步失败:', error.message);
        process.exit(1);
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

// 执行主函数
main(); 