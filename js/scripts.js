"use strict";
// Функция для отправки POST запроса к API
function fetchApiData(callback) {
  const url = "https://jscp-diplom.netoserver.ru/";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "event=update",
  };

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then(callback)
    .catch((error) => console.error("Error fetching data:", error));
}

export default fetchApiData;