/* Cafe Crunch — vanilla JS: mobile menu, carousel, tabs, scroller, lightbox, FAQ, booking note */
(function () {
  "use strict";

  /* ---------- Mobile menu (instant toggle — no CSS transition on transform) ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (toggle && mobileMenu) {
    var setMenu = function (open) {
      mobileMenu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setMenu(!mobileMenu.classList.contains("is-open"));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Hero carousel ---------- */
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide]"));
    var dotsWrap = carousel.querySelector("[data-carousel-dots]");
    var current = 0, timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + slides.length);
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    var goTo = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle("is-active", j === current); });
      dots.forEach(function (d, j) { d.classList.toggle("is-active", j === current); });
    };
    var restart = function () {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    };
    carousel.querySelector("[data-carousel-prev]").addEventListener("click", function () { goTo(current - 1); restart(); });
    carousel.querySelector("[data-carousel-next]").addEventListener("click", function () { goTo(current + 1); restart(); });
    carousel.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    carousel.addEventListener("mouseleave", restart);
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { goTo(current - 1); restart(); }
      if (e.key === "ArrowRight") { goTo(current + 1); restart(); }
    });
    restart();
  }

  /* ---------- Tabbed menu ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  if (tabs.length) {
    var activate = function (tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("data-tab"));
        if (panel) {
          panel.hidden = !selected;
          panel.classList.toggle("is-active", selected);
        }
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });
  }

  /* ---------- Dessert horizontal scroller ---------- */
  var scroller = document.querySelector("[data-dessert-scroll]");
  if (scroller) {
    var step = function (dir) { scroller.scrollBy({ left: dir * 340, behavior: "smooth" }); };
    var prev = document.querySelector("[data-scroll-prev]");
    var next = document.querySelector("[data-scroll-next]");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  }

  /* ---------- Lightbox gallery ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCap = document.getElementById("lightbox-caption");
  var lbIndex = 0, lastFocus = null;
  if (galleryItems.length && lightbox) {
    var openLb = function (i) {
      lbIndex = (i + galleryItems.length) % galleryItems.length;
      var img = galleryItems[lbIndex].querySelector("img");
      var big = img.getAttribute("srcset") || img.getAttribute("src");
      var large = big.split(",").pop().trim().split(" ")[0];
      lbImg.src = large;
      lbImg.alt = img.alt;
      lbCap.textContent = galleryItems[lbIndex].getAttribute("data-caption") || img.alt;
      lastFocus = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector("[data-lightbox-close]").focus();
    };
    var closeLb = function () {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    galleryItems.forEach(function (item, i) {
      item.addEventListener("click", function () { openLb(i); });
    });
    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLb);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { openLb(lbIndex - 1); });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { openLb(lbIndex + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") openLb(lbIndex - 1);
      if (e.key === "ArrowRight") openLb(lbIndex + 1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.closest(".accordion-item").querySelector(".accordion-panel");
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  /* ---------- Booking form note ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var note = document.getElementById("booking-note");
    var callBtn = document.getElementById("booking-call");
    var updateNote = function () {
      var date = document.getElementById("bk-date").value;
      var time = document.getElementById("bk-time").value;
      var party = document.getElementById("bk-party").value;
      var name = document.getElementById("bk-name").value.trim();
      if (date) {
        var d = new Date(date + "T12:00:00");
        var nice = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
        note.textContent = "Ready to call: " + party + " on " + nice + " at " + time + (name ? " for " + name : "") + ".";
      } else {
        note.textContent = "";
      }
    };
    form.addEventListener("change", updateNote);
    form.addEventListener("input", updateNote);
    callBtn.addEventListener("click", updateNote);
    var dateInput = document.getElementById("bk-date");
    var today = new Date();
    var iso = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
    dateInput.min = iso;
    dateInput.value = iso;
    updateNote();
  }

  /* ---------- Active nav highlighting ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".dish-card, .why-card, .dessert-card, .visit-card, .gallery-item");
  if ("IntersectionObserver" in window) {
    var robs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); robs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add("reveal"); robs.observe(el); });
  }
})();
