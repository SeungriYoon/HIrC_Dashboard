import { showNotification } from './ui.js';
import { renderResearchers } from './knowledgeGraph.js';
import { achievements2024 } from './achievement_2024.js';
import { getResearchers, getCollaborations } from './main.js';

let achievements = [];

// 성과 추가
export function addAchievement(researchers) {
    try {
        const type = document.getElementById('achievementType').value;
        const title = document.getElementById('achievementTitle').value;
        const researcher = document.getElementById('achievementResearcher').value;
        const date = document.getElementById('achievementDate').value;
        const description = document.getElementById('achievementDescription').value;

        if (!title.trim()) {
            showNotification('성과 제목을 입력해주세요.', 'error');
            return;
        }

        if (!researcher) {
            showNotification('연구자를 선택해주세요.', 'error');
            return;
        }

        const newAchievement = {
            id: Date.now(),
            type: type,
            title: title,
            researcher: researcher,
            date: date,
            description: description,
            createdAt: new Date()
        };

        achievements.push(newAchievement);

        // 연구자 데이터도 업데이트
        const researcherObj = researchers.find(r => r.name === researcher);
        if (researcherObj) {
            if (type === 'paper') researcherObj.papers = (researcherObj.papers || 0) + 1;
            else if (type === 'patent') researcherObj.patents = (researcherObj.patents || 0) + 1;
            else if (type === 'conference') researcherObj.conferences = (researcherObj.conferences || 0) + 1;
            else if (type === 'award') researcherObj.awards = (researcherObj.awards || 0) + 1;
            
            researcherObj.achievements = (researcherObj.achievements || 0) + 1;
        }

        // 폼 초기화
        document.getElementById('achievementTitle').value = '';
        document.getElementById('achievementResearcher').value = '';
        document.getElementById('achievementDate').value = '';
        document.getElementById('achievementDescription').value = '';

        // 성과 카드 업데이트
        renderAchievementCards(researchers);
        const collaborations = getCollaborations();
        renderResearchers(researchers, collaborations); // 연구자 카드도 업데이트

        showNotification('성과가 성공적으로 추가되었습니다.', 'success');
    } catch (error) {
        console.error('성과 추가 오류:', error);
        showNotification('성과 추가 중 오류가 발생했습니다.', 'error');
    }
}
        
// 성과관리 탭 동적 렌더링
// [추가] 과거 구조 기반 하드코딩 성과 카드 렌더링
function renderStaticAchievementCards() {
    const achievementsContainer = document.querySelector('#achievement-summary .achievements-grid');
    achievementsContainer.innerHTML = `
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">📄 논문 발표</div>
                <div class="achievement-count">23</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 76%"></div>
            </div>
            <p>국제학회 논문 15편, 국내학회 논문 8편</p>
        </div>
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🏆 특허 등록</div>
                <div class="achievement-count">8</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 53%"></div>
            </div>
            <p>국내특허 5건, 국제특허 3건</p>
        </div>
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">💰 연구비 수주</div>
                <div class="achievement-count">12억</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 80%"></div>
            </div>
            <p>정부과제 8억, 산업체 과제 4억</p>
        </div>
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🤝 산학협력</div>
                <div class="achievement-count">15</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 62%"></div>
            </div>
            <p>대기업 6개사, 중소기업 9개사</p>
        </div>
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🎓 인력양성</div>
                <div class="achievement-count">27</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 90%"></div>
            </div>
            <p>박사 12명, 석사 15명</p>
        </div>
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🌍 국제협력</div>
                <div class="achievement-count">6</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 40%"></div>
            </div>
            <p>미국 2개기관, 유럽 3개기관, 아시아 1개기관</p>
        </div>
    `;
}

export function renderAchievementCards(researchers) {
    const achievementsContainer = document.querySelector('#achievement-summary .achievements-grid');
    
    // 실제 성과 데이터 계산
    const actualStats = {
        papers: researchers.reduce((sum, r) => sum + (r.papers || 0), 0),
        patents: researchers.reduce((sum, r) => sum + (r.patents || 0), 0),
        conferences: researchers.reduce((sum, r) => sum + (r.conferences || 0), 0),
        awards: researchers.reduce((sum, r) => sum + (r.awards || 0), 0),
        cooperation: 15, // 고정값 (CSV에 없는 데이터)
        education: researchers.reduce((sum, r) => sum + (r.awards || 0), 0) // 임시로 awards 사용
    };
    
    // 만약 모든 값이 0이면(즉, 연구자 데이터에 papers 등 없음), 하드코딩 카드 렌더링
    if (
        actualStats.papers === 0 &&
        actualStats.patents === 0 &&
        actualStats.conferences === 0 &&
        actualStats.awards === 0 &&
        actualStats.education === 0
    ) {
        renderStaticAchievementCards();
        return;
    }
    
    // 목표값 설정
    const targets = {
        papers: 30,
        patents: 15,
        conferences: 25,
        awards: 10,
        cooperation: 20,
        education: 30
    };
    
    // 퍼센트 계산
    const percentages = {
        papers: Math.min(Math.round((actualStats.papers / targets.papers) * 100), 100),
        patents: Math.min(Math.round((actualStats.patents / targets.patents) * 100), 100),
        conferences: Math.min(Math.round((actualStats.conferences / targets.conferences) * 100), 100),
        awards: Math.min(Math.round((actualStats.awards / targets.awards) * 100), 100),
        cooperation: Math.min(Math.round((actualStats.cooperation / targets.cooperation) * 100), 100),
        education: Math.min(Math.round((actualStats.education / targets.education) * 100), 100)
    };

    achievementsContainer.innerHTML = `
        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">📄 논문 발표</div>
                <div class="achievement-count">${actualStats.papers}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.papers}%"></div>
                <div class="progress-text">${percentages.papers}%</div>
            </div>
            <p>목표 ${targets.papers}편 중 ${actualStats.papers}편 달성</p>
        </div>

        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🏆 특허 등록</div>
                <div class="achievement-count">${actualStats.patents}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.patents}%"></div>
                <div class="progress-text">${percentages.patents}%</div>
            </div>
            <p>목표 ${targets.patents}건 중 ${actualStats.patents}건 달성</p>
        </div>

        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🎓 학술대회 발표</div>
                <div class="achievement-count">${actualStats.conferences}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.conferences}%"></div>
                <div class="progress-text">${percentages.conferences}%</div>
            </div>
            <p>목표 ${targets.conferences}건 중 ${actualStats.conferences}건 달성</p>
        </div>

        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🏅 수상 및 영예</div>
                <div class="achievement-count">${actualStats.awards}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.awards}%"></div>
                <div class="progress-text">${percentages.awards}%</div>
            </div>
            <p>목표 ${targets.awards}건 중 ${actualStats.awards}건 달성</p>
        </div>

        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🤝 산학협력</div>
                <div class="achievement-count">${actualStats.cooperation}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.cooperation}%"></div>
                <div class="progress-text">${percentages.cooperation}%</div>
            </div>
            <p>목표 ${targets.cooperation}건 중 ${actualStats.cooperation}건 달성</p>
        </div>

        <div class="achievement-card">
            <div class="achievement-header">
                <div class="achievement-title">🎓 인력양성</div>
                <div class="achievement-count">${actualStats.education}</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentages.education}%"></div>
                <div class="progress-text">${percentages.education}%</div>
            </div>
            <p>목표 ${targets.education}명 중 ${actualStats.education}명 달성</p>
        </div>
    `;
}

