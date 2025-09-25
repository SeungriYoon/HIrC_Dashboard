import { showNotification } from './ui.js';
import { getResearchers, getAchievements, getCollaborations, saveData } from './main.js';
import { renderResearchers } from './knowledgeGraph.js';
import { renderAchievementCards } from './achievements.js';

// 데이터 관리 탭 초기화
export function initializeDataManagement() {
    populateResearcherSelects();
    setupEventListeners();
    updateStatistics();
}

// 연구자 선택 드롭다운 채우기
function populateResearcherSelects() {
    const researchers = getResearchers();
    const achievementSelect = document.getElementById('achievementResearcher');
    const editSelect = document.getElementById('editResearcherSelect');

    if (achievementSelect) {
        achievementSelect.innerHTML = '<option value="">연구자를 선택하세요</option>';
        researchers.forEach(researcher => {
            const option = document.createElement('option');
            option.value = researcher.name;
            option.textContent = `${researcher.name} (${researcher.group}그룹)`;
            achievementSelect.appendChild(option);
        });
    }

    if (editSelect) {
        editSelect.innerHTML = '<option value="">연구자를 선택하세요</option>';
        researchers.forEach(researcher => {
            const option = document.createElement('option');
            option.value = researcher.id;
            option.textContent = `${researcher.name} (${researcher.group}그룹)`;
            editSelect.appendChild(option);
        });
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 성과 추가
    const addAchievementBtn = document.getElementById('addAchievementBtn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', addNewAchievement);
    }

    // 연구자 선택 시 정보 표시
    const editSelect = document.getElementById('editResearcherSelect');
    if (editSelect) {
        editSelect.addEventListener('change', showResearcherEditForm);
    }

    // 연구자 정보 수정
    const updateBtn = document.getElementById('updateResearcherBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateResearcher);
    }

    // 백업 & 복원
    const backupBtn = document.getElementById('backupDataBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', backupAllData);
    }

    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCsv);
    }

    const importBtn = document.getElementById('importDataBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            document.getElementById('importDataFile').click();
        });
    }

    const fileInput = document.getElementById('importDataFile');
    if (fileInput) {
        fileInput.addEventListener('change', importData);
    }

    const resetBtn = document.getElementById('resetAllDataBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllData);
    }
}

// 새로운 성과 추가
async function addNewAchievement() {
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

    if (!date) {
        showNotification('날짜를 선택해주세요.', 'error');
        return;
    }

    const newAchievement = {
        id: `achieve_${Date.now()}`,
        type,
        title,
        researcher,
        date,
        description,
        createdAt: new Date().toISOString()
    };

    // 현재 성과 목록 가져오기 (로컬스토리지에서)
    let achievements = JSON.parse(localStorage.getItem('hirc_achievements') || '[]');

    // 기존 JSON 데이터가 있다면 합치기
    const defaultAchievements = getAchievements();
    if (achievements.length === 0 && defaultAchievements.length > 0) {
        achievements = [...defaultAchievements];
    }

    achievements.push(newAchievement);

    // 연구자 데이터 업데이트
    const researchers = getResearchers();
    const researcherObj = researchers.find(r => r.name === researcher);
    if (researcherObj) {
        if (type === 'paper') researcherObj.papers = (researcherObj.papers || 0) + 1;
        else if (type === 'patent') researcherObj.patents = (researcherObj.patents || 0) + 1;
        else if (type === 'conference') researcherObj.conferences = (researcherObj.conferences || 0) + 1;
        else if (type === 'award') researcherObj.awards = (researcherObj.awards || 0) + 1;

        researcherObj.achievements = (researcherObj.achievements || 0) + 1;
    }

    // 데이터 저장
    await saveData('achievements', achievements);
    await saveData('researchers', researchers);

    // 폼 초기화
    document.getElementById('achievementTitle').value = '';
    document.getElementById('achievementResearcher').value = '';
    document.getElementById('achievementDate').value = '';
    document.getElementById('achievementDescription').value = '';

    // UI 업데이트
    const collaborations = getCollaborations();
    renderAchievementCards(researchers);
    renderResearchers(researchers, collaborations);
    updateStatistics();

    showNotification('성과가 성공적으로 추가되었습니다.', 'success');
}

