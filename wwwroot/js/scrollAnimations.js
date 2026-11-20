(function () {
    'use strict';

    if (window.__yolArkadasiScrollInit) return;
    window.__yolArkadasiScrollInit = true;

    let rafPending = false;
    let revealObserver = null;
    let counterObserver = null;
    const observedElements = new WeakSet();
    const countedElements = new WeakSet();
    const tiltBoundElements = new WeakSet();

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    function updateProgressBar() {
        const bar = document.getElementById('scroll-progress-bar');
        if (!bar) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;
        bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    function updateParallaxAndScrub() {
        if (prefersReducedMotion()) return;
        const vh = window.innerHeight || 1;
        const vhHalf = vh * 0.5;

        // 1. Parallax elements
        const parallaxNodes = document.querySelectorAll('[data-parallax-speed]');
        for (let i = 0; i < parallaxNodes.length; i++) {
            const el = parallaxNodes[i];
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
            const rect = el.getBoundingClientRect();
            const centerOffset = (rect.top + rect.height * 0.5) - vhHalf;
            const translateY = clamp(-centerOffset * speed, -90, 90);
            el.style.setProperty('--parallax-y', `${translateY.toFixed(2)}px`);
        }

        // 2. Scroll-scrubbed transform elements (tinyPod-style scale & 3D tilt)
        const scrubNodes = document.querySelectorAll('[data-scroll-scrub]');
        for (let i = 0; i < scrubNodes.length; i++) {
            const el = scrubNodes[i];
            const rect = el.getBoundingClientRect();
            const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
            el.style.setProperty('--scroll-p', progress.toFixed(4));
        }

        // 2.5 Full-Page Scroll Scenes (.scroll-scene) — scene-to-scene morphing & active HUD dot
        const scenes = document.querySelectorAll('.scroll-scene');
        if (scenes.length > 0) {
            let activeSceneId = null;
            let bestSceneDist = Infinity;

            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];
                const rect = scene.getBoundingClientRect();
                // Progress: -1 (below viewport), 0 (aligned at top/center), +1 (scrolled past top)
                const rawP = clamp(-rect.top / Math.max(vh, 1), -1, 1);
                const absP = Math.abs(rawP);
                const sceneScale = 1 - Math.min(absP * 0.045, 0.045);
                const sceneOpacity = clamp(1 - Math.max(absP - 0.55, 0) * 1.1, 0.35, 1);

                scene.style.setProperty('--scene-p', rawP.toFixed(4));
                scene.style.setProperty('--scene-scale', sceneScale.toFixed(4));
                scene.style.setProperty('--scene-opacity', sceneOpacity.toFixed(4));

                // Determine which scene occupies viewport center
                const sceneCenter = rect.top + Math.min(rect.height, vh) * 0.5;
                const dist = Math.abs(sceneCenter - vhHalf);
                if (rect.bottom > vh * 0.2 && rect.top < vh * 0.8 && dist < bestSceneDist) {
                    bestSceneDist = dist;
                    activeSceneId = scene.id;
                }
            }

            if (activeSceneId) {
                for (let i = 0; i < scenes.length; i++) {
                    scenes[i].classList.toggle('is-active-scene', scenes[i].id === activeSceneId);
                }
                const hudItems = document.querySelectorAll('.scene-nav-item');
                for (let i = 0; i < hudItems.length; i++) {
                    const target = hudItems[i].getAttribute('data-scene-target');
                    hudItems[i].classList.toggle('active', target === activeSceneId);
                }
            }
        }

        // 3. Sticky Storytelling Stage (#scroll-story-stage)
        const storyContainer = document.getElementById('scroll-story-stage');
        if (storyContainer) {
            const rect = storyContainer.getBoundingClientRect();
            const scrollableDistance = Math.max(rect.height - vh, 1);
            const rawProgress = clamp(-rect.top / scrollableDistance, 0, 1);
            storyContainer.style.setProperty('--story-p', rawProgress.toFixed(4));

            // 3D rotation & scale values scrubbed by scroll
            const rotY = Math.sin(rawProgress * Math.PI * 2) * 7;
            const rotX = (0.5 - rawProgress) * 6;
            const scale = 0.94 + Math.sin(rawProgress * Math.PI) * 0.08;
            storyContainer.style.setProperty('--stage-rot-y', `${rotY.toFixed(2)}deg`);
            storyContainer.style.setProperty('--stage-rot-x', `${rotX.toFixed(2)}deg`);
            storyContainer.style.setProperty('--stage-scale', scale.toFixed(4));

            // Determine active chapter closest to 42% viewport height
            const chapters = storyContainer.querySelectorAll('.story-chapter');
            let activeIdx = 0;
            let bestDist = Infinity;
            const targetY = vh * 0.42;

            for (let i = 0; i < chapters.length; i++) {
                const cRect = chapters[i].getBoundingClientRect();
                const cCenter = cRect.top + cRect.height * 0.5;
                const dist = Math.abs(cCenter - targetY);
                if (dist < bestDist) {
                    bestDist = dist;
                    activeIdx = i;
                }
            }

            if (storyContainer.getAttribute('data-active-chapter') !== String(activeIdx)) {
                storyContainer.setAttribute('data-active-chapter', String(activeIdx));
                chapters.forEach((ch, idx) => ch.classList.toggle('active', idx === activeIdx));

                const slides = storyContainer.querySelectorAll('.stage-slide');
                slides.forEach((sl, idx) => sl.classList.toggle('active', idx === activeIdx));

                const dots = storyContainer.querySelectorAll('.stage-progress-dot');
                dots.forEach((dot, idx) => dot.classList.toggle('active', idx <= activeIdx));
            }
        }
    }

    function onScrollFrame() {
        rafPending = false;
        updateProgressBar();
        updateParallaxAndScrub();
    }

    function requestScrollTick() {
        if (!rafPending) {
            rafPending = true;
            window.requestAnimationFrame(onScrollFrame);
        }
    }

    function animateCounter(el) {
        if (countedElements.has(el)) return;
        countedElements.add(el);

        const target = parseFloat(el.getAttribute('data-count-to'));
        if (isNaN(target)) return;
        const suffix = el.getAttribute('data-count-suffix') || '';
        const prefix = el.getAttribute('data-count-prefix') || '';
        const duration = parseInt(el.getAttribute('data-count-duration') || '1200', 10);

        if (prefersReducedMotion()) {
            el.textContent = `${prefix}${Math.round(target)}${suffix}`;
            return;
        }

        const startTime = performance.now();
        function step(now) {
            const elapsed = now - startTime;
            const t = clamp(elapsed / duration, 0, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            const current = Math.round(eased * target);
            el.textContent = `${prefix}${current}${suffix}`;
            if (t < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    function ensureObservers() {
        if (!revealObserver && 'IntersectionObserver' in window) {
            revealObserver = new IntersectionObserver(
                (entries) => {
                    for (let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        if (entry.isIntersecting) {
                            const el = entry.target;
                            const delay = el.getAttribute('data-reveal-delay');
                            if (delay) {
                                el.style.transitionDelay = `${delay}ms`;
                            }
                            el.classList.add('is-visible');
                            if (el.getAttribute('data-reveal-repeat') !== 'true') {
                                revealObserver.unobserve(el);
                            }
                        } else if (entry.target.getAttribute('data-reveal-repeat') === 'true') {
                            entry.target.classList.remove('is-visible');
                        }
                    }
                },
                { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
            );
        }

        if (!counterObserver && 'IntersectionObserver' in window) {
            counterObserver = new IntersectionObserver(
                (entries) => {
                    for (let i = 0; i < entries.length; i++) {
                        if (entries[i].isIntersecting) {
                            animateCounter(entries[i].target);
                            counterObserver.unobserve(entries[i].target);
                        }
                    }
                },
                { threshold: 0.25 }
            );
        }
    }

    function bindTiltCard(card) {
        if (tiltBoundElements.has(card) || prefersReducedMotion()) return;
        tiltBoundElements.add(card);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
            const y = (e.clientY - rect.top) / Math.max(rect.height, 1);
            const rx = (0.5 - y) * 6;
            const ry = (x - 0.5) * 6;
            card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
            card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
            card.style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`);
            card.style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-rx', '0deg');
            card.style.setProperty('--tilt-ry', '0deg');
        });
    }

    function scanAndBindElements() {
        ensureObservers();

        const revealSelectors = '.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, [data-reveal]';
        const revealNodes = document.querySelectorAll(revealSelectors);
        for (let i = 0; i < revealNodes.length; i++) {
            const el = revealNodes[i];
            if (!observedElements.has(el)) {
                observedElements.add(el);
                if (prefersReducedMotion() || !revealObserver) {
                    el.classList.add('is-visible');
                } else {
                    revealObserver.observe(el);
                }
            }
        }

        const counterNodes = document.querySelectorAll('[data-count-to]');
        for (let i = 0; i < counterNodes.length; i++) {
            const el = counterNodes[i];
            if (!countedElements.has(el)) {
                if (counterObserver) {
                    counterObserver.observe(el);
                } else {
                    animateCounter(el);
                }
            }
        }

        const tiltNodes = document.querySelectorAll('[data-tilt-card]');
        for (let i = 0; i < tiltNodes.length; i++) {
            bindTiltCard(tiltNodes[i]);
        }

        requestScrollTick();
    }

    function init() {
        scanAndBindElements();

        window.addEventListener('scroll', requestScrollTick, { passive: true });
        window.addEventListener('resize', requestScrollTick, { passive: true });

        // Re-scan automatically whenever Blazor updates the DOM
        if ('MutationObserver' in window) {
            let mutationTimer = null;
            const mo = new MutationObserver(() => {
                if (mutationTimer) return;
                mutationTimer = window.setTimeout(() => {
                    mutationTimer = null;
                    scanAndBindElements();
                }, 60);
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.yolArkadasiScroll = {
        refresh: scanAndBindElements,
        scrollToSection: (id) => {
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
