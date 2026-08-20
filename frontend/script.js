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

  if (popup && closePopup) {
    setTimeout(() => {
      popup.classList.add("open");
    }, 1500);

    closePopup.addEventListener("click", () => {
      popup.classList.remove("open");
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.classList.remove("open");
      }
    });
  }
  /* ============================================================
   HESTIIA — PAGE NAVIGATION SYSTEM
   ============================================================ */

  function navigateTo(pageName) {
    /* ---------------------------------------------
     Find all pages
     --------------------------------------------- */

    const pages = document.querySelectorAll(".page");

    /* ---------------------------------------------
     Find navbar links
     --------------------------------------------- */

    const navLinks = document.querySelectorAll(".nav-links a[data-page]");

    /* ---------------------------------------------
     Validate requested page
     --------------------------------------------- */

    const targetPage = document.getElementById(`page-${pageName}`);

    if (!targetPage) {
      console.error(
        `HESTIIA Navigation Error:
       page-${pageName} not found.`,
      );

      return;
    }

    /* ---------------------------------------------
     Hide all pages
     --------------------------------------------- */

    pages.forEach((page) => {
      page.classList.remove("active");
    });

    /* ---------------------------------------------
     Show selected page
     --------------------------------------------- */

    targetPage.classList.add("active");

    /* ---------------------------------------------
     Update active navbar link
     --------------------------------------------- */

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.dataset.page === pageName) {
        link.classList.add("active");
      }
    });

    /* ---------------------------------------------
     Close mobile menu
     --------------------------------------------- */

    closeMobileMenu();

    /* ---------------------------------------------
     Scroll to top
     --------------------------------------------- */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    /* ---------------------------------------------
     Refresh reveal animations
     --------------------------------------------- */

    setTimeout(() => {
      document
        .querySelectorAll("#page-" + pageName + " .reveal")
        .forEach((element) => {
          element.classList.add("visible");
        });
    }, 100);

    /* ---------------------------------------------
     Refresh featured menu
     --------------------------------------------- */

    if (pageName === "menu") {
      if (typeof renderMenuPage === "function") {
        renderMenuPage();
      }
    }

    /* ---------------------------------------------
     Refresh gallery
     --------------------------------------------- */

    if (pageName === "gallery") {
      window.dispatchEvent(new Event("galleryPageOpened"));
    }
  }

  // IMPORTANT:
  // onclick="" HTML ke bahar se bhi function available rahe.

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

  // ─── WHATSAPP / EMAIL NOTIFICATION HELPERS ──────────────
  function sendWhatsApp(message) {
    const phone = "916392693457";

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

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

  // HESTIIA — NEWSLETTER
  // ============================================================

  const newsletterForm = document.getElementById("footerNewsletterForm");

  const newsletterInput = document.getElementById("footerNewsletter");

  const newsletterButton = document.getElementById("footerNewsletterBtn");

  const newsletterMessage = document.getElementById("newsletterMessage");

  if (newsletterForm && newsletterInput) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = newsletterInput.value.trim();

      // --------------------------------------------------------
      // Validation
      // --------------------------------------------------------

      if (!email) {
        showNewsletterMessage("Please enter your email address.", "error");

        newsletterInput.focus();

        return;
      }

      if (!newsletterInput.checkValidity()) {
        showNewsletterMessage("Please enter a valid email address.", "error");

        newsletterInput.focus();

        return;
      }

      // --------------------------------------------------------
      // Loading state
      // --------------------------------------------------------

      if (newsletterButton) {
        newsletterButton.disabled = true;

        newsletterButton.textContent = "Sending...";
      }

      // --------------------------------------------------------
      // Owner notification
      // --------------------------------------------------------

      const message =
        `📧 HESTIIA Newsletter Subscription\n\n` + `Email: ${email}`;

      // WhatsApp
      if (typeof sendWhatsApp === "function") {
        sendWhatsApp(message);
      }

      // Email
      if (typeof sendEmail === "function") {
        sendEmail("HESTIIA Newsletter Subscription", message);
      }

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      setTimeout(() => {
        showNewsletterMessage(
          "✓ You're subscribed! Welcome to HESTIIA.",
          "success",
        );

        newsletterInput.value = "";

        if (newsletterButton) {
          newsletterButton.disabled = false;

          newsletterButton.textContent = "Subscribe";
        }
      }, 500);
    });
  }

  /* Newsletter message helper */

  function showNewsletterMessage(message, type) {
    if (!newsletterMessage) return;

    newsletterMessage.textContent = message;

    newsletterMessage.className = "newsletter-message " + type;
  }

  // ============================================================
  // HESTIIA — COMPLETE MENU SYSTEM
  // ============================================================

  const menuData = [
    // =========================
    // SANDWICH
    // =========================
    {
      id: "sandwich",
      name: "Sandwiches",
      items: [
        {
          name: "Veg Sandwich",
          price: 119,
          description: "Fresh vegetables and delicious filling.",
          image: "images/menu/veg-sandwich.jpg",
        },
        {
          name: "Cheese Sandwich",
          price: 139,
          description: "Grilled sandwich loaded with cheese.",
          image: "images/menu/cheese-sandwich.jpg",
        },
        {
          name: "Cheese Corn Sandwich",
          price: 149,
          description: "Cheese and sweet corn filling.",
          image: "images/menu/cheese-corn-sandwich.jpg",
        },
        {
          name: "Paneer Tikka Sandwich",
          price: 169,
          description: "Tandoori paneer with fresh vegetables.",
          image: "images/menu/paneer-tikka-sandwich.jpg",
        },
        {
          name: "O.T.C. Sandwich",
          price: 139,
          description: "Signature HESTIIA sandwich.",
          image: "images/menu/otc-sandwich.jpg",
        },
      ],
    },

    // =========================
    // BURGERS
    // =========================
    {
      id: "burger",
      name: "Burgers",
      items: [
        {
          name: "Veg Burger",
          price: 89,
          description: "Classic crispy vegetable burger.",
          image: "images/menu/veg-burger.jpg",
        },
        {
          name: "Cheese Burger",
          price: 109,
          description: "Classic burger with melted cheese.",
          image: "images/menu/cheese-burger.jpg",
        },
        {
          name: "Double Daker",
          price: 169,
          description: "Double-layered signature burger.",
          image: "images/menu/double-burger.jpg",
        },
        {
          name: "Cottage Cheese Burger",
          price: 189,
          description: "Premium cottage cheese burger.",
          image: "images/menu/cottage-cheese-burger.jpg",
        },
      ],
    },

    // =========================
    // PIZZA
    // =========================
    {
      id: "pizza",
      name: "Pizzas",
      items: [
        {
          name: "Margherita",
          price: 189,
          description: "Only cheese topping.",
          image: "images/menu/margherita-pizza.jpg",
        },
        {
          name: "Fresh Veggies",
          price: 219,
          description: "Onion, tomato and capsicum.",
          image: "images/menu/veg-pizza.jpg",
        },
        {
          name: "Cheese Corn",
          price: 219,
          description: "Mozzarella cheese and corn.",
          image: "images/menu/cheese-corn-pizza.jpg",
        },
        {
          name: "Paneer Tikka Pizza",
          price: 279,
          description: "Roasted paneer with fresh vegetables.",
          image: "images/menu/paneer-pizza.jpg",
        },
        {
          name: "Farm Fresh",
          price: 249,
          description: "Onion, tomato, capsicum and mushroom.",
          image: "images/menu/farm-fresh-pizza.jpg",
        },
        {
          name: "Hestiia Special",
          price: 339,
          description: "Loaded with vegetables, mushroom, corn and paneer.",
          image: "images/menu/hestiia-special-pizza.jpg",
        },
      ],
    },

    // =========================
    // PASTA
    // =========================
    {
      id: "pasta",
      name: "Pasta",
      items: [
        {
          name: "White Sauce Pasta",
          price: 249,
          description: "Creamy white sauce pasta.",
          image: "images/menu/white-pasta.jpg",
        },
        {
          name: "Red Sauce Pasta",
          price: 219,
          description: "Rich and tangy red sauce pasta.",
          image: "images/menu/red-pasta.jpg",
        },
        {
          name: "Pink Sauce Pasta",
          price: 259,
          description: "Creamy tomato pink sauce pasta.",
          image: "images/menu/pink-pasta.jpg",
        },
      ],
    },

    // =========================
    // KEBABS
    // =========================
    {
      id: "kebab",
      name: "Kebabs",
      items: [
        {
          name: "Haryali Kebab",
          price: 165,
          description: "8 pieces of flavorful haryali kebab.",
          image: "images/menu/haryali-kebab.jpg",
        },
        {
          name: "Dahi Kebab",
          price: 165,
          description: "6 pieces of creamy dahi kebab.",
          image: "images/menu/dahi-kebab.jpg",
        },
        {
          name: "Seekh Kebab",
          price: 189,
          description: "6 pieces of delicious seekh kebab.",
          image: "images/menu/seekh-kebab.jpg",
        },
        {
          name: "Shami Kebab",
          price: 189,
          description: "6 pieces of classic shami kebab.",
          image: "images/menu/shami-kebab.jpg",
        },
      ],
    },

    // =========================
    // STARTERS
    // =========================
    {
      id: "starters",
      name: "Starters",
      items: [
        {
          name: "Honey Chilli Potato",
          price: 165,
          description: "Crispy potato tossed in sweet chilli sauce.",
          image: "images/menu/honey-chilli-potato.jpg",
        },
        {
          name: "Crispy Corn",
          price: 165,
          description: "Crispy golden corn.",
          image: "images/menu/crispy-corn.jpg",
        },
        {
          name: "Spring Roll",
          price: 185,
          description: "Crispy vegetable spring rolls.",
          image: "images/menu/spring-roll.jpg",
        },
        {
          name: "Cheese Cigar Roll",
          price: 185,
          description: "Crispy rolls filled with cheese.",
          image: "images/menu/cheese-cigar-roll.jpg",
        },
        {
          name: "Crispy Veg",
          price: 189,
          description: "Crispy mixed vegetable starter.",
          image: "images/menu/crispy-veg.jpg",
        },
      ],
    },

    // =========================
    // INDIAN MAIN COURSE
    // =========================
    {
      id: "indian",
      name: "Indian Main Course",
      items: [
        {
          name: "Dal Fry",
          price: 189,
          description: "Classic Indian dal.",
          image: "images/menu/dal-fry.jpg",
        },
        {
          name: "Dal Tadka",
          price: 199,
          description: "Yellow dal with aromatic tadka.",
          image: "images/menu/dal-tadka.jpg",
        },
        {
          name: "Dal Makhani",
          price: 229,
          description: "Rich and creamy black lentils.",
          image: "images/menu/dal-makhani.jpg",
        },
        {
          name: "Matar Paneer",
          price: 275,
          description: "Paneer and green peas in rich gravy.",
          image: "images/menu/matar-paneer.jpg",
        },
        {
          name: "Kadhai Paneer",
          price: 275,
          description: "Paneer cooked in traditional kadhai masala.",
          image: "images/menu/kadhai-paneer.jpg",
        },
        {
          name: "Paneer Butter Masala",
          price: 285,
          description: "Paneer in creamy tomato gravy.",
          image: "images/menu/paneer-butter-masala.jpg",
        },
        {
          name: "Palak Paneer",
          price: 275,
          description: "Paneer cooked in spinach gravy.",
          image: "images/menu/palak-paneer.jpg",
        },
        {
          name: "Paneer Lababdar",
          price: 309,
          description: "Rich and creamy paneer gravy.",
          image: "images/menu/paneer-lababdar.jpg",
        },
      ],
    },

    // =========================
    // RICE & BIRYANI
    // =========================
    {
      id: "rice",
      name: "Rice & Biryani",
      items: [
        {
          name: "Steam Rice",
          price: 129,
          description: "Steamed basmati rice.",
          image: "images/menu/steam-rice.jpg",
        },
        {
          name: "Jeera Rice",
          price: 139,
          description: "Fragrant cumin rice.",
          image: "images/menu/jeera-rice.jpg",
        },
        {
          name: "Veg Pulao",
          price: 139,
          description: "Aromatic vegetable pulao.",
          image: "images/menu/veg-pulao.jpg",
        },
        {
          name: "Veg Biryani",
          price: 189,
          description: "Aromatic vegetable biryani.",
          image: "images/menu/veg-biryani.jpg",
        },
        {
          name: "Hyderabadi Biryani",
          price: 209,
          description: "Rich and aromatic Hyderabadi biryani.",
          image: "images/menu/hyderabadi-biryani.jpg",
        },
        {
          name: "Chaap Tikka Biryani",
          price: 239,
          description: "Flavorful chaap tikka biryani.",
          image: "images/menu/chaap-biryani.jpg",
        },
      ],
    },

    // =========================
    // CHINESE
    // =========================
    {
      id: "chinese",
      name: "Chinese",
      items: [
        {
          name: "Veg Manchurian",
          price: 219,
          description: "Available dry or gravy.",
          image: "images/menu/veg-manchurian.jpg",
        },
        {
          name: "Chilli Manchurian",
          price: 219,
          description: "Spicy Indo-Chinese preparation.",
          image: "images/menu/chilli-manchurian.jpg",
        },
        {
          name: "Paneer 65",
          price: 219,
          description: "Crispy spicy paneer.",
          image: "images/menu/paneer-65.jpg",
        },
        {
          name: "Paneer Manchurian",
          price: 219,
          description: "Available dry or gravy.",
          image: "images/menu/paneer-manchurian.jpg",
        },
        {
          name: "Veg Fried Rice",
          price: 165,
          description: "Classic vegetable fried rice.",
          image: "images/menu/veg-fried-rice.jpg",
        },
        {
          name: "Hakka Noodles",
          price: 165,
          description: "Classic stir-fried noodles.",
          image: "images/menu/hakka-noodles.jpg",
        },
        {
          name: "Schezwan Noodles",
          price: 175,
          description: "Spicy Schezwan noodles.",
          image: "images/menu/schezwan-noodles.jpg",
        },
        {
          name: "Hestia Special Noodles",
          price: 219,
          description: "Signature HESTIIA noodles.",
          image: "images/menu/special-noodles.jpg",
        },
      ],
    },

    // =========================
    // BREADS
    // =========================
    {
      id: "breads",
      name: "Indian Breads",
      items: [
        {
          name: "Butter Roti",
          price: 35,
          description: "Soft Indian roti with butter.",
          image: "images/menu/butter-roti.jpg",
        },
        {
          name: "Plain Roti",
          price: 30,
          description: "Traditional tandoori roti.",
          image: "images/menu/plain-roti.jpg",
        },
        {
          name: "Plain Naan",
          price: 40,
          description: "Soft tandoori naan.",
          image: "images/menu/plain-naan.jpg",
        },
        {
          name: "Garlic Naan",
          price: 45,
          description: "Naan topped with garlic.",
          image: "images/menu/garlic-naan.jpg",
        },
        {
          name: "Butter Naan",
          price: 60,
          description: "Soft naan with butter.",
          image: "images/menu/butter-naan.jpg",
        },
        {
          name: "Cheese Naan",
          price: 70,
          description: "Naan stuffed with cheese.",
          image: "images/menu/cheese-naan.jpg",
        },
        {
          name: "Laccha Paratha",
          price: 45,
          description: "Layered Indian paratha.",
          image: "images/menu/laccha-paratha.jpg",
        },
      ],
    },

    // =========================
    // MOCKTAILS
    // =========================
    {
      id: "mocktails",
      name: "Mocktails",
      items: [
        {
          name: "V. Mojito",
          price: 149,
          description: "Refreshing mint mojito.",
          image: "images/menu/mojito.jpg",
        },
        {
          name: "Blue Lagoon",
          price: 149,
          description: "Refreshing blue lagoon.",
          image: "images/menu/blue-lagoon.jpg",
        },
        {
          name: "Watermelon",
          price: 149,
          description: "Fresh watermelon cooler.",
          image: "images/menu/watermelon.jpg",
        },
        {
          name: "Green Apple",
          price: 149,
          description: "Refreshing green apple drink.",
          image: "images/menu/green-apple.jpg",
        },
        {
          name: "Kiwi Blast",
          price: 149,
          description: "Refreshing kiwi mocktail.",
          image: "images/menu/kiwi-blast.jpg",
        },
        {
          name: "Hestia Special Mocktail",
          price: 199,
          description: "Three-flavour signature mix.",
          image: "images/menu/special-mocktail.jpg",
        },
      ],
    },

    // =========================
    // SHAKES
    // =========================
    {
      id: "shakes",
      name: "Shakes",
      items: [
        {
          name: "Chocolate Shake",
          price: 149,
          description: "Thick creamy chocolate shake.",
          image: "images/menu/chocolate-shake.jpg",
        },
        {
          name: "Vanilla Shake",
          price: 149,
          description: "Classic vanilla shake.",
          image: "images/menu/vanilla-shake.jpg",
        },
        {
          name: "Butterscotch Shake",
          price: 149,
          description: "Creamy butterscotch shake.",
          image: "images/menu/butterscotch-shake.jpg",
        },
        {
          name: "Strawberry Shake",
          price: 149,
          description: "Fresh strawberry shake.",
          image: "images/menu/strawberry-shake.jpg",
        },
        {
          name: "Oreo Shake",
          price: 159,
          description: "Chocolate Oreo shake.",
          image: "images/menu/oreo-shake.jpg",
        },
        {
          name: "Kit-Kat Shake",
          price: 159,
          description: "Kit-Kat chocolate shake.",
          image: "images/menu/kitkat-shake.jpg",
        },
        {
          name: "Hestia Special Shake",
          price: 199,
          description: "Our signature shake.",
          image: "images/menu/special-shake.jpg",
        },
      ],
    },

    // =========================
    // DESSERTS
    // =========================
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          name: "Gulab Jamun",
          price: 49,
          description: "Soft and warm gulab jamun.",
          image: "images/menu/gulab-jamun.jpg",
        },
        {
          name: "Chhena",
          price: 59,
          description: "Traditional Indian sweet.",
          image: "images/menu/chhena.jpg",
        },
        {
          name: "Hot Chocolate With Brownie",
          price: 149,
          description: "Brownie served with hot chocolate.",
          image: "images/menu/chocolate-brownie.jpg",
        },
        {
          name: "Hot Brownie With Vanilla",
          price: 149,
          description: "Warm brownie with vanilla ice cream.",
          image: "images/menu/brownie-vanilla.jpg",
        },
        {
          name: "Chocolate",
          price: 69,
          description: "Classic chocolate ice cream.",
          image: "images/menu/chocolate-ice-cream.jpg",
        },
      ],
    },

    // =========================
    // BEVERAGES
    // =========================
    {
      id: "beverages",
      name: "Beverages",
      items: [
        {
          name: "Fresh Lime Soda",
          price: 85,
          description: "Refreshing fresh lime soda.",
          image: "images/menu/lime-soda.jpg",
        },
        {
          name: "Masala Cold Drink",
          price: 79,
          description: "Spiced refreshing cold drink.",
          image: "images/menu/cold-drink.jpg",
        },
        {
          name: "Lassi",
          price: 59,
          description: "Creamy traditional lassi.",
          image: "images/menu/lassi.jpg",
        },
        {
          name: "Hot Coffee",
          price: 79,
          description: "Freshly brewed hot coffee.",
          image: "images/menu/hot-coffee.jpg",
        },
        {
          name: "Hot Tea",
          price: 49,
          description: "Classic Indian tea.",
          image: "images/menu/hot-tea.jpg",
        },
        {
          name: "Cold Coffee",
          price: 149,
          description: "Chilled creamy cold coffee.",
          image: "images/menu/cold-coffee.jpg",
        },
      ],
    },
  ];

  // ============================================================
  // MENU PAGE RENDER
  // ============================================================

  function renderFullMenu(data = menuData) {
    const menuContent = document.getElementById("menuContent");

    if (!menuContent) return;

    menuContent.innerHTML = "";

    data.forEach((category) => {
      const section = document.createElement("section");

      section.className = "menu-category-section";

      section.innerHTML = `
      <div class="menu-category-heading">

        <div>
          <span class="menu-category-label">HESTIIA</span>
          <h2>${category.name}</h2>
        </div>

        <span class="menu-item-count">
          ${category.items.length} Items
        </span>

      </div>

      <div class="menu-grid">

        ${category.items
          .map(
            (item) => `

          <article class="menu-item">

            <div class="menu-item-image">

              <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
                onerror="this.src='images/menu/default-food.jpg'"
              >

              <span class="menu-price">
                ₹${item.price}
              </span>

            </div>

            <div class="menu-item-content">

              <h3>${item.name}</h3>

              <p>
                ${item.description || ""}
              </p>

              <button
                class="add-cart-btn"
                data-name="${item.name}"
                data-price="${item.price}"
              >
                Add to Order
                <i class="fas fa-plus"></i>
              </button>

            </div>

          </article>

        `,
          )
          .join("")}

      </div>
    `;

      menuContent.appendChild(section);
    });
  }
  // ============================================================
  // MENU CATEGORY FILTER
  // ============================================================

  function renderMenuCategories() {
    const container = document.getElementById("menuCategories");

    if (!container) return;

    container.innerHTML = `
    <button
      class="menu-category-btn active"
      data-category="all"
    >
      All
    </button>

    ${menuData
      .map(
        (category) => `
      
      <button
        class="menu-category-btn"
        data-category="${category.id}"
      >
        ${category.name}
      </button>

    `,
      )
      .join("")}
  `;

    container.querySelectorAll(".menu-category-btn").forEach((button) => {
      button.addEventListener("click", () => {
        container.querySelectorAll(".menu-category-btn").forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        const categoryId = button.dataset.category;

        if (categoryId === "all") {
          renderFullMenu(menuData);

          return;
        }

        const selectedCategory = menuData.filter(
          (category) => category.id === categoryId,
        );

        renderFullMenu(selectedCategory);
      });
    });
  }
  // ============================================================
  // MENU SEARCH
  // ============================================================

  const menuSearchInput = document.getElementById("menuSearch");

  if (menuSearchInput) {
    menuSearchInput.addEventListener("input", function () {
      const query = this.value.trim().toLowerCase();

      if (!query) {
        renderFullMenu(menuData);

        return;
      }

      const results = menuData
        .map((category) => {
          const matchingItems = category.items.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query),
          );

          return {
            ...category,
            items: matchingItems,
          };
        })
        .filter((category) => category.items.length > 0);

      renderFullMenu(results);
    });
  }
  // ============================================================
  // INITIALIZE MENU
  // ============================================================

  renderMenuCategories();
  renderFullMenu(menuData);
  // ============================================================
  // HOME PAGE — FEATURED MENU
  // ============================================================

  const featuredMenu = [
    {
      name: "Paneer Tikka Pizza",
      price: 279,
      description: "Roasted paneer with onion, tomato & capsicum.",
      image: "images/menu/paneer-pizza.jpg",
    },

    {
      name: "Kadhai Paneer",
      price: 275,
      description: "Paneer cooked with traditional kadhai spices.",
      image: "images/menu/kadhai-paneer.jpg",
    },

    {
      name: "Hestia Special Noodles",
      price: 219,
      description: "Our signature special noodles.",
      image: "images/menu/special-noodles.jpg",
    },

    {
      name: "Hestia Special Mocktail",
      price: 199,
      description: "Three-flavour signature mocktail.",
      image: "images/menu/special-mocktail.jpg",
    },

    {
      name: "Chocolate Shake",
      price: 149,
      description: "Thick and creamy chocolate shake.",
      image: "images/menu/chocolate-shake.jpg",
    },

    {
      name: "Hot Brownie With Vanilla",
      price: 149,
      description: "Warm brownie served with vanilla ice cream.",
      image: "images/menu/brownie-vanilla.jpg",
    },
  ];

  const featuredMenuGrid = document.getElementById("featuredMenuGrid");

  if (featuredMenuGrid) {
    featuredMenuGrid.innerHTML = featuredMenu
      .map(
        (item) => `

    <article class="featured-food-card">

      <div class="featured-food-image">

        <img
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.src='images/menu/default-food.jpg'"
        >

        <span class="featured-food-price">
          ₹${item.price}
        </span>

      </div>

      <div class="featured-food-content">

        <h3>${item.name}</h3>

        <p>${item.description}</p>

        <button
          class="add-cart-btn"
          data-name="${item.name}"
          data-price="${item.price}"
        >
          Add to Order
        </button>

      </div>

    </article>

  `,
      )
      .join("");
  }

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
      document.getElementById("checkoutOverlay").style.display = "none";
    }
  });

  // ─── INIT CART UI ──────────────────────────────────────
  // console.log("✦ HESTIIA — Premium Luxury Restaurant Website ✦");
  // console.log(
  //   "📍 Map Location: 1-b, Ram Puram, Shyam Nagar, Kanpur, UP 208013",
  // );
  // console.log("🛒 Cart System with Razorpay Payment Integration");
  // console.log("📱 All notifications sent to WhatsApp + Email");
});

