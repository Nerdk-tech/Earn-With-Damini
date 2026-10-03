/* ===========================
   EARN WITH DAMINĪ — MAIN JS
   =========================== */

const WA_NUMBER = "2348054671458";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- LOADING SCREEN ---------- */
  const preloader = document.getElementById("preloader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderPct = document.getElementById("loaderPct");

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(() => {
        preloader.classList.add("done");
        document.body.classList.add("loaded");
        revealOnScroll(); // reveal whatever is in view immediately
      }, 450);
    }
    loaderFill.style.width = progress + "%";
    loaderPct.textContent = Math.round(progress) + "%";
  }, 130);

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  function revealOnScroll() {
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }
  revealOnScroll();

  /* ---------- 3D TILT ON COURSE CARDS ---------- */
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- HERO 3D TITLE PARALLAX ---------- */
  const scene = document.querySelector(".hero");
  const layers = document.querySelectorAll(".t3d");

  if (window.matchMedia("(pointer: fine)").matches) {
    scene.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      layers.forEach((l, i) => {
        l.style.transform = `translateX(${x * (6 + i * 3)}px) translateY(${y * (5 + i * 2)}px)`;
      });
      const sceneEl = document.querySelector(".coin-scene");
      if (sceneEl) {
        sceneEl.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 14}deg)`;
      }
    });
  }

  /* ---------- INSTALLMENT PLAN PICKER ---------- */
  const plans = document.querySelectorAll(".plan");
  const planLabel = document.getElementById("planLabel");
  const waPayBtn = document.getElementById("waPayBtn");

  function selectedPlan() {
    const el = document.querySelector(".plan.active");
    return el ? el.dataset.plan : "5 payments";
  }

  function updatePayLink() {
    const plan = selectedPlan();
    planLabel.textContent = plan;
    const msg = `Hi Damini! 👋 I want to enroll in a course with *Earn With Daminī*. I'd like to pay in *${plan}*. Please send me the details and how to start.`;
    waPayBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  plans.forEach(p => {
    p.addEventListener("click", () => {
      plans.forEach(x => {
        x.classList.remove("active");
        x.setAttribute("aria-checked", "false");
      });
      p.classList.add("active");
      p.setAttribute("aria-checked", "true");
      updatePayLink();
    });
  });

  updatePayLink();

  /* ---------- COURSE CARDS -> WHATSAPP ---------- */
  document.querySelectorAll(".course-card").forEach(card => {
    const btn = card.querySelector(".course-btn");
    const course = card.dataset.course;
    const msg = `Hi Damini! 👋 I want to enroll in the *${course}* course from Earn With Daminī. Please send me the details and payment plans.`;
    btn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
