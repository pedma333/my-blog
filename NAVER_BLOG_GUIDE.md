# 네이버 블로그 자동 발행 가이드

my-blog의 마크다운 글을 **자동으로 네이버 블로그에 올리는 방법**입니다.

---

## 📌 개요

| 항목 | 설명 |
|------|------|
| **방식** | Python Selenium 기반 자동화 |
| **안정성** | 중간 (네이버 UI 변경 시 영향) |
| **속도** | 글 당 30~60초 |
| **비용** | 무료 |

---

## 🔧 설치

### 1단계: Python 패키지 설치

```bash
pip install selenium --break-system-packages
```

### 2단계: ChromeDriver 설치

Selenium은 Chrome 자동화에 ChromeDriver 필요:

1. [ChromeDriver 다운로드](https://chromedriver.chromium.org/)
2. Chrome 버전과 일치하는 버전 다운로드
3. `C:\Program Files\chromedriver.exe` 또는 PATH에 복사

Chrome 버전 확인:
- Chrome 주소창에 `chrome://version/` 입력

---

## 🚀 사용 방법

### 기본 실행

```bash
cd C:\my-blog
python naver-blog-publisher.py
```

### 실행 흐름

```
1. 블로그 ID 입력
   → 예: sangheuk (네이버 블로그 ID)

2. 비밀번호 입력 (화면에 표시 안 됨)
   → 네이버 계정 비밀번호

3. 자동 발행 시작
   ✅ 로그인
   ✅ posts/ 폴더의 마크다운 파일 읽기
   ✅ 각 글을 에디터에 입력
   ✅ 발행 버튼 자동 클릭
   ✅ 완료!
```

---

## 🔒 보안 (중요!)

### ⚠️ 주의사항

**절대로 비밀번호를 스크립트에 하드코딩하지 마세요!**

### 안전한 방법: 환경변수 사용

#### Windows (PowerShell)

```powershell
$env:NAVER_PASSWORD = "your-password"
python naver-blog-publisher.py
```

#### Linux/Mac

```bash
export NAVER_PASSWORD="your-password"
python naver-blog-publisher.py
```

### 스크립트 수정 (환경변수 사용)

`naver-blog-publisher.py` 하단 수정:

```python
if __name__ == '__main__':
    import os
    import getpass

    blog_id = input("네이버 블로그 ID: ").strip()
    # 환경변수에서 읽기
    password = os.environ.get('NAVER_PASSWORD')
    
    if not password:
        password = getpass.getpass("네이버 비밀번호: ")

    publisher = NaverBlogPublisher(blog_id, password)
    publisher.publish_all()
```

---

## 📝 마크다운 작성 규칙

네이버 블로그에 발행되려면 마크다운 파일이 다음 형식을 따라야 합니다:

```markdown
---
title: 글 제목
date: 2026-07-16
author: 작성자 이름
category: 카테고리
tags: [태그1, 태그2]
---

# 본문 시작

**굵은 텍스트**
*이탤릭*

## 소제목

- 리스트 항목 1
- 리스트 항목 2

> 인용문

\`\`\`python
# 코드 블록
print("Hello")
\`\`\`
```

### 메타데이터 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| `title` | ✅ | 글 제목 |
| `date` | ✅ | 발행 날짜 (YYYY-MM-DD) |
| `author` | ❌ | 작성자 |
| `category` | ❌ | 네이버 블로그 카테고리 |
| `tags` | ❌ | 태그 (배열 형식) |

---

## 🐛 트러블슈팅

### 문제 1: ChromeDriver 못 찾음

```
Error: 'chromedriver' executable needs to be in PATH
```

**해결책:**
```bash
# ChromeDriver 경로 지정
python naver-blog-publisher.py --driver-path "C:\path\to\chromedriver.exe"
```

### 문제 2: 로그인 실패

```
❌ 로그인 실패: TimeoutException
```

**원인 & 해결:**
- ✅ 계정명 확인 (이메일 아닌 계정명)
- ✅ 비밀번호 확인 (공백 없음)
- ✅ 2FA/OTP 활성화 시 수동 로그인 필요
- ✅ IP 차단 확인

### 문제 3: 에디터 로드 안 됨

```
❌ 글 발행 실패: NoSuchElementException
```

**해결책:**
- 네이버 블로그 UI 변경됨 (클래스명 변경)
- 스크립트의 셀렉터 업데이트 필요
- 브라우저 DevTools에서 현재 클래스명 확인

---

## ✅ 체크리스트

자동 발행 전 확인사항:

```
[ ] ChromeDriver 설치 완료
[ ] Python 3.8+ 설치
[ ] selenium 패키지 설치 (pip install selenium)
[ ] 네이버 블로그 ID/비밀번호 준비
[ ] posts/manifest.json에 파일명 등록
[ ] 마크다운 파일에 YAML 헤더 포함
[ ] 테스트용 마크다운 1개 준비
[ ] 환경변수로 비밀번호 저장
```

---

## 🎯 고급: 자동 예약 발행

### Windows 작업 스케줄러 사용

매일 오전 10시에 자동 발행:

```powershell
# PowerShell (관리자 권한)
$action = New-ScheduledTaskAction -Execute "python" `
  -Argument "naver-blog-publisher.py" `
  -WorkingDirectory "C:\my-blog"

$trigger = New-ScheduledTaskTrigger -Daily -At 10:00AM

Register-ScheduledTask -Action $action -Trigger $trigger `
  -TaskName "PublishBlog" -Description "네이버 블로그 자동 발행"
```

### Linux/Mac Cron 사용

```bash
# 매일 오전 10시
0 10 * * * cd /path/to/my-blog && python naver-blog-publisher.py

# crontab 편집
crontab -e
```

---

## 📊 발행 로그 확인

발행 결과를 파일에 저장:

```python
# naver-blog-publisher.py 수정
def publish_all(self):
    log_file = open('publish_log.txt', 'a')
    
    try:
        # ... 코드 ...
        log_file.write(f"[{datetime.now()}] ✅ {len(self.published)}개 글 발행\n")
    except Exception as e:
        log_file.write(f"[{datetime.now()}] ❌ 오류: {e}\n")
    finally:
        log_file.close()
```

---

## 🔄 대안 방법들

Selenium이 작동하지 않는다면:

### 1️⃣ RSS + 외부 배포 서비스
- my-blog에서 RSS 피드 생성
- IFTTT, Zapier 등으로 자동 배포
- **장점**: 안정적, 간단
- **단점**: 네이버 블로그 직접 지원 안 함

### 2️⃣ HTML 내보내기 (수동)
- 마크다운 → HTML 변환
- 네이버 블로그 에디터에 복사-붙여넣기
- **장점**: 완벽한 포맷 제어
- **단점**: 수동 작업

### 3️⃣ 블로그 리디렉션
- my-blog를 SEO 최적화
- 네이버 블로그 대신 독립 블로그 운영
- **장점**: 완전한 제어
- **단점**: 네이버 검색 유입 감소

---

## 📞 지원

문제 발생 시:
1. 스크립트 실행 시 출력된 에러 메시지 확인
2. 위의 "트러블슈팅" 섹션 참고
3. Chrome DevTools (`F12`)에서 HTML 구조 확인

---

**주의**: 이 방법은 네이버의 약관을 위반할 수 있으므로 신중하게 사용하세요.