// ============================================================
// HESTIIA — INSTAGRAM EMBED INITIALIZATION
// ============================================================

function processInstagramEmbeds() {
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }
}

window.addEventListener("load", function () {
  setTimeout(processInstagramEmbeds, 1000);
});
// ============================================================
// HESTIIA — FEATURED MENU RENDER
// HOME PAGE
// ============================================================

const featuredMenu = [
  {
    name: "Paneer Tikka Pizza",
    category: "Pizza",
    price: 279,
    description: "Onion, tomato, capsicum and roasted paneer.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",
  },

  {
    name: "Paneer Tikka",
    category: "Tandoor",
    price: 239,
    description: "Char-grilled paneer with aromatic spices.",
    image:
      "https://images.unsplash.com/photo-1666001120694-3ebe8fd207be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Veg Biryani",
    category: "Biryani",
    price: 189,
    description: "Fragrant basmati rice with vegetables and spices.",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=85",
  },

  {
    name: "Cheese Burger",
    category: "Burger",
    price: 109,
    description: "Vegetarian burger loaded with melted cheese.",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=900&q=85",
  },

  {
    name: "White Sauce Pasta",
    category: "Pasta",
    price: 249,
    description: "Creamy pasta prepared with rich white sauce.",
    image:
      "https://images.unsplash.com/photo-1662197480393-2a82030b7b83?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Hestia Special Noodles",
    category: "Chinese",
    price: 219,
    description: "Signature noodles tossed with fresh vegetables.",
    image:
      "https://images.unsplash.com/photo-1680359873713-f7f4768fc2e5?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Hestia Special Mocktail",
    category: "Mocktail",
    price: 199,
    description: "Refreshing three-flavour signature mix.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=85",
  },

  {
    name: "Chocolate Shake",
    category: "Shake",
    price: 149,
    description: "Rich, creamy and indulgent chocolate shake.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900&q=85",
  },
];

