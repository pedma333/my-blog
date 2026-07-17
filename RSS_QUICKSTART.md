# RSS 피드 빠른 시작 (5분)

## 📍 현재 상태
✅ RSS 피드 생성 시스템이 완성되었습니다.
- `feed.xml` 자동 생성 (2개 포스트 포함)
- 네이버 블로그 연동 가능

---

## 🚀 Step 1: 로컬 테스트 (1분)

```bash
# 프로젝트 폴더로 이동
cd C:\my-blog

# RSS 피드 생성
npm run build

# ✅ 결과: feed.xml 업데이트됨
# "RSS feed generated: C:\my-blog\feed.xml"
```

---

## 📡 Step 2: 배포하기 (2분)

### 옵션 A: GitHub Pages (추천)

```bash
# 1) Git 초기화
git init
git add .
git commit -m "Initial commit: my-blog with RSS"

# 2) GitHub에 저장소 생성
# https://github.com/new
# 저장소명: my-blog

# 3) 푸시
git remote add origin https://github.com/YOUR_USERNAME/my-blog.git
git branch -M main
git push -u origin main

# 4) Settings → Pages → main branch 선택
# ✅ 배포 완료: https://YOUR_USERNAME.github.io/my-blog/
```

### 옵션 B: Netlify (더 간단)

```bash
# 1) https://app.netlify.com 가입
# 2) GitHub 연결
# 3) my-blog 저장소 선택
# 4) Build command: npm run build
# 5) Deploy!
# ✅ 배포 완료: https://xxx.netlify.app/
```

---

## 🔗 Step 3: RSS 피드 확인 (1분)

배포 후 다음 URL 방문:
```
https://YOUR_USERNAME.github.io/my-blog/feed.xml
```

또는 RSS Reader에서 피드 추가:
- Feedly: https://feedly.com → Add feed → URL 입력
- Google Reader: https://www.inoreader.com → Add feed → URL 입력

---

## 📌 Step 4: 네이버 블로그에 등록 (1분)

### 방법 1: 블로그 주소로 등록 (가장 간단)
```
네이버 블로그 설정 → 블로그 기본 설정 → 블로그 주소
https://your-domain.com 또는 https://your-domain.com/feed.xml
```

### 방법 2: 외부 블로그 소개 글 작성
```
네이버 블로그에서 글 작성
제목: "🔗 [외부] 나의 마크다운 블로그"
내용: "https://your-domain.com/feed.xml 에서 최신 글을 확인하세요"
```

---

## 📝 Step 5: 새 글 추가하기

### 1) 마크다운 파일 작성
```bash
# posts/my-post.md 생성
---
title: 새로운 글 제목
date: 2026-07-17
author: 당신의 이름
category: 기술
tags: [블로그, RSS, 마크다운]
---

# 글 제목

글 내용을 여기 작성하세요...
```

### 2) RSS 피드 갱신
```bash
npm run build
```

### 3) GitHub에 푸시
```bash
git add posts/my-post.md feed.xml
git commit -m "Add new post: my-post"
git push
```

**자동 빌드 설정 후** (GitHub Actions):
- 푸시하면 자동으로 `npm run build` 실행
- `feed.xml` 자동 갱신
- 네이버 블로그가 자동 수집 (최대 24시간)

---

## ✅ 체크리스트

```
로컬 테스트
□ npm run build 성공
□ feed.xml 생성됨
□ RSS Reader에서 피드 보임

배포
□ GitHub/Netlify 배포 완료
□ 배포 URL에서 feed.xml 접근 가능

네이버 연동
□ RSS 피드 URL 등록
□ 블로그 주소 등록

글 추가
□ 새 포스트 작성
□ npm run build 실행
□ git push 완료
```

---

## 🆘 문제 해결

**Q: `npm run build` 실행이 안 됩니다.**
```bash
# Node.js 설치 확인
node --version
npm --version

# 설치되지 않았다면:
# https://nodejs.org/en/ 에서 LTS 버전 다운로드
```

**Q: `feed.xml`이 업데이트되지 않습니다.**
```bash
# 캐시 삭제 후 다시 생성
rm feed.xml
npm run build
```

**Q: GitHub에 푸시가 안 됩니다.**
```bash
# 1) 원격 확인
git remote -v

# 2) 인증 재설정 (Windows)
git config --global credential.helper wincred
git push  # 재인증 프롬프트

# 3) SSH 키 설정
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**Q: 네이버 블로그에 피드가 안 보입니다.**
```
- 최대 24시간 소요
- feed.xml 파일이 공개 상태인지 확인
- RSS Validator로 피드 검증: https://validator.w3.org/feed/
```

---

## 📚 다음 단계

1. **자동화 강화**: GitHub Actions로 푸시 시 자동 빌드
2. **더 많은 포스트**: `posts/` 디렉토리에 추가
3. **스타일 커스터마이징**: `css/style.css` 수정
4. **도메인 연결**: GitHub Pages 커스텀 도메인 설정

---

## 🔗 유용한 링크

| 도구 | 링크 |
|------|------|
| RSS Validator | https://validator.w3.org/feed/ |
| Feedly | https://feedly.com |
| GitHub Pages | https://pages.github.com |
| Netlify | https://www.netlify.com |
| Node.js | https://nodejs.org |

---

**더 자세한 정보는 `NAVER_RSS_GUIDE.md`를 참고하세요!**
