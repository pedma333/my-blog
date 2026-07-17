/**
 * 다크모드 테마 관리
 * CSS 변수 + 로컬스토리지 + prefers-color-scheme 통합
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'theme-preference';
    this.themes = ['auto', 'light', 'dark'];
    this.init();
  }

  /**
   * 초기화: OS 설정 또는 저장된 선택지 적용
   */
  init() {
    // 저장된 선택지 확인
    const saved = this.getSavedTheme();

    if (saved) {
      this.setTheme(saved);
    } else {
      // OS 설정 자동 감지
      this.setTheme('auto');
      this.syncWithOS();
    }

    // 이벤트 리스너 등록
    this.setupListeners();
  }

  /**
   * 로컬스토리지에서 저장된 테마 가져오기
   */
  getSavedTheme() {
    return localStorage.getItem(this.storageKey);
  }

  /**
   * 테마 설정
   */
  setTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    const html = document.documentElement;
    html.setAttribute('data-theme', theme);

    // OS 설정 감지 (auto 모드)
    if (theme === 'auto') {
      this.syncWithOS();
    } else {
      localStorage.setItem(this.storageKey, theme);
    }

    this.updateThemeIcon();
  }

  /**
   * OS 설정과 동기화 (prefers-color-scheme)
   */
  syncWithOS() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const actualTheme = prefersDark ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', actualTheme);
    this.updateThemeIcon();

    // OS 설정 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const saved = this.getSavedTheme();
      if (!saved || saved === 'auto') {
        this.syncWithOS();
      }
    });
  }

  /**
   * 테마 아이콘 업데이트
   */
  updateThemeIcon() {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;

    const html = document.documentElement;
    const theme = html.getAttribute('data-theme');

    // auto 모드일 때는 OS 설정 기준
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      icon.textContent = prefersDark ? '☀️' : '🌙';
    } else {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * 테마 토글 (light ↔ dark)
   */
  toggle() {
    const html = document.documentElement;
    let currentTheme = html.getAttribute('data-theme');

    // auto 모드면 실제 적용된 테마 확인
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }

    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  /**
   * 이벤트 리스너 설정
   */
  setupListeners() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }
  }

  /**
   * 현재 테마 조회
   */
  getCurrentTheme() {
    const html = document.documentElement;
    let theme = html.getAttribute('data-theme');

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    return theme;
  }

  /**
   * 다크모드 여부 확인
   */
  isDark() {
    return this.getCurrentTheme() === 'dark';
  }
}

// 전역 인스턴스 생성 (DOM이 준비되기 전에 실행)
const themeManager = new ThemeManager();
