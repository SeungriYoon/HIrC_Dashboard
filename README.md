# 휴머노이드 후각 디스플레이센터 통합 관리 시스템

## 📋 개요
휴머노이드 후각 디스플레이센터의 연구진, 성과, 일정, 협업 현황을 통합적으로 관리하는 웹 기반 대시보드입니다.

## 🚀 주요 기능

### 📊 지식그래프
- **카드 뷰**: 연구자별 정보를 카드 형태로 표시
- **네트워크 뷰**: 연구자 간 협력 관계를 네트워크 그래프로 시각화
- **그룹별 필터링**: 4개 연구그룹별 필터링 기능
- **검색 기능**: 연구자명, 키워드 기반 검색

### 🤝 연구 협업
- **전체 개요**: 4개 그룹의 연구 현황 요약
- **그룹별 상세**: 각 그룹의 세부 연구 내용
- **마인드맵**: 2그룹, 3그룹의 상세 연구 현황 시각화

### 📅 일정관리
- **캘린더 뷰**: 월별 일정 표시
- **일정 추가**: 논문 마감, 학회 발표 등 다양한 일정 관리
- **우선순위**: 중요도별 일정 관리

### 📈 성과관리
- **성과 요약**: 논문, 특허, 학회 발표 등 통계
- **2024년 상세**: 연도별 성과 상세 현황
- **진행률**: 목표 대비 달성률 시각화

### 💼 데이터 관리 (NEW!)
- **성과 추가**: 새로운 연구 성과 등록
- **연구자 관리**: 연구자 정보 수정
- **데이터 백업**: JSON 파일로 백업/복원
- **CSV 내보내기**: 엑셀에서 편집 가능한 형태로 내보내기

## 🛠 기술 스택
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **시각화**: D3.js
- **데이터**: JSON 파일 기반
- **배포**: GitHub Pages

## 📁 프로젝트 구조
```
HIrC 대시보드/
├── index6.html              # 메인 HTML 파일
├── js/                      # JavaScript 모듈들
│   ├── main.js             # 메인 초기화 및 데이터 관리
│   ├── knowledgeGraph.js   # 지식그래프 시각화
│   ├── achievements.js     # 성과 관리
│   ├── schedule.js         # 일정 관리
│   ├── collaboration.js    # 협업 현황
│   ├── dataManagement.js   # 데이터 관리 (NEW!)
│   └── ui.js              # UI 공통 기능
├── data/                   # 데이터 파일들 (NEW!)
│   ├── researchers.json    # 연구자 정보
│   ├── achievements.json   # 성과 데이터
│   ├── collaborations.json # 협력 관계
│   └── settings.json      # 시각화 설정
└── README.md              # 이 파일
```

## 🚀 설치 및 실행

### 방법 1: GitHub Pages (권장)
1. GitHub에 리포지토리 생성
2. 파일들을 업로드
3. Settings → Pages → Source를 "Deploy from a branch" 선택
4. Branch를 "main"으로 설정
5. 제공된 URL로 접속

### 방법 2: 로컬 서버
```bash
# 웹 서버 실행 (Python 3)
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000/index6.html
```

### 방법 3: Live Server (VS Code)
1. VS Code Live Server 확장 설치
2. index6.html 우클릭 → "Open with Live Server"

## 📚 사용법

### 기본 사용
1. **지식그래프**: 카드 뷰/네트워크 뷰 전환으로 연구자 정보 확인
2. **필터링**: 좌측 사이드바에서 그룹별 필터 적용
3. **검색**: 검색창에 연구자명이나 키워드 입력

### 데이터 관리 (관리자용)
1. **데이터 관리** 탭으로 이동
2. **성과 추가**: 새로운 논문, 특허 등 성과 등록
3. **연구자 관리**: 연구자 정보 수정
4. **백업**: 정기적으로 데이터 백업 수행

### 데이터 수정 방법
1. **JSON 파일 직접 편집**:
   - `data/` 폴더의 JSON 파일들을 직접 편집
   - 브라우저에서 새로고침

2. **관리 인터페이스 사용**:
   - 데이터 관리 탭에서 GUI로 편집
   - 변경사항이 로컬스토리지에 저장됨

## 🔧 설정 변경

### 시각화 설정 (`data/settings.json`)
```json
{
  "visualization": {
    "nodeSize": {
      "minSize": 20,        // 최소 노드 크기
      "maxSize": 80,        // 최대 노드 크기
      "paperWeight": 5,     // 논문 당 가중치
      "patentWeight": 8     // 특허 당 가중치
    },
    "colors": {
      "group1": "#E8F4FD",  // 1그룹 색상
      "group2": "#FFF2E8"   // 2그룹 색상
    }
  }
}
```

### 성과 목표 설정
```json
{
  "achievements": {
    "targets": {
      "papers": 30,         // 논문 목표
      "patents": 15,        // 특허 목표
      "conferences": 25     // 학회 목표
    }
  }
}
```

## 🤝 기여 방법
1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 릴리즈 노트

### v2.0.0 (현재)
- ✨ 데이터 관리 인터페이스 추가
- ✨ JSON 파일 기반 데이터 구조로 변경
- ✨ 백업/복원 기능
- ✨ CSV 내보내기
- 🔧 성과별 노드 크기 자동 조절
- 🔧 설정 기반 시각화 커스터마이징

### v1.0.0
- 🎉 초기 버전 출시
- 📊 지식그래프 시각화
- 🤝 연구 협업 현황
- 📅 일정 관리
- 📈 성과 관리

## ⚠️ 주의사항
- Internet Explorer는 지원하지 않습니다
- 데이터 수정 후 정기적으로 백업을 수행하세요
- 파일 경로는 상대 경로를 사용해야 GitHub Pages에서 정상 작동합니다

## 📞 문의
- 담당자: [담당자명]
- 이메일: [이메일주소]
- 이슈 신고: [GitHub Issues 링크]

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
