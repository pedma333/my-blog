---
title: RSS 피드로 블로그 콘텐츠 배포하기
date: 2026-07-17
author: pedma333
category: 기술
tags: [RSS, 피드, 자동화, 배포]
---

# RSS 피드로 블로그 콘텐츠 배포하기

RSS(Really Simple Syndication)는 블로그 콘텐츠를 자동으로 구독자들에게 전달하는 강력한 도구입니다.

## RSS 피드란?

**RSS 피드**는 블로그의 최신 글을 **자동으로 정보 형태**로 제공하는 방식입니다.

### 장점
- 📱 **독자 편의성**: RSS Reader에서 모든 블로그를 한곳에서 관리
- 🔄 **자동화**: 새 글이 나올 때마다 자동으로 알림
- 🌐 **확산성**: 다양한 플랫폼(네이버, Feedly 등)에 자동 배포
- 📊 **추적**: 구독자 수 모니터링

## my-blog의 RSS 시스템

우리 블로그는 다음과 같이 구성되어 있습니다:

```
posts/*.md (마크다운 파일)
    ↓
npm run build (빌드 스크립트)
    ↓
feed.xml (RSS 피드)
    ↓
배포 (GitHub Pages)
    ↓
RSS Reader / 네이버 블로그
```

## RSS 피드 URL

```
https://pedma333.github.io/my-blog/feed.xml
```

## RSS Reader에 등록하기

### Feedly
1. https://feedly.com 방문
2. "Add feed" 클릭
3. RSS 피드 URL 입력
4. Subscribe

### Google Reader 대체 (Inoreader)
1. https://www.inoreader.com 방문
2. "Add subscription" 클릭
3. RSS 피드 URL 입력

## 네이버 블로그에 등록

1. 네이버 블로그 설정
2. "외부 블로그 소개" 포스트 작성
3. RSS 피드 URL 명시

자세한 내용은 `NAVER_RSS_GUIDE.md` 참고!

---

**RSS를 통해 더 많은 독자에게 도달하세요! 🚀**
