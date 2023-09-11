"use strict";
// Дождемся загрузки всего HTML-документа перед выполнением скрипта
document.addEventListener("DOMContentLoaded", () => {
// Получаем данные о билете из хранилища
  const ticketDetails = getJSON("ticket-details");
// Находим контейнер для информации о билете
  const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
  ticketInfoWrapper.innerHTML = "";
// Генерируем HTML-разметку для информации о билете и добавляем ее в контейнер
  const textHtml = `
      <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">${ticketDetails.filmName}</span></p>
      <p class="ticket__info">Ряд/Место: <span class="ticket__details ticket__chairs">${ticketDetails.strRowPlace}</span></p>
      <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">${ticketDetails.hallNameNumber}</span></p>
      <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">${ticketDetails.seanceTime} - ${ticketDetails.seanceDay}</span></p>
      <p class="ticket__info">Стоимость: <span class="ticket__details ticket__cost">${ticketDetails.totalCost}</span> рублей</p>
      <button class="acceptin-button">Получить код бронирования</button>
      <p class="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</p>
      <p class="ticket__hint">Приятного просмотра!</p>
    `;
  ticketInfoWrapper.insertAdjacentHTML("beforeend", textHtml);
// Находим кнопку "Получить код бронирования"
  const acceptinButton = document.querySelector(".acceptin-button");
  acceptinButton?.addEventListener("click", (event) => {

// Получаем объект с информацией о зале и его конфигурации
    const hallsConfigurationObj = getJSON("pre-config-halls-paid-seats"); // из JSON в объект
    const hallConfiguration = hallsConfigurationObj[ticketDetails.hallId];

// Формируем строку запроса для создания заказа на оплату
    const requestBodyString = `event=sale_add&timestamp=${ticketDetails.seanceTimeStampInSec}&hallId=${ticketDetails.hallId}&seanceId=${ticketDetails.seanceId}&hallConfiguration=${hallConfiguration}`;
// Отправляем запрос на сервер для оплаты и обновления информации
    createRequest(requestBodyString, "PAYMENT", updateHtmlPayment, true);
  });
// Функция для обновления информации после оплаты
  function updateHtmlPayment(serverResponse) {
// Перенаправляем пользователя на страницу с билетом
    window.location.href = "ticket.html";
  }
});