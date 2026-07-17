/**
 * RSS 피드 생성기
 * 마크다운 메타데이터 → RSS XML 형식으로 변환
 */

/**
 * YAML 프론트매터 파싱
 * @param {string} markdown - 마크다운 텍스트
 * @returns {object} {metadata, content}
 */
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: markdown };

  const metadataStr = match[1];
  const content = match[2];

  // YAML 간단 파싱 (속성 수 적음)
  const metadata = {};
  metadataStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();

      // 배열 처리 [태그1, 태그2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }
      // 불린/숫자 처리
      else if (value === 'true') value = true;
      else if (value === 'false') value = false;

      metadata[key.trim()] = value;
    }
  });

  return { metadata, content };
}

/**
 * 마크다운을 평문 텍스트로 변환 (RSS 본문용)
 * @param {string} markdown - 마크다운 텍스트
 * @returns {string} 평문 텍스트 (최대 300자)
 */
function markdownToPlainText(markdown) {
  let text = markdown
    .replace(/^#+\s+/gm, '') // 제목 제거
    .replace(/\*{2,}(.*?)\*{2,}/g, '$1') // 굵은 텍스트
    .replace(/_{2,}(.*?)_{2,}/g, '$1') // 굵은 텍스트 (언더스코어)
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭
    .replace(/_(.*?)_/g, '$1') // 이탤릭 (언더스코어)
    .replace(/~~(.*?)~~/g, '$1') // 취소선
    .replace(/`{3}[\s\S]*?`{3}/g, '') // 코드 블록
    .replace(/`(.*?)`/g, '$1') // 인라인 코드
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크
    .replace(/^>\s+/gm, '') // 인용문
    .replace(/\n+/g, ' ') // 개행 → 공백
    .trim();

  // 최대 300자 + "..." 추가
  return text.length > 300 ? text.substring(0, 300) + '...' : text;
}

/**
 * XML 이스케이프 (XSS 방지)
 * @param {string} str - 이스케이프할 문자열
 * @returns {string} 이스케이프된 문자열
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * ISO 8601 날짜 형식으로 변환
 * @param {string} dateStr - YYYY-MM-DD 형식의 날짜
 * @returns {string} RFC 822 형식 (RSS 표준)
 */
function toRssDate(dateStr) {
  if (!dateStr) return new Date().toUTCString();

  const date = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(date)) return new Date().toUTCString();

  return date.toUTCString();
}

/**
 * RSS 피드 생성
 * @param {object} blogMeta - 블로그 메타데이터 {title, description, siteUrl, author}
 * @param {array} posts - 포스트 배열 [{filename, metadata, content}]
 * @returns {string} RSS XML 문자열
 */
function generateRssFeed(blogMeta, posts) {
  const {
    title = 'My Blog',
    description = 'A blog powered by Markdown',
    siteUrl = 'https://example.com',
    author = 'Admin'
  } = blogMeta;

  const lastBuildDate = new Date().toUTCString();

  // RSS 아이템 생성
  const items = posts
    .sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date)) // 최신순
    .map(post => {
      const {
        title: postTitle = 'Untitled',
        date = new Date().toISOString().split('T')[0],
        author: postAuthor = author,
        category = '',
        tags = []
      } = post.metadata;

      const slug = post.filename.replace(/\.md$/, '');
      const link = `${siteUrl}/blog.html?post=${slug}`;
      const description = markdownToPlainText(post.content);

      return `  <item>
    <title>${escapeXml(postTitle)}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="false">${escapeXml(link)}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${toRssDate(date)}</pubDate>
    <author>${escapeXml(postAuthor)}</author>
    ${category ? `<category>${escapeXml(category)}</category>` : ''}
    ${tags.length > 0 ? `<comments>${escapeXml(tags.join(', '))}</comments>` : ''}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>ko-kr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>my-blog RSS Generator</generator>
${items}
  </channel>
</rss>`;
}

// Node.js 환경에서 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseFrontmatter,
    markdownToPlainText,
    escapeXml,
    toRssDate,
    generateRssFeed
  };
}
