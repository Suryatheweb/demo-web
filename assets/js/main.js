/**
 * Ecokuri LP — main script
 * Enqueued from functions.php (ecokuri-lp-main).
 *
 * Site-wide JavaScript. Dependency-free and progressively enhanced:
 * nothing here ever hides content unless the browser supports the
 * features required to animate it.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// FAQ: allow only one <details> item open at a time.
		var faqList = document.querySelector('.faq__list');
		if (faqList) {
			faqList.addEventListener('toggle', function (event) {
				var target = event.target;
				if (!target.open) {
					return;
				}
				faqList.querySelectorAll('.faq__item[open]').forEach(function (item) {
					if (item !== target) {
						item.open = false;
					}
				});
			}, true);
		}

		// Everything below requires IntersectionObserver.
		if (typeof IntersectionObserver === 'undefined') {
			return;
		}

		document.documentElement.classList.add('js');

		// Reduced motion: reveal everything immediately, no animation.
		if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		// ---- Scroll progress bar ----
		var progressBar = document.createElement('div');
		progressBar.className = 'scroll-progress';
		document.body.prepend(progressBar);

		function updateProgress() {
			var max = document.documentElement.scrollHeight - window.innerHeight;
			progressBar.style.width = max > 0 ? (window.pageYOffset / max * 100) + '%' : '0';
		}

		// ---- Sticky header compact ----
		var header = document.querySelector('.site-header');

		function updateHeader() {
			if (!header) return;
			if (window.pageYOffset > 80) {
				header.classList.add('site-header--scrolled');
			} else {
				header.classList.remove('site-header--scrolled');
			}
		}

		// ---- Hero parallax depth ----
		var heroImg = document.querySelector('.hero__media img');

		function updateParallax() {
			if (!heroImg) return;
			var rect = heroImg.getBoundingClientRect();
			var vh = window.innerHeight;
			if (rect.bottom < 0 || rect.top > vh) return;
			var center = rect.top + rect.height / 2;
			var offset = (center - vh / 2) * 0.07;
			heroImg.style.transform = 'translateY(' + offset + 'px) scale(1.02)';
		}

		// ---- Throttled scroll handler (RAF) ----
		var ticking = false;
		window.addEventListener('scroll', function () {
			if (!ticking) {
				requestAnimationFrame(function () {
					updateProgress();
					updateHeader();
					updateParallax();
					ticking = false;
				});
				ticking = true;
			}
		}, { passive: true });

		// Initial state.
		updateProgress();
		updateHeader();

		// ---- Scroll-reveal (IntersectionObserver) ----
		var targets = document.querySelectorAll('.reveal, .item-card, .voice-card, .faq__item');
		if (!targets.length) {
			return;
		}

		var reveal = function (el) {
			el.classList.add('is-visible');
		};

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					reveal(entry.target);
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

		Array.prototype.forEach.call(targets, function (el) {
			observer.observe(el);
		});
	});
})();
