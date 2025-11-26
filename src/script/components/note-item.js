class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.dateFormatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    this.timeFormatter = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ["title", "body", "created-at", "note-id", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  render() {
    const title = this.getAttribute("title") || "Tanpa Judul";
    const body = this.getAttribute("body") || "Tidak ada konten";
    const createdAt =
      this.getAttribute("created-at") || new Date().toISOString();
    const isArchived = this.getAttribute("archived") === "true";

    const date = new Date(createdAt);

    const formattedDate = this.dateFormatter.format(date);
    const formattedTime = this.timeFormatter.format(date);

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 2rem;
                    animation: slideIn 0.5s ease-out;
                }

                .note-item {
                    background-color: #ffffff;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    height: 100%;
                    display: grid;
                    grid-template-rows: auto 1fr auto;
                    gap: 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .note-item.archived {
                    border-color: #e5e7eb;
                    background-color: #ffffff;
                }

                .note-item.archived::before {
                    background: linear-gradient(90deg, #6366f1, #6b7280);
                }

                .note-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
                    border-color: #6366f1;
                }

                .note-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #6366f1, #6b7280);
                }

                .archive-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #f59e0b;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    animation: bounceIn 0.6s ease-out;
                }

                .aktif-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #10b981;
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    animation: bounceIn 0.6s ease-out;
                }

                h3 {
                    color: #6366f1;
                    font-size: 1.25rem;
                    font-weight: 600;
                    line-height: 1.4;
                    margin: 0;
                    padding-right: ${isArchived ? "6rem" : "4rem"};
                }

                p {
                    color: #374151;
                    line-height: 1.6;
                    white-space: pre-wrap;
                    opacity: 0.9;
                    margin: 0;
                }

                .note-footer {
                    display: grid;
                    grid-template-columns: 1fr auto auto;
                    align-items: center;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 1rem;
                    gap: 0.5rem;
                }

                .date-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }

                .created-date {
                    color: #374151;
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .created-time {
                    color: #374151;
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .btn-group {
                    display: flex;
                    gap: 0.5rem;
                }

                .archive, .unarchive, .delete {
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .archive {
                    background-color: #f59e0b;
                    color: white;
                }

                .archive:hover {
                    background-color: #d97706;
                    transform: scale(1.05);
                }

                .unarchive {
                    background-color: #10b981;
                    color: white;
                }

                .unarchive:hover {
                    background-color: #059669;
                    transform: scale(1.05);
                }

                .delete {
                    background-color: #ef4444;
                    color: white;
                }

                .delete:hover {
                    background-color: #dc2626;
                    transform: scale(1.05);
                }

                .delete:active, .archive:active, .unarchive:active {
                    transform: scale(0.95);
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        display: block;
                        margin-bottom: 1.5rem;
                    }

                    .note-item {
                        padding: 1rem;
                        gap: 0.7rem;
                    }

                    h3 {
                        font-size: 1.1rem;
                        padding-right: ${isArchived ? "5rem" : "3rem"};
                    }

                    .note-footer {
                        grid-template-columns: 1fr;
                        gap: 0.5rem;
                        text-align: left;
                    }

                    .btn-group {
                        justify-content: flex-end;
                    }
                }
            </style>
            <div class="note-item ${isArchived ? "archived" : ""}">
                ${isArchived ? '<div class="archive-badge">Diarsipkan</div>' : '<div class="aktif-badge">Aktif</div>'}
                <h3>${title}</h3>
                <p>${body}</p>
                <div class="note-footer">
                    <div class="date-info">
                        <span class="created-date">${formattedDate}</span>
                        <span class="created-time">${formattedTime}</span>
                    </div>
                    <div class="btn-group">
                        ${isArchived
        ? `<button class="unarchive" data-note-id="${this.getAttribute("note-id")}">
                                Aktifkan
                            </button>`
        : `<button class="archive" data-note-id="${this.getAttribute("note-id")}">
                                Arsipkan
                            </button>`
      }
                        <button class="delete" data-note-id="${this.getAttribute("note-id")}">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    // Delete button
    const deleteBtn = this.shadowRoot.querySelector(".delete");
    if (deleteBtn) {
      deleteBtn.onclick = null;
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.handleDelete();
      };
    }

    // Archive button
    const archiveBtn = this.shadowRoot.querySelector(".archive");
    if (archiveBtn) {
      archiveBtn.onclick = null;
      archiveBtn.onclick = (e) => {
        e.stopPropagation();
        this.handleArchive();
      };
    }

    // Unarchive button
    const unarchiveBtn = this.shadowRoot.querySelector(".unarchive");
    if (unarchiveBtn) {
      unarchiveBtn.onclick = null;
      unarchiveBtn.onclick = (e) => {
        e.stopPropagation();
        this.handleUnarchive();
      };
    }
  }

  handleDelete() {
    const noteId = this.getAttribute("note-id");
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

  handleArchive() {
    const noteId = this.getAttribute("note-id");
    if (noteId) {
      this.dispatchEvent(
        new CustomEvent("note-archived", {
          detail: { id: noteId },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  handleUnarchive() {
    const noteId = this.getAttribute("note-id");
    if (noteId) {
      this.dispatchEvent(
        new CustomEvent("note-unarchived", {
          detail: { id: noteId },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

customElements.define("note-item", NoteItem);
