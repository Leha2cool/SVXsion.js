# SVXsion.js

# SVXsion.js - Документация

**SVXsion.js** (Simple Vision for X-Site Interactive Operations) - это мощная, но простая в использовании JavaScript-библиотека, специально разработанная для начинающих веб-разработчиков. Она предоставляет интуитивно понятные методы для выполнения самых распространенных задач веб-разработки, значительно ускоряя процесс создания интерактивных сайтов.

## Основные особенности
- Простой синтаксис, понятный новичкам
- Более 80 функций для различных задач
- Встроенные UI-компоненты (модальные окна, уведомления, карусели)
- Кросс-браузерная совместимость
- Поддержка плагинов
- Автоматическая обработка ошибок
- Подробные сообщения об ошибках в режиме отладки

## Подключение библиотеки

Добавьте в ваш HTML-файл перед закрывающим тегом `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/svxsion@2.0.0/dist/svxsion.min.js"></script>
<script>
  // Включение режима отладки
  S.debug(true);
  
  // Проверка подключения
  S.toast('SVXsion.js успешно загружена!', 'success');
</script>
```

## Основные функции

### 1. Работа с DOM

#### Выбор элементов
```javascript
// Выбор первого элемента
const header = S.get('#header');

// Выбор всех элементов
const buttons = S.getAll('.btn');
```

#### Изменение контента
```javascript
S.setText('#title', 'Новый заголовок');
S.setHTML('#content', '<p>Новый контент</p>');
S.append('#list', '<li>Новый элемент</li>');
```

#### Работа с классами и стилями
```javascript
S.addClass('#element', 'active');
S.removeClass('#element', 'disabled');
S.toggleClass('#element', 'hidden');

S.setStyle('#element', {
  color: 'red',
  fontSize: '20px'
});
```

#### Создание элементов
```javascript
const newElement = S.createEl('div', {
  class: 'box',
  text: 'Привет, мир!',
  styles: {
    padding: '10px',
    backgroundColor: '#eee'
  },
  parent: '#container'
});
```

### 2. Работа с событиями
```javascript
// Простое событие
S.on('#btn', 'click', () => {
  alert('Кнопка нажата!');
});

// Одноразовое событие
S.once('#btn-once', 'click', () => {
  console.log('Сработает только один раз');
});

// Делегирование событий
S.delegate('#list', 'click', 'li', (e) => {
  console.log('Клик по элементу списка:', e.target);
});
```

### 3. AJAX и работа с сервером
```javascript
// GET-запрос
S.get('/api/data')
  .then(data => console.log(data));

// POST-запрос
S.post('/api/save', { name: 'John', age: 30 })
  .then(response => S.toast('Данные сохранены!', 'success'));

// Загрузка файла
const fileInput = S.get('#file-input');
S.upload('/api/upload', fileInput.files[0])
  .then(result => console.log(result));
```

### 4. Формы
```javascript
// Сериализация данных формы
const formData = S.serializeForm('#my-form');

// Валидация формы
const rules = {
  email: { type: 'email', required: true },
  password: { min: 6, max: 20 },
  confirmPassword: { match: 'password' }
};

const validation = S.validateForm('#my-form', rules);
if (!validation.isValid) {
  S.toast('Исправьте ошибки в форме', 'error');
}

// Отключение формы
S.disableForm('#my-form');
```

### 5. Анимации
```javascript
// Плавное появление
S.fadeIn('#element');

// Скрытие с анимацией
S.fadeOut('#element');

// Кастомная анимация
S.animate('#box', {
  opacity: 0.5,
  left: '200px'
}, 1000, 'ease-in-out');
```

### 6. Работа с хранилищем
```javascript
// Локальное хранилище
S.store('user', { name: 'Anna', id: 123 });
const user = S.getStore('user');

// Куки
S.setCookie('theme', 'dark', 7);
const theme = S.getCookie('theme');

// Сессионное хранилище
S.session('token', 'abc123xyz');
```

### 7. Утилиты
```javascript
// Генерация случайного числа
const random = S.random(1, 100);

// Форматирование даты
const today = S.formatDate(new Date(), 'dd.MM.yyyy HH:mm');

// Проверка на мобильное устройство
if (S.isMobile()) {
  S.addClass('body', 'mobile');
}

// Копирование текста
S.copy('Текст для копирования')
  .then(() => S.toast('Скопировано!', 'success'));
```

### 8. UI-компоненты

#### Модальное окно
```javascript
S.modal('Заголовок', 'Содержимое модального окна', {
  buttons: [
    { text: 'Отмена', primary: false },
    { text: 'Сохранить', primary: true, onClick: saveData }
  ]
});
```

#### Уведомления
```javascript
S.toast('Операция выполнена успешно!', 'success');
S.toast('Произошла ошибка', 'error', 5000);
```

