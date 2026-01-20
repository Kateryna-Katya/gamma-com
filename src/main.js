/**
 * GAMMA-COM.FIT - Core Engine 2026
 * Платформа: Инновации на пальцах
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. МОБИЛЬНОЕ МЕНЮ (Full Overlay)
    const initMobileMenu = () => {
        const burger = document.querySelector('.burger');
        const menu = document.getElementById('mobile-menu');
        const closeBtn = document.getElementById('menu-close');
        const navLinks = document.querySelectorAll('.mobile-menu__nav a');

        const toggleMenu = (state) => {
            menu.classList.toggle('active', state);
            document.body.style.overflow = state ? 'hidden' : '';
        };

        if (burger && menu) {
            burger.addEventListener('click', () => toggleMenu(true));
            closeBtn?.addEventListener('click', () => toggleMenu(false));
            
            navLinks.forEach(link => {
                link.addEventListener('click', () => toggleMenu(false));
            });
        }
    };

    // 3. ФИКС РАЗРЫВА СЛОВ И HERO АНИМАЦИЯ (GSAP + SplitType)
    const initHeroAnimation = () => {
        const title = document.querySelector('#hero-title');
        if (!title || typeof gsap === 'undefined' || typeof SplitType === 'undefined') return;

        /**
         * РЕШЕНИЕ ПРОБЛЕМЫ РАЗРЫВА СЛОВ:
         * Мы разбиваем текст на words И chars. 
         * В CSS .word должен иметь white-space: nowrap.
         */
        const textInstance = new SplitType(title, { 
            types: 'words, chars',
            tagName: 'span'
        });

        // Анимация появления букв
        gsap.to(textInstance.chars, {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.3
        });

        // Анимация остальных элементов Hero
        gsap.from('.hero__badge, .hero__subtitle, .hero__actions, .hero__visual', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.8
        });

        // Параллакс свечений (Интерактив)
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 30;
            
            gsap.to('.hero__glow--1', { x: moveX, y: moveY, duration: 1.5 });
            gsap.to('.hero__glow--2', { x: -moveX, y: -moveY, duration: 1.5 });
        });
    };

    // 4. HEADER: СКРОЛЛ ЭФФЕКТЫ
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header--scrolled');
                header.style.padding = '12px 0';
                header.style.backgroundColor = 'rgba(10, 10, 12, 0.95)';
            } else {
                header.classList.remove('header--scrolled');
                header.style.padding = '20px 0';
                header.style.backgroundColor = 'transparent';
            }
        });
    };

    // 5. REVEAL: ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ (Intersection Observer)
    const initRevealOnScroll = () => {
        const observerOptions = { threshold: 0.12 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Перестаем следить после активации
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // 6. TECH EXPLORER (Интерактивные карточки инноваций)
    const initTechCards = () => {
        const cards = document.querySelectorAll('.tech__card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                cards.forEach(c => c.classList.remove('active'));
                if (!isActive) card.classList.add('active');
            });
        });
    };

    // 7. КОНТАКТНАЯ ФОРМА: ВАЛИДАЦИЯ И CAPTCHA
    const initContactForm = () => {
        const form = document.getElementById('main-form');
        if (!form) return;

        const phoneInput = document.getElementById('user_phone');
        const captchaLabel = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        const successOverlay = document.getElementById('form-success');

        // Генерация математического примера
        const n1 = Math.floor(Math.random() * 12) + 1;
        const n2 = Math.floor(Math.random() * 8) + 1;
        const sum = n1 + n2;
        if (captchaLabel) captchaLabel.textContent = `Решите: ${n1} + ${n2} = ?`;

        // Валидация телефона (удаление не-цифр)
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });

        // Отправка формы (AJAX имитация)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Проверка капчи
            if (parseInt(captchaInput.value) !== sum) {
                captchaInput.style.borderColor = '#ff4b4b';
                alert('Ошибка в расчетах капчи. Попробуйте еще раз.');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Обработка...';

            // Имитация задержки сервера
            setTimeout(() => {
                successOverlay.classList.add('active');
                if (typeof lucide !== 'undefined') lucide.createIcons();
                form.reset();
            }, 1800);
        });
    };

    // 8. COOKIE POPUP (Local Storage)
    const initCookieConsent = () => {
        const cookieBox = document.getElementById('cookie-popup');
        const acceptBtn = document.getElementById('cookie-accept');

        if (!cookieBox || !acceptBtn) return;

        if (!localStorage.getItem('gamma_cookies_accepted')) {
            setTimeout(() => {
                cookieBox.classList.add('active');
            }, 3000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('gamma_cookies_accepted', 'true');
            cookieBox.classList.remove('active');
        });
    };

    // ЗАПУСК ВСЕХ СИСТЕМ
    initMobileMenu();
    initHeaderScroll();
    initHeroAnimation();
    initRevealOnScroll();
    initTechCards();
    initContactForm();
    initCookieConsent();
});