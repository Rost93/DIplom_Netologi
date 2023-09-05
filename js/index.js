"use strict";
import fetchData from './createRequest.js';
// Изменение даты 
const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const months = [
  "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
  "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
];
const dateLinks = document.querySelectorAll(".page-nav__day");
let selectedDate = new Date(Date.now()); 
dateLinks.forEach((dateLink, index) => {
  const futureDate = new Date(Date.now());
  futureDate.setDate(futureDate.getDate() + index);

  const dayOfWeek = daysOfWeek[futureDate.getDay()];
  const dayOfMonth = futureDate.getDate();
  const month = months[futureDate.getMonth()];

  const dayWeekElement = dateLink.querySelector(".page-nav__day-week");
  const dayNumberElement = dateLink.querySelector(".page-nav__day-number");

  if (dayWeekElement !== null) {
    dayWeekElement.textContent = dayOfWeek;
  } else {
    console.log("Null");
  }

  if (dayNumberElement !== null) {
    dayNumberElement.textContent = dayOfMonth.toString();
  } else {
    console.log("Null");
  }

  if (index === 0) {
    dateLink.classList.add("page-nav__day_today");
  }

  // Выделение красным выходные 
  if (dayOfWeek === "Сб" || dayOfWeek === "Вс") {
    dateLink.classList.add("page-nav__day_weekend");
  } else {
    dateLink.classList.remove("page-nav__day_weekend");
  }

  // Переключение дней 
  dateLink.addEventListener("click", () => {
    // Удаляем класс у всех элементов
    dateLinks.forEach(link => {
      link.classList.remove("page-nav__day_chosen");
    });

    // Добавляем класс только для текущего элемента
    dateLink.classList.add("page-nav__day_chosen");

    // Обновляем выбранную дату после клика
    selectedDate = new Date(futureDate);
  });
});
// ____________________________________________
function fillPageWithData(data) {
  console.log(data);
  const box = document.querySelector('#content-box');
  const films = data.films.result;
  const seances = data.seances.result;
  const halls = data.halls.result;

  films.forEach((film) => {
    const seanceData = seances.filter(seance => seance.seance_filmid === film.film_id);
    const openHalls = halls.filter(hall => hall.hall_open === '1');
    
    if (openHalls.length > '0') {
      const movieSection = createMovieSection(film, seanceData, openHalls, selectedDate);
      if (box !== null) {
        box.appendChild(movieSection);
      } else {
        console.log("Null");
      }
    }
  });
}

