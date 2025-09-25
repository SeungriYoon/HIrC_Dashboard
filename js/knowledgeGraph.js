import { showResearcherModal, showNotification } from './ui.js';
import { getSettings } from './main.js';

let currentFilter = 'all';
let simulation, svg, zoom, g;

// 연구자 카드 렌더링
export function renderResearchers(researchers, collaborations = []) {
    const container = document.getElementById('researcherGrid');
    const filteredResearchers = currentFilter === 'all' ? 
        researchers : researchers.filter(r => r.group.toString() === currentFilter);
    
    container.innerHTML = '';
    
    filteredResearchers.forEach(researcher => {
        const card = document.createElement('div');
        card.className = 'researcher-card';
        // 이미지 경로
        const imgPath = `js/images/${researcher.id}.png`;
        card.innerHTML = `
            <div class="researcher-image">
                <img src="${imgPath}" alt="${researcher.name}" onerror="this.style.display='none';this.parentNode.textContent='${researcher.name.charAt(0)}';">
            </div>
            <div class="researcher-info">
                <div class="researcher-name">${researcher.name}</div>
                <div class="researcher-role">${researcher.role} (${researcher.group}그룹)</div>
                <div class="researcher-dept">${researcher.department}</div>
                <div class="researcher-keywords">${Array.isArray(researcher.keywords) ? researcher.keywords.join(', ') : researcher.keywords}</div>
            </div>
        `;
        card.addEventListener('click', () => showResearcherModal(researcher.id, researchers));
        container.appendChild(card);
    });
}

// 연구자 필터링
export function filterResearchers(group, researchers, target) {
    currentFilter = group;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    target.classList.add('active');
    
    renderResearchers(researchers);
}

