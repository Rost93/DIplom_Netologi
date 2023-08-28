async function fetchData(url, requestData, callback) {
  try {
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

    if (typeof callback === 'function') {
      callback(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default fetchData;