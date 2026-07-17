"""
my-blog → 네이버 블로그 자동 발행 도구
Python 3.8+ 필요
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

class NaverBlogPublisher:
    def __init__(self, blog_id, password):
        """
        초기화
        :param blog_id: 네이버 블로그 ID
        :param password: 네이버 계정 비밀번호 (환경변수에서 읽기 권장)
        """
        self.blog_id = blog_id
        self.password = password
        self.driver = None
        self.posts_dir = Path(__file__).parent / 'posts'
        self.published = []

    def start_driver(self):
        """Selenium WebDriver 시작"""
        options = webdriver.ChromeOptions()
        # options.add_argument('--headless')  # 백그라운드 모드 (필요시 활성화)
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        self.driver = webdriver.Chrome(options=options)
        print("✅ WebDriver 시작됨")

    def close_driver(self):
        """WebDriver 종료"""
        if self.driver:
            self.driver.quit()
            print("✅ WebDriver 종료됨")

    def login(self):
        """네이버 로그인"""
        print("\n📝 네이버 로그인 중...")
        self.driver.get('https://nid.naver.com/nidlogin.login')

        try:
            # 아이디 입력
            id_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, 'id'))
            )
            id_input.send_keys(self.blog_id)

            # 비밀번호 입력
            pw_input = self.driver.find_element(By.ID, 'pw')
            pw_input.send_keys(self.password)

            # 로그인 버튼
            login_btn = self.driver.find_element(By.ID, 'log.login')
            login_btn.click()

            # 로그인 완료 대기
            time.sleep(3)
            print("✅ 로그인 성공")

        except Exception as e:
            print(f"❌ 로그인 실패: {e}")
            raise

    def go_to_editor(self):
        """블로그 작성 페이지로 이동"""
        print("📝 블로그 에디터로 이동 중...")
        self.driver.get(f'https://blog.naver.com/{self.blog_id}/postwrite')
        time.sleep(2)
        print("✅ 에디터 페이지 로드됨")

    def publish_post(self, title, content, category=''):
        """
        블로그 글 발행

        :param title: 글 제목
        :param content: HTML 내용
        :param category: 카테고리 (선택사항)
        """
        try:
            print(f"\n📄 글 발행 중: {title}")

            # 제목 입력
            title_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'se-textarea'))
            )
            title_input.clear()
            title_input.send_keys(title)

            # 에디터 frame으로 전환
            editor_frame = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, 'se-container'))
            )

            # 내용 입력 (JavaScript 사용)
            self.driver.execute_script(f"""
                const editor = document.querySelector('.se-container');
                editor.innerHTML = `{content}`;
            """)

            time.sleep(1)

            # 발행 버튼 클릭
            publish_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CLASS_NAME, 'btn_publish'))
            )
            publish_btn.click()

            # 발행 완료 대기
            time.sleep(2)
            print(f"✅ 글 발행 완료: {title}")
            self.published.append(title)

        except Exception as e:
            print(f"❌ 글 발행 실패 ({title}): {e}")

    def load_posts(self):
        """posts 디렉토리에서 마크다운 파일 로드"""
        posts = []

        manifest_path = self.posts_dir / 'manifest.json'
        if manifest_path.exists():
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
                post_files = manifest.get('files', [])
        else:
            post_files = [f.name for f in self.posts_dir.glob('*.md')]

        for filename in post_files:
            filepath = self.posts_dir / filename
            if filepath.exists():
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    posts.append({
                        'filename': filename,
                        'content': content
                    })

        return posts

    def markdown_to_html(self, markdown):
        """마크다운을 HTML로 변환 (기본 변환)"""
        # 실제로는 js/markdown-parser.js의 로직을 Python으로 재구현하거나,
        # Node.js를 호출하여 처리

        html = markdown

        # 간단한 마크다운 변환 (실제로는 더 완벽한 파서 필요)
        html = html.replace('**', '<strong>').replace('**', '</strong>')
        html = html.replace('*', '<em>').replace('*', '</em>')
        html = html.replace('\n\n', '<br><br>')
        html = html.replace('# ', '<h1>').replace('\n', '</h1>\n')

        return html

    def extract_metadata(self, markdown):
        """YAML 프론트매터에서 메타데이터 추출"""
        lines = markdown.split('\n')
        metadata = {}

        if lines[0].strip() == '---':
            i = 1
            while i < len(lines) and lines[i].strip() != '---':
                if ':' in lines[i]:
                    key, value = lines[i].split(':', 1)
                    metadata[key.strip()] = value.strip()
                i += 1

        return metadata

    def publish_all(self):
        """모든 마크다운 파일을 네이버 블로그에 발행"""
        try:
            self.start_driver()
            self.login()

            posts = self.load_posts()
            print(f"\n📚 발행할 글: {len(posts)}개")

            for post in posts:
                metadata = self.extract_metadata(post['content'])
                title = metadata.get('title', post['filename'])

                # 메타데이터 제거
                content = post['content']
                if content.startswith('---'):
                    content = content.split('---', 2)[2].strip()

                html = self.markdown_to_html(content)

                self.go_to_editor()
                self.publish_post(title, html)

                time.sleep(2)

            print(f"\n✅ 완료! {len(self.published)}개 글 발행됨")

        finally:
            self.close_driver()

if __name__ == '__main__':
    # 사용 방법
    import getpass

    print("🚀 my-blog → 네이버 블로그 자동 발행")
    print("=" * 50)

    blog_id = input("네이버 블로그 ID: ").strip()
    password = getpass.getpass("네이버 비밀번호 (입력되지 않음): ")

    publisher = NaverBlogPublisher(blog_id, password)
    publisher.publish_all()
