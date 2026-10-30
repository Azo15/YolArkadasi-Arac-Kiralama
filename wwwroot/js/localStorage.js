window.yolArkadasiStorage = {
    get: key => window.localStorage.getItem(key),
    set: (key, value) => window.localStorage.setItem(key, value)
};

window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.launchCelebrationConfetti = () => {
    try {
        const canvas = document.createElement('canvas');
        canvas.id = 'celebration-confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '999999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const width = (canvas.width = window.innerWidth);
        const height = (canvas.height = window.innerHeight);

        const colors = ['#10b981', '#059669', '#d1f26a', '#f59e0b', '#3b82f6', '#14b8a6', '#ffffff'];
        const particles = [];
        const count = 130;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: width * 0.5 + (Math.random() - 0.5) * 260,
                y: height * 0.4 + (Math.random() - 0.5) * 90,
                vx: (Math.random() - 0.5) * 18,
                vy: Math.random() * -15 - 5,
                size: Math.random() * 9 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 14,
                opacity: 1,
                decay: Math.random() * 0.009 + 0.006
            });
        }

        const start = performance.now();
        const duration = 2800;

        function animate(now) {
            const elapsed = now - start;
            if (elapsed > duration || particles.length === 0) {
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4;
                p.vx *= 0.98;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                if (p.opacity <= 0 || p.y > height + 20) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
                ctx.restore();
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    } catch (e) {
        console.error('Confetti error:', e);
    }
};