// ============================================================
// RENDER FEATURED MENU
// ============================================================

function renderFeaturedMenu() {
  const grid = document.getElementById("featuredMenuGrid");

  if (!grid) return;

  grid.innerHTML = featuredMenu
    .map(
      (item) => `
        <article class="featured-menu-card">

          <div class="featured-menu-image">

            <img
              src="${item.image}"
              alt="${item.name}"
              loading="lazy"
            />

            <span class="featured-menu-price">
              ₹${item.price}
            </span>

          </div>


          <div class="featured-menu-content">

            <span class="featured-menu-category">
              ${item.category}
            </span>

            <h3>
              ${item.name}
            </h3>

            <p>
              ${item.description}
            </p>

          </div>

        </article>
      `,
    )
    .join("");
}

// ============================================================
// INITIALIZE FEATURED MENU
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedMenu();
});

/* ============================================================
   HESTIIA — INSTAGRAM REELS VIDEO CONTROL
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const reelVideos = document.querySelectorAll(".reel-video");

  if (!reelVideos.length) return;

  /* ----------------------------------------------------------
     Try autoplay
     ---------------------------------------------------------- */

  reelVideos.forEach((video) => {
    video.muted = true;

    video.playsInline = true;

    const playVideo = () => {
      const promise = video.play();

      if (promise !== undefined) {
        promise.catch(() => {
          // Browser autoplay restriction
          // Video remains muted and ready
        });
      }
    };

    playVideo();

    /* Retry after page becomes visible */

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    });
  });

  /* ----------------------------------------------------------
     Pause videos when section is not visible
     ---------------------------------------------------------- */

  const reelsSection = document.querySelector(".instagram-reels-section");

  if (!reelsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reelVideos.forEach((video) => {
            video.play().catch(() => {});
          });
        } else {
          reelVideos.forEach((video) => {
            video.pause();
          });
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  observer.observe(reelsSection);
});

