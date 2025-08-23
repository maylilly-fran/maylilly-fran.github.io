
let skillwords = document.querySelectorAll('.word');
let tooltip = document.getElementById('tooltip');

function positionTooltip(target) {
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + window.scrollY;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    const tipRect = tooltip.getBoundingClientRect();
    const margin = 8;
    let left = x - tipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.scrollX + document.documentElement.clientWidth - tipRect.width - margin));
    tooltip.style.left = (left + tipRect.width / 2) + 'px';
}

function getSkillText(target) {
    const tag = skilltags.find(tag => tag.name === target.dataset.tooltip);
    return tag ? tag.text : "";
}

function showTooltip(target) {
    tooltip.textContent = getSkillText(target) || '情報がありません';
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    positionTooltip(target);
}

function hideTooltip() {
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
}

function addEventSkillTags() {
    skillwords = document.querySelectorAll('.word');
    tooltip = document.getElementById('tooltip');

    skillwords.forEach(word => {
        word.addEventListener('click', (e) => {
            e.stopPropagation();
            if (tooltip.classList.contains('visible') && tooltip.textContent === word.dataset.tooltip) {
                hideTooltip();
            } else {
                showTooltip(word);
            }
        });
        word.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (tooltip.classList.contains('visible') && tooltip.textContent === word.dataset.tooltip) {
                    hideTooltip();
                } else {
                    showTooltip(word);
                }
            }
        });
    });
}

document.addEventListener('click', (e) => {
    if (!tooltip.classList.contains('visible')) return;
    if (![...skillwords].some(w => w.contains(e.target)) && !tooltip.contains(e.target)) {
        hideTooltip();
    }
});

window.addEventListener('resize', () => {
    if (tooltip.classList.contains('visible')) {
        const currentWord = [...skillwords].find(w => w.dataset.tooltip === tooltip.textContent);
        if (currentWord) positionTooltip(currentWord);
    }
});
window.addEventListener('scroll', () => {
    if (tooltip.classList.contains('visible')) {
        const currentWord = [...skillwords].find(w => w.dataset.tooltip === tooltip.textContent);
        if (currentWord) positionTooltip(currentWord);
    }
}, { passive: true });