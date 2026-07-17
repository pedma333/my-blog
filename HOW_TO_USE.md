# my-blog 사용 매뉴얼

> pedma333의 마크다운 블로그 일상 사용 가이드
> 
> 마지막 업데이트: 2026-07-17

---

## 🎯 블로그 전체 구조

```
내 컴퓨터 (C:\my-blog)
    ↓
1️⃣ 마크다운 파일 작성 (posts/*.md)
    ↓
2️⃣ npm run build (RSS 피드 생성)
    ↓
3️⃣ git add/commit/push (GitHub에 업로드)
    ↓
4️⃣ GitHub Actions 자동 실행
    ↓
5️⃣ GitHub Pages 자동 배포
    ↓
6️⃣ 네이버 블로그 자동 수집 (최대 24시간)
```

---

## 📝 Step 1: 블로그 글 작성

### 1-1) 새 마크다운 파일 생성

**파일 위치:** `C:\my-blog\posts\my-post-title.md`

**파일명 규칙:**
- 영문 소문자 + 하이픈 사용 (예: `how-to-use-markdown.md`)
- 공백, 한글, 특수문자 금지
- 파일명이 URL에 사용되므로 의미 있게!

### 1-2) YAML 프론트매터 작성

**파일 시작 부분에 반드시 포함:**

```markdown
---
title: 글의 제목 (필수)
date: 2026-07-17 (필수, YYYY-MM-DD 형식)
author: 작성자명 (필수)
category: 카테고리 (선택, 1개만)
tags: [태그1, 태그2, 태그3] (선택, 최대 5개)
---

# 글 제목

글 내용을 여기에 작성하세요...
```

### 1-3) 마크다운 본문 작성

**지원하는 마크다운 문법:**

```markdown
# H1 제목
## H2 제목
### H3 제목

**굵은 텍스트** 또는 __굵은 텍스트__
*이탤릭* 또는 _이탤릭_
~~취소선~~

[링크 텍스트](https://example.com)
![이미지 설명](image.jpg)

- 순서 없는 리스트
- 항목 2
  - 중첩 항목

1. 순서 있는 리스트
2. 항목 2

> 인용문
> 여러 줄 가능

`인라인 코드`

```코드
console.log('코드 블록');
```
```

### ✅ 작성 예시

```markdown
---
title: 마크다운으로 블로그 시작하기
date: 2026-07-17
author: pedma333
category: 튜토리얼
tags: [마크다운, 블로그, 시작하기]
---

# 마크다운으로 블로그 시작하기 🚀

마크다운은 **간단하고 우아한** 텍스트 포맷입니다.

## 왜 마크다운을 사용하나?

1. **읽기 쉽다** - 순수 텍스트로도 가독성 좋음
2. **쓰기 편하다** - 복잡한 GUI 없이도 포맷팅 가능
3. **버전 관리 좋다** - Git과 완벽 호환

## 마크다운 예시

### 텍스트 포매팅
- 이것은 **굵은** 텍스트입니다
- 이것은 *이탤릭* 텍스트입니다

### 코드 예시
```python
def hello():
    print("Hello, World!")
```

## 마무리

마크다운으로 **자유롭게** 블로그를 시작하세요! ✨
```

---

## 🔨 Step 2: RSS 피드 생성

### 2-1) 터미널 열기

**Windows:**
- `Win + X` → 터미널 (관리자) 또는
- `Win + R` → `cmd` 입력 또는
- VSCode 터미널: `` Ctrl + ` ``

### 2-2) 프로젝트 폴더로 이동

```bash
cd C:\my-blog
```

### 2-3) RSS 피드 빌드

```bash
npm run build
```

**결과 예시:**
```
> my-blog@1.0.0 build
> node build.js

📖 Found 5 posts
✅ RSS feed generated: C:\my-blog\feed.xml
   Posts: 5
   Size: 3.85 KB
```

### ✅ 확인사항

- ✓ 메시지에 "RSS feed generated" 표시됨
- ✓ 포스트 개수가 증가함
- ✓ `feed.xml` 파일 크기가 증가함

---

## 📤 Step 3: GitHub에 업로드

### 3-1) 변경사항 확인

```bash
git status
```

**출력 예시:**
```
On branch main
Changes not staged for commit:
  modified:   feed.xml
  
Untracked files:
  new file:   posts/my-post-title.md
