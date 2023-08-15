# API сервиса

### Базовый URL АПИ:
[https://jscp-diplom.netoserver.ru/](https://jscp-diplom.netoserver.ru/)

### Ответы API
Ответы API  приходят в формате JSON
Чтобы распарсить ответ используйте функцию [JSON.parse()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

### Запросы к API

При отправке запросов используйте следующие параметры:

* ***Адрес (URL)*** - `https://jscp-diplom.netoserver.ru/`
* ***Метод (Method)*** - `POST`
*  ***HTTP заголовок (HttpRequest)***

|Название заголовка | Значение заголовка |
|--|--|
| `Content-Type` | `application/x-www-form-urlencoded`  |

### Основные функции API

1.  [Получение списков всех Залов Кинофильмов и Сеансов](api/getlist.md)
2.  [Получение актуальной схемы посадочных мест на выбранный сеанс](api/getconfig.md)
3.  [Заказ билета](api/reserv.md)
