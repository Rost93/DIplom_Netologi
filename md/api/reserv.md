# Заказ билета

Добавление информации о забронированных билетах в базу данных 

## Параметры
В качестве тела POST запроса передайте строку вида `event=sale_add&timestamp=${value1}&hallId=${value2}&seanceId=${value3}&hallConfiguration=${value4}`
Где
* `timestamp` - начало сеанса  с учетом даты. Значение указывается в ***секундах***. Подробнее про timestemp можно прочитать [тут](https://projectpulse.ru/blog/all/timestamp-in-vanilla-javascript)
* `hallId` - ID зала
* `seanceId` - ID сеанса
* `hallConfiguration` - Строка - ***html разметка*** которую следует взять со страницы `hall.html` внутри контейнера с классом `conf-step__wrapper`(см разметку).
