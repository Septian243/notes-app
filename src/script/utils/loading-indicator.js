class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.hide();
  }

  show() {
    this.style.display = "flex";
    this.style.opacity = "1";
  }

  hide() {
    this.style.display = "none";
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 99999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: opacity 0.3s ease;
                }

                .loading-container {
                    background: white;
                    padding: 2rem 3rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    min-width: 200px;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f4f6;
                    border-top: 5px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loading-text {
                    color: #374151;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>

            <div class="loading-container">
                <div class="spinner"></div>
                <div class="loading-text">Memuat...</div>
            </div>
        `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
