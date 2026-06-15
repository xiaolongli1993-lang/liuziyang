const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll(".hero, .section");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

// Ensure above-the-fold content is visible immediately on first paint.
sections.forEach((section) => {
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    section.classList.add("is-visible");
  }
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  {
    rootMargin: "-40% 0px -45% 0px",
    threshold: 0,
  }
);

document.querySelectorAll("main section").forEach((section) => {
  activeObserver.observe(section);
});

const trainingGate = document.querySelector("[data-training-gate]");
const trainingForm = document.querySelector("[data-training-form]");
const trainingStatus = document.querySelector("[data-training-status]");
const trainingUser = document.querySelector("[data-training-user]");
const trainingLogout = document.querySelector("[data-training-logout]");
const trainingLibrary = document.querySelectorAll("[data-training-library]");
const trainingStorageKey = "zlzh_employee_name";

function setTrainingVisibility(name) {
  const isLoggedIn = Boolean(name && name.trim());

  trainingGate?.classList.toggle("is-hidden", isLoggedIn);
  trainingLibrary.forEach((section) => {
    section.classList.toggle("is-hidden", !isLoggedIn);
  });

  if (trainingUser) {
    trainingUser.textContent = isLoggedIn ? name : "未登录";
  }
}

const savedEmployeeName = window.localStorage.getItem(trainingStorageKey);

if (savedEmployeeName) {
  setTrainingVisibility(savedEmployeeName);
}

if (trainingForm) {
  trainingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(trainingForm);
    const employeeName = String(formData.get("employeeName") || "").trim();

    if (!employeeName) {
      if (trainingStatus) {
        trainingStatus.textContent = "请输入员工姓名后再进入。";
      }
      return;
    }

    window.localStorage.setItem(trainingStorageKey, employeeName);
    setTrainingVisibility(employeeName);

    if (trainingStatus) {
      trainingStatus.textContent = `欢迎你，${employeeName}。已进入中联智慧大学。`;
    }
  });
}

if (trainingLogout) {
  trainingLogout.addEventListener("click", () => {
    window.localStorage.removeItem(trainingStorageKey);
    setTrainingVisibility("");

    if (trainingStatus) {
      trainingStatus.textContent = "你已退出学习中心。";
    }

    const input = trainingForm?.querySelector('input[name="employeeName"]');
    if (input instanceof HTMLInputElement) {
      input.value = "";
      input.focus();
    }
  });
}
