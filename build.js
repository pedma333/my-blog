#!/usr/bin/env node

/**
 * RSS 피드 빌드 스크립트
 * posts/*.md 파일들을 읽어 feed.xml 생성
 *
 * 사용법: node build.js
 */

const fs = require('fs');
const path = require('path');

// RSS 생성기 함수 (js/rss-generator.js에서 복사)
const {
  parseFrontmatter,
  generateRssFeed
} = require('./js/rss-generator.js');

// 설정
const CONFIG = {
  postsDir: path.join(__dirname, 'posts'),
  outputFile: path.join(__dirname, 'feed.xml'),
  blogMeta: {
    title: 'my-blog',
    description: '마크다운으로 만드는 정적 블로그',
    siteUrl: 'https://example.com', // 배포 시 변경
    author: '관리자'
  }
};

/**
 * posts 디렉토리에서 모든 .md 파일 읽기
 */
function loadPosts() {
  try {
    const files = fs.readdirSync(CONFIG.postsDir)
      .filter(f => f.endsWith('.md'))
      .sort();

    console.log(`📖 Found ${files.length} posts`);

    return files.map(filename => {
      const filePath = path.join(CONFIG.postsDir, filename);
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const { metadata, content } = parseFrontmatter(markdown);

      return {
        filename,
        metadata,
        content
      };
    });
  } catch (error) {
    console.error('❌ Error reading posts:', error.message);
    process.exit(1);
  }
}

/**
 * RSS 피드 생성 및 저장
 */
function buildFeed() {
  const posts = loadPosts();

  if (posts.length === 0) {
    console.warn('⚠️  No posts found');
  }

  try {
    const rssFeed = generateRssFeed(CONFIG.blogMeta, posts);
    fs.writeFileSync(CONFIG.outputFile, rssFeed, 'utf-8');

    console.log(`✅ RSS feed generated: ${CONFIG.outputFile}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Size: ${(rssFeed.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Error generating feed:', error.message);
    process.exit(1);
  }
}

/**
 * 메인 실행
 */
if (require.main === module) {
  buildFeed();
}

module.exports = { loadPosts, buildFeed };
