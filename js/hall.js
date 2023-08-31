"use strict";
// Получение сериализованной строки JSON из хранилища сессии
const serializedSeance = sessionStorage.getItem("selectedSeance");

// Разбор JSON-строки для получения объекта данных сеанса
const selectedSeance = JSON.parse(serializedSeance);

// Теперь вы можете использовать объект selectedSeance для отображения данных на странице
console.log(selectedSeance);

