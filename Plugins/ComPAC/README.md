# ComPAC.js - Плагин для SVXsion.js

**ComPAC** (Common Patterns And Components) - это мощный плагин, расширяющий функциональность библиотеки SVXsion.js 40+ новыми функциями и шаблонами, специально разработанными для упрощения веб-разработки новичкам.

## Основные возможности плагина

- **Утилиты и вспомогательные функции**: Генерация случайных цветов, форматирование чисел, работа с объектами и массивами
- **Работа с датами**: Операции с датами, форматирование продолжительности, расчет возраста
- **Формы и валидация**: Очистка форм, отображение ошибок, расширенные валидации
- **UI компоненты**: Аккордеоны, табы, выпадающие меню, переключатели, рейтинги
- **Шаблоны страниц**: Готовые шаблоны для страницы входа, карточек товаров, галереи
- **Анимации и эффекты**: Параллакс, эффекты при наведении, печатная машинка
- **Работа с данными**: Загрузка JSON, фильтрация, поиск, пагинация
- **Работа с медиа**: Предпросмотр изображений, аудиоплеер

## Установка

```html
<!-- Подключение SVXsion.js -->
<script src="https://cdn.jsdelivr.net/gh/Leha2cool/SVXsion.js@main/code/SVXsion.js"></script>

<!-- Подключение плагина ComPAC.js -->
<script src="https://cdn.jsdelivr.net/gh/Leha2cool/SVXsion.js@main/Plugins/ComPAC/ComPAC.js"></script>
```

## Инициализация

```javascript
// Включение режима отладки
S.debug(true);

// Инициализация плагина
S.plugins.ComPAC.init();
```

## Документация по функциям

### 1. Утилиты

#### `randomColor(opacity = 1)`
Генерирует случайный цвет в формате RGBA
```javascript
const color = S.plugins.ComPAC.randomColor(0.8);
S.setStyle('body', { backgroundColor: color });
```

#### `formatNumber(num, decimals = 2)`
Форматирует число с разделителями
```javascript
const formatted = S.plugins.ComPAC.formatNumber(12345.6789); // "12,345.68"
```

#### `deepCopy(obj)`
Создает глубокую копию объекта
```javascript
const original = { a: 1, b: { c: 2 } };
const copy = S.plugins.ComPAC.deepCopy(original);
```

#### `uniqueId(prefix = 'id')`
Генерирует уникальный идентификатор
```javascript
const id = S.plugins.ComPAC.uniqueId('user'); // "user-123456789"
```

### 2. Работа с датами

#### `addDays(date, days)`
Добавляет дни к дате
```javascript
const nextWeek = S.plugins.ComPAC.addDays(new Date(), 7);
```

#### `calculateAge(birthDate)`
Рассчитывает возраст по дате рождения
```javascript
const age = S.plugins.ComPAC.calculateAge(new Date(1990, 0, 1));
```

### 3. Формы и валидация

#### `clearForm(formSelector)`
Очищает все поля формы
```javascript
S.plugins.ComPAC.clearForm('#signup-form');
```

#### `validateEmail(email)`
Проверяет валидность email
```javascript
if (!S.plugins.ComPAC.validateEmail(email)) {
  S.toast('Некорректный email', 'error');
}
```

### 4. UI компоненты

#### `accordion(containerSelector, options)`
Создает аккордеон
```html
<div class="accordion-container">
  <div class="accordion-item">
    <div class="accordion-header">Раздел 1</div>
    <div class="accordion-content">Содержимое 1</div>
  </div>
  <div class="accordion-item">
    <div class="accordion-header">Раздел 2</div>
    <div class="accordion-content">Содержимое 2</div>
  </div>
</div>
```
```javascript
S.plugins.ComPAC.accordion('.accordion-container', {
  multiple: true,
  activeClass: 'open'
});
```

#### `starRating(containerSelector, options)`
Создает рейтинг звездами
```html
<div class="rating-container">
  <span class="star">★</span>
  <span class="star">★</span>
  <span class="star">★</span>
  <span class="star">★</span>
  <span class="star">★</span>
</div>
```
```javascript
S.plugins.ComPAC.starRating('.rating-container', {
  onChange: rating => console.log('Выбран рейтинг:', rating)
});
```

### 5. Шаблоны

#### `loginPageTemplate()`
Возвращает HTML шаблона страницы входа
```javascript
S.setHTML('#app', S.plugins.ComPAC.loginPageTemplate());
```

#### `productCardTemplate(product)`
Генерирует HTML карточки товара
```javascript
const product = {
  id: 1,
  name: "Ноутбук",
  price: 89990,
  oldPrice: 99990,
  discount: 10,
  image: "laptop.jpg",
  rating: 4,
  reviews: 24
};

const cardHTML = S.plugins.ComPAC.productCardTemplate(product);
S.append('#products', cardHTML);
```

### 6. Анимации

