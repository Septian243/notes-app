class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ["max-title-length", "max-body-length"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  render() {
    const maxTitleLength = this.getAttribute("max-title-length") || 50;
    const maxBodyLength = this.getAttribute("max-body-length") || 1000;

    this.shadowRoot.innerHTML = `
            <style>
                .form-container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    margin-top: 5rem;
                    margin-bottom: 1.5rem;
                    color: white;
                }

                h2 {
                    margin-bottom: 1rem;
                    font-size: 1.7rem;
                    font-weight: bold;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 1rem;
                    position: relative;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    font-size: 0.9rem;
                }

                input, textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    backdrop-filter: blur(10px);
                    box-sizing: border-box;
                }

                input::placeholder, textarea::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.5);
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
                }

                input.valid, textarea.valid {
                    border-color: #10b981;
                }

                input.invalid, textarea.invalid {
                    border-color: #ef4444;
                }

                textarea {
                    min-height: 120px;
                    resize: vertical;
                    font-family: inherit;
                }

                .char-counter {
                    text-align: right;
                    font-size: 0.8rem;
                    opacity: 0.8;
                }

                .char-counter.warning {
                    color: #fbbf24;
                }

                .char-counter.error {
                    color: #ef4444;
                }

                .validation-message {
                    font-size: 0.8rem;
                    display: none;
                }

                .validation-message.show {
                    display: block;
                }

                .validation-message.error {
                    color: #ef4444;
                }

                .validation-message.success {
                    color: #10b981;
                }

                button {
                    background: white;
                    color: #6366f1;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    width: 100%;
                    margin-top: 1rem;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                button:active {
                    transform: translateY(0);
                }

                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                @media (max-width: 768px) {
                    .form-container {
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .form-container {
                        padding: 1rem;
                        border-radius: 12px;
                    }
                    
                    h2 {
                        font-size: 1.5rem;
                    }
                }
            </style>
            <div class="form-container">
                <h2>Tambah Catatan Baru</h2>
                <form id="note-form">
                    <div class="form-group">
                        <label for="title">Judul Catatan</label>
                        <input type="text" id="title" name="title" placeholder="Masukkan judul catatan" maxlength="${maxTitleLength}" required>
                        <div class="char-counter">
                            <span id="title-counter">0</span> / ${maxTitleLength} karakter
                        </div>
                        <div class="validation-message" id="title-validation"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="body">Isi Catatan</label>
                        <textarea id="body" name="body" placeholder="Tulis isi catatan Anda di sini" maxlength="${maxBodyLength}" required></textarea>
                        <div class="char-counter">
                            <span id="body-counter">0</span> / ${maxBodyLength} karakter
                        </div>
                        <div class="validation-message" id="body-validation"></div>
                    </div>
                    
                    <button type="submit" id="submit-btn" disabled>
                        Tambah Catatan
                    </button>
                </form>
            </div>
        `;
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector("#note-form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleCounter = this.shadowRoot.querySelector("#title-counter");
    const bodyCounter = this.shadowRoot.querySelector("#body-counter");
    const titleValidation = this.shadowRoot.querySelector("#title-validation");
    const bodyValidation = this.shadowRoot.querySelector("#body-validation");
    const submitBtn = this.shadowRoot.querySelector("#submit-btn");

    const maxTitleLength =
      parseInt(this.getAttribute("max-title-length")) || 50;
    const maxBodyLength =
      parseInt(this.getAttribute("max-body-length")) || 1000;

    titleInput.addEventListener("input", () => {
      const value = titleInput.value.trim();
      const length = value.length;

      titleCounter.textContent = length;

      const counter = titleCounter.parentElement;
      counter.className = "char-counter";
      if (length > maxTitleLength * 0.8) {
        counter.classList.add("warning");
      }
      if (length >= maxTitleLength) {
        counter.classList.add("error");
      }

      this.validateTitle(value, titleInput, titleValidation);
      this.updateSubmitButton(submitBtn, titleInput, bodyInput);
    });

    bodyInput.addEventListener("input", () => {
      const value = bodyInput.value.trim();
      const length = value.length;

      bodyCounter.textContent = length;

      const counter = bodyCounter.parentElement;
      counter.className = "char-counter";
      if (length > maxBodyLength * 0.8) {
        counter.classList.add("warning");
      }
      if (length >= maxBodyLength) {
        counter.classList.add("error");
      }

      this.validateBody(value, bodyInput, bodyValidation);
      this.updateSubmitButton(submitBtn, titleInput, bodyInput);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      if (this.isFormValid(title, body)) {
        this.dispatchEvent(
          new CustomEvent("note-added", {
            detail: {
              title,
              body,
            },
            bubbles: true,
          }),
        );

        form.reset();
        titleCounter.textContent = "0";
        bodyCounter.textContent = "0";
        submitBtn.disabled = true;

        titleInput.classList.remove("valid", "invalid");
        bodyInput.classList.remove("valid", "invalid");
        titleValidation.className = "validation-message";
        bodyValidation.className = "validation-message";
      }
    });
  }

  validateTitle(value, input, validationEl) {
    if (value.length === 0) {
      this.showValidation(validationEl, "Judul tidak boleh kosong", "error");
      input.classList.add("invalid");
      input.classList.remove("valid");
      return false;
    } else if (value.length < 3) {
      this.showValidation(
        validationEl,
        "Judul terlalu pendek (minimal 3 karakter)",
        "error",
      );
      input.classList.add("invalid");
      input.classList.remove("valid");
      return false;
    } else {
      this.showValidation(validationEl, "Judul valid ✓", "success");
      input.classList.add("valid");
      input.classList.remove("invalid");
      return true;
    }
  }

  validateBody(value, input, validationEl) {
    if (value.length === 0) {
      this.showValidation(
        validationEl,
        "Isi catatan tidak boleh kosong",
        "error",
      );
      input.classList.add("invalid");
      input.classList.remove("valid");
      return false;
    } else if (value.length < 10) {
      this.showValidation(
        validationEl,
        "Isi catatan terlalu pendek (minimal 10 karakter)",
        "error",
      );
      input.classList.add("invalid");
      input.classList.remove("valid");
      return false;
    } else {
      this.showValidation(validationEl, "Isi catatan valid ✓", "success");
      input.classList.add("valid");
      input.classList.remove("invalid");
      return true;
    }
  }

  showValidation(element, message, type) {
    element.textContent = message;
    element.className = `validation-message show ${type}`;

    if (type === "success") {
      setTimeout(() => {
        element.classList.remove("show");
      }, 3000);
    }
  }

  isFormValid(title, body) {
    return title.length >= 3 && body.length >= 10;
  }

  updateSubmitButton(button, titleInput, bodyInput) {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    button.disabled = !this.isFormValid(title, body);
  }
}

customElements.define("note-form", NoteForm);