export function render2024Achievements() {
    const container = document.getElementById('achievements2024Grid');
    
    // 날짜를 기준으로 내림차순 정렬
    const sortedAchievements = [...achievements2024].sort((a, b) => {
        const dateA = new Date(a['Date of Occurrence']);
        const dateB = new Date(b['Date of Occurrence']);
        return dateB - dateA; // 내림차순
    });

    container.innerHTML = sortedAchievements.map(item => {
        const allResearchers = getResearchers();
    const researcher = allResearchers.find(r => r.id === item.responsible_researchers);
        const researcherName = researcher ? researcher.name : '알 수 없음';
        const journalInfo = item['Achievement Name'] === 'Paper' && item['Journal Name'] ? 
                            `<p><strong>저널:</strong> ${item['Journal Name']}</p>` : '';

        return `
            <div class="achievement-card achievement-2024-card" data-achievement-id="${item.id}">
                <div class="achievement-header">
                    <div class="achievement-title">${item['Achievement Name']}</div>
                    <div class="achievement-count">${item['Date of Occurrence']}</div>
                </div>
                <p><strong>연구원:</strong> ${researcherName}</p>
                <p><strong>제목:</strong> ${item['Title and Content']}</p>
                ${journalInfo}
            </div>
        `;
    }).join('');

    // 클릭 이벤트 리스너 추가
    document.querySelectorAll('.achievement-2024-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const achievementId = event.currentTarget.dataset.achievementId;
            const selectedAchievement = achievements2024.find(a => a.id === achievementId);
            if (selectedAchievement) {
                showAchievementDetailModal(selectedAchievement);
            }
        });
    });
}

// 2024년 성과 상세 모달 표시 함수
function showAchievementDetailModal(achievement) {
    const modal = document.getElementById('achievementDetailModal');
    const modalContent = document.getElementById('achievementDetailModalContent');
    
    const allResearchers = getResearchers();
    const researcher = allResearchers.find(r => r.id === achievement.responsible_researchers);
    const researcherName = researcher ? researcher.name : '알 수 없음';
    const journalInfo = achievement['Achievement Name'] === 'Paper' && achievement['Journal Name'] ? 
                        `<p><strong>저널:</strong> ${achievement['Journal Name']}</p>` : '';

    modalContent.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">${achievement['Achievement Name']}</h3>
            <button class="modal-close" id="closeAchievementDetailModalBtn">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>연구원:</strong> ${researcherName}</p>
            <p><strong>그룹:</strong> ${achievement.group_id}그룹</p>
            <p><strong>제목 및 내용:</strong> ${achievement['Title and Content']}</p>
            <p><strong>국내/국외:</strong> ${achievement['Domestic/International']}</p>
            <p><strong>발생일:</strong> ${achievement['Date of Occurrence']}</p>
            ${journalInfo}
            ${achievement['Impact Factor'] ? `<p><strong>Impact Factor:</strong> ${achievement['Impact Factor']}</p>` : ''}
            ${achievement['Contribution Rate (%)'] ? `<p><strong>기여율:</strong> ${achievement['Contribution Rate (%)']}%</p>` : ''}
            ${achievement['JCR Top (%)'] ? `<p><strong>JCR Top:</strong> ${achievement['JCR Top (%)']}%</p>` : ''}
            ${achievement['Number of Acknowledged Papers'] ? `<p><strong>인정 논문 수:</strong> ${achievement['Number of Acknowledged Papers']}</p>` : ''}
        </div>
    `;

    modal.classList.add('show');

    document.getElementById('closeAchievementDetailModalBtn').addEventListener('click', () => {
        modal.classList.remove('show');
    });
}


export function switchAchievementTab(tabName, target) {
    console.log('achievements.js: switchAchievementTab() 호출');
    document.querySelectorAll('#achievements .collab-tab-btn').forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');

    document.querySelectorAll('#achievements .collab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`achievement-${tabName}`).classList.add('active');

    if (tabName === '2024') {
        render2024Achievements();
    }
}