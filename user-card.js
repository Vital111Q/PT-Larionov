// user-card.js
export class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._user = null;
    this._loading = false;
  }

  static get observedAttributes() {
    return ['user-id', 'theme'];
  }

  // Properties
  get user() { return this._user; }
  set user(val) { 
    this._user = val; 
    this.render(); 
  }

  get loading() { return this._loading; }

  // Attribute Changed Callback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'user-id' && newValue) {
        this.loadUserData(newValue);
      }
      this.render();
    }
  }

  // Method: Load Data (Async)
  async loadUserData(id) {
    this._loading = true;
    this.render();
    
    try {
      const response = await fetch(`https://api.example.com/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      this.user = data;
      
      // Dispatch Event
      this.dispatchEvent(new CustomEvent('user-loaded', {
        detail: { id: data.id, name: data.name },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent('error-occurred', {
        detail: { message: error.message }
      }));
    } finally {
      this._loading = false;
      this.render();
    }
  }

  // Method: Clear
  clearData() {
    this._user = null;
    this.removeAttribute('user-id');
    this.render();
  }

  // Method: Toggle Theme
  toggleTheme() {
    const current = this.getAttribute('theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setAttribute('theme', newTheme);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener('click', () => {
        this.dispatchEvent(new Event('card-click'));
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; border: 1px solid #ccc; padding: 10px; }
        :host([theme="dark"]) { background: #333; color: #fff; }
        .loader { color: blue; }
      </style>
      <div class="card">
        ${this._loading ? '<span class="loader">Loading...</span>' : ''}
        ${this._user ? `<h2>${this._user.name}</h2><p>${this._user.email}</p>` : '<p>No user data</p>'}
        <button id="refresh-btn">Refresh</button>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);