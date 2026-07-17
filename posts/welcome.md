---
title: my-blog에 오신 것을 환영합니다
date: 2026-07-16
author: 관리자
category: 소개
tags: [마크다운, 블로그, 웹개발]
---

# my-blog에 오신 것을 환영합니다 👋

이 블로그는 **마크다운 파일을 HTML로 변환**하는 정적 블로그입니다. 프레임워크 없이 순수 HTML, CSS, JavaScript로만 구현했습니다.

## 주요 특징

- 📝 **마크다운 중심**: `.md` 파일로 글을 작성하고 자동 렌더링
- 🌓 **다크모드**: OS 설정 자동 감지 + 수동 토글
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 최적화
- ⚡ **빠른 성능**: 의존성 없는 순수 바닐라 JS
- 🎨 **깔끔한 디자인**: 읽기 편한 미니멀 스타일

## 시작하기

### 블로그 글 작성하기

1. `posts/` 디렉토리에 새 마크다운 파일 생성
2. 다음 형식으로 메타데이터 작성:

```markdown
---
title: 글 제목
date: 2026-07-16
author: 작성자
category: 카테고리
tags: [태그1, 태그2]
---

# 글 내용

본문을 마크다운으로 작성하세요.
```

3. `posts/manifest.json`에 파일명 추가
4. 브라우저에서 새로고침하면 자동 반영

### 지원하는 마크다운 문법

#### 제목
```markdown
# H1 제목
## H2 제목
### H3 제목
```

#### 텍스트 스타일
```markdown
**굵은 텍스트**
*이탤릭*
~~취소선~~
```

#### 리스트
```markdown
- 순서 없는 리스트
- 항목 2

1. 순서 있는 리스트
2. 항목 2
```

#### 링크와 이미지
```markdown
[링크 텍스트](https://example.com)
![이미지 alt](path/to/image.jpg)
```

#### 코드
```markdown
`인라인 코드`

\`\`\`javascript
// 코드 블록
console.log('Hello, World!');
\`\`\`
```

#### 인용문
```markdown
> 인용문입니다.
> 여러 줄도 지원합니다.
```

#### 표
```markdown
| 헤더 1 | 헤더 2 |
|--------|--------|
| 셀 1   | 셀 2   |
| 셀 3   | 셀 4   |
```

## 다크모드 사용

오른쪽 상단의 **🌙** 버튼을 클릭하여 다크모드를 토글할 수 있습니다.

- **자동 (기본값)**: OS 설정을 따릅니다
- **수동 선택**: 선택한 테마는 로컬스토리지에 저장됩니다

## 디렉토리 구조

```
my-blog/
├── index.html           # 홈페이지 (블로그 목록)
├── blog.html            # 개별 글 페이지
├── css/
│   └── style.css        # 전체 스타일 (다크모드 포함)
├── js/
│   ├── app.js           # 홈페이지 로직
│   ├── blog-loader.js   # 글 페이지 로직
│   ├── markdown-parser.js  # 마크다운 파서
│   └── theme.js         # 다크모드 관리
└── posts/
    ├── manifest.json    # 파일 목록
    ├── welcome.md       # 이 글
    └── example.md       # 예제
```

## 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js (npx 필요)
npx http-server
```

그 후 `http://localhost:8000`에 접속하세요.

## 성능

- **번들 크기**: JS + CSS < 100KB
- **로딩 시간**: 1초 이내
- **Lighthouse 점수**: 90+ (성능, 접근성, SEO)

## 기술 스택

- HTML5 (시맨틱 마크업)
- CSS3 (변수, Flexbox, Grid)
- JavaScript ES6+ (모듈, async/await)

## 라이센스

자유롭게 사용하세요.

---

**더 알아보기**: [example.md](blog.html?post=example) 글에서 마크다운 문법을 더 살펴보세요! 📚