/* ============================================================
   HESTIIA — GALLERY LIGHTBOX
   ============================================================ */

const hestiiaGalleryImages = [
  "images/Hall.jpeg",
  "images/counter.jpeg",
  "images/image 7.webp",
  "images/image 8.webp",
  "images/image 6.webp",
  "images/image 5.webp",
  "images/image 4.webp",
  "images/image 3.webp",
  "images/image 2.webp",
  "images/image 1.webp",
];

let currentGalleryIndex = 0;

/* ============================================================
   OPEN LIGHTBOX
   ============================================================ */

function openGalleryLightbox(index) {
  const lightbox = document.getElementById("galleryLightbox");

  const image = document.getElementById("galleryLightboxImage");

  if (!lightbox || !image) return;

  currentGalleryIndex = index;

  image.src = hestiiaGalleryImages[currentGalleryIndex];

  image.alt = `HESTIIA Gallery Image ${currentGalleryIndex + 1}`;

  updateGalleryCounter();

  lightbox.classList.add("active");

  lightbox.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

/* ============================================================
   CLOSE
   ============================================================ */

function closeGalleryLightbox() {
  const lightbox = document.getElementById("galleryLightbox");

  if (!lightbox) return;

  lightbox.classList.remove("active");

  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/* ============================================================
   NEXT
   ============================================================ */

function galleryNext() {
  currentGalleryIndex++;

  if (currentGalleryIndex >= hestiiaGalleryImages.length) {
    currentGalleryIndex = 0;
  }

  updateGalleryImage();
}

/* ============================================================
   PREVIOUS
   ============================================================ */

function galleryPrevious() {
  currentGalleryIndex--;

  if (currentGalleryIndex < 0) {
    currentGalleryIndex = hestiiaGalleryImages.length - 1;
  }

  updateGalleryImage();
}

/* ============================================================
   UPDATE IMAGE
   ============================================================ */

function updateGalleryImage() {
  const image = document.getElementById("galleryLightboxImage");

  if (!image) return;

  image.style.opacity = "0";

  setTimeout(() => {
    image.src = hestiiaGalleryImages[currentGalleryIndex];

    image.alt = `HESTIIA Gallery Image ${currentGalleryIndex + 1}`;

    image.style.opacity = "1";

    updateGalleryCounter();
  }, 120);
}

/* ============================================================
   COUNTER
   ============================================================ */

function updateGalleryCounter() {
  const counter = document.getElementById("galleryLightboxCounter");

  if (!counter) return;

  const current = String(currentGalleryIndex + 1).padStart(2, "0");

  const total = String(hestiiaGalleryImages.length).padStart(2, "0");

  counter.textContent = `${current} / ${total}`;
}

/* ============================================================
   KEYBOARD CONTROLS
   ============================================================ */

document.addEventListener("keydown", (event) => {
  const lightbox = document.getElementById("galleryLightbox");

  if (!lightbox || !lightbox.classList.contains("active")) {
    return;
  }

  if (event.key === "Escape") {
    closeGalleryLightbox();
  }

  if (event.key === "ArrowRight") {
    galleryNext();
  }

  if (event.key === "ArrowLeft") {
    galleryPrevious();
  }
});

/* ============================================================
   CLICK BACKDROP TO CLOSE
   ============================================================ */

document.addEventListener("click", (event) => {
  const lightbox = document.getElementById("galleryLightbox");

  if (!lightbox) return;

  if (event.target === lightbox) {
    closeGalleryLightbox();
  }
});

/* ============================================================
   HOME PREVIEW LIGHTBOX
   ============================================================ */

function openGalleryPreview(index) {
  openGalleryLightbox(index);
}

/* ============================================================
   HESTIIA — MOBILE NAVIGATION
   ============================================================ */

const hamburger = document.getElementById("hamburger");

const navLinksWrap = document.querySelector(".nav-links-wrap");

/* ============================================================
   OPEN / CLOSE MOBILE MENU
   ============================================================ */

function toggleMobileMenu() {
  if (!hamburger || !navLinksWrap) {
    return;
  }

  const isOpen = navLinksWrap.classList.contains("mobile-open");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/* ============================================================
   OPEN
   ============================================================ */

function openMobileMenu() {
  if (!hamburger || !navLinksWrap) {
    return;
  }

  navLinksWrap.classList.add("mobile-open");

  hamburger.classList.add("active");

  hamburger.setAttribute("aria-expanded", "true");
}

/* ============================================================
   CLOSE
   ============================================================ */

function closeMobileMenu() {
  if (!hamburger || !navLinksWrap) {
    return;
  }

  navLinksWrap.classList.remove("mobile-open");

  hamburger.classList.remove("active");

  hamburger.setAttribute("aria-expanded", "false");
}

/* ============================================================
   HAMBURGER CLICK
   ============================================================ */

if (hamburger) {
  hamburger.addEventListener("click", toggleMobileMenu);
}

/* ============================================================
   CLOSE MOBILE MENU AFTER NAV CLICK
   ============================================================ */

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

/* ============================================================
   HESTIIA — ACTUAL RESTAURANT MENU
   ============================================================ */

const hestiiaRestaurantMenu = [

  /* ================= SANDWICHES ================= */

  {
    name: "Veg Sandwich",
    category: "sandwiches",
    categoryName: "Sandwiches",
    price: 119,
    image: "images/image 1.webp",
    description: "Fresh vegetable sandwich prepared with quality ingredients."
  },

  {
    name: "Cheese Sandwich",
    category: "sandwiches",
    categoryName: "Sandwiches",
    price: 139,
    image: "images/image 2.webp",
    description: "Classic sandwich filled with creamy cheese."
  },

  {
    name: "Cheese Corn Sandwich",
    category: "sandwiches",
    categoryName: "Sandwiches",
    price: 149,
    image: "images/image 3.webp",
    description: "Cheese and sweet corn layered into a delicious sandwich."
  },

  {
    name: "Paneer Tikka Sandwich",
    category: "sandwiches",
    categoryName: "Sandwiches",
    price: 169,
    image: "images/image 4.webp",
    description: "Paneer tikka with fresh vegetables and creamy filling."
  },

  {
    name: "O.T.C. Sandwich",
    category: "sandwiches",
    categoryName: "Sandwiches",
    price: 139,
    image: "images/image 5.webp",
    description: "HESTIIA's special OTC sandwich."
  },


  /* ================= BURGERS ================= */

  {
    name: "Veg Burger",
    category: "burgers",
    categoryName: "Burgers",
    price: 89,
    image: "images/image 6.webp",
    description: "Classic vegetarian burger with a crispy veg patty."
  },

  {
    name: "Cheese Burger",
    category: "burgers",
    categoryName: "Burgers",
    price: 109,
    image: "images/image 7.webp",
    description: "Veg burger finished with melted cheese."
  },

  {
    name: "Double Daker",
    category: "burgers",
    categoryName: "Burgers",
    price: 169,
    image: "images/image 8.webp",
    description: "Double-layered burger for a richer bite."
  },

  {
    name: "Cottage Cheese Burger",
    category: "burgers",
    categoryName: "Burgers",
    price: 189,
    image: "images/image 1.webp",
    description: "Cottage cheese patty burger with fresh toppings."
  },


  /* ================= PIZZA ================= */

  {
    name: "Marghrita",
    category: "pizza",
    categoryName: "Pizza",
    price: 189,
    image: "images/image 2.webp",
    description: "Only cheese topping."
  },

  {
    name: "Fresh Veggies",
    category: "pizza",
    categoryName: "Pizza",
    price: 219,
    image: "images/image 3.webp",
    description: "Onion, tomato and capsicum."
  },

  {
    name: "Cheese Corn",
    category: "pizza",
    categoryName: "Pizza",
    price: 219,
    image: "images/image 4.webp",
    description: "Mozzarella cheese and corn."
  },

  {
    name: "Paneer Tikka Pizza",
    category: "pizza",
    categoryName: "Pizza",
    price: 279,
    image: "images/image 5.webp",
    description: "Onion, tomato, capsicum and roasted paneer."
  },

  {
    name: "Farm Fresh",
    category: "pizza",
    categoryName: "Pizza",
    price: 249,
    image: "images/image 6.webp",
    description: "Onion, tomato, capsicum and mushroom."
  },

  {
    name: "Hestiia Special",
    category: "pizza",
    categoryName: "Pizza",
    price: 339,
    image: "images/image 7.webp",
    description: "Onion, tomato, red, yellow & green capsicum, mushroom, corn and paneer."
  },


  /* ================= PASTA ================= */

  {
    name: "White Sauce",
    category: "pasta",
    categoryName: "Pasta",
    price: 249,
    image: "images/image 8.webp",
    description: "Creamy white sauce pasta."
  },

  {
    name: "Red Sauce",
    category: "pasta",
    categoryName: "Pasta",
    price: 219,
    image: "images/image 1.webp",
    description: "Rich red sauce pasta."
  },

  {
    name: "Pink Sauce",
    category: "pasta",
    categoryName: "Pasta",
    price: 259,
    image: "images/image 2.webp",
    description: "Creamy and tangy pink sauce pasta."
  },


  /* ================= BEVERAGES ================= */

  {
    name: "Mineral Water / Cold Drink",
    category: "beverages",
    categoryName: "Beverages",
    price: 59,
    image: "images/image 3.webp",
    description: "Mineral water or chilled cold drink."
  },

  {
    name: "Fresh Lime Soda",
    category: "beverages",
    categoryName: "Beverages",
    price: 85,
    image: "images/image 4.webp",
    description: "Refreshing fresh lime soda."
  },

  {
    name: "Masala Cold Drink",
    category: "beverages",
    categoryName: "Beverages",
    price: 79,
    image: "images/image 5.webp",
    description: "Chilled cold drink with a masala twist."
  },

  {
    name: "Redbull",
    category: "beverages",
    categoryName: "Beverages",
    price: 179,
    image: "images/image 6.webp",
    description: "Chilled Red Bull."
  },

  {
    name: "Lassi",
    category: "beverages",
    categoryName: "Beverages",
    price: 59,
    image: "images/image 7.webp",
    description: "Traditional chilled lassi."
  },

  {
    name: "Hot Coffee",
    category: "beverages",
    categoryName: "Beverages",
    price: 79,
    image: "images/image 8.webp",
    description: "Freshly prepared hot coffee."
  },

  {
    name: "Black Coffee",
    category: "beverages",
    categoryName: "Beverages",
    price: 79,
    image: "images/image 1.webp",
    description: "Classic black coffee."
  },

  {
    name: "Hot Tea",
    category: "beverages",
    categoryName: "Beverages",
    price: 49,
    image: "images/image 2.webp",
    description: "Fresh hot tea."
  },

  {
    name: "Black Tea",
    category: "beverages",
    categoryName: "Beverages",
    price: 49,
    image: "images/image 3.webp",
    description: "Classic black tea."
  },

  {
    name: "Desi Chhach",
    category: "beverages",
    categoryName: "Beverages",
    price: 59,
    image: "images/image 4.webp",
    description: "Traditional Indian buttermilk."
  },


  /* ================= MOCKTAILS ================= */

  {
    name: "V. Mojito",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 5.webp",
    description: "Refreshing mint and citrus mocktail."
  },

  {
    name: "Blue Lagoon",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 6.webp",
    description: "Refreshing blue citrus mocktail."
  },

  {
    name: "Watermelon",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 7.webp",
    description: "Fresh watermelon mocktail."
  },

  {
    name: "Green Apple",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 8.webp",
    description: "Crisp green apple mocktail."
  },

  {
    name: "Lucy Berry",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 1.webp",
    description: "Refreshing berry mocktail."
  },

  {
    name: "Kiwi Blast",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 149,
    image: "images/image 2.webp",
    description: "Tropical kiwi mocktail."
  },

  {
    name: "Juice Tank",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 179,
    image: "images/image 3.webp",
    description: "Peach and litchi blend."
  },

  {
    name: "Twister",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 179,
    image: "images/image 4.webp",
    description: "Orange and watermelon blend."
  },

  {
    name: "Heaven",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 179,
    image: "images/image 5.webp",
    description: "Black currant and mango blend."
  },

  {
    name: "James",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 179,
    image: "images/image 6.webp",
    description: "Strawberry and blueberry blend."
  },

  {
    name: "Hestia Special Moctail",
    category: "mocktails",
    categoryName: "Mocktails",
    price: 199,
    image: "images/image 7.webp",
    description: "Three flavour mix — HESTIIA special."
  },


  /* ================= KULCHA ================= */

  {
    name: "Aloo Kulcha",
    category: "breads",
    categoryName: "Breads",
    price: 55,
    image: "images/image 8.webp",
    description: "Stuffed aloo kulcha."
  },

  {
    name: "Paneer Kulcha",
    category: "breads",
    categoryName: "Breads",
    price: 75,
    image: "images/image 1.webp",
    description: "Stuffed paneer kulcha."
  },

  {
    name: "Mix Kulcha",
    category: "breads",
    categoryName: "Breads",
    price: 65,
    image: "images/image 2.webp",
    description: "Mixed stuffed kulcha."
  },

  {
    name: "Onion Kulcha",
    category: "breads",
    categoryName: "Breads",
    price: 55,
    image: "images/image 3.webp",
    description: "Stuffed onion kulcha."
  },


  /* ================= DESSERTS ================= */

  {
    name: "Gulab Jamun",
    category: "desserts",
    categoryName: "Desserts",
    price: 49,
    image: "images/image 4.webp",
    description: "Soft and warm gulab jamun."
  },

  {
    name: "Chhena",
    category: "desserts",
    categoryName: "Desserts",
    price: 59,
    image: "images/image 5.webp",
    description: "Traditional fresh chhena."
  },

  {
    name: "Hot Chocolate With Brownie",
    category: "desserts",
    categoryName: "Desserts",
    price: 149,
    image: "images/image 6.webp",
    description: "Warm chocolate with brownie."
  },

  {
    name: "Hot Brownie With Vanilla",
    category: "desserts",
    categoryName: "Desserts",
    price: 149,
    image: "images/image 7.webp",
    description: "Hot brownie served with vanilla."
  },

  {
    name: "Vanilla",
    category: "desserts",
    categoryName: "Desserts",
    price: 49,
    image: "images/image 8.webp",
    description: "Classic vanilla ice cream."
  },

  {
    name: "Strawberry",
    category: "desserts",
    categoryName: "Desserts",
    price: 49,
    image: "images/image 1.webp",
    description: "Classic strawberry ice cream."
  },

  {
    name: "Chocolate",
    category: "desserts",
    categoryName: "Desserts",
    price: 69,
    image: "images/image 2.webp",
    description: "Rich chocolate ice cream."
  },

  {
    name: "Butter Scotch",
    category: "desserts",
    categoryName: "Desserts",
    price: 69,
    image: "images/image 3.webp",
    description: "Creamy butterscotch ice cream."
  },


  /* ================= KEBABS ================= */

  {
    name: "Haryali Kebab",
    category: "kebabs",
    categoryName: "Kebabs & Starters",
    price: 165,
    image: "images/image 4.webp",
    description: "8 pieces of flavourful haryali kebab."
  },

  {
    name: "Dahi Kebab",
    category: "kebabs",
    categoryName: "Kebabs & Starters",
    price: 165,
    image: "images/image 5.webp",
    description: "6 pieces of soft dahi kebab."
  },

  {
    name: "Seekh Kebab",
    category: "kebabs",
    categoryName: "Kebabs & Starters",
    price: 189,
    image: "images/image 6.webp",
    description: "6 pieces of vegetarian seekh kebab."
  },

  {
    name: "Shami Kebab",
    category: "kebabs",
    categoryName: "Kebabs & Starters",
    price: 189,
    image: "images/image 7.webp",
    description: "6 pieces of vegetarian shami kebab."
  },


  /* ================= SALAD & RAITA ================= */

  {
    name: "Onion Salad",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 49,
    image: "images/image 8.webp",
    description: "Fresh sliced onion salad."
  },

  {
    name: "Green Salad",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 69,
    image: "images/image 1.webp",
    description: "Fresh green salad."
  },

  {
    name: "Cucumber Salad",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 49,
    image: "images/image 2.webp",
    description: "Fresh cucumber salad."
  },

  {
    name: "Pineapple Raita",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 129,
    image: "images/image 3.webp",
    description: "Creamy raita with pineapple."
  },

  {
    name: "Fruit Raita",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 129,
    image: "images/image 4.webp",
    description: "Fresh fruit raita."
  },

  {
    name: "Boondi Raita",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 99,
    image: "images/image 5.webp",
    description: "Classic boondi raita."
  },

  {
    name: "Mix Veg Raita",
    category: "salads-raita",
    categoryName: "Salads & Raita",
    price: 99,
    image: "images/image 6.webp",
    description: "Fresh vegetable raita."
  },


  /* ================= VEG MAIN ================= */

  {
    name: "Baked Veg",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 299,
    image: "images/image 7.webp",
    description: "Baked vegetable preparation."
  },

  {
    name: "Spinach Corn Baked",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 309,
    image: "images/image 8.webp",
    description: "Baked spinach and corn preparation."
  },

  {
    name: "Saute Vegetable",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 219,
    image: "images/image 1.webp",
    description: "Fresh vegetables sautéed to perfection."
  },

  {
    name: "Grilled Paneer Lemon Butter Sauce",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 2.webp",
    description: "Grilled paneer with lemon butter sauce."
  },


  /* ================= DAL ================= */

  {
    name: "Dal Fry",
    category: "dal",
    categoryName: "Dal",
    price: 189,
    image: "images/image 3.webp",
    description: "Classic dal fry."
  },

  {
    name: "Dal Tadka",
    category: "dal",
    categoryName: "Dal",
    price: 199,
    image: "images/image 4.webp",
    description: "Yellow dal finished with aromatic tadka."
  },

  {
    name: "Dal Makhani",
    category: "dal",
    categoryName: "Dal",
    price: 229,
    image: "images/image 5.webp",
    description: "Rich slow-cooked black lentils."
  },

  {
    name: "Dal Bukhara",
    category: "dal",
    categoryName: "Dal",
    price: 209,
    image: "images/image 6.webp",
    description: "Slow-cooked creamy dal preparation."
  },


  /* ================= RICE ================= */

  {
    name: "Steam Rice",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 129,
    image: "images/image 7.webp",
    description: "Steamed basmati rice."
  },

  {
    name: "Jeera Rice",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 139,
    image: "images/image 8.webp",
    description: "Basmati rice tempered with cumin."
  },

  {
    name: "Veg Pulao",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 139,
    image: "images/image 1.webp",
    description: "Aromatic vegetable pulao."
  },

  {
    name: "Peas Rice",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 139,
    image: "images/image 2.webp",
    description: "Fragrant rice with green peas."
  },

  {
    name: "Veg Biryani",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 189,
    image: "images/image 3.webp",
    description: "Aromatic vegetarian biryani."
  },

  {
    name: "Hydabadi Biryani",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 209,
    image: "images/image 4.webp",
    description: "Hyderabadi-style vegetarian biryani."
  },

  {
    name: "Chaap Tikka Biryani",
    category: "rice",
    categoryName: "Rice & Biryani",
    price: 239,
    image: "images/image 5.webp",
    description: "Aromatic biryani with chaap tikka."
  },


  /* ================= BREADS ================= */

  {
    name: "Butter Roti",
    category: "breads",
    categoryName: "Breads",
    price: 35,
    image: "images/image 6.webp",
    description: "Tandoori roti with butter."
  },

  {
    name: "Plain Roti",
    category: "breads",
    categoryName: "Breads",
    price: 30,
    image: "images/image 7.webp",
    description: "Fresh tandoori plain roti."
  },

  {
    name: "Plain Naan",
    category: "breads",
    categoryName: "Breads",
    price: 40,
    image: "images/image 8.webp",
    description: "Soft tandoori naan."
  },

  {
    name: "Garlic Naan",
    category: "breads",
    categoryName: "Breads",
    price: 45,
    image: "images/image 1.webp",
    description: "Naan topped with garlic."
  },

  {
    name: "Butter Naan",
    category: "breads",
    categoryName: "Breads",
    price: 60,
    image: "images/image 2.webp",
    description: "Soft naan brushed with butter."
  },

  {
    name: "Cheese Naan",
    category: "breads",
    categoryName: "Breads",
    price: 70,
    image: "images/image 3.webp",
    description: "Naan stuffed with cheese."
  },

  {
    name: "Laccha Paratha",
    category: "breads",
    categoryName: "Breads",
    price: 45,
    image: "images/image 4.webp",
    description: "Layered crispy laccha paratha."
  },

  {
    name: "Mirchi Paratha",
    category: "breads",
    categoryName: "Breads",
    price: 45,
    image: "images/image 5.webp",
    description: "Spiced mirchi paratha."
  },

  {
    name: "Pudina Paratha",
    category: "breads",
    categoryName: "Breads",
    price: 45,
    image: "images/image 6.webp",
    description: "Fragrant mint paratha."
  },

  {
    name: "Missi Roti",
    category: "breads",
    categoryName: "Breads",
    price: 45,
    image: "images/image 7.webp",
    description: "Traditional missi roti."
  },


  /* ================= CHINESE STARTERS ================= */

  {
    name: "Honey Chilli Potato",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 165,
    image: "images/image 8.webp",
    description: "Crispy potato tossed in sweet chilli sauce."
  },

  {
    name: "Chilli Potato",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 185,
    image: "images/image 1.webp",
    description: "Crispy potato with chilli and oriental seasoning."
  },

  {
    name: "Crispy Corn",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 165,
    image: "images/image 2.webp",
    description: "Crispy corn tossed with seasoning."
  },

  {
    name: "Spring Roll",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 185,
    image: "images/image 3.webp",
    description: "Crispy vegetable spring rolls."
  },

  {
    name: "Cheese Cigar Roll",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 185,
    image: "images/image 4.webp",
    description: "Crispy cheese cigar rolls."
  },

  {
    name: "Crispy Veg",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 189,
    image: "images/image 5.webp",
    description: "Crispy mixed vegetables."
  },

  {
    name: "Spinach Cheese Corn Roll",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 189,
    image: "images/image 6.webp",
    description: "Spinach, cheese and corn rolls."
  },

  {
    name: "Spinach Corn Salt N Pepper",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 185,
    image: "images/image 7.webp",
    description: "Crispy spinach and corn with salt and pepper."
  },

  {
    name: "Gobhi Manchurian Dry",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 165,
    image: "images/image 8.webp",
    description: "Crispy cauliflower Manchurian."
  },

  {
    name: "Chilli Manchurian",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 219,
    image: "images/image 1.webp",
    description: "Available dry or gravy."
  },

  {
    name: "Paneer 65",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 219,
    image: "images/image 2.webp",
    description: "Crispy spicy paneer preparation."
  },

  {
    name: "Paneer Manchurian",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 219,
    image: "images/image 3.webp",
    description: "Available dry or gravy."
  },

  {
    name: "Paneer Stick",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 275,
    image: "images/image 4.webp",
    description: "Crispy paneer sticks."
  },

  {
    name: "Creamy Crispy Paneer",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 185,
    image: "images/image 5.webp",
    description: "Crispy paneer with creamy sauce."
  },

  {
    name: "Veg Manchurian",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 219,
    image: "images/image 6.webp",
    description: "Available dry or gravy."
  },

  {
    name: "Chilli Mushroom",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 219,
    image: "images/image 7.webp",
    description: "Available dry or gravy."
  },

  {
    name: "Mushroom Stick",
    category: "chinese-starters",
    categoryName: "Chinese Starters",
    price: 189,
    image: "images/image 8.webp",
    description: "Crispy mushroom sticks."
  },


  /* ================= CHINESE RICE & NOODLES ================= */

  {
    name: "Veg Fried Rice",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 165,
    image: "images/image 1.webp",
    description: "Wok-tossed vegetable fried rice."
  },

  {
    name: "Garlic Fried Rice",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 175,
    image: "images/image 2.webp",
    description: "Aromatic garlic fried rice."
  },

  {
    name: "Schezwan Fried Rice",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 175,
    image: "images/image 3.webp",
    description: "Spicy Schezwan-style fried rice."
  },

  {
    name: "Hakka Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 165,
    image: "images/image 4.webp",
    description: "Classic wok-tossed Hakka noodles."
  },

  {
    name: "Veg Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 185,
    image: "images/image 5.webp",
    description: "Vegetable noodles with oriental seasoning."
  },

  {
    name: "Paneer Fried Rice",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 185,
    image: "images/image 6.webp",
    description: "Fried rice with paneer."
  },

  {
    name: "Garlic Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 175,
    image: "images/image 7.webp",
    description: "Garlic-flavoured noodles."
  },

  {
    name: "Schezwan Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 175,
    image: "images/image 8.webp",
    description: "Spicy Schezwan noodles."
  },

  {
    name: "Paneer Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 185,
    image: "images/image 1.webp",
    description: "Noodles with paneer."
  },

  {
    name: "Hestia Special Noodles",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 219,
    image: "images/image 2.webp",
    description: "HESTIIA special noodles."
  },

  {
    name: "Hestia Special Rice",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 219,
    image: "images/image 3.webp",
    description: "HESTIIA special rice."
  },

  {
    name: "Chinese Platter",
    category: "chinese-main",
    categoryName: "Chinese Rice & Noodles",
    price: 389,
    image: "images/image 4.webp",
    description: "Honey chilli potato, spring roll, veg Manchurian and veg fried rice."
  },


  /* ================= PANEER ================= */

  {
    name: "Paneer Ragan Josh",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 5.webp",
    description: "Rich paneer preparation inspired by Rogan Josh."
  },

  {
    name: "Matar Paneer",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 6.webp",
    description: "Paneer and green peas in rich gravy."
  },

  {
    name: "Kadhai Paneer",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 7.webp",
    description: "Paneer cooked with capsicum and aromatic spices."
  },

  {
    name: "Paneer Butter Masala",
    category: "paneer",
    categoryName: "Paneer",
    price: 285,
    image: "images/image 8.webp",
    description: "Paneer in rich buttery tomato gravy."
  },

  {
    name: "Handi Paneer",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 1.webp",
    description: "Paneer prepared in traditional handi style."
  },

  {
    name: "Paneer Koftahani",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 2.webp",
    description: "Paneer kofta preparation."
  },

  {
    name: "Paneer Rajdhani",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 3.webp",
    description: "Special paneer preparation."
  },

  {
    name: "Paneer Jodhpuri",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 4.webp",
    description: "Rajasthani-inspired paneer preparation."
  },

  {
    name: "Paneer Bhujji",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 5.webp",
    description: "Paneer bhujji preparation."
  },

  {
    name: "Palak Paneer",
    category: "paneer",
    categoryName: "Paneer",
    price: 275,
    image: "images/image 6.webp",
    description: "Paneer cooked in smooth spinach gravy."
  },

  {
    name: "Paneer Lababdar",
    category: "paneer",
    categoryName: "Paneer",
    price: 309,
    image: "images/image 7.webp",
    description: "Rich tomato-based paneer preparation."
  },

  {
    name: "Paneer Tikka Masala",
    category: "paneer",
    categoryName: "Paneer",
    price: 309,
    image: "images/image 8.webp",
    description: "Tandoori paneer tikka in rich masala gravy."
  },

  {
    name: "Paneer Makhmali",
    category: "paneer",
    categoryName: "Paneer",
    price: 285,
    image: "images/image 1.webp",
    description: "Creamy and delicate paneer preparation."
  },


  /* ================= VEG MAIN ================= */

  {
    name: "Bhojpuri Dum Aloo",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 239,
    image: "images/image 2.webp",
    description: "Bhojpuri-style dum aloo."
  },

  {
    name: "Banarsi Dum Aloo",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 239,
    image: "images/image 3.webp",
    description: "Banarasi-style dum aloo."
  },

  {
    name: "Kashmiri Dum Aloo",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 219,
    image: "images/image 4.webp",
    description: "Kashmiri-style dum aloo."
  },

  {
    name: "Dum Aloo",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 219,
    image: "images/image 5.webp",
    description: "Classic dum aloo."
  },

  {
    name: "Mix Veg",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 275,
    image: "images/image 6.webp",
    description: "Mixed vegetables in Indian gravy."
  },

  {
    name: "Veg Jal Frezi",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 229,
    image: "images/image 7.webp",
    description: "Mixed vegetables cooked in jalfrezi style."
  },

  {
    name: "Pindi Chana Dry",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 169,
    image: "images/image 8.webp",
    description: "Dry Punjabi-style chickpeas."
  },

  {
    name: "Punjabi Chole",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 169,
    image: "images/image 1.webp",
    description: "Classic Punjabi chole."
  },

  {
    name: "Aloo Matar Dry",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 169,
    image: "images/image 2.webp",
    description: "Dry potato and peas preparation."
  },

  {
    name: "Jeera Aloo",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 175,
    image: "images/image 3.webp",
    description: "Potatoes tempered with cumin."
  },

  {
    name: "Mushroom Butter Masala",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 4.webp",
    description: "Mushrooms in rich buttery gravy."
  },

  {
    name: "Mushroom Do Pyaza",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 5.webp",
    description: "Mushroom with onion in rich gravy."
  },

  {
    name: "Matar Mushroom",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 6.webp",
    description: "Mushroom and peas curry."
  },

  {
    name: "Handi Mushroom",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 7.webp",
    description: "Mushroom prepared in handi style."
  },

  {
    name: "Mushroom Rogan Josh",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 249,
    image: "images/image 8.webp",
    description: "Mushroom preparation inspired by Rogan Josh."
  },

  {
    name: "Chaap Butter Masala",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 275,
    image: "images/image 1.webp",
    description: "Soya chaap in rich buttery gravy."
  },

  {
    name: "Chaap Tikka Masala",
    category: "veg-main",
    categoryName: "Veg Main Course",
    price: 285,
    image: "images/image 2.webp",
    description: "Tikka-style chaap in masala gravy."
  },


  /* ================= TANDOORI ================= */

  {
    name: "Paneer Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 239,
    image: "images/image 3.webp",
    description: "6 pieces of classic paneer tikka."
  },

  {
    name: "Achari Paneer Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 249,
    image: "images/image 4.webp",
    description: "6 pieces of achari paneer tikka."
  },

  {
    name: "Paneer Malai Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 269,
    image: "images/image 5.webp",
    description: "6 pieces of creamy malai paneer tikka."
  },

  {
    name: "Paneer Kali Mirch Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 249,
    image: "images/image 6.webp",
    description: "6 pieces of black pepper paneer tikka."
  },

  {
    name: "Mint Paneer Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 269,
    image: "images/image 7.webp",
    description: "6 pieces of mint paneer tikka."
  },

  {
    name: "Stuffed Paneer Malai Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 269,
    image: "images/image 8.webp",
    description: "6 pieces of stuffed paneer malai tikka."
  },

  {
    name: "Mushroom Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 219,
    image: "images/image 1.webp",
    description: "8 pieces of mushroom tikka."
  },

  {
    name: "Soya Malai Chaap",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 219,
    image: "images/image 2.webp",
    description: "6 pieces of creamy soya malai chaap."
  },

  {
    name: "Soya Angara Tikka",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 239,
    image: "images/image 3.webp",
    description: "6 pieces of smoky soya angara tikka."
  },

  {
    name: "Soya Aloo Kalimirch",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 219,
    image: "images/image 4.webp",
    description: "6 pieces of soya and aloo with black pepper."
  },

  {
    name: "Stuffed Chaap",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 249,
    image: "images/image 5.webp",
    description: "6 pieces of stuffed chaap."
  },

  {
    name: "Tandoori Platter",
    category: "tandoori",
    categoryName: "Tandoori Specials",
    price: 389,
    image: "images/image 6.webp",
    description: "Paneer tikka, soya kadahi chaap, dahi kebab and haryali kebab."
  },


  /* ================= SIDES ================= */

  {
    name: "Papad",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 35,
    image: "images/image 7.webp",
    description: "Crispy papad."
  },

  {
    name: "Masala Papad",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 49,
    image: "images/image 8.webp",
    description: "Papad topped with fresh masala."
  },

  {
    name: "French Fries",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 89,
    image: "images/image 1.webp",
    description: "Crispy golden French fries."
  },

  {
    name: "Cheese Fries",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 119,
    image: "images/image 2.webp",
    description: "Crispy fries topped with cheese."
  },

  {
    name: "Nachos",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 89,
    image: "images/image 3.webp",
    description: "Crispy nachos."
  },

  {
    name: "Cheese Nachos",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 129,
    image: "images/image 4.webp",
    description: "Nachos topped with cheese."
  },

  {
    name: "Garlic Bread",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 89,
    image: "images/image 5.webp",
    description: "6 pieces of garlic bread."
  },

  {
    name: "Veg Cutlet",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 119,
    image: "images/image 6.webp",
    description: "6 pieces of vegetable cutlet."
  },

  {
    name: "Cheese Cutlet",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 165,
    image: "images/image 7.webp",
    description: "6 pieces of cheese cutlet."
  },

  {
    name: "Paneer Pakoda",
    category: "sides",
    categoryName: "Sides & Snacks",
    price: 129,
    image: "images/image 8.webp",
    description: "8 pieces of crispy paneer pakoda."
  },


  /* ================= JUICES ================= */

  {
    name: "Orange",
    category: "juices",
    categoryName: "Juices",
    price: 99,
    image: "images/image 1.webp",
    description: "Refreshing orange juice."
  },

  {
    name: "Litchi",
    category: "juices",
    categoryName: "Juices",
    price: 99,
    image: "images/image 2.webp",
    description: "Refreshing litchi juice."
  },

  {
    name: "Mix Fruit",
    category: "juices",
    categoryName: "Juices",
    price: 99,
    image: "images/image 3.webp",
    description: "Fresh mixed fruit juice."
  },

  {
    name: "Apple",
    category: "juices",
    categoryName: "Juices",
    price: 99,
    image: "images/image 4.webp",
    description: "Refreshing apple juice."
  },

  {
    name: "Cranberry",
    category: "juices",
    categoryName: "Juices",
    price: 99,
    image: "images/image 5.webp",
    description: "Refreshing cranberry juice."
  },


  /* ================= SHAKES ================= */

  {
    name: "Chocolate Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 6.webp",
    description: "Rich chocolate shake."
  },

  {
    name: "Vanilla Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 7.webp",
    description: "Creamy vanilla shake."
  },

  {
    name: "Butterscotch Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 8.webp",
    description: "Rich butterscotch shake."
  },

  {
    name: "Pineapple Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 1.webp",
    description: "Fresh pineapple shake."
  },

  {
    name: "Mango Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 2.webp",
    description: "Creamy mango shake."
  },

  {
    name: "Strawberry Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 3.webp",
    description: "Fresh strawberry shake."
  },

  {
    name: "Black Currant Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 159,
    image: "images/image 4.webp",
    description: "Rich black currant shake."
  },

  {
    name: "Oreo Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 159,
    image: "images/image 5.webp",
    description: "Creamy Oreo shake."
  },

  {
    name: "Kit-Kat Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 159,
    image: "images/image 6.webp",
    description: "Chocolate Kit-Kat shake."
  },

  {
    name: "Cold Coffee",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 7.webp",
    description: "Classic chilled cold coffee."
  },

  {
    name: "Cold Coffee With Ice Cream",
    category: "shakes",
    categoryName: "Shakes",
    price: 149,
    image: "images/image 8.webp",
    description: "Cold coffee topped with ice cream."
  },

  {
    name: "Cold Coffee With Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 169,
    image: "images/image 1.webp",
    description: "Cold coffee with brownie and chocolate."
  },

  {
    name: "Hestia Special Shake",
    category: "shakes",
    categoryName: "Shakes",
    price: 199,
    image: "images/image 2.webp",
    description: "HESTIIA special shake."
  },


  /* ================= SOUPS ================= */

  {
    name: "Cream Of Tomato",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 3.webp",
    description: "Creamy tomato soup."
  },

  {
    name: "Hot N Sour",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 4.webp",
    description: "Classic hot and sour soup."
  },

  {
    name: "Manchow",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 5.webp",
    description: "Spicy Manchow soup."
  },

  {
    name: "Sweet Corn",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 6.webp",
    description: "Classic sweet corn soup."
  },

  {
    name: "Cream Of Mushroom",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 7.webp",
    description: "Creamy mushroom soup."
  },

  {
    name: "Veg Clear",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 8.webp",
    description: "Light vegetable clear soup."
  },

  {
    name: "Choise On You",
    category: "soups",
    categoryName: "Soups",
    price: 119,
    image: "images/image 1.webp",
    description: "Chef's choice soup."
  }

];
/* ============================================================
   MENU RENDER ENGINE
   ============================================================ */

let currentMenuCategory = "all";


function renderHestiiaMenu() {

  const grid =
    document.getElementById("restaurantMenuGrid");

  const empty =
    document.getElementById("menuEmpty");

  const result =
    document.getElementById("menuResultText");

  const search =
    document.getElementById("menuSearchInput");


  if (!grid) return;


  const searchText =
    search
      ? search.value.trim().toLowerCase()
      : "";


  let filtered =
    hestiiaRestaurantMenu;


  /* CATEGORY */

  if (currentMenuCategory !== "all") {

    filtered =
      filtered.filter(
        item =>
          item.category === currentMenuCategory
      );

  }


  /* SEARCH */

  if (searchText) {

    filtered =
      filtered.filter(item => {

        return (
          item.name
            .toLowerCase()
            .includes(searchText) ||

          item.categoryName
            .toLowerCase()
            .includes(searchText) ||

          item.description
            .toLowerCase()
            .includes(searchText)
        );

      });

  }


  /* EMPTY */

  if (!filtered.length) {

    grid.innerHTML = "";

    grid.style.display = "none";

    if (empty) {
      empty.classList.add("show");
    }

    if (result) {
      result.textContent =
        "No dishes found";
    }

    return;

  }


  grid.style.display = "grid";

  if (empty) {
    empty.classList.remove("show");
  }


  if (result) {

    result.textContent =
      `Showing ${filtered.length} ${
        filtered.length === 1
          ? "dish"
          : "dishes"
      }`;

  }


  /* BUILD CARDS */

  grid.innerHTML =
    filtered
      .map((item, index) => {

        return `

          <article
            class="restaurant-menu-card"
            style="animation-delay:${index * 35}ms"
          >

            <div class="restaurant-menu-image">

              <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
                onerror="
                  this.src='images/image 1.webp'
                "
              />

              <span
                class="restaurant-menu-veg"
              >
                <span></span>
                Pure Veg
              </span>

              <span
                class="restaurant-menu-price"
              >
                ₹${item.price.toFixed(2)}
              </span>

            </div>


            <div class="restaurant-menu-content">

              <span
                class="restaurant-menu-category"
              >
                ${item.categoryName}
              </span>

              <h3>
                ${item.name}
              </h3>

              <p
                class="restaurant-menu-description"
              >
                ${item.description}
              </p>


              <div
                class="restaurant-menu-bottom"
              >

                <strong
                  class="restaurant-menu-bottom-price"
                >
                  ₹${item.price.toFixed(2)}
                </strong>


                <button
                  type="button"
                  class="restaurant-menu-order"
                  onclick="
                    addHestiiaMenuItem(${itemIndexSafe(
                      filtered,
                      item
                    )})
                  "
                >

                  <i class="fas fa-plus"></i>

                  Add

                </button>

              </div>

            </div>

          </article>

        `;

      })
      .join("");

}


/* ============================================================
   SAFE ITEM INDEX
   ============================================================ */

function itemIndexSafe(list, item) {

  return hestiiaRestaurantMenu.indexOf(item);

}


/* ============================================================
   ADD TO CART
   ============================================================ */

function addHestiiaMenuItem(index) {

  const item =
    hestiiaRestaurantMenu[index];

  if (!item) return;


  let cart =
    JSON.parse(
      localStorage.getItem(
        "hestiia_cart"
      ) || "[]"
    );


  const existing =
    cart.find(
      cartItem =>
        cartItem.name === item.name
    );


  if (existing) {

    existing.quantity =
      (existing.quantity || 1) + 1;

  } else {

    cart.push({

      ...item,

      quantity: 1

    });

  }


  localStorage.setItem(
    "hestiia_cart",
    JSON.stringify(cart)
  );


  showHestiiaMenuToast(
    `${item.name} added to order`
  );

}


/* ============================================================
   CATEGORY FILTER
   ============================================================ */

function setHestiiaMenuCategory(category) {

  currentMenuCategory = category;


  document
    .querySelectorAll(".menu-category")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.menuCategory === category
      );

    });


  renderHestiiaMenu();

}