function createMovieSection(film, seanceData, openHalls, selectedDate) {
  const movieSection = document.createElement("section");
  movieSection.classList.add("movie");

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie__info");

  const hallsContainer = document.createElement("div");
  hallsContainer.classList.add("movie-seances__hall");

  const moviePoster = document.createElement("div");
  moviePoster.classList.add("movie__poster");

  const moviePosterImage = document.createElement("img");
  moviePosterImage.classList.add("movie__poster-image");
  moviePosterImage.alt = "";
  moviePosterImage.src = film.film_poster;
  moviePoster.appendChild(moviePosterImage);

  const movieDescription = document.createElement("div");
  movieDescription.classList.add("movie__description");

  const movieTitle = document.createElement("h2");
  movieTitle.classList.add("movie__title");
  movieTitle.textContent = film.film_name;

  const movieSynopsis = document.createElement("p");
  movieSynopsis.classList.add("movie__synopsis");
  movieSynopsis.textContent = film.film_description;

  const movieData = document.createElement("p");
  movieData.classList.add("movie__data");

  const movieDuration = document.createElement("span");
  movieDuration.classList.add("movie__data-duration");
  movieDuration.textContent = film.film_duration + " минут";

  const movieOrigin = document.createElement("span");
  movieOrigin.classList.add("movie__data-origin");
  movieOrigin.textContent = film.film_origin;

  movieData.appendChild(movieDuration);
  movieData.appendChild(movieOrigin);

  movieDescription.appendChild(movieTitle);
  movieDescription.appendChild(movieSynopsis);
  movieDescription.appendChild(movieData);

  movieInfo.appendChild(moviePoster);
  movieInfo.appendChild(movieDescription);

  movieSection.appendChild(movieInfo);

  openHalls.forEach((hall) => {
    const hallSeanceData = seanceData.filter(seance => seance.seance_hallid === hall.hall_id);

    if (hallSeanceData.length > 0) {
      const hallDiv = document.createElement("div");
      hallDiv.classList.add("movie-seances__hall");

      const hallTitle = document.createElement("h3");
      hallTitle.classList.add("movie-seances__hall-title");
      hallTitle.textContent = hall.hall_name;

      const seancesList = document.createElement("ul");
      seancesList.classList.add("movie-seances__list");

      hallSeanceData.forEach((seance) => {
        const seanceTimeBlock = document.createElement("li");
        seanceTimeBlock.classList.add("movie-seances__time-block");

  // Получаем timestamp начала дня
  const chosenDayStart = new Date(selectedDate); // Используем selectedDate
  chosenDayStart.setHours(0, 0, 0, 0);
  // парсим время сеанса
  const timeParts = seance.seance_time.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  // Получаем timestamp начала дня сеанса
  const seanceTimeStamp = new Date(chosenDayStart);
  seanceTimeStamp.setHours(hours, minutes, 0, 0);
  const currentTime = Date.now();

  const seanceTimeLink = document.createElement("a");
  seanceTimeLink.classList.add("movie-seances__time");
  seanceTimeLink.href = "hall.html";
  seanceTimeLink.textContent = seance.seance_time;
  seanceTimeLink.dataset.filmId = film.film_id;
  seanceTimeLink.dataset.filmName = film.film_name;
  seanceTimeLink.dataset.hallId = hall.hall_id;
  seanceTimeLink.dataset.hallName = hall.hall_name;
  seanceTimeLink.dataset.priceVip = hall.hall_price_vip;
  seanceTimeLink.dataset.priceStandart = hall.hall_price_standart;
  seanceTimeLink.dataset.seanceId = seance.seance_id;
  seanceTimeLink.dataset.seanceTime = seance.seance_time;
  seanceTimeLink.dataset.seanceStart = seance.seance_start;
  seanceTimeLink.dataset.seanceTimeStamp = seanceTimeStamp.toISOString();

  if (seanceTimeStamp.getTime() <= currentTime) {
    // Сеанс уже начался или прошел
    seanceTimeLink.classList.add("acceptin-button-disabled");
  } else {
    // Сеанс еще не начался, ссылка активна
    seanceTimeLink.href = "hall.html";
  }

        seanceTimeBlock.appendChild(seanceTimeLink);
        seancesList.appendChild(seanceTimeBlock);

        // Обработчик события для каждой ссылки сеанса
        seanceTimeLink.addEventListener("click", (event) => {
          event.preventDefault();

          const selectedSeance = {
            seance_id: seance.seance_id,
            film_id: film.film_id,
            hall_id: hall.hall_id,
            film_name: film.film_name,
            hall_name: hall.hall_name,
            price_vip: hall.hall_price_vip,
            price_standard: hall.hall_price_standart,
            seance_time: seance.seance_time,
            seance_start: seance.seance_start,
            seance_time_stamp: seanceTimeLink.dataset.seanceTimeStamp
          };

          // Сохраняем данные в sessionStorage
          sessionStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));

          // Перенаправляем на страницу "hall.html"
          window.location.href = "hall.html";
        });
      });

      hallDiv.appendChild(hallTitle);
      hallDiv.appendChild(seancesList);
      hallsContainer.appendChild(hallDiv);
    }
  });

  movieSection.appendChild(hallsContainer);

  return movieSection;
}

const requestData = "event=update";
const apiUrl = "https://jscp-diplom.netoserver.ru/";
fetchData(apiUrl, requestData, fillPageWithData);
