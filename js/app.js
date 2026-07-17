/**
 * my-blog 메인 앱 로직
 * 블로그 글 목록 렌더링 (index.html)
 */

class BlogApp {
  constructor() {
    this.posts = [];
    // GitHub Pages와 로컬 환경 모두 지원
    const isGitHub = window.location.hostname.includes('github');
    this.postsPath = isGitHub ? '/my-blog/posts/' : './posts/';
  }

  /**
   * 앱 초기화
   */
  async init() {
    await this.loadPosts();
    this.renderBlogGrid();
  }

  /**
   * posts 디렉토리의 마크다운 파일 목록 가져오기
   * 제한: fetch API는 디렉토리 리스팅을 지원하지 않음
   * 해결책: 사전에 정의된 파일 목록 또는 manifest.json 사용
   */
  async loadPosts() {
    // 수동 파일 목록 정의 (또는 manifest.json에서 로드)
    const postFiles = await this.getPostFileList();

    for (const filename of postFiles) {
      try {
        const post = await this.loadPost(filename);
        if (post) {
          this.posts.push(post);
        }
      } catch (error) {
        console.error(`Failed to load post: ${filename}`, error);
      }
    }

    // 날짜순으로 정렬 (최신순)
    this.posts.sort((a, b) => {
      const dateA = new Date(a.metadata?.date || 0);
      const dateB = new Date(b.metadata?.date || 0);
      return dateB - dateA;
    });
  }

  /**
   * 마크다운 파일 목록 가져오기
   * 실제 프로젝트에서는 manifest.json이나 서버 API 사용 권장
   */
  async getPostFileList() {
    try {
      // manifest.json에서 파일 목록 로드 시도
      const response = await fetch('./posts/manifest.json');
      if (response.ok) {
        const data = await response.json();
        return data.files || [];
      }
    } catch (error) {
      console.warn('manifest.json not found, using default files');
    }

    // 기본값: 알려진 파일들 반환
    return ['welcome.md', 'example.md'];
  }

  /**
   * 마크다운 파일 로드 및 파싱
   */
  async loadPost(filename) {
    try {
      const response = await fetch(`${this.postsPath}${filename}`);
      if (!response.ok) {
        console.warn(`Post not found: ${filename}`);
        return null;
      }

      const markdown = await response.text();
      const { html, metadata } = parser.parse(markdown);

      return {
        filename,
        slug: filename.replace('.md', ''),
        html,
        metadata: metadata || {}
      };
    } catch (error) {
      console.error(`Error loading post: ${filename}`, error);
      return null;
    }
  }

  /**
   * 블로그 그리드 렌더링
   */
  renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    if (this.posts.length === 0) {
      grid.innerHTML = '<div class="text-center" style="grid-column: 1 / -1; padding: 2rem;"><p>아직 블로그 글이 없습니다.</p></div>';
      return;
    }

    grid.innerHTML = this.posts.map(post => this.createPostCard(post)).join('');
  }

  /**
   * 블로그 카드 HTML 생성
   */
  createPostCard(post) {
    const { slug, metadata, html } = post;
    const title = metadata.title || '제목 없음';
    const date = metadata.date ? new Date(metadata.date).toLocaleDateString('ko-KR') : '날짜 없음';
    const author = metadata.author || '';
    const tags = metadata.tags || [];

    // 첫 번째 문단을 요약으로 사용
    const excerptMatch = html.match(/<p>(.*?)<\/p>/);
    const excerpt = excerptMatch ? this.stripHtml(excerptMatch[1]).substring(0, 120) + '...' : '';

    const tagsHtml = tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('');

    return `
      <a href="blog.html?post=${encodeURIComponent(slug)}" class="blog-card">
        <h2 class="blog-card-title">${this.escapeHtml(title)}</h2>
        <div class="blog-card-meta">
          <span>📅 ${date}</span>
          ${author ? `<span>✍️ ${this.escapeHtml(author)}</span>` : ''}
        </div>
        <p class="blog-card-excerpt">${excerpt}</p>
        ${tagsHtml ? `<div class="blog-card-tags">${tagsHtml}</div>` : ''}
      </a>
    `;
  }

  /**
   * HTML 태그 제거 (요약용)
   */
  stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * HTML 이스케이프
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// 문서 로드 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  const app = new BlogApp();
  app.init();
});
