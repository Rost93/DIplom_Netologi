"use strict";
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
  const halls = data.halls.result;
  const films = data.films.result;
  const seances = data.seances.result;

  // Обновление списка залов
  const hallList = document.querySelector(".page-nav");

  halls.forEach((hall) => {
    if (hall.hall_open === 1) {
      const hallLink = document.createElement("a");
      hallLink.classList.add("page-nav__day");
      hallLink.href = `hall.html?hallId=${hall.hall_id}`;
      hallLink.textContent = hall.hall_name;
      hallLink.dataset.hallId = hall.hall_id; // Устанавливаем значение data-атрибута
      hallList.appendChild(hallLink);
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

    seanceList.forEach((seanceElement, index) => {
      seanceElement.textContent = upcomingSeanceTimes[index];
      seanceElement.href = upcomingSeances[index] ? "hall.html" : "#"; // ссылка на страницу сеанса или заблокированная ссылка
      const seanceHall = movieSection.querySelector(".movie-seances__hall");

      if (upcomingSeances.length === 0) {
        seanceHall.classList.add("hidden"); // Скрываем блок, если нет доступных сеансов
      } else {
        seanceHall.classList.remove("hidden"); // Показываем блок, если есть доступные сеансы
      }
    });
  });
}

// Параметры для запроса
const requestData = "event=update";

// URL для запроса
const apiUrl = "https://jscp-diplom.netoserver.ru/"; 

import fetchData from './scripts.js';

// Вызов функции отправки запроса и заполнения страницы данными
fetchData(apiUrl, requestData, fillPageWithData);