// 연구자 편집 폼 표시
function showResearcherEditForm() {
    const selectElement = document.getElementById('editResearcherSelect');
    const formDiv = document.getElementById('researcherEditForm');
    const researcherId = selectElement.value;

    if (!researcherId) {
        formDiv.style.display = 'none';
        return;
    }

    const researchers = getResearchers();
    const researcher = researchers.find(r => r.id === researcherId);

    if (researcher) {
        document.getElementById('editResearcherName').value = researcher.name;
        document.getElementById('editResearcherRole').value = researcher.role;
        document.getElementById('editResearcherDepartment').value = researcher.department;
        document.getElementById('editResearcherKeywords').value =
            Array.isArray(researcher.keywords) ? researcher.keywords.join(', ') : researcher.keywords;

        formDiv.style.display = 'block';
    }
}

// 연구자 정보 수정
async function updateResearcher() {
    const researcherId = document.getElementById('editResearcherSelect').value;

    if (!researcherId) {
        showNotification('연구자를 선택해주세요.', 'error');
        return;
    }

    const researchers = getResearchers();
    const researcher = researchers.find(r => r.id === researcherId);

    if (researcher) {
        researcher.role = document.getElementById('editResearcherRole').value;
        researcher.department = document.getElementById('editResearcherDepartment').value;

        const keywordsValue = document.getElementById('editResearcherKeywords').value;
        researcher.keywords = keywordsValue.split(',').map(k => k.trim()).filter(k => k);

        // 데이터 저장
        await saveData('researchers', researchers);

        // UI 업데이트
        const collaborations = getCollaborations();
        renderResearchers(researchers, collaborations);
        populateResearcherSelects();

        showNotification('연구자 정보가 성공적으로 수정되었습니다.', 'success');
    }
}

// 전체 데이터 백업
function backupAllData() {
    const data = {
        researchers: getResearchers(),
        achievements: JSON.parse(localStorage.getItem('hirc_achievements') || '[]'),
        collaborations: getCollaborations(),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirc_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('데이터 백업이 완료되었습니다.', 'success');
}

// CSV로 내보내기
function exportToCsv() {
    const researchers = getResearchers();

    // 연구자 데이터를 CSV로 변환
    const csvContent = [
        ['이름', '그룹', '역할', '소속', '전문분야', '키워드', '성과수', '논문', '특허', '학회', '수상'].join(','),
        ...researchers.map(r => [
            r.name,
            r.group,
            r.role,
            r.department,
            r.specialty,
            Array.isArray(r.keywords) ? r.keywords.join(';') : r.keywords,
            r.achievements || 0,
            r.papers || 0,
            r.patents || 0,
            r.conferences || 0,
            r.awards || 0
        ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirc_researchers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('CSV 파일이 다운로드되었습니다.', 'success');
}

// 데이터 가져오기
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.researchers) {
                localStorage.setItem('hirc_researchers', JSON.stringify(data.researchers));
            }
            if (data.achievements) {
                localStorage.setItem('hirc_achievements', JSON.stringify(data.achievements));
            }
            if (data.collaborations) {
                localStorage.setItem('hirc_collaborations', JSON.stringify(data.collaborations));
            }

            showNotification('데이터가 성공적으로 가져와졌습니다. 페이지를 새로고침하세요.', 'success');

            // 자동 새로고침 (선택사항)
            setTimeout(() => {
                location.reload();
            }, 2000);

        } catch (error) {
            showNotification('잘못된 파일 형식입니다.', 'error');
        }
    };
    reader.readAsText(file);
}

// 모든 데이터 초기화
function resetAllData() {
    if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        localStorage.clear();
        showNotification('모든 데이터가 초기화되었습니다. 페이지를 새로고침하세요.', 'success');

        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

// 통계 정보 업데이트
function updateStatistics() {
    const researchers = getResearchers();
    const achievements = JSON.parse(localStorage.getItem('hirc_achievements') || '[]');
    const collaborations = getCollaborations();

    document.getElementById('statTotalResearchers').textContent = researchers.length;
    document.getElementById('statTotalAchievements').textContent = achievements.length;
    document.getElementById('statTotalCollaborations').textContent = collaborations.length;

    const lastUpdate = localStorage.getItem('hirc_lastUpdate');
    if (lastUpdate) {
        const date = new Date(lastUpdate);
        document.getElementById('statLastUpdated').textContent = date.toLocaleDateString('ko-KR');
    }
}