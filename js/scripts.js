"use strict";
// Функция для отправки POST запроса к API
async function fetchData(url, requestData, callback) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestData,
  });

  if (response.status === 404) {
    throw new Error("Resource not found");
  } else if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return; // Останавливаем выполнение функции
  }

  callback(data);
}

export default fetchData;
