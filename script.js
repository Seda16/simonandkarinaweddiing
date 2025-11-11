// Плавная прокрутка между секциями - УЛУЧШЕННАЯ ВЕРСИЯ
document.addEventListener("DOMContentLoaded", function () {
  let currentSection = 0;
  const sections = document.querySelectorAll(".screen");
  let isScrolling = false;

  function scrollToSection(index) {
    if (isScrolling || index < 0 || index >= sections.length) return;

    isScrolling = true;
    currentSection = index;

    sections[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Разблокируем прокрутку через 500ms
    setTimeout(() => {
      isScrolling = false;
    }, 500);
  }

  // Листание пальцем
  let startY = 0;
  let isTouchScrolling = false;

  document.addEventListener("touchstart", (e) => {
    if (isScrolling) return;
    startY = e.touches[0].clientY;
    isTouchScrolling = true;
  });

  document.addEventListener("touchend", (e) => {
    if (!isTouchScrolling || isScrolling) return;

    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    // Увеличил чувствительность до 80px
    if (diff > 80 && currentSection < sections.length - 1) {
      scrollToSection(currentSection + 1);
    } else if (diff < -80 && currentSection > 0) {
      scrollToSection(currentSection - 1);
    }

    isTouchScrolling = false;
  });

  // Прокрутка колесиком
  let wheelTimeout;
  document.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 50 && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
      } else if (e.deltaY < -50 && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    }, 100);
  });
});

// Фоновая музыка
const music = document.getElementById("bg-music");
// Автозапуск может не работать на мобильных - нужен пользовательский клик

// Функционал для плюсиков - УПРОЩЕННАЯ ВЕРСИЯ
document.addEventListener("DOMContentLoaded", function () {
  const plusButtons = document.querySelectorAll(".plus");

  plusButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const timelineItem = this.closest(".timeline-item");
      const details = timelineItem.querySelector(".event-details");
      const isActive = details.classList.contains("active");

      // Переключаем текущий
      if (isActive) {
        details.classList.remove("active");
        this.classList.remove("active");
      } else {
        // Добавляем текст если его нет
        if (!details.innerHTML.trim()) {
          details.innerHTML = this.getAttribute("data-details");
        }
        details.classList.add("active");
        this.classList.add("active");
      }
    });
  });

  // Закрытие при клике на сам event
  document.querySelectorAll(".event").forEach((event) => {
    event.addEventListener("click", function () {
      const plus = this.querySelector(".plus");
      const details = this.nextElementSibling;

      if (details.classList.contains("active")) {
        details.classList.remove("active");
        plus.classList.remove("active");
      } else {
        if (!details.innerHTML.trim()) {
          details.innerHTML = plus.getAttribute("data-details");
        }
        details.classList.add("active");
        plus.classList.add("active");
      }
    });
  });
});
// Карусель для дресс-кода
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация карусели
  function initCarousel() {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const container = carousel.querySelector(".carousel-container");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    let currentSlide = 0;

    // Создаем точки
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    function goToSlide(index) {
      // Скрываем все слайды
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      // Показываем нужный слайд
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(prev);
    }

    // Автопереключение каждые 5 секунд
    let autoSlide = setInterval(nextSlide, 5000);

    // Останавливаем автопереключение при взаимодействии
    carousel.addEventListener("mouseenter", () => clearInterval(autoSlide));
    carousel.addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextSlide, 5000);
    });

    // Кнопки навигации
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    // Инициализация
    goToSlide(0);
  }

  initCarousel();
});

// RSVP функционал с счетчиком
let rsvpInitialized = false; // Флаг для отслеживания инициализации

