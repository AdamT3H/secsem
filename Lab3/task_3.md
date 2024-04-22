<!-- # Task

## 1

Create API for returning last 5 unique address for "from" point. In orders new order will be pushed in the end of array.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

```
GET http://localhost:8080/address/from/last-5
headers: { authorization: <user token> }
```

Response structure
```
string[]
```

In the case if db orders will be have next docs:
```
[
 { from: "address-1", to: "address-2", login: "user-1" },
 { from: "address-2", to: "address-3", login: "user-1" },
 { from: "address-3", to: "address-4", login: "user-1" },
 { from: "address-3", to: "address-5", login: "user-1" },
 { from: "address-5", to: "address-2", login: "user-1" },
 { from: "address-4", to: "address-1", login: "user-1" },
 { from: "address-2", to: "address-1", login: "user-1" },
]
```

Response example
```
[
 "address-4",
 "address-5",
 "address-3",
 "address-2",
 "address-1",
]
``` -->

<!-- ## 2

Create API for returning last 3 unique address for "to" point. In orders new order will be pushed in the end of array.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

```
GET http://localhost:8080/address/to/last-3
headers: { authorization: <user token> }
```

Response structure
```
string[]
```

In the case if db orders will be have next docs:
```
[
 { from: "address-1", to: "address-2", login: "user-1" },
 { from: "address-2", to: "address-3", login: "user-1" },
 { from: "address-3", to: "address-4", login: "user-1" },
 { from: "address-3", to: "address-5", login: "user-1" },
 { from: "address-5", to: "address-2", login: "user-1" },
 { from: "address-4", to: "address-1", login: "user-1" },
 { from: "address-2", to: "address-1", login: "user-1" },
]
```

Response example
```
[
 "address-1",
 "address-2",
 "address-5",
]
``` -->

<!-- ## 3

Update API for creating orders. We need to add field price, and price will be random value from 20 to 100.

```
POST http://localhost:8080/orders
headers: { authorization: <user token> }
body: { "from": string, "to": string }
```

Response example
```
{
 message: 'Order was created',
 order: {
  login,
  from,
  to,
  price
 }
}
``` -->

<!-- ## 4

Create API forto get lowest order by price.

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

In the case when user do not have any orders
* return message: "User do not have orders yet"
* return status code: 404

```
GET http://localhost:8080/orders/lowest
headers: { authorization: <user token> }
```

Response example
```
{
  login: string,
  from: string,
  to: string,
  price: number
}
``` -->

<!-- ## 5

Create API forto get biggest order by price 

In the case when user was not found
* return error message: "User was not found by token: <token>"
* return status code: 400

In the case when user do not have any orders
* return message: "User do not have orders yet"
* return status code: 404

```
GET http://localhost:8080/orders/biggest
headers: { authorization: <user token> }
```

Response example
```
{
  login: string,
  from: string,
  to: string,
  price: number
}
``` -->



<!-- **********************## 1

Перенести наступні роути з index.js в окремий файл routers/users.router.js
* POST '/users'
* GET '/users'
* POST '/login'

і підключити їх до сервера********************** -->

<!-- ## 2

Створити нову таблицю в БД під назвою addresses. Яка буде в собі зберігати інформацію про адресу і її гео локацію (дані для цієї таблиці будуть у файлі db_addresses.json). -->

<!-- ## 3

Payload (body) яке ми надсилаємо на створення замовлення тепер буде виглядати таким чином:
```
{ from: string, to: string, type: string } -->
```

<!-- ### 3.a
Оновити логіку створення замовлення таким чином, що якщо значення полів from або to не є доступні у таблиці addresses, то видавати помилку. -->

<!-- ### 3.b
Оновити логіку створення замовлення таким чином, що б користувачу у відповідь надсилавс не тільки стоврене замовлення, але і поле distance яке вираховуються на основі координат і повертається у форматі кілометрів -->
ЗАПИТАТИ ПРО ПЕРЕДАЧУ ЛОНГІТЮД ТА АТІТЮД


<!-- ### 3.b
Оновити логіку створення замовлення таким чином, що б ціна замовлення вираховувалась за такими формулами:
* якщо type має значення "standard", то ціна за кілометраж distance * 2.5
* якщо type має значення "lite", то ціна за кілометраж distance * 1.5
* якщо type має значення "universal", то ціна за кілометраж distance * 3

У всіх інших випадках, якщо переданий type не співпадає з описаними правилами, то повертати відповідну помилку -->

<!-- ## 4

Тепер в користувачів нашої системи буде можливість присвоювати ролі. Список доступних ролей:
* Customer
* Driver
* Admin -->

<!-- ### 4.a

Оновити логіку роботи роута реєстрації. Тепер будь який користувач, який зареєструється з використанням цього роута, буде мати роль "Customer" -->

### 4.b

Створити новий роут
```
POST /admin
headers: { authorization: SUPER_PASSWORD }
body { login: string, password: string }
```

Цей роут стоврює користувачів, з ролю "Admin"

<!-- ### 4.с

Створити новий роут
```
POST /drivers
body { login: string, password: string }
```

Цей роут стоврює користувачів, з ролю "Driver" -->


<!-- ## 5

Оновити логіку роботи АПІ роути для отримання списку замовлень.

> Для ролі "Customer" реалізації не міняється. Цей роут повертає список всіх замовлень які належать цьому користувачу

фільтруємо юзерів
фільтруємо по ролі
забираєм пасворд
виводимо користувачу -->

<!-- ### 5.a

Для користувачів з ролю "Driver", необхідно повертати всі замовлення, які мають поле status: "Active". -->

<!-- ### 5.b

Для користувачів з ролю "Admin", необхідно повертати всі замовлення -->

<!-- ## 6

Оновити логіку роботи АПІ
PATCH /orders/:orderId
Таким чином, що б можна було міняти статус замовлення -->

<!-- ### 6.a

Якщо access token (authorization) належить користувачу з ролю Customer, то довзолити міняти статус тільки в тому випадку, якщо поточний статус є Active, а передане значення є Rejected -->

<!-- ### 6.b

Якщо access token (authorization) належить користувачу з ролю Driver, то довзолити міняти статус тільки в тому випадку:
* якщо поточний статус є Active, а передане значення є "In progress"
* якщо поточний статус є "In progress", а передане значення є "Done" -->

### 6.c

Якщо access token (authorization) належить користувачу з ролю Admin, то довзолити міняти статус тільки в тому випадку:
* якщо поточний статус є Active, а передане значення є "Rejected"
* якщо поточний статус є Active, а передане значення є "In progress"
* якщо поточний статус є "In progress", а передане значення є "Done"

### 6.d

Не дозволяти в жодному випадку міняти статус замовлення з "Done" на будь який інший статус