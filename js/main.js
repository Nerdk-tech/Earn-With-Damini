/* ===========================
   EARN WITH DAMINĪ — MAIN JS
   =========================== */

const WA_NUMBER = "2348054671458";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- HELPERS ---------- */
  const naira = (n) => "₦" + n.toLocaleString("en-NG");

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

  /* ---------- CART STATE ---------- */
  let cart = [];

  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartCount = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartPlanLabel = document.getElementById("cartPlanLabel");
  const cartPerPay = document.getElementById("cartPerPay");
  const planBreakdown = document.getElementById("planBreakdown");
  const toast = document.getElementById("toast");

  const courseCard = (name) =>
    document.querySelector(`.course-card[data-course="${CSS.escape(name)}"]`);

  const cartTotal = () =>
    cart.reduce((sum, name) => {
      const card = courseCard(name);
      return card ? sum + Number(card.dataset.price) : sum;
    }, 0);

  /* ---------- INSTALLMENT PLAN PICKER ---------- */
  const plans = document.querySelectorAll(".plan");
  const planLabel = document.getElementById("planLabel");
  const waPayBtn = document.getElementById("waPayBtn");

  function selectedPlan() {
    const el = document.querySelector(".plan.active");
    return el ? el.dataset.plan : "5 payments";
  }

  function planCount() {
    return Number(selectedPlan().split(" ")[0]);
  }

  function buildCheckoutMessage() {
    const plan = selectedPlan();
    const n = planCount();
    const total = cartTotal();

    if (total > 0) {
      const per = Math.ceil(total / n);
      const lines = cart.map(name => {
        const card = courseCard(name);
        return `• ${name} — ${naira(Number(card.dataset.price))}`;
      }).join("\n");
      return `Hi Damini! 👋 I want to enroll in these courses from *Earn With Daminī*:\n${lines}\n\nTotal: *${naira(total)}*\nI'd like to pay in *${plan}* (about ${naira(per)} per payment).\nPlease send me the payment details.`;
    }

    return `Hi Damini! 👋 I want to enroll in a course with *Earn With Daminī*. I'd like to pay in *${plan}*. Please send me the details and how to start.`;
  }

  function refreshAll() {
    const plan = selectedPlan();
    const n = planCount();
    const total = cartTotal();
    const per = total > 0 ? Math.ceil(total / n) : 0;

    planLabel.textContent = plan;
    waPayBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildCheckoutMessage())}`;

    if (total > 0) {
      planBreakdown.textContent = ` → ${naira(per)} per payment`;
      planBreakdown.hidden = false;
    } else {
      planBreakdown.hidden = true;
    }

    cartPlanLabel.textContent = plan;
    cartPerPay.textContent = total > 0 ? naira(per) : "—";

    if (total > 0) {
      checkoutBtn.href = waPayBtn.href;
      checkoutBtn.classList.remove("disabled");
    } else {
      checkoutBtn.href = "#";
      checkoutBtn.classList.add("disabled");
    }
  }

  plans.forEach(p => {
    p.addEventListener("click", () => {
      plans.forEach(x => {
        x.classList.remove("active");
        x.setAttribute("aria-checked", "false");
      });
      p.classList.add("active");
      p.setAttribute("aria-checked", "true");
      refreshAll();
    });
  });

  /* ---------- CART DRAWER UI ---------- */
  function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.hidden = false;
    cartDrawer.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.hidden = true;
    cartDrawer.setAttribute("aria-hidden", "true");
  }
  cartBtn.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function renderCart() {
    cartItems.querySelectorAll(".cart-item").forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmpty.style.display = "";
    } else {
      cartEmpty.style.display = "none";
      cart.forEach(name => {
        const card = courseCard(name);
        const price = Number(card.dataset.price);
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div class="cart-item-info">
            <strong></strong>
            <span></span>
          </div>
          <button class="cart-remove" aria-label="Remove ${name}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          </button>`;
        row.querySelector("strong").textContent = name;
        row.querySelector("span").textContent = naira(price);
        row.querySelector(".cart-remove").addEventListener("click", () => {
          removeFromCart(name);
        });
        cartItems.appendChild(row);
      });
    }

    cartCount.textContent = cart.length;
    cartCount.hidden = cart.length === 0;
    cartTotalEl.textContent = naira(cartTotal());
    refreshAll();
  }

  function addToCart(name, btn) {
    cart.push(name);
    btn.classList.add("added");
    btn.textContent = "Added ✓";
    showToast("Added to cart");
    renderCart();
  }

  function removeFromCart(name) {
    cart = cart.filter(c => c !== name);
    const card = courseCard(name);
    const btn = card.querySelector(".add-btn");
    btn.classList.remove("added");
    btn.textContent = "Add to Cart";
    showToast("Removed from cart");
    renderCart();
  }

  /* ---------- ADD TO CART BUTTONS ---------- */
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.closest(".course-card").dataset.course;
      if (cart.includes(name)) {
        removeFromCart(name);
      } else {
        addToCart(name, btn);
      }
    });
  });

  // clicking checkout with empty cart opens the drawer instead
  checkoutBtn.addEventListener("click", (e) => {
    if (cart.length === 0) {
      e.preventDefault();
      openCart();
    }
  });

  renderCart();

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
