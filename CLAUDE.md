# my-blog: 마크다운 → 블로그 웹사이트 변환기

> 순수 HTML/CSS/JavaScript로 구현한 정적 블로그 생성기
> 
> 마지막 업데이트: 2026-07-16

---

## 🎯 프로젝트 개요

### 핵심 목표
- 마크다운 파일(.md)을 읽어 웹 기반 블로그로 즉시 렌더링
- 프레임워크 없이 순수 바닐라 JS + CSS로 구현
- 모바일-퍼스트 반응형 디자인
- 다크모드 네이티브 지원
- 깔끔하고 읽기 편한 미니멀 UX

### 기술 스택
- **언어**: HTML5, CSS3, JavaScript (ES6+)
- **마크다운 파싱**: 직접 구현 (의존성 제로)
- **다크모드**: CSS 변수 + `prefers-color-scheme` + 로컬스토리지
- **반응형**: Flexbox/Grid + viewport meta tag
- **번들링**: 없음 (모듈식 파일 구조)

### 프로젝트 구조
```
my-blog/
├── CLAUDE.md                      (이 파일)
├── index.html                     (메인 홈페이지)
├── blog.html                      (블로그 글 렌더링 페이지)
├── css/
│   └── style.css                  (전역 스타일 + 다크모드)
├── js/
│   ├── app.js                     (진입점 & 초기화)
│   ├── markdown-parser.js         (마크다운 → HTML 변환)
│   ├── theme.js                   (다크모드 토글)
│   └── blog-loader.js             (마크다운 파일 로드 & 렌더링)
├── posts/                         (마크다운 블로그 글 디렉토리)
│   ├── example.md
│   └── welcome.md
└── assets/
    └── (이미지, 아이콘 등)
```

---

## 🎨 디자인 원칙

### 컬러 팔레트
```css
/* 라이트 모드 */
--bg-primary: #ffffff
--bg-secondary: #f5f5f5
--text-primary: #1a1a1a
--text-secondary: #666666
--accent: #0066cc
--border: #e0e0e0

/* 다크 모드 */
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #f5f5f5
--text-secondary: #a0a0a0
--accent: #4db8ff
--border: #404040
```

### 폰트
- **제목**: 시스템 폰트 스택 (Segoe UI, -apple-system 등)
- **본문**: 가독성 최적화 (line-height: 1.8, font-size: 16px)
- **모노스페이스**: `'Courier New', monospace` (코드 블록용)

### 레이아웃 규칙
- **컨테이너 최대 너비**: 900px (읽기 편한 라인길이)
- **여백**: 상하 2rem, 좌우 1.5rem (모바일: 1rem)
- **버튼/입력**: 최소 44px 높이 (모바일 터치 친화적)

---

## 🔧 마크다운 지원 문법

### 기본 문법
```markdown
# H1 제목
## H2 제목
### H3 제목

**굵은 텍스트** 또는 __굵은 텍스트__
*이탤릭* 또는 _이탤릭_
~~취소선~~

[링크 텍스트](https://example.com)
![이미지 alt](path/to/image.jpg)

`인라인 코드`

> 인용문
> 여러 줄 가능
```

### 확장 문법
```markdown
- 순서 없는 리스트
- 항목 2
  - 중첩 항목

1. 순서 있는 리스트
2. 항목 2
   1. 중첩 항목

| 표 헤더 1 | 표 헤더 2 |
|----------|----------|
| 셀 1     | 셀 2     |
| 셀 3     | 셀 4     |

```코드 블록
console.log('코드 블록');
```
```

### 메타데이터 (YAML 프론트매터)
```markdown
---
title: 블로그 제목
date: 2026-07-16
author: 작성자명
category: 카테고리
tags: [태그1, 태그2]
---

본문 내용...
```

---

## 💻 코딩 규칙