#### Карусель изображений
```javascript
S.carousel('#gallery', [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg'
], {
  width: '800px',
  height: '400px',
  autoplay: true,
  interval: 3000,
  navigation: true,
  indicators: true
});
```

#### Тултипы
```javascript
S.tooltip('.info-icon', 'Дополнительная информация', 'right');
```

### 9. Работа с URL
```javascript
// Получение параметра URL
const id = S.getUrlParam('id');

// Обновление URL
S.updateUrl('/products', { category: 'electronics', page: 2 });

// Простой роутер
const router = S.router({
  '/': () => showHomePage(),
  '/about': () => showAboutPage(),
  '/contact': () => showContactPage(),
  '*': () => showNotFoundPage()
});

// Навигация
router.navigate('/about');
```

## Система плагинов

SVXsion.js поддерживает расширение функционала через плагины. 

### Использование плагина
```javascript
S.use('myPlugin', (S) => {
  // Инициализация плагина
  return {
    init: () => {
      console.log('Плагин инициализирован');
    },
    customMethod: () => {
      // Кастомная логика
    }
  };
});

// Использование метода плагина
S.plugins.myPlugin.customMethod();
```

### Создание плагина
```javascript
// Пример простого плагина
function clockPlugin(S) {
  let intervalId;
  
  return {
    init: () => {
      console.log('Clock plugin initialized');
    },
    start: (selector, format = 'HH:mm:ss') => {
      intervalId = setInterval(() => {
        S.setText(selector, S.formatDate(new Date(), format));
      }, 1000);
    },
    stop: () => {
      clearInterval(intervalId);
    }
  };
}

// Регистрация плагина
S.use('clock', clockPlugin);

// Использование плагина
S.plugins.clock.start('#clock', 'HH:mm');
```

## Советы и лучшие практики

1. **Цепочки вызовов**: Многие методы возвращают объект S, что позволяет создавать цепочки:
   ```javascript
   S.get('#element')
     .setText('Новый текст')
     .addClass('active')
     .setStyle({ color: 'blue' });
   ```

2. **Обработка ошибок**: Все функции библиотеки защищены от ошибок, но для отладки включите режим отладки:
   ```javascript
   S.debug(true);
   ```

3. **Оптимизация производительности**:
   - Используйте делегирование событий для динамических элементов
   - Применяйте debounce/throttle для ресурсоемких операций
   ```javascript
   const search = S.debounce((query) => {
     // Поисковый запрос
   }, 300);
   ```

4. **Адаптивный дизайн**:
   ```javascript
   if (S.isMobile()) {
     S.addClass('body', 'mobile-view');
   }
   ```

5. **Работа с асинхронными операциями**:
   ```javascript
   async function loadData() {
     try {
       const data = await S.get('/api/data');
       S.setHTML('#content', data.html);
     } catch (error) {
       S.toast('Ошибка загрузки данных', 'error');
     }
   }
   ```

## Примеры использования

### Простой таймер
```javascript
let counter = 0;
S.on('#start-btn', 'click', () => {
  setInterval(() => {
    counter++;
    S.setText('#counter', counter);
  }, 1000);
});
```

### Динамическая загрузка контента
```javascript
S.on('#load-btn', 'click', async () => {
  const data = await S.get('/api/content');
  S.setHTML('#content', data.html);
  S.fadeIn('#content');
});
```

### Валидация и отправка формы
```javascript
S.on('#signup-form', 'submit', async (e) => {
  e.preventDefault();
  
  const rules = {
    email: { type: 'email', required: true },
    password: { min: 8 }
  };
  
  const validation = S.validateForm('#signup-form', rules);
  if (!validation.isValid) return;
  
  S.disableForm('#signup-form');
  
  try {
    const data = S.serializeForm('#signup-form');
    await S.post('/api/signup', data);
    S.toast('Регистрация успешна!', 'success');
  } catch (error) {
    S.toast('Ошибка регистрации', 'error');
  } finally {
    S.enableForm('#signup-form');
  }
});
```

## Заключение

SVXsion.js предоставляет начинающим разработчикам мощный набор инструментов для быстрого создания современных веб-приложений. Библиотека охватывает все основные аспекты веб-разработки - от манипуляций с DOM до работы с сервером и создания UI-компонентов.

Благодаря простому синтаксису и подробным сообщениям об ошибках, SVXsion.js значительно снижает порог вхождения в веб-разработку, позволяя сосредоточиться на реализации функционала, а не на решении технических сложностей.

Для более глубокого изучения всех возможностей библиотеки рекомендуется:
1. Экспериментировать с разными функциями
2. Изучать исходный код библиотеки
3. Создавать собственные плагины для расширения функционала
4. Читать сообщения в консоли в режиме отладки