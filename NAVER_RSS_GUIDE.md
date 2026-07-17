# 네이버 블로그에 RSS 피드 자동 등록하기

## 🎯 목표
마크다운 블로그의 `feed.xml`을 네이버 블로그에 자동으로 수집하게 하기

---

## 📋 준비물
1. **네이버 블로그** 계정 (https://blog.naver.com)
2. **배포된 블로그의 RSS 피드 URL** 
   - GitHub Pages: `https://username.github.io/feed.xml`
   - Netlify: `https://your-site.netlify.app/feed.xml`
   - 기타: `https://yourdomain.com/feed.xml`

---

## 🚀 Step 1: 로컬에서 빌드하기

```bash
# 1. 새 포스트 작성 후 posts/ 디렉토리에 저장
# 예: posts/my-new-post.md

# 2. RSS 피드 생성
npm run build

# 3. feed.xml이 생성되었는지 확인
ls feed.xml
```

---

## 🌐 Step 2: 블로그 배포하기

### 옵션 A: GitHub Pages (추천)

**1) GitHub 저장소 생성**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/my-blog.git
git branch -M main
git push -u origin main
```

**2) GitHub Pages 활성화**
- 저장소 Settings → Pages
- Source: `main` branch, `/root` directory
- Save

**3) GitHub Actions 자동 빌드 설정**

`.github/workflows/build-rss.yml` 파일 생성:

```yaml
name: Build RSS Feed

on:
  push:
    branches: [main]
    paths:
      - 'posts/**'
      - 'build.js'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run build
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add feed.xml
          git commit -m "Update RSS feed" || echo "No changes to commit"
          git push
```

**결과**: 포스트 추가 시 자동으로 `feed.xml` 업데이트 및 배포

---

### 옵션 B: Netlify (더 간단함)

**1) Netlify에 GitHub 연결**
- https://app.netlify.com 가입
- "New site from Git" → GitHub 선택
- `my-blog` 저장소 선택

**2) Build command 설정**
```
Build command: npm run build
Publish directory: .
```

**3) Deploy**
- Netlify가 자동으로 빌드 및 배포
- 배포 URL: `https://my-blog-xxxx.netlify.app/`

---

## 📡 Step 3: 네이버 블로그에 RSS 등록하기

### 방법 1: 블로그 글로 수동 발행 (권장)

네이버 블로그에서는 자동 RSS 수집을 공식 지원하지 않으므로, 다음 2가지 대안을 사용합니다:

**A) 매달 한 번 RSS 피드를 확인하고 수동으로 소개글 작성**
```
1. RSS 피드 URL 방문: https://yourdomain.com/feed.xml
2. 최신 포스트 확인
3. 네이버 블로그에서 "외부 블로그 소개" 글 작성
4. RSS 피드 링크 포함
```

**B) 블로그 주소 등록**
- 네이버 블로그 설정 → 블로그 기본 설정
- "블로그 연동" 섹션에 블로그 주소 입력
- `https://yourdomain.com` 또는 `https://yourdomain.com/feed.xml`

---

### 방법 2: 자동 발행 (고급 - Zapier/IFTTT)

**Zapier를 사용한 자동 발행 (유료, 월 $20~)**

```
1. Zapier 가입: https://zapier.com
2. "Create a Zap" 선택
3. Trigger: RSS Feed → feed.xml URL
4. Action: Blog → 네이버 블로그 (플러그인 설치)
5. 필드 매핑:
   - Title → 블로그 제목
   - Description → 요약
   - Link → 링크
6. Test & Deploy
```

**문제**: 네이버 블로그 Zapier 플러그인이 잘 지원되지 않음

---

### 방법 3: 프로그래밍 방식 (초급 개발자)

**Python + Selenium으로 자동 발행**

파일: `publish-to-naver.py`

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import time
import xml.etree.ElementTree as ET

# RSS 피드 파싱
tree = ET.parse('feed.xml')
root = tree.getroot()

# 가장 최신 포스트 가져오기
items = root.findall('.//item')
latest_post = items[0] if items else None

if not latest_post:
    print("No posts found")
    exit()

title = latest_post.find('title').text
link = latest_post.find('link').text
description = latest_post.find('description').text

# Selenium으로 네이버 블로그 자동화
driver = webdriver.Chrome()
driver.get("https://blog.naver.com/")

# 로그인
input("Press Enter after logging in...")

# 글쓰기 페이지로 이동
driver.find_element(By.XPATH, "//글쓰기 버튼").click()

# 제목 입력
driver.find_element(By.ID, "title").send_keys(f"[외부] {title}")

# 내용 입력
driver.find_element(By.ID, "editor").send_keys(f"{description}\n\n링크: {link}")

# 발행
driver.find_element(By.XPATH, "//발행 버튼").click()

print("Post published successfully!")
driver.quit()
```

**실행:**
```bash
python publish-to-naver.py
```

⚠️ **주의사항**:
- 네이버 약관상 자동화 도구 사용 금지
- 계정 정지 위험

---

## ✅ 확인 체크리스트

- [ ] `npm run build`로 RSS 피드 생성 확인
- [ ] `feed.xml`이 최신 포스트 포함하는지 확인
- [ ] 배포된 사이트에서 `feed.xml` 접근 가능한지 확인
- [ ] RSS Reader(Feedly, Google Reader 등)에서 피드 수집 가능한지 확인
- [ ] 네이버 블로그에서 외부 링크 또는 RSS 피드 URL 안내

---

## 🔗 유용한 링크

- **RSS Validator**: https://validator.w3.org/feed/
- **RSS Feed Reader**: https://feedly.com
- **GitHub Pages**: https://pages.github.com
- **Netlify**: https://www.netlify.com

---

## 📝 자주 묻는 질문

**Q: 매번 수동으로 `npm run build`를 해야 하나요?**
A: GitHub Actions을 사용하면 푸시 시 자동으로 빌드됩니다.

**Q: feed.xml이 업데이트되지 않아요.**
A: 캐시 문제일 수 있습니다. 브라우저 캐시 삭제 후 확인하세요.

**Q: 네이버 블로그에 자동 발행되는 방법은?**
A: 공식 API 없음. Zapier나 Python 자동화 사용 (위험).

**Q: RSS 피드를 비공개로 설정할 수 있나요?**
A: `build.js`의 `CONFIG.siteUrl`을 비공개 URL로 변경하면 됩니다.