#### `parallax(selector, options)`
Создает параллакс-эффект
```javascript
S.plugins.ComPAC.parallax('.parallax-section', {
  speed: 0.5
});
```

#### `typewriter(selector, text, options)`
Эффект печатной машинки
```javascript
S.plugins.ComPAC.typewriter('#title', 'Добро пожаловать!', {
  speed: 100,
  pause: 2000,
  loop: true
});
```

### 7. Работа с данными

#### `loadJSON(url, containerSelector, templateFunction)`
Загружает и отображает JSON данные
```javascript
S.plugins.ComPAC.loadJSON(
  '/api/products',
  '#products-container',
  S.plugins.ComPAC.productCardTemplate
);
```

#### `paginateData(data, currentPage, perPage)`
Разбивает данные на страницы
```javascript
const currentPage = 1;
const perPage = 10;
const paginated = S.plugins.ComPAC.paginateData(products, currentPage, perPage);
```

### 8. Работа с медиа

#### `imagePreview(inputSelector, previewSelector)`
Предпросмотр изображения перед загрузкой
```html
<input type="file" id="avatar-input">
<img id="avatar-preview" style="display: none;">
```
```javascript
S.plugins.ComPAC.imagePreview('#avatar-input', '#avatar-preview');
```

#### `audioPlayer(containerSelector, tracks)`
Создает аудиоплеер
```javascript
S.plugins.ComPAC.audioPlayer('#player', [
  { title: 'Трек 1', src: 'track1.mp3' },
  { title: 'Трек 2', src: 'track2.mp3' }
]);
```

## Примеры использования

### Создание страницы с товарами
```javascript
// Загрузка товаров и отображение
S.plugins.ComPAC.loadJSON(
  '/api/products',
  '#products-container',
  S.plugins.ComPAC.productCardTemplate
);

// Добавление пагинации
const pagination = S.plugins.ComPAC.paginationTemplate(1, 5);
S.append('#products-container', pagination);

// Инициализация рейтинга
S.plugins.ComPAC.starRating('.rating');
```

### Реализация формы регистрации
```javascript
// Установка шаблона
S.setHTML('#app', S.plugins.ComPAC.loginPageTemplate());

// Обработка отправки формы
S.on('#login-form', 'submit', e => {
  e.preventDefault();
  
  const email = S.get('#email').value;
  const password = S.get('#password').value;
  
  if (!S.plugins.ComPAC.validateEmail(email)) {
    S.plugins.ComPAC.showFormErrors({ email: 'Некорректный email' });
    return;
  }
  
  if (!S.plugins.ComPAC.validatePassword(password)) {
    S.plugins.ComPAC.showFormErrors({ password: 'Пароль должен содержать минимум 8 символов, включая цифры и буквы' });
    return;
  }
  
  // Отправка данных на сервер
  S.post('/api/login', { email, password })
    .then(response => {
      S.toast('Вход выполнен успешно!', 'success');
    })
    .catch(error => {
      S.toast('Ошибка входа', 'error');
    });
});
```

### Создание галереи изображений
```javascript
const images = [
  { url: 'image1.jpg', alt: 'Пейзаж 1', caption: 'Горы' },
  { url: 'image2.jpg', alt: 'Пейзаж 2', caption: 'Озеро' },
  { url: 'image3.jpg', alt: 'Пейзаж 3' }
];

const galleryHTML = S.plugins.ComPAC.imageGalleryTemplate(images, {
  columns: 4,
  gap: '15px'
});

S.setHTML('#gallery-container', galleryHTML);
```

## Преимущества для новичков

1. **Упрощение сложных задач**: Сложные операции выполняются одной функцией
2. **Готовые решения**: Шаблоны для типовых страниц и компонентов
3. **Экономия времени**: Не нужно писать повторяющийся код
4. **Уменьшение ошибок**: Встроенные валидации и обработка ошибок
5. **Быстрое прототипирование**: Создание работающих прототипов за минуты
6. **Единый стиль кода**: Последовательный API для всех операций

## Расширение функционала

Вы можете легко расширять функционал плагина, добавляя свои функции:

```javascript
S.plugins.ComPAC.customFunction = function() {
  // Ваша кастомная логика
  console.log('Кастомная функция плагина');
};

// Использование
S.plugins.ComPAC.customFunction();
```

## Заключение

ComPAC.js - это незаменимый инструмент для начинающих веб-разработчиков, использующих библиотеку SVXsion.js. С его помощью вы сможете:

- Создавать сложные интерфейсы с минимальными усилиями
- Использовать готовые решения для типовых задач
- Сократить время разработки в 2-3 раза
- Избежать распространенных ошибок
- Сосредоточиться на логике приложения, а не на рутинных операциях

Плагин полностью бесплатен и распространяется под лицензией MIT. Присоединяйтесь к сообществу разработчиков SVXsion.js и ComPAC.js для обмена опытом и решениями!
