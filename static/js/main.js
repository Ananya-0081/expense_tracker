// ================================================================== //
// TrackIt — landing interactions                                     //
// ================================================================== //

(function () {
    "use strict";

    // ---- Lucide icons ------------------------------------------- //
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }

    // ---- Navbar blur on scroll ---------------------------------- //
    var navbar = document.getElementById("navbar");
    if (navbar) {
        var onScroll = function () {
            navbar.classList.toggle("scrolled", window.scrollY > 8);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Scroll reveal ------------------------------------------ //
    var revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    // ---- Animated statistics ------------------------------------ //
    var counters = document.querySelectorAll(".stat-number[data-count]");

    var runCount = function (el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var start = null;

        var frame = function (ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            // easeOutCubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(target * eased);
            el.innerHTML = prefix + value + '<span class="suffix">' + suffix + "</span>";
            if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
        counters.forEach(function (el) {
            var prefix = el.getAttribute("data-prefix") || "";
            var suffix = el.getAttribute("data-suffix") || "";
            el.innerHTML = prefix + (el.getAttribute("data-count") || "0") +
                '<span class="suffix">' + suffix + "</span>";
        });
    } else {
        var countObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { countObserver.observe(el); });
    }
})();
