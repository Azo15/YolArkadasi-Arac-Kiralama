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

window.printSpecificVoucher = (bookingId) => {
    try {
        const targetCard = document.getElementById('booking-card-' + bookingId);
        if (!targetCard) {
            window.print();
            return;
        }

        // Clean up previous print iframe if any
        const oldIframe = document.getElementById('voucher-print-frame');
        if (oldIframe && oldIframe.parentNode) {
            oldIframe.parentNode.removeChild(oldIframe);
        }

        const iframe = document.createElement('iframe');
        iframe.id = 'voucher-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="utf-8" />
                <title>Rezervasyon Fisi - ${bookingId}</title>
                <style>
                    @page { size: A4 portrait; margin: 1.5cm; }
                    * { box-sizing: border-box; }
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        color: #1f2937;
                        background: #ffffff;
                    }
                    .voucher-container {
                        border: 2.5px solid #173f36;
                        border-radius: 14px;
                        padding: 24px;
                        max-width: 720px;
                        margin: 0 auto;
                        background: #ffffff;
                    }
                    .voucher-print-header {
                        display: flex !important;
                        align-items: center;
                        justify-content: space-between;
                        padding-bottom: 16px;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #173f36;
                    }
                    .print-brand-wrap { display: flex; flex-direction: column; }
                    .print-brand-name { font-size: 20px; font-weight: 900; color: #173f36; letter-spacing: -0.5px; }
                    .print-brand-name small { font-size: 11px; color: #4b6357; font-weight: 700; margin-top: 2px; }
                    .print-doc-title { font-size: 12px; font-weight: 800; color: #047857; letter-spacing: 0.8px; margin-top: 3px; }
                    .print-meta-wrap { text-align: right; display: flex; flex-direction: column; gap: 3px; font-size: 11.5px; color: #4b5563; }
                    .print-meta-wrap b { color: #111827; font-family: monospace; font-size: 13px; }
                    .booking-image { margin-bottom: 16px; text-align: center; }
                    .booking-image img { width: 100%; max-height: 280px; object-fit: cover; border-radius: 10px; border: 1px solid #e5e7eb; }
                    .booking-topline { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                    .eyebrow { font-size: 10px; font-weight: 800; color: #6b7280; letter-spacing: 1px; display: block; }
                    .booking-code { font-size: 16px; font-weight: 800; color: #173f36; font-family: monospace; }
                    .booking-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
                    .status-active { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
                    .status-cancelled { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
                    .status-past { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
                    h2 { margin: 10px 0 14px; font-size: 22px; color: #111827; font-weight: 800; }
                    .booking-details { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 20px; color: #4b5563; font-size: 13.5px; }
                    .detail-tag { display: inline-flex; align-items: center; gap: 6px; background: #f9fafb; padding: 6px 12px; border-radius: 8px; border: 1px solid #e5e7eb; }
                    .booking-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1.5px dashed #d1d5db; margin-top: 16px; }
                    .booking-bottom span { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.5px; display: block; }
                    .booking-bottom strong { font-size: 24px; font-weight: 900; color: #173f36; }
                    .booking-actions { display: none !important; }
                    .voucher-footer { margin-top: 24px; padding-top: 14px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
                </style>
            </head>
            <body>
                <div class="voucher-container">
                    ${targetCard.innerHTML}
                    <div class="voucher-footer">
                        Bu belge yolarkadaşı Araç Kiralama sistemi üzerinden elektronik olarak üretilmiştir.
                    </div>
                </div>
            </body>
            </html>
        `);
        doc.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }, 250);
    } catch (e) {
        window.print();
    }
};

window.printAllBookings = () => {
    window.print();
};
