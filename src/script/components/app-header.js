class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["app-name", "theme"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const appName = this.getAttribute("app-name") || "Aplikasi Catatan";
    const theme = this.getAttribute("theme") || "primary";

    const themes = {
      primary: {
        bgColor: "#6366f1",
        textColor: "#ffffff",
      },
      dark: {
        bgColor: "#1f2937",
        textColor: "#f3f4f6",
      },
      teal: {
        bgColor: "#0d9488",
        textColor: "#ffffff",
      },
    };

    const currentTheme = themes[theme] || themes.primary;

    this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: ${currentTheme.bgColor};
                    color: ${currentTheme.textColor};
                    padding: 1rem 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 9999;
                }

                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    header {
                        padding: 1rem 1.5rem;
                    }
                    
                    h1 {
                        font-size: 1.5rem;
                    }
                    
                    .subtitle {
                        font-size: 0.875rem;
                    }
                }

                @media (max-width: 480px) {
                    .header-content {
                        flex-direction: column;
                        gap: 0.5rem;
                        text-align: center;
                    }
                }
            </style>
            <header>
                <div class="header-content">
                    <div>
                        <h1>${appName}</h1>
                    </div>
                    <div class="stats" id="stats"></div>
                </div>
            </header>
        `;
  }
}

customElements.define("app-header", AppHeader);
