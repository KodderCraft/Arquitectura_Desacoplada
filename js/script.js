"use strict";

const quizAnswers = [
  { correct: "b", explanation: "Reducir dependencias directas permite que los componentes evolucionen con menor impacto mutuo." },
  { correct: "c", explanation: "El bajo acoplamiento ayuda a mantener el sistema y facilita realizar cambios independientes." },
  { correct: "a", explanation: "Interfaces, contratos y mecanismos definidos hacen explícita la colaboración entre componentes." },
  { correct: "d", explanation: "Las responsabilidades claras hacen que cada componente sea más comprensible, mantenible y comprobable." },
  { correct: "b", explanation: "Si conserva el contrato acordado, un módulo puede sustituirse sin exigir cambios generalizados." }
];

const videoConfig = {
  youtubeId: "",
  localVideoPath: "assets/video/video editado.mp4"
};

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const pageSections = document.querySelectorAll("main section[id]");
const progressBar = document.querySelector("#scroll-progress-bar");
const floatingTop = document.querySelector(".floating-top");

function closeMobileMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  navLinks.classList.remove("is-open");
}

function initializeNavigation() {
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navigationAnchors.forEach((anchor) => anchor.addEventListener("click", closeMobileMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  const updateScrollUI = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (floatingTop) floatingTop.classList.toggle("is-visible", window.scrollY > 500);

    let currentSection = "inicio";
    pageSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 150) currentSection = section.id;
    });
    navigationAnchors.forEach((anchor) => {
      if (anchor.getAttribute("href") === `#${currentSection}`) {
        anchor.setAttribute("aria-current", "location");
      } else {
        anchor.removeAttribute("aria-current");
      }
    });
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI);
  updateScrollUI();
}

function initializeReveals() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealItems.forEach((item) => observer.observe(item));
}

function initializeDiagram() {
  const diagramNodes = document.querySelectorAll(".diagram-node");
  const detailTitle = document.querySelector("#diagram-detail-title");
  const detailCopy = document.querySelector("#diagram-detail-copy");
  const resetButton = document.querySelector("#diagram-reset");

  const selectNode = (node) => {
    diagramNodes.forEach((item) => item.classList.toggle("is-selected", item === node));
    if (detailTitle) detailTitle.textContent = node.dataset.title;
    if (detailCopy) detailCopy.textContent = node.dataset.description;
  };

  diagramNodes.forEach((node) => {
    node.addEventListener("click", () => selectNode(node));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node);
      }
    });
  });

  resetButton?.addEventListener("click", () => {
    diagramNodes.forEach((node) => node.classList.remove("is-selected"));
    if (detailTitle) detailTitle.innerHTML = "Límites claros,<br>colaboración explícita.";
    if (detailCopy) detailCopy.textContent = "Selecciona con clic, Enter o espacio un componente para ver su responsabilidad dentro de este ejemplo.";
  });
}

function initializeQuiz() {
  const form = document.querySelector("#quiz-form");
  const hint = document.querySelector("#quiz-hint");
  const result = document.querySelector("#quiz-result");
  if (!form || !hint || !result) return;

  form.addEventListener("change", (event) => {
    if (!event.target.matches('input[type="radio"]')) return;
    form.querySelectorAll(".question").forEach((question) => {
      question.classList.remove("is-correct", "is-incorrect");
      question.querySelector(".question-feedback").textContent = "";
      question.querySelectorAll(".option").forEach((option) => option.classList.remove("is-answer", "is-wrong"));
    });
    result.hidden = true;
    result.textContent = "";
    result.removeAttribute("data-tone");
    hint.textContent = "Respuesta actualizada. Evalúa de nuevo cuando estés listo.";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const questions = [...form.querySelectorAll(".question")];
    const selections = questions.map((question) => question.querySelector('input[type="radio"]:checked'));
    const unansweredIndex = selections.findIndex((selection) => !selection);

    if (unansweredIndex !== -1) {
      hint.textContent = `Te falta responder la pregunta ${unansweredIndex + 1} antes de evaluar.`;
      questions[unansweredIndex].querySelector('input[type="radio"]').focus();
      result.hidden = true;
      return;
    }

    let score = 0;
    questions.forEach((question, index) => {
      const answer = quizAnswers[index];
      const selected = selections[index];
      const isCorrect = selected.value === answer.correct;
      if (isCorrect) score += 1;

      question.classList.toggle("is-correct", isCorrect);
      question.classList.toggle("is-incorrect", !isCorrect);
      question.querySelectorAll(".option").forEach((option) => {
        const input = option.querySelector("input");
        option.classList.toggle("is-answer", input.value === answer.correct);
        option.classList.toggle("is-wrong", input.checked && !isCorrect);
      });
      question.querySelector(".question-feedback").textContent = `${isCorrect ? "Correcta." : "Revisa esta respuesta."} ${answer.explanation}`;
    });

    const percentage = Math.round((score / quizAnswers.length) * 100);
    let message = "Buen comienzo: vuelve a repasar los conceptos y prueba otra vez.";
    if (score === quizAnswers.length) message = "¡Excelente! Tienes muy claros los principios del desacoplamiento.";
    else if (score >= 3) message = "¡Vas por buen camino! Ya tienes una buena base sobre el tema.";

    result.innerHTML = `<strong>${score} de ${quizAnswers.length} · ${percentage}%</strong><br>${message}`;
    result.dataset.tone = score < 3 ? "low" : "high";
    result.hidden = false;
    hint.textContent = "Puedes cambiar cualquier respuesta y volver a evaluar.";
  });

  form.addEventListener("reset", () => {
    form.querySelectorAll(".question").forEach((question) => {
      question.classList.remove("is-correct", "is-incorrect");
      question.querySelector(".question-feedback").textContent = "";
      question.querySelectorAll(".option").forEach((option) => option.classList.remove("is-answer", "is-wrong"));
    });
    result.hidden = true;
    result.textContent = "";
    result.removeAttribute("data-tone");
    hint.textContent = "Selecciona una opción en cada pregunta para evaluar.";
  });
}

function initializeVideo() {
  const frame = document.querySelector("#video-frame");
  if (!frame) return;

  if (/^[\w-]{11}$/.test(videoConfig.youtubeId)) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoConfig.youtubeId}`;
    iframe.title = "Video educativo sobre arquitectura desacoplada";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    return;
  }

  if (videoConfig.localVideoPath.trim()) {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", "Video educativo sobre arquitectura desacoplada");
    const source = document.createElement("source");
    source.src = videoConfig.localVideoPath;
    source.type = /\.webm(?:$|\?)/i.test(videoConfig.localVideoPath) ? "video/webm" : "video/mp4";
    video.append(source);
    frame.replaceChildren(video);
  }
}

function initializePageDetails() {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
}

initializeNavigation();
initializeReveals();
initializeDiagram();
initializeQuiz();
initializeVideo();
initializePageDetails();