// 연구자 검색
export function searchResearchers(query, researchers) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query) {
        resultsDiv.innerHTML = '';
        renderResearchers(researchers);
        return;
    }

    const results = researchers.filter(researcher => {
        return researcher.name.toLowerCase().includes(query.toLowerCase()) ||
            researcher.keywords.toLowerCase().includes(query.toLowerCase()) ||
            researcher.department.toLowerCase().includes(query.toLowerCase());
    });

    resultsDiv.innerHTML = results.length > 0 ?
        `<div style="color: #4ecdc4; font-size: 12px; margin-top: 10px;">
            ${results.length}명 발견
        </div>` :
        `<div style="color: #ff6b6b; font-size: 12px; margin-top: 10px;">
            검색 결과가 없습니다.
        </div>`;

    // 검색 결과만 표시
    const container = document.getElementById('researcherGrid');
    container.innerHTML = '';
    
    results.forEach(researcher => {
        const card = document.createElement('div');
        card.className = 'researcher-card';
        const imgPath = `js/images/${researcher.id}.png`;
        card.innerHTML = `
            <div class="researcher-image">
                <img src="${imgPath}" alt="${researcher.name}" onerror="this.style.display='none';this.parentNode.textContent='${researcher.name.charAt(0)}';">
            </div>
            <div class="researcher-info">
                <div class="researcher-name">${researcher.name}</div>
                <div class="researcher-role">${researcher.role} (${researcher.group}그룹)</div>
                <div class="researcher-dept">${researcher.department}</div>
                <div class="researcher-keywords">${Array.isArray(researcher.keywords) ? researcher.keywords.join(', ') : researcher.keywords}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

export function switchGraphView(view, researchers, collaborations) {
    if (view === 'card') {
        document.getElementById('cardView').style.display = 'block';
        document.getElementById('networkView').style.display = 'none';
    } else {
        document.getElementById('cardView').style.display = 'none';
        document.getElementById('networkView').style.display = 'block';
        initNetworkGraph(researchers, collaborations);
    }
}

function getNodeRadius(d, settings = {}) {
    const nodeSettings = settings.visualization?.nodeSize || {};
    const minSize = nodeSettings.minSize || 20;
    const maxSize = nodeSettings.maxSize || 80;

    const isLeader = ['researcher_001', 'researcher_008', 'researcher_013', 'researcher_016'].includes(d.id);
    let base = isLeader ? Math.max(minSize + 12, 32) : minSize;

    // 성과에 따른 크기 조정
    const papers = (d.papers || 0) * (nodeSettings.paperWeight || 2);
    const patents = (d.patents || 0) * (nodeSettings.patentWeight || 3);
    const awards = (d.awards || 0) * (nodeSettings.awardWeight || 4);

    const totalScore = papers + patents + awards + (d.achievements || 0) * 0.5;
    const calculatedSize = base + totalScore;

    return Math.min(Math.max(calculatedSize, minSize), maxSize);
}

export function initNetworkGraph(researchers, collaborations) {
    const settings = getSettings();
    const nodes = JSON.parse(JSON.stringify(researchers));
    const links = JSON.parse(JSON.stringify(collaborations));
    const colors = settings.visualization?.colors || {};
    const groupColors = {
        1: colors.group1 || '#70c4b8',
        2: colors.group2 || '#6ad1c7',
        3: colors.group3 || '#68a2a4',
        4: colors.group4 || '#68a29a'
    };

    const width = document.getElementById('networkGraph').clientWidth || 900;
    const height = 600;

    d3.select('#networkGraph').selectAll('*').remove();
    svg = d3.select('#networkGraph')
        .attr('width', width)
        .attr('height', height);

    g = svg.append('g');
    const boundaryLayer = g.append('g').attr('class', 'boundaries');
    const linkLayer = g.append('g').attr('class', 'links');
    const nodeLayer = g.append('g').attr('class', 'nodes');
    const labelLayer = g.append('g').attr('class', 'labels');

    zoom = d3.zoom()
        .scaleExtent([0.2, 5])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    svg.call(zoom);

    const centerX = width / 2;
    const centerY = height / 2;
    nodes.forEach(d => { d.x = centerX + (Math.random() - 0.5) * 100; d.y = centerY + (Math.random() - 0.5) * 100; });

    const groupCenters = {
        1: { x: width * 0.3, y: height * 0.3 },
        2: { x: width * 0.7, y: height * 0.3 },
        3: { x: width * 0.3, y: height * 0.7 },
        4: { x: width * 0.7, y: height * 0.7 }
    };

    const layoutSettings = settings.visualization?.layout || {};
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(layoutSettings.linkDistance || 120))
        .force('charge', d3.forceManyBody().strength(layoutSettings.forceStrength || -400))
        .force('center', d3.forceCenter(centerX, centerY))
        .force('collision', d3.forceCollide().radius(d => getNodeRadius(d, settings) + 4))
        .force('x', d3.forceX(d => groupCenters[d.group].x).strength(layoutSettings.centerForce || 0.2))
        .force('y', d3.forceY(d => groupCenters[d.group].y).strength(layoutSettings.centerForce || 0.2));

    const link = linkLayer.selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', d => {
            const edgeSettings = settings.visualization?.edgeWeight || {};
            const baseWeight = d.weight || 1;
            const multiplier = edgeSettings.collaborationMultiplier || 1.5;
            return Math.min(baseWeight * multiplier, edgeSettings.maxWeight || 6);
        })
        .attr('stroke', d => {
            const edgeColor = colors.edge || 'rgba(78, 205, 196, 0.6)';
            return d.weight === 3 ? '#ef4444' : (d.weight === 2 ? '#4ecdc4' : edgeColor);
        });

    const node = nodeLayer.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => getNodeRadius(d, settings))
        .attr('fill', d => groupColors[d.group])
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .call(drag(simulation));

    node.on('click', (event, d) => {
        showResearcherModal(d.id, researchers);
    });

    const label = labelLayer.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .attr('fill', '#222')
        .text(d => d.name);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        drawBoundaries(nodes, boundaryLayer, groupColors);
    });
}

function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        // d.fx, d.fy를 null로 하지 않음 (고정)
    }
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
}

function convexHull(points) {
    if (points.length < 3) return null;
    points = points.map(d => [d.x, d.y]);
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (let p of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
        lower.push(p);
    }
    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        let p = points[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
        upper.push(p);
    }
    upper.pop();
    lower.pop();
    return lower.concat(upper);
}

function drawBoundaries(nodes, boundaryLayer, groupColors) {
    const hulls = [];
    for (let group = 1; group <= 4; group++) {
        const groupNodes = nodes.filter(d => d.group === group && typeof d.x === 'number' && typeof d.y === 'number');
        if (groupNodes.length < 3) continue;
        const hull = convexHull(groupNodes);
        if (hull) hulls.push({ group, hull });
    }
    const boundary = boundaryLayer.selectAll('.group-boundary')
        .data(hulls, d => d.group);
    boundary.exit().remove();
    boundary.enter().append('path')
        .attr('class', 'group-boundary')
        .attr('fill', d => groupColors[d.group])
        .attr('fill-opacity', 0.13)
        .attr('stroke', d => groupColors[d.group])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8 4')
        .merge(boundary)
        .attr('d', d => 'M' + d.hull.map(p => p.join(',')).join('L') + 'Z');
}

export function networkZoomIn() {
    if (svg && zoom) svg.transition().call(zoom.scaleBy, 1.5);
}
export function networkZoomOut() {
    if (svg && zoom) svg.transition().call(zoom.scaleBy, 1 / 1.5);
}
export function networkZoomReset() {
    if (svg && zoom) svg.transition().call(zoom.transform, d3.zoomIdentity);
}

// 이미지 저장 함수
export function saveGraphAsImage() {
    const cardView = document.getElementById('cardView');
    const networkView = document.getElementById('networkView');
    let targetElement;
    let filenamePrefix;

    if (cardView.style.display === 'block') {
        targetElement = cardView;
        filenamePrefix = 'card_view';
    } else if (networkView.style.display === 'block') {
        targetElement = networkView;
        filenamePrefix = 'network_view';
    } else {
        showNotification('저장할 뷰를 찾을 수 없습니다.', 'error');
        return;
    }

    // 실제 배경 스타일이 적용된 자식 요소를 찾습니다.
    const graphContainer = targetElement.querySelector('.graph-container');
    if (!graphContainer) {
        showNotification('이미지를 저장할 컨테이너를 찾을 수 없습니다.', 'error');
        return;
    }

    // 1. 기존 배경 스타일을 저장합니다.
    const originalBackground = graphContainer.style.background;

    // 2. 이미지 저장을 위해 배경을 흰색으로 임시 변경합니다.
    graphContainer.style.background = '#ffffff';

    const scale = 3; 

    html2canvas(targetElement, { 
        scale: scale, 
        useCORS: true,
        // backgroundColor 옵션은 그대로 두거나 제거해도 됩니다.
        // 직접 스타일을 변경하는 것이 더 확실하기 때문입니다.
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('이미지가 성공적으로 저장되었습니다!', 'success');
    }).catch(error => {
        console.error('이미지 저장 중 오류 발생:', error);
        showNotification('이미지 저장에 실패했습니다.', 'error');
    }).finally(() => {
        // 3. 캡처가 성공하든 실패하든, 원래 배경 스타일로 복원합니다.
        graphContainer.style.background = originalBackground;
    });
}
