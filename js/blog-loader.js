/**
 * 개별 블로그 글 렌더링 로직
 * blog.html에서 사용됨
 */

class BlogLoader {
  constructor() {
    this.postsPath = './posts/';
  }

  /**
   * 블로그 로더 초기화
   */
  async init() {
    const postSlug = this.getPostSlugFromURL();

    if (!postSlug) {
      this.showError('블로그 글을 찾을 수 없습니다.');
      return;
    }

    try {
      const post = await this.loadPost(postSlug);
      if (post) {
        this.renderPost(post);
      } else {
        this.showError('블로그 글을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      this.showError('글을 불러오는 중 오류가 발생했습니다.');
    }
  }

  /**
   * URL 파라미터에서 post slug 추출
   */
  getPostSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
  }

  /**
   * 마크다운 파일 로드
   */
  async loadPost(slug) {
    const filename = `${slug}.md`;

    try {
      const response = await fetch(`${this.postsPath}${filename}`);
      if (!response.ok) {
        console.warn(`Post not found: ${filename}`);
        return null;
      }

      const markdown = await response.text();
      const { html, metadata } = parser.parse(markdown);

      return {
        slug,
        html,
        metadata: metadata || {}
      };
    } catch (error) {
      console.error(`Error loading post: ${filename}`, error);
      return null;
    }
  }

  /**
   * 블로그 글 렌더링
   */
  renderPost(post) {
    const container = document.getElementById('blogPost');
    if (!container) return;

    const { html, metadata } = post;
    const title = metadata.title || 'Untitled';
    const date = metadata.date ? this.formatDate(metadata.date) : '';
    const author = metadata.author || '';
    const category = metadata.category || '';

    // 페이지 제목 업데이트
    document.title = `${title} | my-blog`;

    // 헤더 렌더링
    let metaHtml = '';
    if (date || author || category) {
      const parts = [];
      if (date) parts.push(`<span class="post-meta-item">📅 ${this.escapeHtml(date)}</span>`);
      if (author) parts.push(`<span class="post-meta-item">✍️ ${this.escapeHtml(author)}</span>`);
      if (category) parts.push(`<span class="post-meta-item">📂 ${this.escapeHtml(category)}</span>`);

      metaHtml = `<div class="post-meta">${parts.join('')}</div>`;
    }

    // 콘텐츠 렌더링
    container.innerHTML = `
      <div class="post-header">
        <h1 class="post-title">${this.escapeHtml(title)}</h1>
        ${metaHtml}
      </div>
      <div class="post-content">
        ${html}
      </div>
    `;

    // 목차 생성 (선택사항)
    this.generateTableOfContents();
  }

  /**
   * 날짜 포맷팅
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * 목차 생성 (선택사항)
   * H2, H3 제목을 기반으로 목차 생성
   */
  generateTableOfContents() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>목차</h3><ul>';

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const level = heading.tagName === 'H2' ? 0 : 1;
      const indent = level > 0 ? 'style="margin-left: 1.5rem;"' : '';

      toc.innerHTML += `
        <li ${indent}>
          <a href="#${id}" style="text-decoration: none; color: var(--accent);">
            ${this.escapeHtml(heading.textContent)}
          </a>
        </li>
      `;
    });

    toc.innerHTML += '</ul>';

    // 맨 앞에 삽입
    content.insertBefore(toc, content.firstChild);

    // CSS 추가
    this.addTableOfContentsStyle();
  }

  /**
   * 목차 스타일 추가
   */
  addTableOfContentsStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .table-of-contents {
        background-color: var(--bg-secondary);
        border-left: 4px solid var(--accent);
        padding: var(--spacing-md);
        margin: var(--spacing-lg) 0;
        border-radius: 6px;
      }
      .table-of-contents h3 {
        margin-top: 0;
        font-size: 1rem;
      }
      .table-of-contents ul {
        list-style: none;
        margin: var(--spacing-sm) 0;
        padding: 0;
      }
      .table-of-contents li {
        margin: 0.5rem 0;
      }
      .table-of-contents a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 에러 메시지 표시
   */
  showError(message) {
    const container = document.getElementById('blogPost');
    if (container) {
      container.innerHTML = `
        <div class="post-header">
          <h1 class="post-title">오류</h1>
        </div>
        <p>${this.escapeHtml(message)}</p>
        <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
      `;
    }
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
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }
}

// 문서 로드 후 블로그 로더 초기화
document.addEventListener('DOMContentLoaded', () => {
  const loader = new BlogLoader();
  loader.init();
});
