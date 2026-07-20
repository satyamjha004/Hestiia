const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", function () {
  // ─── LENIS SMOOTH SCROLL ──────────────────────────────
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", (e) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (e.animatedScroll / max) * 100;
    document.getElementById("scrollProgress").style.width = progress + "%";
    const navbar = document.getElementById("navbar");
    // Add scrolled class for visual effect, but navbar stays visible
    if (e.animatedScroll > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    const backTop = document.getElementById("backTop");
    if (e.animatedScroll > 500) {
      backTop.classList.add("show");
    } else {
      backTop.classList.remove("show");
    }
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ─── GSAP + SCROLLTRIGGER ──────────────────────────────
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  gsap.from(".hero-social-sidebar", {
    duration: 1,
    x: -30,
    opacity: 0,
    ease: "power3.out",
    delay: 0.8,
  });

  gsap.from(".hero-buttons", {
    duration: 0.8,
    y: 40,
    opacity: 0,
    ease: "power3.out",
    delay: 0.5,
  });

  ScrollTrigger.batch(".reveal-scale", {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    once: true,
  });

  ScrollTrigger.batch(".reveal-left", {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    once: true,
  });

  ScrollTrigger.batch(".reveal-right", {
    onEnter: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    once: true,
  });

  // ─── HERO SLIDER ──────────────────────────────────────────
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide-img");
    if (!slides.length) return;
    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    showSlide(0);
    // 2-second interval
    let interval = setInterval(nextSlide, 2000);

    const container = document.getElementById("heroSliderContainer");
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(interval));
      container.addEventListener("mouseleave", () => {
        interval = setInterval(nextSlide, 2000);
      });
    }
  }
  initHeroSlider();

  // ─── POPUP BOOKING ──────────────────────────────────────
  const popup = document.getElementById("popupBooking");
  const closePopup = document.getElementById("closePopup");

  setTimeout(() => {
    popup.classList.add("open");
  }, 1500);

  closePopup.addEventListener("click", () => popup.classList.remove("open"));
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.classList.remove("open");
  });

  // ─── NAVIGATION SYSTEM ──────────────────────────────────
  function navigateTo(page) {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));

    const target = document.getElementById("page-" + page);
    if (target) {
      target.classList.add("active");
      gsap.fromTo(
        target,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }

    document.querySelectorAll(".nav-links > li > a").forEach((a) => {
      a.classList.remove("active");
      if (a.dataset.page === page) {
        a.classList.add("active");
      }
    });

    lenis.scrollTo(0, { immediate: true });
    if (menuOpen) hamburger.click();
    document.getElementById("cartPanel").classList.remove("open");
  }
  window.navigateTo = navigateTo;

  // ─── BACK TO TOP ──────────────────────────────────────
  document.getElementById("backTop").addEventListener("click", () => {
    lenis.scrollTo(0, { duration: 1.2 });
  });

  // ─── HAMBURGER ───────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  let menuOpen = false;

  hamburger.addEventListener("click", function () {
    menuOpen = !menuOpen;
    const spans = this.querySelectorAll("span");
    if (menuOpen) {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "50px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(26,26,26,0.96)";
      navLinks.style.backdropFilter = "blur(24px)";
      navLinks.style.padding = "20px 24px 24px";
      navLinks.style.gap = "12px";
      navLinks.style.borderRadius = "16px";
      navLinks.style.marginTop = "12px";
      navLinks.style.zIndex = "999";
      navLinks.querySelectorAll(".dropdown").forEach((d) => {
        d.style.position = "relative";
        d.style.top = "0";
        d.style.left = "0";
        d.style.transform = "none";
        d.style.opacity = "1";
        d.style.visibility = "visible";
        d.style.boxShadow = "none";
        d.style.background = "transparent";
        d.style.padding = "4px 0 4px 16px";
        d.style.border = "none";
      });
      spans[0].style.transform = "rotate(45deg) translate(4px,4px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(4px,-4px)";
      this.setAttribute("aria-expanded", "true");
    } else {
      navLinks.style.display = "";
      navLinks.style.flexDirection = "";
      navLinks.style.position = "";
      navLinks.style.top = "";
      navLinks.style.left = "";
      navLinks.style.right = "";
      navLinks.style.background = "";
      navLinks.style.backdropFilter = "";
      navLinks.style.padding = "";
      navLinks.style.gap = "";
      navLinks.style.borderRadius = "";
      navLinks.style.marginTop = "";
      navLinks.style.zIndex = "";
      navLinks.querySelectorAll(".dropdown").forEach((d) => {
        d.style.position = "";
        d.style.top = "";
        d.style.left = "";
        d.style.transform = "";
        d.style.opacity = "";
        d.style.visibility = "";
        d.style.boxShadow = "";
        d.style.background = "";
        d.style.padding = "";
        d.style.border = "";
      });
      spans.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
      this.setAttribute("aria-expanded", "false");
    }
  });

  // ─── CART SYSTEM ──────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem("hestiia_cart")) || [];

  function saveCart() {
    localStorage.setItem("hestiia_cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const itemsContainer = document.getElementById("cartItems");
    const footer = document.getElementById("cartFooter");
    const totalEl = document.getElementById("cartTotal");
    const badge = document.getElementById("cartBadge");

    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (badge) {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove("empty");
      } else {
        badge.classList.add("empty");
      }
    }

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
                <div class="empty-cart">
                  <i class="fas fa-shopping-bag"></i>
                  Your cart is empty.<br />
                  <span style="font-size: 0.8rem; opacity: 0.6">Add items from our menu</span>
                </div>
              `;
      footer.style.display = "none";
      return;
    }

    footer.style.display = "block";
    totalEl.textContent = "₹" + total;

    let html = "";
    cart.forEach((item, idx) => {
      html += `
                <div class="cart-item">
                  <div class="info">
                    <h5>${item.name}</h5>
                    <div class="price">₹${item.price} × ${item.qty}</div>
                  </div>
                  <div class="qty">
                    <button onclick="changeQty(${idx}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${idx}, 1)">+</button>
                    <button class="remove-item" onclick="removeItem(${idx})"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              `;
    });
    itemsContainer.innerHTML = html;
  }

  window.changeQty = function (idx, delta) {
    if (cart[idx]) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      saveCart();
      updateCartUI();
    }
  };

  window.removeItem = function (idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
  };

  // ─── ADD TO CART FROM MENU ──────────────────────────────
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-cart-btn");
    if (btn) {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      saveCart();
      updateCartUI();
      showToast(`✓ ${name} added to cart!`);
    }
  });

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  // ─── CART PANEL TOGGLE ──────────────────────────────────
  const navCartBtn = document.getElementById("navCartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");

  navCartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });

  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });

  document.addEventListener("click", (e) => {
    if (
      cartPanel.classList.contains("open") &&
      !cartPanel.contains(e.target) &&
      e.target !== navCartBtn &&
      !navCartBtn.contains(e.target)
    ) {
      cartPanel.classList.remove("open");
    }
  });

  // ─── RAZORPAY CHECKOUT ──────────────────────────────────
  const RAZORPAY_KEY = "rzp_test_YourKeyHere";
  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }
    document.getElementById("checkoutOverlay").style.display = "flex";
  });

  document
    .getElementById("closeCheckout")
    .addEventListener("click", function () {
      document.getElementById("checkoutOverlay").style.display = "none";
    });
  document
    .getElementById("checkoutOverlay")
    .addEventListener("click", function (e) {
      if (e.target === this) this.style.display = "none";
    });

  document
    .getElementById("checkoutForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const options = {
        key: RAZORPAY_KEY,
        amount: total * 100,
        currency: "INR",
        name: "HESTIIA Restaurant",
        description: "Food Order Payment",
        image: "https://via.placeholder.com/100x100?text=HESTIIA",
        prefill: {
          name: document.getElementById("customerName").value,
          email: document.getElementById("customerEmail").value,
          contact: document.getElementById("customerPhone").value,
        },
        notes: {
          address: document.getElementById("customerAddress").value,
          city: document.getElementById("customerCity").value,
          state: document.getElementById("customerState").value,
          pincode: document.getElementById("customerPincode").value,
          order_items: cart
            .map((item) => `${item.name} × ${item.qty}`)
            .join(", "),
        },
        theme: { color: "#8B1A1A" },
        handler: async function (response) {
          const orderId = "ORD-" + Date.now();
          const orderData = {
            customer_name: document.getElementById("customerName").value,
            email: document.getElementById("customerEmail").value,
            phone: document.getElementById("customerPhone").value,
            address: document.getElementById("customerAddress").value,
            city: document.getElementById("customerCity").value,
            state: document.getElementById("customerState").value,
            pincode: document.getElementById("customerPincode").value,
            items: cart,
            subtotal: total,
            gst: 0,
            delivery_charge: 0,
            total: total,
            payment_method: "Razorpay",
            payment_id: response.razorpay_payment_id,
          };

          try {
            const res = await fetch(`${API_URL}/orders`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            console.log("Order placed:", result);
          } catch (error) {
            console.error("Order API error:", error);
          }

          cart = [];
          saveCart();
          updateCartUI();
          cartPanel.classList.remove("open");
          document.getElementById("checkoutOverlay").style.display = "none";

          sendWhatsApp(
            `🆕 *New Order Placed!*\n\n` +
              `🆔 Order ID: ${orderId}\n` +
              `📦 Items:\n${orderData.items.map((i) => `  • ${i.name} × ${i.qty} = ₹${i.price * i.qty}`).join("\n")}\n` +
              `💰 Total: ₹${total}\n` +
              `💳 Payment ID: ${response.razorpay_payment_id}\n` +
              `📅 Date: ${new Date().toLocaleString()}`,
          );

          showToast(`✅ Order placed successfully! Order ID: ${orderId}`);
        },
        modal: {
          ondismiss: function () {
            showToast("Payment cancelled.", "error");
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });

  // ─── WHATSAPP / EMAIL NOTIFICATION HELPERS ──────────────
  function sendWhatsApp(message) {
    const waUrl = `https://wa.me/916392693457?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  function sendEmail(subject, body) {
    const mailtoUrl = `mailto:info@hestiia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  }

  window.sendOrderNotification = function (platform) {
    const msg = `🍽️ *Order Notification*\n\nPlatform: ${platform}\nCustomer wants to order from HESTIIA.\nPlease check the platform for details.`;
    sendWhatsApp(msg);
    sendEmail(`Order - ${platform}`, msg);
    showToast(`✓ Order notification sent to owner via WhatsApp & Email!`);
    if (platform === "Zomato") {
      window.open("https://www.zomato.com/kanpur", "_blank");
    } else {
      window.open("https://www.swiggy.com/", "_blank");
    }
  };

  // ─── RESERVATION FORM ──────────────────────────────────
  document
    .getElementById("reservationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("resName").value.trim();
      const email = document.getElementById("resEmail").value.trim();
      const phone = document.getElementById("resPhone").value.trim();
      const date = document.getElementById("resDate").value;
      const time = document.getElementById("resTime").value;
      const guests = document.getElementById("resGuests").value;
      const requests = document.getElementById("resRequests").value.trim();

      if (!name || !email || !phone || !date) {
        alert("Please fill all required fields.");
        return;
      }

      const msg =
        `🍽️ *New Table Reservation*\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📞 Phone: ${phone}\n` +
        `📅 Date: ${date}\n` +
        `🕐 Time: ${time}\n` +
        `👥 Guests: ${guests}\n` +
        `📝 Requests: ${requests || "None"}`;

      sendWhatsApp(msg);
      sendEmail(`Table Reservation - ${name}`, msg);

      document.getElementById("resSuccess").classList.add("show");
      this.querySelector(".btn-reserve").textContent = "✓ Sent!";
      this.reset();
      setTimeout(() => {
        document.getElementById("resSuccess").classList.remove("show");
        this.querySelector(".btn-reserve").textContent = "Reserve Table";
      }, 3000);
    });

  // ─── INQUIRY FORM ──────────────────────────────────────
  document
    .getElementById("inquiryForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("inqName").value.trim();
      const email = document.getElementById("inqEmail").value.trim();
      const phone = document.getElementById("inqPhone").value.trim();
      const age = document.getElementById("inqAge").value;
      const designation = document.getElementById("inqDesignation").value;
      const pincode = document.getElementById("inqPincode").value;
      const company = document.getElementById("inqCompany").value;
      const address = document.getElementById("inqAddress").value;
      const message = document.getElementById("inqMessage").value.trim();

      if (!name || !email) {
        alert("Please fill all required fields.");
        return;
      }

      const msg =
        `👑 *Membership Inquiry*\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📞 Phone: ${phone || "N/A"}\n` +
        `📅 Age: ${age || "N/A"}\n` +
        `💼 Designation: ${designation || "N/A"}\n` +
        `🏢 Company: ${company || "N/A"}\n` +
        `📍 Address: ${address || "N/A"}\n` +
        `📮 Pincode: ${pincode || "N/A"}\n` +
        `📝 Message: ${message || "None"}`;

      sendWhatsApp(msg);
      sendEmail(`Membership Inquiry - ${name}`, msg);

      document.getElementById("inqSuccess").classList.add("show");
      this.querySelector(".btn-submit").textContent = "✓ Sent!";
      this.reset();
      setTimeout(() => {
        document.getElementById("inqSuccess").classList.remove("show");
        this.querySelector(".btn-submit").textContent = "Send Your Message";
      }, 3000);
    });

  // ─── NEWSLETTER ──────────────────────────────────────────
  document
    .getElementById("footerNewsletterBtn")
    .addEventListener("click", function () {
      const input = document.getElementById("footerNewsletter");
      if (input.value.trim() && input.value.includes("@")) {
        const msg = `📧 *Newsletter Subscription*\n\nEmail: ${input.value.trim()}`;
        sendWhatsApp(msg);
        sendEmail("Newsletter Subscription", msg);
        alert(
          "✓ Thank you for subscribing! Get 25% off on your first order. (T&C apply)",
        );
        input.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });

  // ─── MENU DATA & RENDER ─────────────────────────────────
  const menuData = [
    {
      name: "Veg Sandwich",
      category: "sandwich",
      price: 119,
      desc: "Fresh veggies with cheese",
    },
    {
      name: "Cheese Sandwich",
      category: "sandwich",
      price: 139,
      desc: "Grilled cheese delight",
    },
    {
      name: "Paneer Tikka Sandwich",
      category: "sandwich",
      price: 169,
      desc: "Tandoori paneer",
    },
    {
      name: "Veg Burger",
      category: "burger",
      price: 89,
      desc: "Classic veg patty",
    },
    {
      name: "Cheese Burger",
      category: "burger",
      price: 109,
      desc: "Loaded with cheese",
    },
    {
      name: "Margherita",
      category: "pizza",
      price: 189,
      desc: "Only cheese topping",
    },
    {
      name: "Fresh Veggies",
      category: "pizza",
      price: 219,
      desc: "Onion, Tomato, Capsicum",
    },
    {
      name: "Paneer Tikka Pizza",
      category: "pizza",
      price: 279,
      desc: "Roasted paneer",
    },
    {
      name: "Hestiia Special",
      category: "pizza",
      price: 339,
      desc: "Loaded with everything",
    },
    {
      name: "White Sauce Pasta",
      category: "pasta",
      price: 249,
      desc: "Creamy white sauce",
    },
    {
      name: "Red Sauce Pasta",
      category: "pasta",
      price: 219,
      desc: "Tangy red sauce",
    },
    {
      name: "Paneer Butter Masala",
      category: "indian",
      price: 285,
      desc: "Rich tomato gravy",
    },
    {
      name: "Kadhai Paneer",
      category: "indian",
      price: 275,
      desc: "Spicy kadhai",
    },
    {
      name: "Dal Makhani",
      category: "indian",
      price: 229,
      desc: "Creamy black dal",
    },
    {
      name: "Veg Biryani",
      category: "indian",
      price: 189,
      desc: "Fragrant rice",
    },
    {
      name: "Hyderabadi Biryani",
      category: "indian",
      price: 209,
      desc: "Rich & spicy",
    },
    {
      name: "Honey Chilli Potato",
      category: "chinese",
      price: 165,
      desc: "Sweet & spicy",
    },
    {
      name: "Veg Manchurian",
      category: "chinese",
      price: 219,
      desc: "Dry or gravy",
    },
    {
      name: "Veg Fried Rice",
      category: "chinese",
      price: 165,
      desc: "Classic fried rice",
    },
    {
      name: "Hakka Noodles",
      category: "chinese",
      price: 165,
      desc: "Stir-fried noodles",
    },
    {
      name: "Mojito",
      category: "beverages",
      price: 149,
      desc: "Classic mojito",
    },
    {
      name: "Blue Lagoon",
      category: "beverages",
      price: 149,
      desc: "Blue curaçao",
    },
    {
      name: "Fresh Lime Soda",
      category: "beverages",
      price: 85,
      desc: "Lime & soda",
    },
    { name: "Gulab Jamun", category: "desserts", price: 49, desc: "2 pieces" },
    {
      name: "Hot Chocolate Brownie",
      category: "desserts",
      price: 149,
      desc: "With ice cream",
    },
    {
      name: "Chocolate Shake",
      category: "shakes",
      price: 149,
      desc: "Thick chocolate",
    },
    { name: "Oreo Shake", category: "shakes", price: 159, desc: "Oreo cookie" },
    {
      name: "Kit-Kat Shake",
      category: "shakes",
      price: 159,
      desc: "Kit-Kat chunks",
    },
    {
      name: "Cold Coffee",
      category: "shakes",
      price: 149,
      desc: "Iced coffee",
    },
    {
      name: "Hestiia Special Shake",
      category: "shakes",
      price: 199,
      desc: "Signature shake",
    },
  ];

  function renderMenu(category) {
    const filtered =
      category === "all"
        ? menuData
        : menuData.filter((item) => item.category === category);
    const limited = filtered.slice(0, 8);
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = limited
      .map(
        (item) => `
                <div class="menu-item">
                  <div class="thumb">
                    <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=100&q=80" alt="${item.name}" loading="lazy" />
                  </div>
                  <div class="info">
                    <h5>${item.name}</h5>
                    <div class="meta">${item.desc} <span>•</span> ${item.category}</div>
                  </div>
                  <div class="price-tag">₹${item.price}</div>
                  <button class="add-cart-btn" data-name="${item.name}" data-price="${item.price}">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              `,
      )
      .join("");
  }
  renderMenu("all");

  document.querySelectorAll(".menu-filter").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".menu-filter")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      renderMenu(this.dataset.category);
    });
  });

  // ─── AI CHATBOT ──────────────────────────────────────────
  const chatToggle = document.getElementById("chatToggle");
  const chatWidget = document.getElementById("chatWidget");
  const closeChat = document.getElementById("closeChat");
  const chatMessages = document.getElementById("chatMessages");

  chatToggle.addEventListener("click", () => {
    chatWidget.classList.toggle("open");
  });

  closeChat.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });

  const whatsappNumber = "916392693457";

  document.querySelectorAll(".chat-options .opt-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action;

      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = this.textContent.trim();
      chatMessages.appendChild(userMsg);

      let response = "";
      let waMsg = "";

      switch (action) {
        case "book":
          response =
            "📍 You can book a table by calling us at <strong>6392693457</strong> or use our <strong>Book Table</strong> button.";
          waMsg = "Hello HESTIIA, I would like to book a table.";
          break;
        case "menu":
          response =
            '🍽️ Explore our delicious menu <a href="#" onclick="navigateTo(\'menu\'); chatWidget.classList.remove(\'open\');" style="color:var(--gold);">here</a> or visit our Zomato/Swiggy pages.';
          waMsg = "Hello HESTIIA, I would like to see your menu.";
          break;
        case "contact":
          response =
            "📧 You can reach us at <strong>info@hestiia.com</strong> or call <strong>6392693457</strong>. We're here to help!";
          waMsg = "Hello HESTIIA, I have a question.";
          break;
        case "membership":
          response =
            '👑 For membership inquiries, please visit our <a href="#" onclick="navigateTo(\'inquiry\'); chatWidget.classList.remove(\'open\');" style="color:var(--gold);">Inquiry page</a> or contact +91 6392693457.';
          waMsg = "Hello HESTIIA, I am interested in your membership program.";
          break;
        default:
          response =
            "Thank you for reaching out! How can I assist you further?";
          waMsg = "Hello HESTIIA, I have a question.";
      }

      setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "msg bot";
        botMsg.innerHTML = response;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");
      }, 600);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // ─── THREE.JS PARTICLES ──────────────────────────────────
  (function initParticles() {
    const container = document.getElementById("hero-particles");
    if (!container || typeof THREE === "undefined") return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      const c = 0.5 + Math.random() * 0.5;
      colors[i * 3] = c * 0.95;
      colors[i * 3 + 1] = c * 0.7;
      colors[i * 3 + 2] = c * 0.35;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.045,
      transparent: true,
      opacity: 0.4,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 6;
    let t = 0;

    function animParticles() {
      requestAnimationFrame(animParticles);
      t += 0.001;
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(t + i * 0.5) * 0.0006;
        pos[i3] += Math.cos(t * 0.6 + i * 0.3) * 0.0005;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    }
    animParticles();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

  // ─── KEYBOARD ACCESSIBILITY ────────────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (menuOpen) hamburger.click();
      popup.classList.remove("open");
      chatWidget.classList.remove("open");
      cartPanel.classList.remove("open");
      document.getElementById("checkoutOverlay").style.display = "none";
    }
  });

  // ─── INIT CART UI ──────────────────────────────────────
  updateCartUI();

  console.log("✦ HESTIIA — Premium Luxury Restaurant Website ✦");
  console.log(
    "📍 Map Location: 1-b, Ram Puram, Shyam Nagar, Kanpur, UP 208013",
  );
  console.log("🛒 Cart System with Razorpay Payment Integration");
  console.log("📱 All notifications sent to WhatsApp + Email");
});
