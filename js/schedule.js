
import { showNotification } from './ui.js';

let currentCalendarDate = new Date();
let selectedCalendarDate = new Date();
let events = window.events || [];
window.events = events;
export { events };

// 날짜 포맷 함수
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 오늘 날짜 확인
function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// 같은 날짜 확인
function isSameDate(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

// 특정 날짜의 이벤트 가져오기
function getEventsForDate(date) {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
}

// 캘린더 네비게이션
export function navigateCalendar(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    updateCalendar();
}

// 캘린더 업데이트
export function updateCalendar() {
    console.log('updateCalendar() 시작', events);
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    document.getElementById('currentMonth').textContent = 
        `${currentCalendarDate.getFullYear()}년 ${monthNames[currentCalendarDate.getMonth()]}`;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // 요일 헤더
    const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });

    // 달력 날짜 생성
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    // 이전 달의 빈 칸들
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        grid.appendChild(emptyDay);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const currentDate = new Date(year, month, day);
        const today = new Date();
        
        dayElement.className = 'calendar-day';
        if (isToday(currentDate)) dayElement.classList.add('today');
        if (isSameDate(currentDate, selectedCalendarDate)) dayElement.classList.add('selected');
        
        dayElement.innerHTML = `<div class="day-number">${day}</div>`;
        
        // 해당 날짜의 이벤트 표시
        const dayEvents = getEventsForDate(currentDate);
        dayEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `event-item ${event.priority}-priority`;
            eventDiv.textContent = event.title;
            eventDiv.title = `${event.title} - ${event.description}`;
            dayElement.appendChild(eventDiv);
        });
        
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayElement.classList.add('selected');
            selectedCalendarDate = new Date(currentDate);
        });
        
        grid.appendChild(dayElement);
    }
    console.log('updateCalendar() 끝', events);
}

// 다가오는 이벤트 업데이트
export function updateUpcomingEvents() {
    console.log('updateUpcomingEvents() 시작', events);
    const container = document.getElementById('upcomingEvents');
    const today = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    container.innerHTML = '';
    
    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #94a3b8;">다가오는 일정이 없습니다.</p>';
        return;
    }

    upcomingEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        const daysUntil = Math.ceil((new Date(event.date) - today) / (1000 * 60 * 60 * 24));
        
        eventDiv.className = `upcoming-event ${daysUntil <= 3 ? 'urgent' : ''}`;
        eventDiv.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date">D-${daysUntil} (${new Date(event.date).toLocaleDateString()})</div>
            <div class="event-description">${event.description}</div>
        `;
        container.appendChild(eventDiv);
    });
    console.log('updateUpcomingEvents() 끝', events);
}

// 이벤트 추가
export function addEvent() {
    console.log('addEvent() 시작', events);
    try {
        const title = document.getElementById('eventTitle').value;
        const type = document.getElementById('eventType').value;
        const priority = document.getElementById('eventPriority').value;
        const description = document.getElementById('eventDescription').value;

        if (!title.trim()) {
            showNotification('일정 제목을 입력해주세요.', 'error');
            return;
        }

        const newEvent = {
            id: Date.now(),
            title: title,
            type: type,
            priority: priority,
            description: description,
            date: formatDate(selectedCalendarDate),
            researcher: '미지정'
        };

        events.push(newEvent);

        // 폼 초기화
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDescription').value = '';

        updateCalendar();
        updateUpcomingEvents();
        showNotification('일정이 성공적으로 추가되었습니다.', 'success');
    } catch (error) {
        console.error('이벤트 추가 오류:', error);
        showNotification('일정 추가 중 오류가 발생했습니다.', 'error');
    }
    console.log('addEvent() 끝', events);
}

export function initializeEvents() {
    console.log('initializeEvents() 시작', events);
    const today = new Date();
    events = [
        {
            id: 1,
            title: '3그룹 연구 정기 미팅',
            type: 'seminar',
            priority: 'high',
            description: '월간 연구 진행 상황 공유',
            date: formatDate(new Date(today.getFullYear(), today.getMonth(), 24)),
            researcher: '서민호'
        },
        {
            id: 2,
            title: '4그룹 연구 정기 미팅',
            type: 'seminar',
            priority: 'high',
            description: '월간 연구 진행 상황 공유',
            date: formatDate(new Date(today.getFullYear(), today.getMonth(), 25)),
            researcher: '김윤학'
        },
        {
            id: 3,
            title: '국제공동연구 협약',
            type: 'grant_application',
            priority: 'high',
            description: '한국연구재단',
            date: formatDate(new Date(today.getFullYear(), today.getMonth(), 28)),
            researcher: '정효영영'
        }
    ];
    window.events = events;
    console.log('initializeEvents() 끝', events);
    updateCalendar();
    updateUpcomingEvents();
}
