/* Allés theme: hero slideshow, menu tabs and rail, add to order, mobile menu, scroll reveal fallback. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* hero slideshow */
  document.querySelectorAll("[data-hero]").forEach(hero => {
    const slides = [...hero.querySelectorAll(".slide")];
    const dots = hero.querySelector(".dots");
    if (slides.length < 2 || !dots) { hero.classList.add("single"); slides[0]?.classList.add("active"); return; }
    let i = 0, timer;
    slides.forEach((s, n) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", (hero.dataset.slideLabel || "Slide {{ number }}").replace("{{ number }}", n + 1));
      b.addEventListener("click", () => go(n));
      dots.appendChild(b);
    });
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === i));
      [...dots.children].forEach((d, k) => { d.removeAttribute("aria-current"); if (k === i) { d.style.setProperty("--hold", slides[i].dataset.hold + "ms"); d.setAttribute("aria-current", "true"); } });
      schedule();
    }
    function schedule() { clearTimeout(timer); if (reduce) return; timer = setTimeout(() => go(i + 1), +slides[i].dataset.hold || 6000); }
    hero.querySelector("[data-prev]")?.addEventListener("click", () => go(i - 1));
    hero.querySelector("[data-next]")?.addEventListener("click", () => go(i + 1));
    hero.addEventListener("mouseenter", () => clearTimeout(timer));
    hero.addEventListener("mouseleave", schedule);
    document.addEventListener("visibilitychange", () => document.hidden ? clearTimeout(timer) : schedule());
    go(0);
  });

  /* menu tabs and rail */
  document.querySelectorAll("[data-menu]").forEach(menu => {
    const tabs = [...menu.querySelectorAll(".tab")];
    const rails = [...menu.querySelectorAll(".rail")];
    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(o => o.setAttribute("aria-selected", o === t));
      rails.forEach(r => { r.hidden = r.dataset.cat !== t.dataset.cat; });
    }));
    const visible = () => rails.find(r => !r.hidden);
    menu.querySelector("[data-rail-prev]")?.addEventListener("click", () => visible()?.scrollBy({ left: -visible().clientWidth * .6, behavior: "smooth" }));
    menu.querySelector("[data-rail-next]")?.addEventListener("click", () => visible()?.scrollBy({ left: visible().clientWidth * .6, behavior: "smooth" }));
  });

  /* add to order from a card or product page */
  const counts = document.querySelectorAll("[data-cart-count]");
  const setCount = n => { counts.forEach(c => { c.textContent = `(${n})`; }); document.querySelectorAll("[data-cart-link]").forEach(a => { if (n > 0) a.href = a.dataset.cartLink; }); };
  document.addEventListener("submit", async e => {
    const form = e.target.closest("form[data-add]");
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector("[type=submit]");
    const label = btn.textContent;
    btn.disabled = true;
    try {
      const res = await fetch(form.action + ".js", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      if (!res.ok) throw new Error((await res.json()).description || res.statusText);
      const cart = await (await fetch("/cart.js", { headers: { Accept: "application/json" } })).json();
      setCount(cart.item_count);
      btn.textContent = btn.dataset.added || "Added";
    } catch (err) {
      btn.textContent = err.message.slice(0, 40);
    } finally {
      setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 1600);
    }
  });

  /* quantity steppers */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-qty]");
    if (!b) return;
    const input = b.parentElement.querySelector("input");
    input.value = Math.max(1, (+input.value || 1) + (+b.dataset.qty));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  /* mobile menu */
  const tog = document.querySelector("[data-menu-toggle]"), mm = document.querySelector("[data-mobile-menu]");
  if (tog && mm) {
    const labels = { open: tog.textContent, close: tog.dataset.close || "Close" };
    tog.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; tog.setAttribute("aria-expanded", open); tog.textContent = open ? labels.close : labels.open; });
  }

  /* newsletter inline validation */
  document.querySelectorAll("form[data-newsletter]").forEach(form => {
    form.addEventListener("submit", e => {
      const v = form.querySelector("input[type=email]").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { e.preventDefault(); const m = form.querySelector(".msg"); if (m) m.textContent = form.dataset.error || "That email address looks incomplete."; }
    });
  });

  /* scroll reveal fallback for browsers without scroll-driven animations */
  if (!CSS.supports("(animation-timeline: view()) and (animation-range: entry)") && !reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }
})();
