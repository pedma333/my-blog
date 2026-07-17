/**
 * 간단한 마크다운 → HTML 파서
 * 정규표현식 기반 구현 (외부 라이브러리 없음)
 */

class MarkdownParser {
  constructor() {
    this.rules = [
      // 코드 블록 (``` ... ```)
      { regex: /```(.*?)\n([\s\S]*?)```/g, replace: this.replaceCodeBlock.bind(this) },

      // 수평선
      { regex: /^\s*[-*_]{3,}\s*$/gm, replace: '<hr>' },

      // 제목 (# H1, ## H2 등)
      { regex: /^### (.*?)$/gm, replace: '<h3>$1</h3>' },
      { regex: /^## (.*?)$/gm, replace: '<h2>$1</h2>' },
      { regex: /^# (.*?)$/gm, replace: '<h1>$1</h1>' },

      // 굵은 텍스트 (**text** or __text__)
      { regex: /\*\*(.*?)\*\*/g, replace: '<strong>$1</strong>' },
      { regex: /__(.+?)__/g, replace: '<strong>$1</strong>' },

      // 이탤릭 (*text* or _text_)
      { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, replace: '<em>$1</em>' },
      { regex: /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, replace: '<em>$1</em>' },

      // 취소선 (~~text~~)
      { regex: /~~(.*?)~~/g, replace: '<del>$1</del>' },

      // 링크 ([text](url))
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, replace: '<a href="$2">$1</a>' },

      // 이미지 (![alt](url))
      { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, replace: '<img src="$2" alt="$1">' },

      // 인라인 코드 (`code`)
      { regex: /`([^`]+)`/g, replace: '<code>$1</code>' },
    ];
  }

  /**
   * 마크다운 텍스트를 HTML로 변환
   * @param {string} markdown - 마크다운 텍스트
   * @returns {object} { html, metadata }
   */
  parse(markdown) {
    const metadata = this.extractMetadata(markdown);
    let html = markdown;

    // 메타데이터 제거
    if (metadata) {
      html = html.replace(/^---\n[\s\S]*?\n---\n/, '');
    }

    // 마크다운 규칙 적용
    for (const rule of this.rules) {
      html = html.replace(rule.regex, rule.replace);
    }

    // 블록 요소 처리 (p, ul, ol, blockquote)
    html = this.processBlocks(html);

    return { html, metadata };
  }

  /**
   * YAML 프론트매터 추출
   */
  extractMetadata(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const yamlContent = match[1];
    const metadata = {};

    // 간단한 YAML 파싱
    yamlContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();

        // 따옴표 제거
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // 배열 처리 ([...])
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1)
            .split(',')
            .map(v => v.trim().replace(/['"]/g, ''))
            .filter(v => v);
        }

        metadata[key.trim()] = value;
      }
    });

    return Object.keys(metadata).length > 0 ? metadata : null;
  }

  /**
   * 코드 블록 렌더링
   */
  replaceCodeBlock(match, language, code) {
    const escapedCode = this.escapeHtml(code.trim());
    const lang = language ? ` class="language-${this.escapeHtml(language)}"` : '';
    return `<pre><code${lang}>${escapedCode}</code></pre>`;
  }

  /**
   * 블록 요소 처리 (단락, 리스트, 인용문 등)
   */
  processBlocks(html) {
    const lines = html.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      // 빈 줄 스킵
      if (!line) {
        i++;
        continue;
      }

      // 제목/hr/pre/code는 이미 처리됨
      if (line.startsWith('<h') || line === '<hr>' || line.startsWith('<pre')) {
        result.push(lines[i]);
        i++;
        continue;
      }

      // 인용문 (>)
      if (line.startsWith('>')) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().substring(1).trim());
          i++;
        }
        result.push(`<blockquote><p>${quoteLines.join('<br>')}</p></blockquote>`);
        continue;
      }

      // 순서 있는 리스트 (1. 2. 등)
      if (/^\d+\.\s/.test(line)) {
        const listItems = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^\d+\.\s/, '');
          listItems.push(`<li>${itemText}</li>`);
          i++;
        }
        result.push(`<ol>${listItems.join('')}</ol>`);
        continue;
      }

      // 순서 없는 리스트 (-, *, +)
      if (/^[-*+]\s/.test(line)) {
        const listItems = [];
        while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
          const itemText = lines[i].trim().replace(/^[-*+]\s/, '');
          listItems.push(`<li>${itemText}</li>`);
          i++;
        }
        result.push(`<ul>${listItems.join('')}</ul>`);
        continue;
      }

      // 표 (| 로 구분)
      if (line.includes('|')) {
        const tableLines = [line];
        let j = i + 1;

        while (j < lines.length && lines[j].trim().includes('|')) {
          tableLines.push(lines[j].trim());
          j++;
        }

        // 최소 2줄 필요 (헤더 + 구분선 또는 데이터)
        if (tableLines.length >= 2) {
          const table = this.parseTable(tableLines);
          if (table) {
            result.push(table);
            i = j;
            continue;
          }
        }
      }

      // 일반 단락
      result.push(`<p>${line}</p>`);
      i++;
    }

    return result.join('\n');
  }

  /**
   * 테이블 파싱
   */
  parseTable(lines) {
    const headerCells = lines[0].split('|').map(c => c.trim()).filter(c => c);
    const separatorRow = lines[1].split('|').map(c => c.trim()).filter(c => c);

    // 구분선 검증 (최소 하나의 :- 또는 -: 패턴)
    if (!separatorRow.some(cell => /^-+$|^:-+$|^-+:$|^:-+:$/.test(cell))) {
      return null;
    }

    let tableHtml = '<table><thead><tr>';
    headerCells.forEach(cell => {
      tableHtml += `<th>${cell}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = 2; i < lines.length; i++) {
      const dataCells = lines[i].split('|').map(c => c.trim()).filter(c => c);
      tableHtml += '<tr>';
      dataCells.forEach(cell => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    }

    tableHtml += '</tbody></table>';
    return tableHtml;
  }

  /**
   * HTML 이스케이프 (XSS 방지)
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// 전역 인스턴스
const parser = new MarkdownParser();
