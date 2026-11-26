// Detail panjang untuk modal. Urutan sama dengan data-index di kartu (0, 1, 2, ...).
// Judul dan kategori diambil langsung dari kartu, jadi cukup edit di HTML.
const projectsData = [
    {
        desc: 'Ngatur jalur suara dari input instrumen dan mic ke audio interface, terus diproses real-time pakai EQ, kompresor, sama limiter sebelum keluar ke speaker atau stream biar bersih dan nggak delay.',
        stack: ['ASIO Driver', 'DAW Routing', 'Parametric EQ', 'Limiter']
    },
    {
        desc: 'Iseng ngerakit halaman web responsif dari nol pakai HTML, Tailwind CSS, sama JavaScript dasar buat latihan bikin tampilan dark mode yang rapi.',
        stack: ['HTML5', 'Tailwind CSS', 'Vanilla JS', 'Responsive']
    },
    {
        desc: 'Racikan profil equalizer khusus buat memperjelas suara langkah kaki (footsteps) pas main game FPS, sekalian setting OBS buat rekam gameplay tanpa bikin FPS drop.',
        stack: ['FPS Audio EQ', 'OBS Studio', 'Low Latency', 'Custom Keybinds']
    },
    {
        desc: 'Ngepasin gain staging, atur potongan frekuensi crossover, sama nyetel jalur dari audio interface ke power ampli biar suara keluar maksimal dan nggak pecah.',
        stack: ['Gain Staging', 'Crossover', 'Audio Interface', 'Sound Check']
    },
    {
        desc: 'Ngerakit halaman profil sendiri, tombol filter kategori, sama fitur salin kontak otomatis langsung di browser.',
        stack: ['DOM JS', 'CSS Grid / Flex', 'Dark Theme', 'UI Iseng']
    },
    {
        desc: 'Nyesuaiin preset shader biar visual game kelihatan lebih tajam tapi frame rate tetap anteng pas dipakai main lama.',
        stack: ['Visual Presets', 'Frame Pacing', 'GPU Tuning', 'In-Game Audio']
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Animasi masuk: hanya hero, sekali saat halaman dibuka.
    requestAnimationFrame(() => {
        document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
    });

    const cards = document.querySelectorAll('.project-card');

    // Spotlight kursor, hanya di kartu arsip yang bisa diklik.
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // Toggle equalizer
    const eqToggle = document.getElementById('eq-toggle');
    eqToggle?.addEventListener('click', () => {
        const paused = eqToggle.classList.toggle('eq-paused');
        eqToggle.setAttribute('aria-pressed', String(paused));
    });

    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function setMobileMenu(open) {
        mobileMenu.classList.toggle('hidden', !open);
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
    }

    mobileMenuBtn?.addEventListener('click', () => {
        setMobileMenu(mobileMenu.classList.contains('hidden'));
    });
    mobileLinks.forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));

    // Filter arsip
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activeClasses = ['bg-blue-600', 'text-white', 'font-medium'];
    const idleClasses = ['border', 'border-slate-800', 'bg-[#0b101b]', 'text-slate-300'];

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach((b) => {
                b.classList.remove(...activeClasses);
                b.classList.add(...idleClasses);
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add(...activeClasses);
            btn.classList.remove(...idleClasses);
            btn.setAttribute('aria-pressed', 'true');

            cards.forEach((card) => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('hidden', !match);
            });
        });
    });

    // Modal detail
    const modal = document.getElementById('project-modal');
    const closeIcon = document.getElementById('modal-close-icon');
    const closeBtn = document.getElementById('modal-close-btn');
    let lastFocused = null;

    const isModalOpen = () => !modal.classList.contains('hidden');

    function openModal(index, trigger) {
        const data = projectsData[index];
        const card = document.querySelector(`.project-card[data-index="${index}"]`);
        if (!data || !card) return;

        document.getElementById('modal-category').textContent =
            card.querySelector('span')?.textContent.trim() ?? '';
        document.getElementById('modal-title').textContent =
            card.querySelector('h3')?.textContent.replace(/\s+/g, ' ').trim() ?? '';
        document.getElementById('modal-desc').textContent = data.desc;

        const stackContainer = document.getElementById('modal-stack');
        stackContainer.replaceChildren();
        data.stack.forEach((tech) => {
            const span = document.createElement('span');
            span.className = 'rounded bg-[#070b12] px-2.5 py-1 border border-slate-800';
            span.textContent = tech;
            stackContainer.appendChild(span);
        });

        lastFocused = trigger ?? document.activeElement;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        lastFocused?.focus?.();
    }

    cards.forEach((card) => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-haspopup', 'dialog');

        card.addEventListener('click', () => openModal(idx, card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(idx, card);
            }
        });
    });

    closeIcon?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isModalOpen()) closeModal();
            else if (!mobileMenu.classList.contains('hidden')) setMobileMenu(false);
            return;
        }

        // Fokus tetap di dalam modal selama terbuka.
        if (e.key === 'Tab' && isModalOpen()) {
            const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Salin kontak + toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    let toastTimeout;

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-4');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-4');
        }, 2500);
    }

    // navigator.clipboard hanya jalan di HTTPS/localhost, jadi ada cadangan.
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try {
                ok = document.execCommand('copy');
            } catch {
                ok = false;
            }
            ta.remove();
            return ok;
        }
    }

    document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const text = btn.getAttribute('data-copy');
            const message = btn.getAttribute('data-msg') || 'Disalin!';
            const ok = await copyText(text);
            showToast(ok ? message : 'Gagal menyalin, salin manual ya.');
        });
    });
});
