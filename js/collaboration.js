
// 협업 탭 전환 함수
export function switchCollabTab(tabName, target) {
    // 모든 협업 탭 버튼과 콘텐츠 비활성화
    document.querySelectorAll('#collaboration .collab-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#collaboration .collab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    target.classList.add('active');
    document.getElementById('collab-' + tabName).classList.add('active');
}


export function saveGroup2AsImage() {
    html2canvas(document.getElementById('group2Mindmap'), {
        useCORS: true,
        scale: 2,
        backgroundColor: '#f8f8ff' // 원하는 배경색
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'group2_mindmap.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}


export function saveGroup3AsImage() {
    html2canvas(document.getElementById('group3Mindmap'), {
        useCORS: true,
        scale: 2,
        backgroundColor: '#f8f8ff' // 원하는 배경색
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'group3_mindmap.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
