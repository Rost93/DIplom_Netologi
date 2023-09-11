"use strict";
// Дождемся загрузки всего HTML-документа перед выполнением скрипта
document.addEventListener("DOMContentLoaded", () => {

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

    <div id="qrcode" class="ticket__info-qr"></div>

    <p class="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
    <p class="ticket__hint">Приятного просмотра!</p>
  `;
// Вставляем сгенерированный HTML в контейнер
  ticketInfoWrapper.insertAdjacentHTML("beforeend", textHtml);
// Генерируем текст для QR-кода, содержащий информацию о билете
  const qrText = `
    Фильм: ${ticketDetails.filmName}
    Зал: ${ticketDetails.hallNameNumber}
    Ряд/место: ${ticketDetails.strRowPlace}
    Дата: ${ticketDetails.seanceDay}
    Начало сеанса: ${ticketDetails.seanceTime}

    Билет действителен строго на свой сеанс
    `;
// Создаем QR-код с заданными параметрами
  const qrcode1 = QRCreator(qrText, {
    mode: 4,
    eccl: 0,
    version: -1,
    mask: -1,
    image: "png",
    modsize: 3,
    margin: 4,
  });
// Функция для получения содержимого QR-кода (ошибки или результат)
  const content = (qrcode) => {
    return qrcode.error
      ? `недопустимые исходные данные ${qrcode.error}`
      : qrcode.result;
  };

// Вставляем QR-код в контейнер
  document.getElementById("qrcode").append("", content(qrcode1));
});