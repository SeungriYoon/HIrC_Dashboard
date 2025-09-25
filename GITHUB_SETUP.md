# GitHub Pages 설정 가이드

## 📋 개요
이 가이드는 휴머노이드 후각 디스플레이센터 대시보드를 GitHub Pages에 배포하는 방법을 설명합니다.

## 🚀 1단계: GitHub 저장소 생성

### 1.1 GitHub 계정 준비
- GitHub 계정이 없다면 [github.com](https://github.com)에서 무료 계정 생성
- 기관용 계정 사용 권장

### 1.2 새 저장소 생성
1. GitHub에 로그인
2. 우상단의 "+" 버튼 → "New repository" 클릭
3. 저장소 설정:
   ```
   Repository name: hirc-dashboard
   Description: 휴머노이드 후각 디스플레이센터 통합 관리 시스템
   Public/Private: Public (무료 계정의 경우 Public 필요)
   Initialize this repository with: README 체크 해제
   ```
4. "Create repository" 클릭

## 📁 2단계: 파일 업로드

### 2.1 필수 파일 목록
다음 파일들을 저장소에 업로드해야 합니다:

```
📂 저장소 루트/
├── index6.html              # 메인 HTML 파일
├── manual.html             # 사용자 매뉴얼
├── README.md              # 프로젝트 설명
├── 📂 js/                 # JavaScript 파일들
│   ├── main.js
│   ├── knowledgeGraph.js
│   ├── achievements.js
│   ├── schedule.js
│   ├── collaboration.js
│   ├── dataManagement.js
│   ├── ui.js
│   ├── data.js
│   └── achievement_2024.js
├── 📂 data/               # 데이터 파일들
│   ├── researchers.json
│   ├── achievements.json
│   ├── collaborations.json
│   └── settings.json
└── 📂 js/images/         # 이미지 파일들 (선택사항)
    ├── group1.jpg
    ├── group2.jpg
    ├── group3.jpg
    └── group4.jpg
```

### 2.2 업로드 방법

#### 방법 A: 웹 인터페이스 사용 (권장)
1. GitHub 저장소 페이지에서 "uploading an existing file" 클릭
2. 모든 파일을 드래그 앤 드롭하여 업로드
3. 폴더 구조를 유지하며 업로드 (브라우저가 지원하는 경우)
4. 커밋 메시지 작성: "Initial upload: Dashboard files"
5. "Commit new files" 클릭

#### 방법 B: Git 사용 (고급 사용자)
```bash
# 저장소 클론
git clone https://github.com/[사용자명]/hirc-dashboard.git
cd hirc-dashboard

# 파일 복사 (로컬에서 파일들을 이 폴더로 복사)

# Git에 파일 추가
git add .
git commit -m "Initial upload: Dashboard files"
git push origin main
```

## 🌐 3단계: GitHub Pages 활성화

### 3.1 Pages 설정
1. GitHub 저장소 페이지에서 "Settings" 탭 클릭
2. 좌측 메뉴에서 "Pages" 클릭
3. Source 설정:
   ```
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   ```
4. "Save" 클릭

### 3.2 URL 확인
- 설정 완료 후 약 5-10분 내에 배포 완료
- URL 형식: `https://[사용자명].github.io/hirc-dashboard/`
- 메인 페이지 URL: `https://[사용자명].github.io/hirc-dashboard/index6.html`

## 🔧 4단계: 도메인 설정 (선택사항)

### 4.1 커스텀 도메인 사용
1. 도메인을 보유한 경우 DNS 설정에서 CNAME 레코드 추가:
   ```
   Type: CNAME
   Name: dashboard (또는 원하는 서브도메인)
   Value: [사용자명].github.io
   ```
2. GitHub Pages 설정에서 "Custom domain"에 도메인 입력
3. "Enforce HTTPS" 체크박스 활성화

### 4.2 GitHub 서브도메인 사용
- 기본 제공되는 `github.io` 도메인 그대로 사용
- 별도 설정 불필요

## 📋 5단계: 초기 설정 및 테스트

### 5.1 배포 확인
1. 제공된 URL로 접속
2. 모든 탭이 정상적으로 작동하는지 확인
3. 데이터가 올바르게 로드되는지 확인

### 5.2 문제 해결
만약 페이지가 로드되지 않는다면:

1. **파일 경로 확인**
   ```html
   <!-- 절대 경로 대신 상대 경로 사용 -->
   <script src="./js/main.js"></script>  <!-- 올바름 -->
   <script src="/js/main.js"></script>   <!-- 잘못됨 -->
   ```

2. **대소문자 확인**
   - GitHub는 대소문자를 구분합니다
   - 파일명과 경로의 대소문자가 정확한지 확인

3. **CORS 오류 해결**
   ```javascript
   // fetch API 사용 시 상대 경로 사용
   fetch('./data/researchers.json')  // 올바름
   fetch('/data/researchers.json')   // GitHub Pages에서 오류 발생 가능
   ```

## 🔄 6단계: 업데이트 및 관리

### 6.1 데이터 업데이트
1. **JSON 파일 직접 편집**:
   - GitHub 웹에서 직접 파일 편집
   - `data/` 폴더의 JSON 파일 수정
   - 변경 후 자동으로 사이트 업데이트 (약 1-2분 소요)

2. **대시보드에서 관리**:
   - "데이터 관리" 탭에서 성과 추가, 연구자 정보 수정
   - 변경사항은 로컬스토리지에 저장됨
   - 정기적으로 백업 수행 후 GitHub에 업로드

### 6.2 정기적인 백업
1. 대시보드에서 "전체 데이터 백업" 수행
2. 백업 파일을 GitHub 저장소에 업로드
3. 월 1회 이상 백업 권장

### 6.3 버전 관리
```bash
# 변경사항이 있을 때마다 커밋
git add .
git commit -m "Update: 새로운 연구성과 추가"
git push origin main
```

## 🔒 7단계: 보안 및 접근 제어

### 7.1 저장소 공개 설정
- **Public**: 누구나 접근 가능 (무료)
- **Private**: 초대된 사용자만 접근 가능 (유료)

### 7.2 협업자 추가
1. Settings → Manage access
2. "Invite a collaborator" 클릭
3. 이메일 또는 사용자명 입력
4. 권한 설정 (Read, Write, Admin)

### 7.3 브랜치 보호
```
Settings → Branches → Add rule
- Branch name pattern: main
- Protect matching branches
- Require pull request reviews
```

## 📊 8단계: 모니터링 및 분석

### 8.1 GitHub 인사이트
- Insights 탭에서 트래픽, 클론 수 등 확인
- 인기 페이지 및 참조 사이트 분석

### 8.2 Google Analytics 연동 (선택사항)
```html
<!-- index6.html의 <head> 태그에 추가 -->
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛠 문제 해결

### 자주 발생하는 문제들

1. **404 오류**
   ```
   문제: 파일을 찾을 수 없음
   해결: 파일 경로와 이름을 정확히 확인
         대소문자 구분 주의
   ```

2. **CORS 오류**
   ```
   문제: Cross-Origin Resource Sharing 오류
   해결: 상대 경로 사용 (./data/file.json)
         절대 경로 피하기 (/data/file.json)
   ```

3. **데이터 로딩 실패**
   ```
   문제: JSON 파일이 로드되지 않음
   해결: JSON 문법 검사 (jsonlint.com 등 사용)
         파일 인코딩 UTF-8 확인
   ```

4. **캐싱 문제**
   ```
   문제: 변경사항이 반영되지 않음
   해결: 브라우저 강력 새로고침 (Ctrl+F5)
         GitHub Pages 배포 시간 대기 (최대 10분)
   ```

## 📞 지원 및 문의

### GitHub 관련 문제
- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [GitHub Community](https://github.community/)

### 대시보드 관련 문제
- 프로젝트 README.md 참조
- GitHub Issues에 문제 신고

---

## ✅ 체크리스트

배포 전 확인사항:
- [ ] 모든 필수 파일이 올바른 위치에 있음
- [ ] JSON 파일 문법이 올바름
- [ ] 상대 경로 사용 확인
- [ ] 대소문자 정확성 확인
- [ ] 로컬에서 정상 작동 테스트
- [ ] GitHub Pages 활성화
- [ ] URL 접속 및 기능 테스트
- [ ] 백업 시스템 구축
- [ ] 사용자 매뉴얼 업데이트

**🎉 축하합니다! 이제 GitHub Pages에서 대시보드가 정상적으로 실행됩니다.**