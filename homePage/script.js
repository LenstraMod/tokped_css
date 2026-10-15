const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const drawerClose = document.getElementById('drawerClose');

function setDrawer(open) {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
}

burger.addEventListener('click', () => setDrawer(true));
drawerClose.addEventListener('click', () => setDrawer(false));
overlay.addEventListener('click', () => setDrawer(false));

// tombol Esc menutup drawer
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setDrawer(false);
});

// kalau layar dibesarkan ke desktop, tutup drawer
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setDrawer(false);
});