```

### 3-2) 파일 스테이징

**방법 A: 새 포스트 + RSS 피드만 추가**
```bash
git add posts/my-post-title.md feed.xml
```

**방법 B: 모든 변경사항 추가 (권장)**
```bash
git add .
```

### 3-3) 커밋 메시지 작성

```bash
git commit -m "Add: 블로그 제목 포스트"
```

**좋은 커밋 메시지 예시:**
```bash
git commit -m "Add: 마크다운 시작 가이드"
git commit -m "Update: RSS 피드 구성 변경"
git commit -m "Fix: 오타 수정"
```

**나쁜 예시:**
```bash
git commit -m "수정" ❌
git commit -m "asdf" ❌
```

### 3-4) GitHub에 푸시

```bash
git push origin main
```

**출력 예시:**
```
To https://github.com/pedma333/my-blog.git
   622b97f..a1b2c3d  main -> main
```

### ✅ 확인사항

- ✓ `git push` 완료 메시지 표시됨
- ✓ GitHub 저장소에 파일이 업로드됨

---

## ⚙️ Step 4: 자동화 확인

### 4-1) GitHub Actions 확인

1. https://github.com/pedma333/my-blog/actions 방문
2. 최신 워크플로우 "Add: 포스트명" 클릭
3. 상태 확인:
   - 🟢 **체크마크** = 성공 ✅
   - 🔴 **X 마크** = 실패 ❌
   - 🟡 **진행 중** = 빌드 중 ⏳

### 4-2) 배포 확인

**1-2분 대기 후:**

1. https://pedma333.github.io/my-blog/ 방문
2. 새 포스트 보이는지 확인
3. 글 클릭해서 내용 확인

### 4-3) RSS 피드 확인

1. https://pedma333.github.io/my-blog/feed.xml 방문
2. 새 포스트가 목록에 포함되었는지 확인

---

## 🔄 전체 작업 흐름 (빠른 버전)

### 🏃 5분 만에 블로그 포스트 배포하기

```bash
# 1️⃣ 파일 작성 (3분)
# → C:\my-blog\posts\my-post.md 작성

# 2️⃣ RSS 생성 (10초)
cd C:\my-blog
npm run build

# 3️⃣ GitHub 업로드 (30초)
git add .
git commit -m "Add: 포스트 제목"
git push origin main

# 4️⃣ 배포 완료 (1-2분 자동)
# → 끝!
```

---

## 📋 포스트 템플릿

**새 포스트 작성할 때마다 복사해서 사용:**

```markdown
---
title: 글 제목을 여기 입력
date: 2026-07-17
author: pedma333
category: 카테고리
tags: [태그1, 태그2]
---

# 글 제목

## 소개

간단한 소개 문단을 작성하세요.

## 본론

### 소제목 1

내용을 작성하세요.

- 포인트 1
- 포인트 2
- 포인트 3

### 소제목 2

더 많은 내용...

## 결론

마무리 문단을 작성하세요.

---

**다음 단계:** 네이버 블로그에서 자동으로 반영됩니다 (최대 24시간)
```

---

## 🐛 문제 해결

### ❌ `npm run build` 실행이 안 됨

**해결책:**
```bash
# 1) Node.js 설치 확인
node --version

# 2) npm 설치 확인
npm --version

# 3) 프로젝트 폴더 확인
cd C:\my-blog
ls package.json
```

**Node.js 미설치 시:**
- https://nodejs.org/en/ 다운로드 (LTS 버전)
- 설치 후 터미널 재시작

---

### ❌ `git push` 실행이 안 됨

**해결책:**
```bash
# 1) 인증 재설정
git config --global credential.helper wincred
git push origin main
# → 인증 프롬프트 나타남

# 2) 원격 확인
git remote -v

# 3) 브랜치 확인
git branch -a
```

---

### ❌ 블로그에 새 포스트가 안 보임

**확인 순서:**
1. ✓ `npm run build` 실행했는가?
2. ✓ `git push` 완료했는가?
3. ✓ 1-2분 대기했는가?
4. ✓ https://pedma333.github.io/my-blog/ 새로고침했는가?
5. ✓ 브라우저 캐시 삭제했는가? (Ctrl + Shift + Del)

**캐시 삭제 방법 (Chrome):**
- Ctrl + Shift + Del → 전체 시간 범위 선택 → 삭제

---

### ❌ RSS 피드에 포스트가 없음

**확인 사항:**
```bash
# 1) feed.xml 파일 존재 확인
ls feed.xml

