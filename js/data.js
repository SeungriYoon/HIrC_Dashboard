
// 연구자 데이터 (18명)
export const researcherData = [
    // 1그룹 - 후각 소재 (7명)
    {
        id: 'researcher_001', name: '오진우', group: 1, role: '책임연구원',
        department: '나노에너지공학과', specialty: '나노에너지공학',
        keywords: 'M13파지,유전자조작,바이오센서,광학센서',
        achievements: 15, tasks: 3, impactScore: 0.95
    },
    {
        id: 'researcher_002', name: '정병국', group: 1, role: '공동연구원',
        department: '화공생명공학', specialty: '화공생명공학',
        keywords: '유무기소재,박막형성,후각수용체',
        achievements: 8, tasks: 2, impactScore: 0.72
    },
    {
        id: 'researcher_003', name: '한동욱', group: 1, role: '공동연구원',
        department: '광메카트로닉스공학과', specialty: '광메카트로닉스공학',
        keywords: '광학기술,전자코,전자혀,비색센서',
        achievements: 6, tasks: 2, impactScore: 0.68
    },
    {
        id: 'researcher_004', name: '이형우', group: 1, role: '공동연구원',
        department: '나노에너지공학과', specialty: '나노에너지공학',
        keywords: '탄소나노튜브,하이브리드소재,가스센싱',
        achievements: 10, tasks: 2, impactScore: 0.78
    },
    {
        id: 'researcher_005', name: '정세영', group: 1, role: '공동연구원',
        department: '광메카트로닉스공학과', specialty: '광메카트로닉스공학',
        keywords: '전극소재,생체적합성,구리패턴',
        achievements: 5, tasks: 1, impactScore: 0.58
    },
    {
        id: 'researcher_006', name: '서지연', group: 1, role: '공동연구원',
        department: '나노에너지공학과', specialty: '나노에너지공학',
        keywords: '나노분석,물성평가,특성분석',
        achievements: 7, tasks: 2, impactScore: 0.65
    },
    {
        id: 'researcher_007', name: 'Kazou Tanaka', group: 1, role: '국제공동연구원',
        department: '고분자화학', specialty: '고분자화학',
        keywords: '국제협력,첨단기술,고분자',
        achievements: 4, tasks: 1, impactScore: 0.55
    },

    // 2그룹 - 후각 소자 (5명)  
    {
        id: 'researcher_008', name: '김종만', group: 2, role: '책임연구원',
        department: '나노에너지공학', specialty: '나노에너지공학',
        keywords: '초미세프린팅,EHD프린팅,센싱층,어셈블리',
        achievements: 12, tasks: 3, impactScore: 0.88
    },
    {
        id: 'researcher_009', name: '이승기', group: 2, role: '공동연구원',
        department: '재료공학', specialty: '재료공학',
        keywords: '센싱메커니즘,데이터베이스,신호분석',
        achievements: 9, tasks: 2, impactScore: 0.75
    },
    {
        id: 'researcher_010', name: '박석희', group: 2, role: '공동연구원',
        department: '기계공학', specialty: '기계공학',
        keywords: 'EHD프린팅,나노복합소재,센싱층',
        achievements: 6, tasks: 2, impactScore: 0.67
    },
    {
        id: 'researcher_011', name: '김승철', group: 2, role: '공동연구원',
        department: '광메카트로닉스공학과', specialty: '광메카트로닉스공학',
        keywords: '멀티스케일분석,특성평가,브릿지구조',
        achievements: 5, tasks: 1, impactScore: 0.62
    },
    {
        id: 'researcher_012', name: '김지희', group: 2, role: '공동연구원',
        department: '물리학', specialty: '물리학',
        keywords: '박막기술,신호전달,물성분석',
        achievements: 4, tasks: 1, impactScore: 0.58
    },

    // 3그룹 - 후각 시스템 (3명)
    {
        id: 'researcher_013', name: '서민호', group: 3, role: '책임연구원',
        department: '의생명공학융합부', specialty: '의생명공학',
        keywords: '센서회로,하드웨어,멀티플렉싱,신호처리',
        achievements: 11, tasks: 3, impactScore: 0.85
    },
    {
        id: 'researcher_014', name: '송명관', group: 3, role: '공동연구원',
        department: '나노디스플레이', specialty: '나노디스플레이',
        keywords: 'MOF소재,전기방사,가스필터',
        achievements: 6, tasks: 2, impactScore: 0.69
    },
    {
        id: 'researcher_015', name: '정효영', group: 3, role: '국제공동연구원',
        department: '전기전자공학', specialty: '전기전자공학',
        keywords: '무선통신,저전력설계,엣지컴퓨팅',
        achievements: 5, tasks: 1, impactScore: 0.64
    },

    // 4그룹 - 후각 데이터 처리 (3명)
    {
        id: 'researcher_016', name: '김윤학', group: 4, role: '책임연구원',
        department: '생명의료정보학', specialty: '생명의료정보학',
        keywords: '빅데이터,질병진단,기계학습,패턴분석',
        achievements: 13, tasks: 3, impactScore: 0.91
    },
    {
        id: 'researcher_017', name: '임희창', group: 4, role: '공동연구원',
        department: '기계공학', specialty: '기계공학',
        keywords: '딥러닝,노이즈제거,패턴인식',
        achievements: 7, tasks: 2, impactScore: 0.71
    },
    {
        id: 'researcher_018', name: '김현민', group: 4, role: '공동연구원',
        department: '수학', specialty: '수학',
        keywords: '빅데이터,텐서분석,특징추출',
        achievements: 6, tasks: 2, impactScore: 0.66
    }
];

// 이벤트 타입 정의
export const eventTypes = {
    paper_deadline: { label: '논문 마감', color: '#ef4444' },
    conference_presentation: { label: '학회 발표', color: '#3b82f6' },
    grant_application: { label: '연구비 신청', color: '#10b981' },
    seminar: { label: '세미나', color: '#8b5cf6' },
    experiment: { label: '실험 일정', color: '#f59e0b' },
    meeting: { label: '회의', color: '#6b7280' }
};

// 협업 관계 데이터
export const collaborationData = [
    { source: 'researcher_001', target: 'researcher_003', weight: 3 },
    { source: 'researcher_001', target: 'researcher_004', weight: 2 },
    { source: 'researcher_001', target: 'researcher_006', weight: 1 },
    { source: 'researcher_004', target: 'researcher_006', weight: 2 },
    { source: 'researcher_002', target: 'researcher_012', weight: 1 },
    { source: 'researcher_008', target: 'researcher_009', weight: 2 },
    { source: 'researcher_008', target: 'researcher_010', weight: 1 },
    { source: 'researcher_010', target: 'researcher_011', weight: 2 },
    { source: 'researcher_011', target: 'researcher_012', weight: 1 },
    { source: 'researcher_013', target: 'researcher_015', weight: 3 },
    { source: 'researcher_013', target: 'researcher_014', weight: 2 },
    { source: 'researcher_016', target: 'researcher_017', weight: 2 },
    { source: 'researcher_017', target: 'researcher_018', weight: 1 },
    { source: 'researcher_001', target: 'researcher_008', weight: 2 },
    { source: 'researcher_008', target: 'researcher_013', weight: 1 },
    { source: 'researcher_013', target: 'researcher_016', weight: 2 },
    { source: 'researcher_001', target: 'researcher_016', weight: 1 }
];