/* ============================================================
   RESET
   ============================================================ */

function resetRestaurantMenu() {

  currentMenuCategory = "all";


  const input =
    document.getElementById(
      "menuSearchInput"
    );

  if (input) {
    input.value = "";
  }


  document
    .querySelectorAll(".menu-category")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.menuCategory === "all"
      );

    });


  renderHestiiaMenu();

}


/* ============================================================
   TOAST
   ============================================================ */

function showHestiiaMenuToast(message) {

  let toast =
    document.getElementById(
      "hestiiaMenuToast"
    );


  if (!toast) {

    toast =
      document.createElement("div");

    toast.id =
      "hestiiaMenuToast";


    toast.style.cssText = `
      position:fixed;
      left:50%;
      bottom:30px;
      z-index:999999;

      transform:
        translate(-50%, 20px);

      padding:13px 22px;

      border-radius:50px;

      background:#c9a84c;

      color:#111;

      font-family:Poppins,sans-serif;

      font-size:12px;

      font-weight:600;

      box-shadow:
        0 15px 45px rgba(0,0,0,.35);

      opacity:0;

      pointer-events:none;

      transition:
        opacity .3s ease,
        transform .3s ease;
    `;


    document.body.appendChild(toast);

  }


  toast.textContent = message;


  requestAnimationFrame(() => {

    toast.style.opacity = "1";

    toast.style.transform =
      "translate(-50%, 0)";

  });


  clearTimeout(
    window.hestiiaToastTimer
  );


  window.hestiiaToastTimer =
    setTimeout(() => {

      toast.style.opacity = "0";

      toast.style.transform =
        "translate(-50%, 20px)";

    }, 2200);

}
document.addEventListener("DOMContentLoaded", () => {

  /* MENU INITIALIZE */

  renderHestiiaMenu();


  /* CATEGORY */

  document
    .querySelectorAll(".menu-category")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setHestiiaMenuCategory(
            button.dataset.menuCategory
          );

        }
      );

    });


  /* SEARCH */

  const searchInput =
    document.getElementById(
      "menuSearchInput"
    );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderHestiiaMenu
    );

  }


  /* CLEAR */

  const clearButton =
    document.getElementById(
      "menuSearchClear"
    );


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      () => {

        if (searchInput) {
          searchInput.value = "";
        }

        renderHestiiaMenu();

      }
    );

  }

});
function renderHestiiaFeaturedMenu() {

  const grid =
    document.getElementById(
      "featuredMenuGrid"
    );

  if (!grid) return;


  /*
   * Home page ke liye selected
   * popular dishes
   */

  const featuredNames = [

    "Paneer Tikka",
    "Paneer Butter Masala",
    "Hestiia Special",
    "Kadhai Paneer",
    "Chinese Platter",
    "Tandoori Platter",
    "Paneer Tikka Pizza",
    "Hestia Special Shake"

  ];


  const featured =
    featuredNames
      .map(name =>
        hestiiaRestaurantMenu.find(
          item => item.name === name
        )
      )
      .filter(Boolean);


  grid.innerHTML =
    featured
      .map(item => `

        <article class="featured-menu-card">

          <div class="featured-menu-image">

            <img
              src="${item.image}"
              alt="${item.name}"
              loading="lazy"
            />

            <span
              class="featured-menu-price"
            >
              ₹${item.price}
            </span>

          </div>


          <div
            class="featured-menu-content"
          >

            <span
              class="featured-menu-category"
            >
              ${item.categoryName}
            </span>

            <h3>
              ${item.name}
            </h3>

            <p>
              ${item.description}
            </p>

          </div>

        </article>

      `)
      .join("");

}

document.addEventListener("DOMContentLoaded", () => {

  renderHestiiaMenu();

  renderHestiiaFeaturedMenu();

  // tumhara existing JS...
});
