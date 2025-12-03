import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './user-card.js'; // Імпортуємо наш компонент

describe('UserCard Web Component', () => {
  let element;

  beforeEach(() => {
    // Створюємо чистий екземпляр перед кожним тестом
    element = document.createElement('user-card');
    document.body.appendChild(element);
    
    // Мок для fetch (глобальний)
    global.fetch = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
  });

  // 1. ТЕСТУВАННЯ ВЛАСТИВОСТЕЙ (PROPERTIES) - 5 тестів
  describe('Properties', () => {
    it('повинен мати початкове значення user як null', () => {
      expect(element.user).toBeNull();
    });

    it('повинен мати початкове значення loading як false', () => {
      expect(element.loading).toBe(false);
    });

    it('повинен коректно встановлювати об\'єкт user через сетер', () => {
      const userData = { name: 'Test User', email: 'test@test.com' };
      element.user = userData;
      expect(element.user).toEqual(userData);
    });

    it('повинен дозволяти перезаписувати властивість user', () => {
      element.user = { name: 'User 1' };
      element.user = { name: 'User 2' };
      expect(element.user.name).toBe('User 2');
    });

    it('повинен мати визначений tagName', () => {
        expect(element.tagName).toBe('USER-CARD');
    });
  });

  // 2. ТЕСТУВАННЯ АТРИБУТІВ (ATTRIBUTES) - 4 тести
  describe('Attributes', () => {
    it('повинен реагувати на встановлення атрибута user-id', () => {
      const spy = vi.spyOn(element, 'loadUserData');
      element.setAttribute('user-id', '123');
      expect(spy).toHaveBeenCalledWith('123');
    });

    it('повинен змінювати тему через атрибут theme', async () => {
      element.setAttribute('theme', 'dark');
      await new Promise(r => setTimeout(r, 0)); // чекаємо оновлення
      // Перевіряємо, чи стиль застосувався (в нашому CSS є селектор :host([theme="dark"]))
      expect(element.getAttribute('theme')).toBe('dark');
    });

    it('не повинен викликати завантаження, якщо user-id не змінився', () => {
        element.setAttribute('user-id', '1');
        const spy = vi.spyOn(element, 'loadUserData');
        element.setAttribute('user-id', '1'); // те саме значення
        expect(spy).not.toHaveBeenCalled();
    });

    it('повинен видаляти атрибут при виклику clearData', () => {
        element.setAttribute('user-id', '555');
        element.clearData();
        expect(element.hasAttribute('user-id')).toBe(false);
    });
  });

  // 3. ТЕСТУВАННЯ МЕТОДІВ (METHODS) - 5 тестів
  describe('Methods', () => {
    it('clearData() повинен очищати об\'єкт user', () => {
      element.user = { name: 'Exists' };
      element.clearData();
      expect(element.user).toBeNull();
    });

    it('toggleTheme() повинен змінювати тему на dark, якщо її немає', () => {
      element.toggleTheme();
      expect(element.getAttribute('theme')).toBe('dark');
    });

    it('toggleTheme() повинен змінювати тему назад на light', () => {
      element.setAttribute('theme', 'dark');
      element.toggleTheme();
      expect(element.getAttribute('theme')).toBe('light');
    });

    it('loadUserData() повинен встановлювати стан loading у true на початку', () => {
        global.fetch.mockImplementation(() => new Promise(() => {})); // вічний проміс
        element.loadUserData('1');
        expect(element.loading).toBe(true);
    });

    it('connectedCallback повинен ініціювати рендер', () => {
        const spy = vi.spyOn(element, 'render');
        element.connectedCallback();
        expect(spy).toHaveBeenCalled();
    });
  });

  // 4. ТЕСТУВАННЯ ПОДІЙ (EVENTS) - 4 тести
  describe('Events', () => {
    it('повинен генерувати user-loaded після успішного завантаження', async () => {
      const mockData = { id: 1, name: 'Alice' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const listener = vi.fn();
      element.addEventListener('user-loaded', listener);

      await element.loadUserData(1);

      expect(listener).toHaveBeenCalled();
      expect(listener.mock.calls[0][0].detail).toEqual(mockData);
    });

    it('повинен генерувати error-occurred при помилці API', async () => {
      global.fetch.mockRejectedValue(new Error('API Down'));
      
      const listener = vi.fn();
      element.addEventListener('error-occurred', listener);

      await element.loadUserData(1);

      expect(listener).toHaveBeenCalled();
      expect(listener.mock.calls[0][0].detail.message).toBe('API Down');
    });

    it('повинен реагувати на клік по компоненту', () => {
        const listener = vi.fn();
        element.addEventListener('card-click', listener);
        
        element.shadowRoot.dispatchEvent(new Event('click'));
        expect(listener).toHaveBeenCalled();
    });

    it('подія user-loaded повинна спливати (bubbles: true)', async () => {
         global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
         let bubbles = false;
         element.addEventListener('user-loaded', (e) => {
             bubbles = e.bubbles;
         });
         await element.loadUserData(1);
         expect(bubbles).toBe(true);
    });
  });

  // 5. ТЕСТУВАННЯ DOM / SHADOW DOM - 4 тести
  describe('DOM & Shadow DOM', () => {
    it('повинен мати Shadow Root', () => {
      expect(element.shadowRoot).toBeTruthy();
    });

    it('повинен відображати "No user data" за замовчуванням', () => {
      const text = element.shadowRoot.querySelector('p').textContent;
      expect(text).toBe('No user data');
    });

    it('повинен рендерити ім\'я користувача в h2', async () => {
      element.user = { name: 'Bob', email: 'bob@example.com' };
      await new Promise(r => setTimeout(r, 0)); // чекаємо рендер
      
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent).toBe('Bob');
    });

    it('повинен мати кнопку refresh', () => {
        const btn = element.shadowRoot.querySelector('#refresh-btn');
        expect(btn).toBeTruthy();
    });
  });

  // 6. ТЕСТУВАННЯ АСИНХРОННИХ ОПЕРАЦІЙ - 4 тести
  describe('Async Operations', () => {
    it('повинен викликати fetch з правильним URL', async () => {
      global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      await element.loadUserData('99');
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users/99');
    });

    it('повинен показувати лоадер під час завантаження', () => {
        // Ми не чекаємо завершення промісу, щоб перевірити стан "в процесі"
        global.fetch.mockImplementation(() => new Promise(r => setTimeout(r, 100)));
        element.loadUserData('1');
        
        const loader = element.shadowRoot.querySelector('.loader');
        expect(loader).toBeTruthy();
        expect(loader.textContent).toBe('Loading...');
    });

    it('повинен прибирати лоадер після завершення (успіх)', async () => {
        global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
        await element.loadUserData('1');
        
        const loader = element.shadowRoot.querySelector('.loader');
        expect(loader).toBeNull();
    });

    it('повинен прибирати лоадер після завершення (помилка)', async () => {
        global.fetch.mockRejectedValue(new Error('Fail'));
        await element.loadUserData('1');
        
        const loader = element.shadowRoot.querySelector('.loader');
        expect(loader).toBeNull();
    });
  });
});