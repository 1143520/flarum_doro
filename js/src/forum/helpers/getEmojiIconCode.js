/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */ /*
  https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/

import twemoji from '@twemoji/api';
import app from 'flarum/forum/app';

// avoid using a string literal like '\u200D' here because minifiers expand it inline
const U200D = String.fromCharCode(0x200d);

// avoid runtime RegExp creation for not so smart,
// not JIT based, and old browsers / engines
const UFE0Fg = /\uFE0F/g;

// 自定义映射表，用于存储emoji代码点到实际文件名的映射
let customEmojiMap = null;
let isMapLoaded = false;

/**
 * 加载自定义emoji映射
 */
async function loadCustomEmojiMap() {
  if (isMapLoaded) return;
  
  try {
    // 获取配置的base URL
    const baseUrl = app.forum.attribute("flarum-twemoji.base");
    if (!baseUrl) return;
    
    // 构建映射文件URL (假设在仓库根目录有一个emoji-map.json文件)
    const mapUrl = baseUrl.replace('/loop', '') + 'emoji-map.json';
    
    // 尝试加载映射文件
    const response = await fetch(mapUrl);
    if (response.ok) {
      customEmojiMap = await response.json();
    }
  } catch (error) {
    console.error('Failed to load custom emoji map:', error);
  } finally {
    isMapLoaded = true;
  }
}

/**
 * Used to both remove the possible variant
 *  and to convert utf16 into code points.
 *  If there is a zero-width-joiner (U+200D), leave the variants in.
 * @param   string    the raw text of the emoji match
 * @return  string    the code point or custom filename
 */
export default function getEmojiIconCode(emoji) {
  // 如果启用了"使用表情符号作为文件名"选项，直接返回表情符号
  if (app.forum.attribute("flarum-twemoji.use_emoji_as_filename") === '1') {
    return emoji;
  }
  
  // 加载自定义映射(如果尚未加载)
  if (!isMapLoaded) {
    loadCustomEmojiMap();
  }
  
  // 获取标准代码点
  const codePoint = twemoji.convert.toCodePoint(emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji);
  
  // 如果有自定义映射，使用映射的文件名
  if (customEmojiMap && customEmojiMap[codePoint]) {
    return customEmojiMap[codePoint];
  }
  
  return codePoint;
}