function initRSVP() {
  // Если уже инициализирована - выходим
  if (rsvpInitialized) {
    console.log("RSVP форма уже инициализирована");
    return;
  }

  // Находим все элементы с защитой от null
  const rsvpForm = document.getElementById("rsvp-form");
  const additionalGuests = document.getElementById("additional-guests");
  const counterValue = document.getElementById("counter-value");
  const minusBtn = document.getElementById("minus-btn");
  const plusBtn = document.getElementById("plus-btn");
  const submitBtn = document.getElementById("submit-btn");

  // Проверяем что все элементы найдены
  if (
    !rsvpForm ||
    !additionalGuests ||
    !counterValue ||
    !minusBtn ||
    !plusBtn ||
    !submitBtn
  ) {
    console.log("RSVP форма не найдена на этой странице");
    return;
  }

  rsvpInitialized = true; // Помечаем как инициализированную
  console.log("RSVP форма инициализирована");

  let guestCount = 0;
  const MAX_GUESTS = 4;

  // Google Apps Script URL
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzXRl5p6nVY4dMgP0OCkIWHJMLHv66q8F4rhaOI2PVbfbB0HKs0Sd3Ca86lzGSBmBXC/exec";

  // Управление счетчиком
  function updateCounter() {
    counterValue.textContent = guestCount;
    minusBtn.disabled = guestCount === 0;
    plusBtn.disabled = guestCount === MAX_GUESTS;
    updateGuestFields();
  }

  // Обновление полей гостей
  // Обновление полей гостей - ИСПРАВЛЕННАЯ ВЕРСИЯ
  function updateGuestFields() {
    // Сохраняем текущие значения полей
    const currentValues = [];
    const existingInputs = additionalGuests.querySelectorAll(
      'input[name^="guest_"]'
    );

    existingInputs.forEach((input, index) => {
      if (index < guestCount) {
        currentValues.push(input.value);
      }
    });

    // Очищаем контейнер
    additionalGuests.innerHTML = "";

    // Создаем поля заново с сохраненными значениями
    for (let i = 0; i < guestCount; i++) {
      const guestField = document.createElement("div");
      guestField.className = "guest-field";
      guestField.innerHTML = `
      <div class="form-label">Гость ${i + 1}</div>
      <input type="text" name="guest_${i + 1}" class="form-input" 
             placeholder="Имя и фамилия гостя"
             value="${currentValues[i] || ""}">
    `;
      additionalGuests.appendChild(guestField);
    }
  }

  // Обработчики счетчика
  function setupEventListeners() {
    minusBtn.addEventListener("click", handleMinusClick);
    plusBtn.addEventListener("click", handlePlusClick);
    rsvpForm.addEventListener("submit", handleFormSubmit);
  }

  function removeEventListeners() {
    minusBtn.removeEventListener("click", handleMinusClick);
    plusBtn.removeEventListener("click", handlePlusClick);
    rsvpForm.removeEventListener("submit", handleFormSubmit);
  }

  function handleMinusClick() {
    if (guestCount > 0) {
      guestCount--;
      updateCounter();
    }
  }

  function handlePlusClick() {
    if (guestCount < MAX_GUESTS) {
      guestCount++;
      updateCounter();
    }
  }

  // Отправка формы - УПРОЩЕННАЯ ВЕРСИЯ БЕЗ CORS
  function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
      mainGuest: formData.get("main_guest"),
      guestCount: guestCount,
      guests: [],
      timestamp: new Date().toISOString(),
    };

    // Собираем данные гостей
    for (let i = 0; i < guestCount; i++) {
      const guestName = formData.get(`guest_${i + 1}`);
      if (guestName && guestName.trim() !== "") {
        data.guests.push(guestName.trim());
      }
    }

    console.log("Отправляемые данные:", data);

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    // Простая отправка через Google Forms совместимый метод
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Игнорируем CORS
      body: JSON.stringify(data),
    })
      .then(() => {
        // Всегда показываем успех при mode: 'no-cors'
        showMessage("Спасибо! Ваш ответ успешно отправлен!", "success");
        rsvpForm.reset();
        guestCount = 0;
        updateCounter();
      })
      .catch((error) => {
        showMessage(
          "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
          "error"
        );
        console.error("Error:", error);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить!";
      });
  }

  function showMessage(text, type) {
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement("div");
    message.className = `form-message ${type}`;
    message.textContent = text;
    rsvpForm.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  // Инициализация
  setupEventListeners();
  updateCounter();
}

