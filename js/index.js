"use strict";
import fetchData from './createRequest.js';
// Изменение даты 
const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const months = [
  "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
  "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
];

const dateLinks = document.querySelectorAll(".page-nav__day");

dateLinks.forEach((dateLink, index) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + index);

  const dayOfWeek = daysOfWeek[futureDate.getDay()];
  const dayOfMonth = futureDate.getDate();
  const month = months[futureDate.getMonth()];

  const dayWeekElement = dateLink.querySelector(".page-nav__day-week");
  const dayNumberElement = dateLink.querySelector(".page-nav__day-number");

  dayWeekElement.textContent = dayOfWeek;
  dayNumberElement.textContent = dayOfMonth;

  if (index === 0) {
    dateLink.classList.add("page-nav__day_today");
  }

  if (dayOfWeek === "Сб" || dayOfWeek === "Вс") {
    dateLink.classList.add("page-nav__day_weekend");
  } else {
    dateLink.classList.remove("page-nav__day_weekend");
  }

  dateLink.addEventListener("click", () => {
    // Удаляем класс у всех элементов
    dateLinks.forEach(link => {
      link.classList.remove("page-nav__day_chosen");
    });

    // Добавляем класс только для текущего элемента
    dateLink.classList.add("page-nav__day_chosen");
  });
});
// ____________________________________________
// Функция для заполнения страницы данными
function fillPageWithData(data) {
  console.log(data);
  const halls = data.halls.result.filter((item) => item.hall_open !== "0");
  const films = data.films.result;
  const seances = data.seances.result;

  const hallTitle = document.querySelector(".movie-seances__hall-title");
  halls.forEach((hall) => {
    if (hall.hall_open === 1) {
      const hallName = document.createElement("span");
      hallName.textContent = hall.hall_name;
      hallTitle.appendChild(hallName); // Добавляем название зала в элемент с классом "movie-seances__hall-title"
    }
  });

  // Обновление списка фильмов и сеансов
  const movieSections = document.querySelectorAll(".movie");
  movieSections.forEach((movieSection, index) => {
    const film = films[index];
    const seanceData = seances.filter(
      (seance) => seance.seance_filmid === film.film_id
    );

    const movieInfo = movieSection.querySelector(".movie__info");
    const movieTitle = movieInfo.querySelector(".movie__title");
    const movieSynopsis = movieInfo.querySelector(".movie__synopsis");
    const movieDuration = movieInfo.querySelector(".movie__data-duration");
    const movieOrigin = movieInfo.querySelector(".movie__data-origin");
    const moviePoster = movieInfo.querySelector(".movie__poster-image");
    const seanceList = movieSection.querySelectorAll(".movie-seances__time");

    movieTitle.textContent = film.film_name;
    movieSynopsis.textContent = film.film_description;
    movieDuration.textContent = `${film.film_duration} минут`;
    movieOrigin.textContent = film.film_origin;
    moviePoster.src = film.film_poster;

    const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
    const upcomingSeances = seanceData.filter(seance => seance.seance_start >= currentTime);
    const upcomingSeanceTimes = upcomingSeances.map(seance => seance.seance_time);

    // Обработчик клика на ссылку сеанса
    seanceList.forEach((seanceElement, index) => {
      const session = upcomingSeances[index];
      if (session) {
        seanceElement.textContent = session.seance_time;

        if (session.isPast) {
          // Если сеанс уже прошел, блокируем ссылку
          seanceElement.href = "#";
          seanceElement.style.backgroundColor = '#f2f2f2'; // Светло-серый фон
        } else {
          // Устанавливаем data-атрибуты для сеанса
          seanceElement.dataset.seanceId = session.seance_id;
          seanceElement.dataset.hallId = session.hall_id;

          seanceElement.addEventListener("click", () => {
            // Сохраняем данные о сеансе в sessionStorage
            const sessionData = {
              seanceId: session.seance_id,
              hallId: session.hall_id,
            };
            sessionStorage.setItem("selectedSession", JSON.stringify(sessionData));
          });

          seanceElement.href = `hall.html`; // Переход на страницу зала
        }
      } else {
        seanceElement.style.display = "none";
      }
    });
  });
}

// Параметры для запроса
const requestData = "event=update";

// URL для запроса
const apiUrl = "https://jscp-diplom.netoserver.ru/";

// Вызов функции отправки запроса и заполнения страницы данными
fetchData(apiUrl, requestData, fillPageWithData);