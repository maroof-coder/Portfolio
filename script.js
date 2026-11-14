const pageLoader = document.getElementById("pageLoader");
let loaderDismissed = false;
const dismissPageLoader = () => {
  if (loaderDismissed || !pageLoader) return;
  loaderDismissed = true;
  pageLoader.classList.add("loader-hidden");
  document.body.classList.remove("is-loading");
  window.setTimeout(() => pageLoader.remove(), 650);
};
window.addEventListener("load", () => window.setTimeout(dismissPageLoader, 1800), { once: true });
window.setTimeout(dismissPageLoader, 9000);

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const backToTop = document.getElementById("backToTop");
  const year = document.getElementById("year");
  const navCollapse = document.getElementById("navbarContent");
  const serviceModal = document.getElementById("serviceModal");
  const achievementModal = document.getElementById("achievementModal");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const savedTheme = localStorage.getItem("maroof-portfolio-theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");
  const syncThemeButton = () => {
    const isLight = document.body.classList.contains("light-theme");
    themeIcon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  };
  syncThemeButton();
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("maroof-portfolio-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    syncThemeButton();
  });
  year.textContent = new Date().getFullYear();
  const handleScroll = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("show", window.scrollY > 450);
  };
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const scrollToSection = target => {
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 14;
    window.scrollTo({ top, behavior: "smooth" });
    if (target.id) history.replaceState(null, "", `#${target.id}`);
  };

  document.querySelectorAll("#navbarContent a[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      if (window.innerWidth < 992 && navCollapse.classList.contains("show")) {
        navCollapse.addEventListener("hidden.bs.collapse", () => scrollToSection(target), { once: true });
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      } else {
        scrollToSection(target);
      }
    });
  });
  const typingElement = document.getElementById("typingText");
  const words = ["Web Developer", "Front-End Learner", "Creative Thinker"];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  function typeLoop() {
    const current = words[wordIndex];
    if (deleting) {
      charIndex--;
      typingElement.textContent = current.substring(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 55);
    } else {
      const next = words[wordIndex];
      charIndex++;
      typingElement.textContent = next.substring(0, charIndex);
      if (charIndex >= next.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
      setTimeout(typeLoop, 85);
    }
  }
  setTimeout(typeLoop, 1800);
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-card, .about-lead, .service-card, .skills-intro, .skills-panel, .education-entry, .achievement-card, .project-card, .hire-card, .contact-form, .contact-detail"
  );
  revealTargets.forEach(item => item.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.querySelectorAll(".progress-bar").forEach(bar => {
          bar.style.width = bar.dataset.width || "0%";
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach(item => revealObserver.observe(item));
  const discussProjectButton = document.getElementById("discussProjectButton");
  discussProjectButton.addEventListener("click", event => {
    event.preventDefault();
    serviceModal.addEventListener("hidden.bs.modal", () => {
      const contactSection = document.getElementById("contact");
      scrollToSection(contactSection);
      window.setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), 650);
    }, { once: true });
    bootstrap.Modal.getOrCreateInstance(serviceModal).hide();
  });

  const exploreProjectsButton = document.getElementById("exploreProjectsButton");
  exploreProjectsButton.addEventListener("click", event => {
    event.preventDefault();
    const projectsSection = document.getElementById("projects");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(achievementModal);
    const navigateToProjects = () => scrollToSection(projectsSection);
    achievementModal.addEventListener("hidden.bs.modal", navigateToProjects, { once: true });
    modalInstance.hide();
  });

  achievementModal.addEventListener("show.bs.modal", event => {
    const trigger = event.relatedTarget;
    document.getElementById("achievementModalTitle").textContent = trigger.dataset.achievementTitle;
    document.getElementById("achievementModalSubtitle").textContent = trigger.dataset.achievementSubtitle;
    document.getElementById("achievementModalDescription").textContent = trigger.dataset.achievementDetail;
    document.getElementById("achievementModalIcon").className = `bi ${trigger.dataset.achievementIcon}`;
    document.getElementById("achievementModalKicker").textContent = trigger.dataset.achievementKicker || "MILESTONE DETAILS";
  });

  serviceModal.addEventListener("show.bs.modal", event => {
    const trigger = event.relatedTarget;
    document.getElementById("serviceModalTitle").textContent = trigger.dataset.serviceTitle;
    document.getElementById("serviceModalIcon").className = `bi ${trigger.dataset.serviceIcon}`;
    document.getElementById("serviceModalDescription").textContent = trigger.dataset.serviceDescription;
    const list = document.getElementById("serviceModalList");
    list.replaceChildren();
    trigger.dataset.serviceList.split("|").forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });
  });

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const recipientEmail = "maroof13679@gmail.com";

  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const subject = formData.get("subject").trim();
    const topic = formData.get("topic").trim();
    const message = formData.get("message").trim();

    const mailSubject = encodeURIComponent(`Portfolio message: ${subject}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${recipientEmail}?subject=${mailSubject}&body=${mailBody}`;
    formMessage.textContent = "Your email app should open with the message ready.";
    formMessage.style.color = "#8bc99d";
    contactForm.reset();
  });
  const messageField = document.getElementById("message");
  const messageCounter = document.getElementById("messageCounter");
  const updateMessageCounter = () => {
    messageCounter.textContent = `${messageField.value.length} / 500`;
  };
  messageField.addEventListener("input", updateMessageCounter);
  contactForm.addEventListener("reset", () => window.setTimeout(updateMessageCounter, 0));

  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
});
