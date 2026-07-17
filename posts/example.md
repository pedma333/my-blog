---
title: 마크다운 문법 가이드
date: 2026-07-15
author: 관리자
category: 튜토리얼
tags: [마크다운, 가이드, 문법]
---

# 마크다운 문법 가이드 📚

이 글은 **my-blog**에서 지원하는 마크다운 문법을 모두 시연합니다.

## 제목 (Headings)

```markdown
# H1 제목
## H2 제목
### H3 제목
#### H4 제목
##### H5 제목
###### H6 제목
```

위의 코드로 위와 같은 제목들을 만들 수 있습니다.

---

## 텍스트 포매팅

### 굵은 텍스트 (Bold)
**이것은 굵은 텍스트입니다.** `**텍스트**` 또는 `__텍스트__` 로 작성합니다.

### 이탤릭 (Italic)
*이것은 이탤릭 텍스트입니다.* `*텍스트*` 또는 `_텍스트_` 로 작성합니다.

### 취소선 (Strikethrough)
~~이 부분은 제거되었습니다.~~ `~~텍스트~~` 로 작성합니다.

### 조합
***굵고 이탤릭***한 텍스트도 가능합니다.

---

## 리스트

### 순서 없는 리스트 (Unordered List)

- 첫 번째 항목
- 두 번째 항목
  - 중첩된 항목
  - 또 다른 중첩 항목
- 세 번째 항목

### 순서 있는 리스트 (Ordered List)

1. 첫 번째 항목
2. 두 번째 항목
   1. 중첩된 항목
   2. 또 다른 중첩 항목
3. 세 번째 항목

---

## 링크와 이미지

### 링크 (Links)

[OpenAI 웹사이트](https://openai.com)

[새 탭에서 열기](https://github.com)

### 이미지 (Images)

마크다운에서 이미지 삽입:

```markdown
![대체 텍스트](image-url)
```

---

## 코드

### 인라인 코드

`const greeting = 'Hello, World!';` 처럼 한 줄 코드를 표현할 때 사용합니다.

### 코드 블록

#### JavaScript
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

#### Python
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

#### HTML
```html
<div class="container">
  <h1>Welcome</h1>
  <p>This is a paragraph.</p>
</div>
```

#### CSS
```css
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
```

---

## 인용문 (Blockquote)

> 이것은 인용문입니다.
> 여러 줄을 사용할 수 있습니다.

> "위대한 변화는 작은 행동에서 시작된다."
> — 무명의 저자

---

## 표 (Table)

| 이름 | 직업 | 위치 |
|------|------|------|
| Alice | 엔지니어 | 서울 |
| Bob | 디자이너 | 부산 |
| Charlie | 마케터 | 인천 |
| Diana | 제품 매니저 | 대구 |

더 복잡한 표:

| 언어 | 난이도 | 추천 대상 |
|------|--------|---------|
| Python | 초급 | 초보자 |
| JavaScript | 초급~중급 | 웹 개발자 |
| Go | 중급 | 백엔드 엔지니어 |

---

## 수평선 (Horizontal Rule)

---

위는 수평선입니다. `---`, `***`, `___` 로 만들 수 있습니다.

---

## 특수 문법

### 체크박스 (Checklist)
- [x] 완료된 항목
- [ ] 미완료 항목
- [x] 또 다른 완료 항목

### 이모지 (Emoji)
🚀 😀 ❤️ 🎉 🔥 ⭐ 💡 🎨

---

## 팁과 주의사항

> 💡 **팁**: 마크다운은 HTML을 포함할 수도 있습니다.
> 
> 예: <span style="color: red;">빨간 텍스트</span>

> ⚠️ **주의**: XSS 공격을 방지하기 위해 사용자 입력은 항상 이스케이프됩니다.

---

## 복합 예제

### 프로젝트 설명

```
my-blog: 순수 HTML/CSS/JavaScript 블로그
```

**주요 특징:**
1. 🚀 빠른 로딩
2. 🌓 다크모드 지원
3. 📱 모바일 최적화
4. ♿ 접근성 준수

**기술 스택:**

| 항목 | 설명 |
|------|------|
| 프론트엔드 | HTML5, CSS3 |
| 스크립트 | Vanilla JavaScript |
| 파서 | 커스텀 마크다운 파서 |

---

## 마무리

이 가이드에서 **my-blog**가 지원하는 모든 마크다운 문법을 살펴봤습니다.

더 궁금한 사항은 [환영 글](blog.html?post=welcome)을 참고하세요!

**즐거운 블로깅! 🎊**
