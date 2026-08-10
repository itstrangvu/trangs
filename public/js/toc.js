(function () {
	var nav = document.querySelector(".toc-nav");
	if (!nav || !("IntersectionObserver" in window)) return;

	// Above the rail breakpoint the panel is a fixed sidebar, not a disclosure.
	// CSS blocks the pointer, this blocks keyboard toggling and covers a resize
	// from a narrow width where the reader had collapsed it.
	var panel = nav.closest("details");
	if (panel) {
		var wide = window.matchMedia("(min-width: 1200px)");
		var keepOpen = function () { if (wide.matches && !panel.open) panel.open = true; };
		panel.addEventListener("toggle", keepOpen);
		if (wide.addEventListener) wide.addEventListener("change", keepOpen);
		keepOpen();
	}

	var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
	var headings = [], map = new Map();
	links.forEach(function (a) {
		var el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
		if (el) { headings.push(el); map.set(el, a); }
	});
	if (!headings.length) return;

	var current = null, locked = false, timer;
	function setActive(a) {
		if (a === current) return;
		if (current) { current.removeAttribute("aria-current"); current.classList.remove("is-active"); }
		current = a || null;
		if (current) { current.setAttribute("aria-current", "location"); current.classList.add("is-active"); }
	}

	// Active = the LAST heading whose top has crossed the 30%-of-viewport line.
	// Monotone in scroll position, so several simultaneously-visible headings
	// can never fight, and scrolling up resolves the same way as scrolling down.
	function update() {
		if (locked) return;
		var line = window.innerHeight * 0.3, active = headings[0], i;
		for (i = 0; i < headings.length; i++) {
			if (headings[i].getBoundingClientRect().top <= line) active = headings[i];
			else break;
		}
		// A short final section may never reach the line at max scroll.
		if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
			active = headings[headings.length - 1];
		}
		setActive(map.get(active));
	}

	// The observer is only a change detector: it fires when a heading crosses
	// the line. Which one wins is resolved geometrically, in update().
	var io = new IntersectionObserver(update, { rootMargin: "0px 0px -70% 0px", threshold: 0 });
	headings.forEach(function (h) { io.observe(h); });

	nav.addEventListener("click", function (e) {
		var a = e.target.closest('a[href^="#"]');
		if (!a) return;
		setActive(a);   // immediate feedback, before the smooth scroll lands
		locked = true;  // don't let in-flight observer events override it
		clearTimeout(timer);
		timer = setTimeout(function () { locked = false; update(); }, 800);
	});

	window.addEventListener("scrollend", function () { locked = false; update(); });
	window.addEventListener("resize", update);
	update();
})();