// Запускаем когда DOM загружен - ТОЛЬКО ОДИН РАЗ
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM загружен, инициализируем RSVP форму");
  initRSVP();
});

// Обратный отсчет до свадьбы
function initCountdown() {
  const countdownElement = document.getElementById("countdown");
  if (!countdownElement) return;

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Дата свадьбы - 27 декабря 2025
  const weddingDate = new Date("2025-12-27T15:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      // Если дата прошла
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }

    // Расчет времени
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Обновление элементов
    daysElement.textContent = days.toString().padStart(2, "0");
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");
  }

  // Запуск отсчета
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Добавьте в DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initRSVP();
  initCountdown(); // Добавляем эту строку
});

// Анимация появления текста при скролле
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Для invitation страницы - анимируем параграфы по отдельности
        if (entry.target.id === "invitation") {
          const paragraphs =
            entry.target.querySelectorAll(".invitation-text p");
          paragraphs.forEach((paragraph, index) => {
            setTimeout(() => {
              paragraph.classList.add("visible");
            }, index * 200); // Задержка между появлением каждого параграфа
          });
        }
        // Для других страниц - просто добавляем класс
        else {
          entry.target.classList.add("visible");
        }
      }
    });
  }, observerOptions);

  // Наблюдаем за секциями
  const sections = document.querySelectorAll(".screen");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Добавьте в DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initRSVP();
  initCountdown();
  initScrollAnimations(); // Добавляем эту строку
});

// Анимация появления текста при скролле
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Для invitation страницы
        if (entry.target.id === "invitation") {
          const paragraphs =
            entry.target.querySelectorAll(".invitation-text p");
          paragraphs.forEach((paragraph, index) => {
            setTimeout(() => {
              paragraph.classList.add("visible");
            }, index * 200);
          });
        }
        // Для location страницы
        else if (entry.target.id === "location") {
          const elements = entry.target.querySelectorAll(".animate-element");
          elements.forEach((element, index) => {
            setTimeout(() => {
              element.classList.add("visible");
            }, index * 200);
          });
        }
        // Для других страниц
        else {
          entry.target.classList.add("visible");
        }
      }
    });
  }, observerOptions);

  // Наблюдаем за секциями
  const sections = document.querySelectorAll(".screen");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Автовоспроизведение видео при прокрутке
function initVideoAutoplay() {
  const video = document.querySelector(".wedding-video");
  if (!video) return;

  let isVideoPlaying = false;

  function playVideo() {
    if (!isVideoPlaying) {
      video
        .play()
        .then(() => {
          isVideoPlaying = true;
        })
        .catch((error) => {
          console.log("Автовоспроизведение заблокировано:", error);
        });
    }
  }

  function pauseVideo() {
    if (isVideoPlaying) {
      video.pause();
      isVideoPlaying = false;
    }
  }

  // Intersection Observer для отслеживания видимости видео
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Видео видно на 50% экрана - воспроизводим
          if (entry.intersectionRatio >= 0.5) {
            playVideo();
          }
        } else {
          // Видео не видно - ставим на паузу
          pauseVideo();
        }
      });
    },
    {
      threshold: [0, 0.5, 1], // Срабатывает при 0%, 50% и 100% видимости
    }
  );

  observer.observe(video);
}

// Вызови функцию после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  initVideoAutoplay();
});

// Включение/выключение музыки по кнопке
document.addEventListener("DOMContentLoaded", function () {
  const musicToggle = document.getElementById("music-toggle");
  const music = document.getElementById("bg-music");

  if (musicToggle && music) {
    let isPlaying = false;

    musicToggle.addEventListener("click", function () {
      if (!isPlaying) {
        music
          .play()
          .then(() => {
            isPlaying = true;
            this.innerHTML = "⏸︎ Выключить музыку";
          })
          .catch((error) => {
            console.log("Не удалось включить музыку:", error);
            this.innerHTML = "▶︎ Нажмите еще раз";
          });
      } else {
        music.pause();
        isPlaying = false;
        this.innerHTML = "▶︎ Включить музыку";
      }
    });

    // Автоматически ставим на паузу при загрузке
    music.pause();
  }
});