### JavaScript 컨벤션
- **변수명**: camelCase (예: `blogPosts`, `isDarkMode`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_POSTS`, `API_TIMEOUT`)
- **함수명**: 동사 + 명사 (예: `loadBlogPosts()`, `renderMarkdown()`)
- **파일명**: kebab-case (예: `markdown-parser.js`)
- **들여쓰기**: 2칸 (절대 탭 금지)

### HTML 규칙
- **의미론적 마크업**: `<article>`, `<section>`, `<nav>` 우선
- **접근성**: alt 속성, ARIA 라벨 필수
- **속성 순서**: id → class → data-* → 기타

### CSS 규칙
- **변수 선언**: `:root`에서 관리
- **네이밍**: BEM 방식 선택적 (`.card__title`, `.card--active`)
- **단위**: 반응형은 rem, 절대 크기는 px
- **미디어 쿼리**: 모바일 우선 (mobile-up)

### 주석 규칙
- **함수 주석**: JSDoc 스타일 (필요시)
  ```javascript
  /**
   * 마크다운을 HTML로 변환
   * @param {string} markdown - 마크다운 텍스트
   * @returns {string} HTML 문자열
   */
  ```
- **인라인 주석**: 왜(why)를 설명, 무엇(what)은 코드가 말함

---

## 🌓 다크모드 구현

### 원칙
1. **자동 감지**: 사용자 OS 설정 자동 인식 (`prefers-color-scheme`)
2. **수동 토글**: 사용자 선택 시 로컬스토리지에 저장
3. **우선순위**: 수동 선택 > OS 설정

### 구현 위치
- **CSS**: 모든 CSS 변수 `:root[data-theme="light/dark"]`로 관리
- **JS**: `theme.js`에서 토글 로직 담당
- **HTML**: `<html data-theme="auto">`로 초기 설정

### 로컬스토리지 키
```javascript
localStorage.setItem('theme-preference', 'dark'); // 'light' 또는 'dark'
```

---

## 📱 모바일 반응형 전략

### 브레이크포인트
```css
/* 모바일 우선 */
/* 기본: 320px~767px */
@media (min-width: 768px) { /* 태블릿 */ }
@media (min-width: 1024px) { /* 데스크톱 */ }
```

### 반응형 요소
- **폰트 크기**: `clamp(14px, 2vw, 18px)` 사용
- **패딩/마진**: 모바일 1rem → 데스크톱 2rem
- **컨테이너**: max-width 900px, 패딩 양쪽 1.5rem
- **이미지**: `max-width: 100%`, `height: auto`

---

## 🚀 개발 워크플로우

### 새 블로그 글 추가
1. `posts/` 디렉토리에 `my-post.md` 파일 생성
2. YAML 프론트매터 작성 (제목, 날짜 등)
3. 마크다운 내용 작성
4. 브라우저에서 자동 반영 (새로고침)

### 로컬 테스트
```bash
# 간단한 HTTP 서버 실행 (Python 필요)
python -m http.server 8000

# 또는
npx http-server
```

그 후 `http://localhost:8000` 접속

### 성능 체크
- **Lighthouse**: 성능, 접근성, SEO 점수 90 이상
- **번들 크기**: JS + CSS 합계 < 200KB 목표
- **로딩 시간**: First Contentful Paint < 1초

---

## 🔄 상태 관리 (단순화)

### 전역 상태
```javascript
// app.js
const APP_STATE = {
  isDarkMode: false,
  currentPost: null,
  posts: [],
  theme: 'auto' // 'auto' | 'light' | 'dark'
};
```

### 상태 업데이트 원칙
- 직접 변경 금지 → `updateAppState(key, value)` 함수 사용
- 상태 변경 시 DOM 자동 갱신
- 로컬스토리지 동기화 필수

---

## ⚠️ 주의사항 & 피해야 할 것

### 금지 사항
- **외부 라이브러리 추가 금지**: 마크다운 파서(marked.js 등) 절대 사용 금지
- **IE 지원 금지**: ES6+ 문법 자유롭게 사용
- **SSG/빌드 도구 금지**: 순수 정적 파일만 허용
- **CDN 의존 금지**: 모든 파일 로컬에서 제공

### 보안 주의
- **XSS 방지**: 사용자 입력 후 마크다운 렌더링 시 HTML 이스케이프 필수
- **마크다운 제한**: `<script>` 태그 필터링
- **로컬 파일**: CORS 이슈 주의 (로컬 fetch 불가 → 서버 필수)

---

## 📊 성능 최적화 체크리스트

- [ ] 마크다운 파일 개수 100개까지는 동기 로드
- [ ] 이미지는 절대 경로 사용, lazy-loading 고려
- [ ] CSS 최소화: 중복 제거, 변수 활용
- [ ] JS 번들: 파일 분리로 캐싱 효율성 증대
- [ ] 폰트: 시스템 폰트 우선, Google Fonts는 선택

---

## 🛠️ 자주 쓰는 명령어

```bash
# HTTP 서버 시작
python -m http.server 8000

# 파일 구조 확인
tree /F

# 마크다운 파일 목록
dir posts\*.md /s

# CSS/JS 문법 체크 (VSCode 내장 기능 사용)
```

---

## 📝 현재 세션 맥락

### 진행 중인 작업
- [x] 프로젝트 기초 구조 설계
- [x] CLAUDE.md 작성
- [x] 기본 HTML/CSS 틀 제작
- [x] 마크다운 파서 구현
- [x] 다크모드 토글 기능
- [x] 첫 블로그 글 예제
- [x] **RSS 피드 생성 시스템 구축** (2026-07-17)

### 완료된 작업 (2026-07-17)
1. `js/rss-generator.js` - RSS XML 생성 함수 (Node.js + 브라우저 모두 지원)
2. `build.js` - Node.js 빌드 스크립트 (posts/*.md → feed.xml 변환)
3. `package.json` - npm scripts 설정 (`npm run build`)
4. `.github/workflows/build-rss.yml` - GitHub Actions 자동 빌드
5. `NAVER_RSS_GUIDE.md` - 네이버 블로그 연동 가이드
6. `.gitignore` - Git 무시 파일 설정

### 다음 할 일
1. GitHub에 저장소 생성 및 푸시
2. GitHub Pages 또는 Netlify 배포
3. 네이버 블로그에 RSS 피드 URL 등록
4. 추가 포스트 작성 후 `npm run build` 실행

---

## ✅ 코딩 시작 체크리스트

각 파일 작성 시:
1. [ ] 파일 목적 주석 추가
2. [ ] 변수명/함수명 규칙 확인
3. [ ] 모바일/다크모드 테스트
4. [ ] 접근성(alt, 의미론적 마크업) 확인
5. [ ] Lighthouse 점수 확인

---

## 🎓 학습 기록 & 피드백

> 개발 과정에서 배운 것이나 개선 사항을 아래에 기록

| 날짜 | 내용 | 결과 |
|------|------|------|
| 2026-07-16 | 프로젝트 초기 설계 | CLAUDE.md 완성 |
| — | — | — |

