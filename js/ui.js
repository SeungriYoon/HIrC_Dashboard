
// 알림 표시
export function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// 탭 전환 함수
export function switchTab(tabName, target) {
    // 모든 탭 버튼과 콘텐츠 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // 탭별 초기화
    if (tabName === 'schedule') {
        // updateCalendar();
        // updateUpcomingEvents();
    }
}

// 연구자 상세 모달 표시
export function showResearcherModal(researcherId, researchers) {
    const researcher = researchers.find(r => r.id === researcherId);
    if (!researcher) return;

    const modalContent = document.getElementById('modalResearcherContent');
    modalContent.innerHTML = `
        <div class="modal-researcher-detail">
            <div class="modal-researcher-header">
                <div class="researcher-image large">
                    <img src="js/images/${researcher.id}.png" alt="${researcher.name}" onerror="this.style.display='none';this.parentNode.textContent='${researcher.name.charAt(0)}';">
                </div>
                <div class="modal-researcher-info">
                    <div class="researcher-name">${researcher.name}</div>
                    <div class="researcher-role">${researcher.role} (${researcher.group}그룹)</div>
                    <div class="researcher-dept">${researcher.department}</div>
                </div>
            </div>
            <div class="modal-researcher-body">
                <div class="info-item">
                    <strong class="info-label">전문분야:</strong>
                    <span class="info-value">${researcher.specialty}</span>
                </div>
                <div class="info-item">
                    <strong class="info-label">연구키워드:</strong>
                    <span class="info-value">${researcher.keywords}</span>
                </div>
            </div>
            <div class="modal-stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${researcher.achievements}</span>
                    <div class="stat-label">성과</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${researcher.tasks}</span>
                    <div class="stat-label">과제</div>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${(researcher.impactScore * 100).toFixed(0)}%</span>
                    <div class="stat-label">영향력</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('researcherModal').classList.add('show');
}

// 연구자 모달 닫기
export function closeResearcherModal() {
    document.getElementById('researcherModal').classList.remove('show');
}
