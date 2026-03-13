/* =============================================
   DEV REFERENCE — app.js
   Tab switching, search, PWA install, SW reg
   ============================================= */

'use strict';

// ─── SERVICE WORKER ──────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('[SW] Registered:', reg.scope))
            .catch(err => console.warn('[SW] Error:', err));
    });
}

// ─── DOM REFS ────────────────────────────────
const tabs = document.querySelectorAll('.tab');
const bottomBtns = document.querySelectorAll('.bottom-nav__btn');
const panels = document.querySelectorAll('.tab-panel');
const searchInput = document.getElementById('searchInput');
const installBtn = document.getElementById('installBtn');
const toast = document.getElementById('toast');

// ─── ACTIVE TAB ──────────────────────────────
let activeTab = 'backend';

function switchTab(tabName) {
    activeTab = tabName;

    // panels
    panels.forEach(p => p.classList.toggle('hidden', p.id !== `tab-${tabName}`));

    // header tabs
    tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === tabName));

    // bottom nav
    bottomBtns.forEach(b => b.classList.toggle('bottom-nav__btn--active', b.dataset.tab === tabName));

    // clear search when switching tab
    searchInput.value = '';
    filterCards('');

    // scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
bottomBtns.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

// ─── SEARCH / FILTER ─────────────────────────
function filterCards(query) {
    const q = query.toLowerCase().trim();
    const activePanel = document.getElementById(`tab-${activeTab}`);
    const cards = activePanel.querySelectorAll('.card');

    cards.forEach(card => {
        if (!q) {
            card.classList.remove('search-hidden');
            return;
        }
        const tags = (card.dataset.tags || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        const matches = tags.includes(q) || text.includes(q);
        card.classList.toggle('search-hidden', !matches);
    });
}

searchInput.addEventListener('input', e => filterCards(e.target.value));

// clear on Escape
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        searchInput.value = '';
        filterCards('');
        searchInput.blur();
    }
});

// ─── TOAST ───────────────────────────────────
let toastTimer;
function showToast(msg, duration = 2500) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── COPY CODE ON TAP ────────────────────────
document.querySelectorAll('.card__code').forEach(block => {
    block.style.cursor = 'pointer';
    block.title = 'Натисніть щоб скопіювати';

    block.addEventListener('click', async () => {
        const text = block.textContent.trim();
        try {
            await navigator.clipboard.writeText(text);
            showToast('✓ Скопійовано!');
        } catch {
            showToast('⚠ Не вдалось скопіювати');
        }
    });
});

// ─── PWA INSTALL ─────────────────────────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.removeAttribute('hidden');
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        showToast('✓ Додаток встановлено!');
        installBtn.setAttribute('hidden', '');
    }
    deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
    installBtn.setAttribute('hidden', '');
    deferredPrompt = null;
});

// ─── COLLAPSIBLE CARDS (double tap code) ─────
// Allow expand/collapse of interview answers on mobile
document.querySelectorAll('.interview-card .card__header').forEach(header => {
    const card = header.closest('.card');
    const answer = card.querySelector('.interview-answer');
    if (!answer) return;

    // collapsed by default on small screens
    const initCollapsed = () => {
        if (window.innerWidth < 900) {
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height .3s ease';
            card.dataset.collapsed = 'true';
        } else {
            answer.style.maxHeight = '';
            answer.style.overflow = '';
            card.dataset.collapsed = 'false';
        }
    };

    initCollapsed();

    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        if (window.innerWidth >= 900) return;
        const collapsed = card.dataset.collapsed === 'true';
        if (collapsed) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            card.dataset.collapsed = 'false';
        } else {
            answer.style.maxHeight = '0';
            card.dataset.collapsed = 'true';
        }
    });
});

// ─── KEYBOARD SHORTCUT ───────────────────────
// Ctrl+K or Cmd+K → focus search
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});


// ─── INIT ────────────────────────────────────
switchTab('backend');