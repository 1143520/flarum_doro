/**
 * 生成emoji代码点到实际文件名的映射
 * 
 * 使用方法:
 * 1. 安装依赖: npm install node-fetch
 * 2. 运行脚本: node generate-emoji-map.js
 * 3. 将生成的emoji-map.json上传到您的仓库根目录
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// 配置
const REPO_URL = 'https://api.github.com/repos/1143520/doro/contents/loop';
const OUTPUT_FILE = 'emoji-map.json';

// 标准emoji代码点列表 (从twemoji库获取)
async function getTwemojiList() {
  try {
    const response = await fetch('https://unpkg.com/@twemoji/api@latest/dist/twemoji.esm.js');
    const text = await response.text();
    
    // 提取twemoji.js中的emoji列表
    const regexMatch = text.match(/emojisList\s*=\s*{([^}]*)}/);
    if (!regexMatch) {
      console.error('无法从twemoji库中提取emoji列表');
      return {};
    }
    
    // 解析emoji列表
    const emojiListStr = '{' + regexMatch[1] + '}';
    // 安全地执行字符串为对象
    const emojiList = eval('(' + emojiListStr + ')');
    
    return emojiList;
  } catch (error) {
    console.error('获取twemoji列表失败:', error);
    return {};
  }
}

// 获取仓库中的文件列表
async function getRepoFiles() {
  try {
    const response = await fetch(REPO_URL);
    const files = await response.json();
    
    if (!Array.isArray(files)) {
      console.error('获取仓库文件列表失败:', files.message || '未知错误');
      return [];
    }
    
    return files
      .filter(file => file.type === 'file' && file.name.endsWith('.gif'))
      .map(file => file.name);
  } catch (error) {
    console.error('获取仓库文件列表失败:', error);
    return [];
  }
}

// 生成映射
async function generateMapping() {
  // 获取标准emoji列表
  const emojiList = await getTwemojiList();
  
  // 获取仓库文件列表
  const repoFiles = await getRepoFiles();
  console.log(`仓库中找到 ${repoFiles.length} 个GIF文件`);
  
  // 创建映射
  const mapping = {};
  
  // 方法1: 尝试直接匹配文件名与代码点
  for (const codePoint in emojiList) {
    const fileName = `${codePoint}.gif`;
    if (repoFiles.includes(fileName)) {
      mapping[codePoint] = fileName.replace('.gif', '');
    }
  }
  
  // 方法2: 尝试模糊匹配
  for (const codePoint in emojiList) {
    if (mapping[codePoint]) continue;
    
    // 尝试找到包含代码点的文件名
    const matchingFile = repoFiles.find(file => {
      const baseName = file.replace('.gif', '');
      return baseName.includes(codePoint) || codePoint.includes(baseName);
    });
    
    if (matchingFile) {
      mapping[codePoint] = matchingFile.replace('.gif', '');
    }
  }
  
  // 方法3: 使用文件名的数字部分
  const unmappedCodePoints = Object.keys(emojiList).filter(cp => !mapping[cp]);
  const unmappedFiles = repoFiles.filter(file => {
    const baseName = file.replace('.gif', '');
    return !Object.values(mapping).includes(baseName);
  });
  
  console.log(`未映射的emoji代码点: ${unmappedCodePoints.length}`);
  console.log(`未映射的文件: ${unmappedFiles.length}`);
  
  // 保存映射
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));
  console.log(`映射已保存到 ${OUTPUT_FILE}`);
  console.log(`成功映射 ${Object.keys(mapping).length} 个emoji`);
  
  // 输出一些未映射的示例，帮助手动映射
  console.log('\n未映射的emoji代码点示例:');
  unmappedCodePoints.slice(0, 10).forEach(cp => console.log(cp));
  
  console.log('\n未映射的文件示例:');
  unmappedFiles.slice(0, 10).forEach(file => console.log(file));
}

// 运行
generateMapping().catch(console.error); 