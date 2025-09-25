import { showNotification, switchTab, closeResearcherModal } from './ui.js';
import { renderResearchers, filterResearchers, searchResearchers, switchGraphView, networkZoomIn, networkZoomOut, networkZoomReset, saveGraphAsImage } from './knowledgeGraph.js';
import { initializeEvents, updateCalendar, updateUpcomingEvents, addEvent, navigateCalendar } from './schedule.js';
import { renderAchievementCards, addAchievement, switchAchievementTab } from './achievements.js';
import { switchCollabTab, saveGroup2AsImage, saveGroup3AsImage } from './collaboration.js';
import { initializeDataManagement } from './dataManagement.js';

// 전역 변수
let researchers = [];
let collaborations = [];
let achievements = [];
let settings = {};

// 데이터 로드 함수
async function loadData() {
    try {
        const [researchersRes, collaborationsRes, achievementsRes, settingsRes] = await Promise.all([
            fetch('./data/researchers.json'),
            fetch('./data/collaborations.json'),
            fetch('./data/achievements.json'),
            fetch('./data/settings.json')
        ]);

        researchers = await researchersRes.json();
        collaborations = await collaborationsRes.json();
        achievements = await achievementsRes.json();
        settings = await settingsRes.json();

        console.log('모든 데이터 로드 완료');
        return true;
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showNotification('데이터를 불러오는 중 오류가 발생했습니다.', 'error');
        return false;
    }
}

// 초기화 함수
async function init() {
    console.log('init() 함수 시작');
    try {
        // 데이터 로드 대기
        const dataLoaded = await loadData();
        if (!dataLoaded) {
            return;
        }

        console.log('데이터 로드 완료');
        initializeEvents();
        console.log('initializeEvents() 호출 완료');
        renderResearchers(researchers, collaborations);
        console.log('renderResearchers() 호출 완료');
        updateCalendar();
        console.log('updateCalendar() 호출 완료');
        updateUpcomingEvents();
        console.log('updateUpcomingEvents() 호출 완료');
        renderAchievementCards(researchers);
        console.log('renderAchievementCards() 호출 완료');
        initializeDataManagement();
        console.log('initializeDataManagement() 호출 완료');
        assignEventListeners();
        console.log('assignEventListeners() 호출 완료');
        console.log('✅ 시스템 초기화 완료');
    } catch (error) {
        console.error('main.js: ❌ 초기화 중 오류:', error);
        showNotification('시스템 초기화 중 오류가 발생했습니다.', 'error');
    }
}

// 데이터 저장 함수
export async function saveData(type, data) {
    try {
        // 브라우저 환경에서는 직접 파일 저장이 불가능하므로
        // 로컬스토리지를 임시로 사용
        localStorage.setItem(`hirc_${type}`, JSON.stringify(data));

        // 전역 변수 업데이트
        if (type === 'researchers') researchers = data;
        else if (type === 'collaborations') collaborations = data;
        else if (type === 'achievements') achievements = data;
        else if (type === 'settings') settings = data;

        showNotification(`${type} 데이터가 저장되었습니다.`, 'success');
        return true;
    } catch (error) {
        console.error('데이터 저장 실패:', error);
        showNotification('데이터 저장 중 오류가 발생했습니다.', 'error');
        return false;
    }
}

// 데이터 내보내기 함수
export function exportData() {
    const data = {
        researchers,
        collaborations,
        achievements,
        settings,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirc_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('데이터가 성공적으로 내보내졌습니다.', 'success');
}

// 전역 데이터 접근 함수들
export function getResearchers() { return researchers; }
export function getCollaborations() { return collaborations; }
export function getAchievements() { return achievements; }
export function getSettings() { return settings; }

// 이벤트 리스너 할당
function assignEventListeners() {
    // 탭
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            switchTab(event.currentTarget.dataset.tab, event.currentTarget);
        });
    });

    // 지식그래프
    const cardViewBtn = document.getElementById('cardViewBtn');
    if (cardViewBtn) {
        cardViewBtn.addEventListener('click', () => switchGraphView('card', researchers, collaborations));
    }

    const networkViewBtn = document.getElementById('networkViewBtn');
    if (networkViewBtn) {
        networkViewBtn.addEventListener('click', () => switchGraphView('network', researchers, collaborations));
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            filterResearchers(event.currentTarget.dataset.group, researchers, event.currentTarget);
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            searchResearchers(event.target.value, researchers);
        });
    }
    
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeResearcherModal);
    }

    const zoomInBtn = document.getElementById('zoom-in');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', networkZoomIn);
    }
    const zoomOutBtn = document.getElementById('zoom-out');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', networkZoomOut);
    }
    const zoomResetBtn = document.getElementById('zoom-reset');
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', networkZoomReset);
    }

    const saveCardViewImageBtn = document.getElementById('saveCardViewImageBtn');
    if (saveCardViewImageBtn) {
        saveCardViewImageBtn.addEventListener('click', saveGraphAsImage);
    }

    const saveNetworkViewImageBtn = document.getElementById('saveNetworkViewImageBtn');
    if (saveNetworkViewImageBtn) {
        saveNetworkViewImageBtn.addEventListener('click', saveGraphAsImage);
    }

    // 연구 협업 탭
    document.querySelectorAll('#collaboration .collab-tab-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            switchCollabTab(event.currentTarget.dataset.collabTab, event.currentTarget);
        });
    });

    const saveMindmapBtn = document.getElementById('saveMindmapBtn');
    if (saveMindmapBtn) {
        saveMindmapBtn.addEventListener('click', saveGroup2AsImage);
    }

    const saveMindmapBtn3 = document.getElementById('saveMindmapBtn3');
    if (saveMindmapBtn3) {
        saveMindmapBtn3.addEventListener('click', saveGroup3AsImage);
    }

    // 성과관리 탭 하위 탭
    document.querySelectorAll('#achievements .collab-tab-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            switchAchievementTab(event.currentTarget.dataset.achievementTab, event.currentTarget);
        });
    });

    // 일정관리
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => navigateCalendar(-1));
    }
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => navigateCalendar(1));
    }
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', addEvent);
    }

    // 성과관리
    const addAchievementBtn = document.getElementById('addAchievementBtn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', () => addAchievement(researchers));
    }

    // 컨트롤
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }
    const loadSampleDataBtn = document.getElementById('loadSampleDataBtn');
    if (loadSampleDataBtn) {
        loadSampleDataBtn.addEventListener('click', () => showNotification('샘플 데이터 로드 기능은 아직 구현되지 않았습니다.', 'info'));
    }
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                localStorage.clear();
                location.reload();
            }
        });
    }
}


// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', init);