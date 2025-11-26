class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this._eventsAttached = false;
  }

  connectedCallback() {
    this.render();

    if (!this._eventsAttached) {
      this.setupEventListeners();
      this._eventsAttached = true;
    }
  }

  static get observedAttributes() {
    return ["layout", "columns"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  setNotes(notes) {
    this.notes = notes;
    this.render();
  }

  render() {
    const layout = this.getAttribute("layout") || "grid";
    const columns = this.getAttribute("columns") || "auto-fill";

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .notes-container {
                    display: grid;
                    grid-template-columns: ${layout === "grid" ? `repeat(${columns}, minmax(300px, 1fr))` : "1fr"};
                    gap: 2rem;
                }

                h2 {
                    margin-top: 3rem;
                    margin-bottom: 0.7rem;
                }

                .empty-message {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #6b7280;
                    grid-column: 1 / -1;
                    font-style: italic;
                    background-color: #f9fafb;
                    border-radius: 8px;
                    border: 1px dashed #d1d5db;
                }

                .empty-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #4b5563;
                }

                .empty-subtitle {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                @media (max-width: 1024px) {
                    :host {
                        display: block;
                        width: 100%;
                    }

                    .notes-container {
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    :host {
                        display: block;
                        width: 100%;
                    }

                    .notes-container {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                        justify-content: center;    
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        display: block;
                        width: 100%;
                    }

                    .notes-container {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .empty-message {
                        padding: 2rem 1rem;
                    }
                    
                    .empty-title {
                        font-size: 1.125rem;
                    }
                }
            </style>
            <h2>Daftar Catatan</h2>
            <div class="notes-container" id="notes-container">
                ${
                  this.notes.length === 0
                    ? `
                    <div class="empty-message">
                        <div class="empty-title">Belum ada catatan</div>
                        <div class="empty-subtitle">Mulai tambahkan catatan pertama Anda</div>
                    </div>
                `
                    : this.notes
                        .map(
                          (note) => `
                    <note-item 
                        title="${note.title}"
                        body="${note.body}"
                        created-at="${note.createdAt}"
                        note-id="${note.id}"
                        archived="${note.archived}"
                    ></note-item>
                `,
                        )
                        .join("")
                }
            </div>
        `;
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
        e.stopPropagation();
        const noteId = e.target.getAttribute("data-note-id");

        if (noteId) {
          this.dispatchEvent(
            new CustomEvent("note-deleted", {
              detail: { id: noteId },
              bubbles: true,
              composed: true,
            }),
          );
        }
      }
    });
  }
}

customElements.define("note-list", NoteList);
