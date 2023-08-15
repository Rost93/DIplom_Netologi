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

// Функция для отправки запроса и получения данных
async function fetchData(url, requestData, callback) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Функция для заполнения страницы данными
function fillPageWithData(data) {
  const halls = data.halls.result;
  const films = data.films.result;
  const seances = data.seances.result;

  //обновление списка залов, фильмов и сеансов

  // обновление списка залов
  const hallList = document.querySelector(".page-nav");
  halls.forEach((hall) => {
    if (hall.hall_open === 1) {
      const hallLink = document.createElement("a");
      hallLink.classList.add("page-nav__day");
      hallLink.href = `hall.html?hallId=${hall.hall_id}`; //ссылка на страницу зала
      hallLink.textContent = hall.hall_name;
      hallList.appendChild(hallLink);
    }
  });

  //обновление списка фильмов и сеансов
  const movieSections = document.querySelectorAll(".movie");
  movieSections.forEach((movieSection, index) => {
    const movieInfo = movieSection.querySelector(".movie__info");
    const movieTitle = movieInfo.querySelector(".movie__title");
    const movieSynopsis = movieInfo.querySelector(".movie__synopsis");
    const movieDuration = movieInfo.querySelector(".movie__data-duration");
    const movieOrigin = movieInfo.querySelector(".movie__data-origin");
    const moviePoster = movieInfo.querySelector(".movie__poster-image");
    const seanceList = movieSection.querySelectorAll(".movie-seances__time");

    const film = films[index];
    const seanceData = seances.filter(
      (seance) => seance.seance_filmid === film.film_id
    );

    movieTitle.textContent = film.film_name;
    movieSynopsis.textContent = film.film_description;
    movieDuration.textContent = `${film.film_duration} минут`;
    movieOrigin.textContent = film.film_origin;
    moviePoster.src = film.film_poster;
    // Фильтрация прошедших сеансов и обновление списка времен начала сеансов
    const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
    seanceData.forEach((seance, index) => {
      if (seance.seance_start >= currentTime) {
        seanceList[index].textContent = seance.seance_time;
        seanceList[index].href = "hall.html"; // ссылка на страницу сеанса
      }
    });
  });
}

const seanceTimes = document.querySelectorAll(".movie-seances__time");
seanceTimes.forEach(seanceTime => {
  seanceTime.addEventListener("click", async function(event) {
    event.preventDefault();

    const selectedSeanceTime = this.textContent;
    const selectedHallElement = this.closest(".movie-seances__hall");
    const selectedHallName = selectedHallElement.querySelector(".movie-seances__hall-title").textContent;

    // Запрос на получение актуальных данных о схеме зала
    const requestDataHall = `event=get_hallConfig&timestamp=${selectedSeanceTime}&hallId=${selectedHallName}`;

    // URL для запроса
    const apiUrlHall = "https://jscp-diplom.netoserver.ru/";

    try {
      // ... остальной код остается без изменений ...
    } catch (error) {
      console.error("Error fetching hall config:", error);
    }
  });
});

// Параметры для запроса
const requestData = "event=update";

// URL для запроса
const apiUrl = "https://jscp-diplom.netoserver.ru/"; 

// Вызов функции отправки запроса и заполнения страницы данными
fetchData(apiUrl, requestData, fillPageWithData);
