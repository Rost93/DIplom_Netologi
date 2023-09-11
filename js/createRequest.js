"use strict";

// Функция для создания HTTP-запроса на сервер
function createRequest(requestBodyString, requestSourceString = "", callback, uploadInfoIsNeed = false) {
  const xhr = new XMLHttpRequest(); // Создаем объект XMLHttpRequest

  xhr.open("POST", "https://jscp-diplom.netoserver.ru/"); // Устанавливаем метод и URL для запроса
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 

  xhr.send(requestBodyString); // Отправляем тело запроса на сервер


  if (uploadInfoIsNeed) {
// Если требуется информация о загрузке
    xhr.upload.onprogress = function (event) {
      console.log(`Отправка данных... Отправлено ${event.loaded} из ${event.total} байт`);
    };

    xhr.upload.onerror = function () {
      console.log("Произошла ошибка при загрузке данных на сервер!");
    };
  }


  xhr.onload = function () {
// Обработчик события при успешном завершении запроса
    if (xhr.status != 200) {
      alert("Ошибка: " + xhr.status);
      return;
    }

    console.log(`${requestSourceString} - статус запроса: ${xhr.status} (${xhr.statusText})`);
    callback(xhr.response); // Вызываем функцию обратного вызова и передаем ей ответ сервера
  };

  xhr.onerror = function () {
// Обработчик события при ошибке запроса
    alert("Запрос не удался");
  };
}

// Функция для сохранения данных в sessionStorage
function setItem(key, value) {
  try {
    return window.sessionStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
}

// Функция для получения данных из sessionStorage
function getItem(key, value) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
}

// Функция для сохранения объектов в sessionStorage в виде JSON
function setJSON(key, value) {
  try {
    const json = JSON.stringify(value);
    setItem(key, json); // Вызываем функцию setItem для сохранения JSON-строки в sessionStorage

  } catch (e) {
    console.error(e);
  }
}

// Функция для получения объектов из sessionStorage в виде JSON
function getJSON(key) {
  try {
    const json = getItem(key);
    return JSON.parse(json); // Преобразуем JSON-строку обратно в объект

  } catch (e) {
    console.error(e);
  }
}
