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
  });
});
// ____________________________________________
function fillPageWithData(data) {
  console.log(data);
  const box = document.querySelector('#template-box');
  const films = data.films.result;
  const seances = data.seances.result;
  const halls = data.halls.result;

  films.forEach((film) => {
    const seanceData = seances.filter(seance => seance.seance_filmid === film.film_id);
    const movieSection = createMovieSection(film, seanceData, halls);
    box.appendChild(movieSection);
  });
}

function createMovieSection(film, seanceData, halls) {
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

    // Добавляем контейнер "movie__info" в общий контейнер "movieSection"
    movieSection.appendChild(movieInfo);

  seanceData.forEach((seance) => {
    const hall = halls.find(h => h.hall_id === seance.seance_hallid);

    const hallDiv = document.createElement("div");
    hallDiv.classList.add("movie-seances__hall");

    const hallTitle = document.createElement("h3");
    hallTitle.classList.add("movie-seances__hall-title");
    hallTitle.textContent = hall.hall_name;

    const seancesList = document.createElement("ul");
    seancesList.classList.add("movie-seances__list");

    const seanceTimeBlock = document.createElement("li");
    seanceTimeBlock.classList.add("movie-seances__time-block");

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
    seanceTimeLink.dataset.seanceTimeStamp = seance.seanceTimeStamp;

// Получаем timestamp начала дня
const chosenDayStart = new Date();
chosenDayStart.setHours(0, 0, 0, 0);
// парсим время сеанса
const timeParts = seance.seance_time.split(":");
const hours = parseInt(timeParts[0], 10);
const minutes = parseInt(timeParts[1], 10);
const seanceStartTimeInMinutes = hours * 60 + minutes;
const seanceTimestamp = chosenDayStart.getTime() + seanceStartTimeInMinutes * 60 * 1000;
const currentTime = Date.now();

if (seanceTimestamp > currentTime) {
  seanceTimeLink.href = "hall.html";
} else {
  seanceTimeLink.classList.add("acceptin-button-disabled");
}

    seanceTimeBlock.appendChild(seanceTimeLink);
    seancesList.appendChild(seanceTimeBlock);

    hallDiv.appendChild(hallTitle);
    hallDiv.appendChild(seancesList);

    hallsContainer.appendChild(hallDiv);

    // Добавляем обработчик события на клик по ссылке сеанса
seanceTimeLink.addEventListener("click", () => {
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
    seance_time_stamp: seance.seanceTimeStamp
  };

  sessionStorage.setItem("selectedSeance", JSON.stringify(selectedSeance));
});
  });

  movieSection.appendChild(hallsContainer);

  return movieSection;
}


const requestData = "event=update";
const apiUrl = "https://jscp-diplom.netoserver.ru/";
fetchData(apiUrl, requestData, fillPageWithData);