# 2) 포스트 개수 확인
npm run build

# 3) feed.xml 내용 확인
type feed.xml
```

---

## ✅ 일일 체크리스트

포스트를 배포할 때마다 이 목록을 확인하세요:

```
블로그 글 작성
□ 파일명: 소문자 + 하이픈 (예: how-to.md)
□ YAML 프론트매터: title, date, author 필수
□ 마크다운 문법: 올바른 문법 사용
□ 링크/이미지: URL 확인

RSS 생성
□ cd C:\my-blog
□ npm run build 실행
□ "RSS feed generated" 메시지 확인
□ 포스트 개수 증가 확인

GitHub 업로드
□ git status로 변경사항 확인
□ git add . (모든 변경사항 추가)
□ git commit -m "메시지" (의미 있는 커밋)
□ git push origin main (성공 메시지 확인)

배포 확인
□ GitHub Actions 초록색 체크마크 ✅
□ https://pedma333.github.io/my-blog/ 새 포스트 보임
□ https://pedma333.github.io/my-blog/feed.xml RSS 피드 확인

네이버 블로그 (선택)
□ 최대 24시간 후 자동 반영
□ 네이버 블로그에서 수동 확인
```

---

## 📊 일반적인 포스트 작성 시간

| 항목 | 시간 |
|------|------|
| 포스트 작성 | 5-30분 (내용에 따라) |
| RSS 빌드 | 10초 |
| GitHub 업로드 | 30초 |
| GitHub 배포 | 1-2분 (자동) |
| 네이버 수집 | 최대 24시간 |
| **총 시간** | **5-30분** |

---

## 🎨 포스트 작성 팁

### 좋은 포스트의 특징

✅ **명확한 제목**
- ❌ "오늘의 생각"
- ✅ "Python에서 리스트 컴프리헨션 사용하기"

✅ **구조화된 본문**
- H2로 섹션 나누기
- 각 섹션마다 3-5개 포인트
- 요약 또는 결론으로 마무리

✅ **코드 예시**
- 실행 가능한 코드 포함
- 언어 명시 (python, javascript 등)

✅ **이미지/링크**
- 관련 이미지 포함하면 가독성 향상
- 외부 링크는 `[텍스트](URL)` 형식

✅ **적절한 태그**
- 3-5개 태그 사용
- 검색 키워드 포함

### 피해야 할 것

❌ **너무 긴 문장** - 한 줄에 50글자 이내
❌ **복잡한 중첩** - H1 → H2 → H3만 사용
❌ **오타** - 작성 후 한 번 읽어보기
❌ **깨진 링크** - 링크 동작 확인

---

## 🔗 자주 쓰는 링크

| 용도 | 링크 |
|------|------|
| 블로그 홈 | https://pedma333.github.io/my-blog/ |
| RSS 피드 | https://pedma333.github.io/my-blog/feed.xml |
| GitHub 저장소 | https://github.com/pedma333/my-blog |
| 커밋 히스토리 | https://github.com/pedma333/my-blog/commits |
| GitHub Actions | https://github.com/pedma333/my-blog/actions |

---

## 💡 고급 팁

### 로컬에서 미리보기

```bash
# HTTP 서버 시작
python -m http.server 8000

# 또는
npm run dev
```

**브라우저에서 방문:** http://localhost:8000

### 포스트 비활성화 (임시 저장)

```bash
# posts/ 외부에 저장
# 예: drafts/my-draft.md
```

### RSS 피드 검증

```
https://validator.w3.org/feed/?url=https://pedma333.github.io/my-blog/feed.xml
```

### 깃 커밋 히스토리 보기

```bash
git log --oneline -10
```

---

## 🎓 학습 순서

1. **기본** - 이 문서 (HOW_TO_USE.md) 읽기
2. **심화** - RSS_QUICKSTART.md 읽기
3. **고급** - NAVER_RSS_GUIDE.md 읽기
4. **기술** - CLAUDE.md의 "코딩 규칙" 섹션 읽기

---

## ✉️ 정리

**당신은 이제 이렇게 블로그를 운영합니다:**

```
매일 아침
↓
마크다운 파일 작성 (posts/my-post.md)
↓
npm run build
↓
git add . && git commit -m "메시지" && git push
↓
자동으로 배포 + 네이버 반영
↓
끝!
```

**간단합니다. 글에 집중하세요! ✍️**

---

**Happy blogging! 🚀**

*마지막 업데이트: 2026-07-17*
