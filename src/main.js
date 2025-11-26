import "./style/style.css";
import NotesApi from "./script/utils/api.js";
import "./script/utils/loading-indicator.js";
import "./script/components/app-header.js";
import "./script/components/note-form.js";
import "./script/components/note-item.js";
import "./script/components/note-list.js";

// Import SweetAlert2
import Swal from "sweetalert2";

class NotesApp {
  constructor() {
    this.notes = [];
    this.activeNotes = [];
    this.archivedNotes = [];
    this.currentView = "active";

    this.noteList = document.querySelector("note-list");
    this.noteForm = document.querySelector("note-form");
    this.appHeader = document.querySelector("app-header");
    this.loadingIndicator = document.createElement("loading-indicator");

    document.body.appendChild(this.loadingIndicator);

    this.init();
  }

  async init() {
    await this.loadNotes();
    this.setupEventListeners();
    this.createViewSwitcher();
  }

  async loadNotes() {
    try {
      this.showLoading();

      const [activeNotes, archivedNotes] = await Promise.all([
        NotesApi.getAllNotes(),
        NotesApi.getArchivedNotes(),
      ]);

      this.notes = [...activeNotes, ...archivedNotes];
      this.activeNotes = activeNotes;
      this.archivedNotes = archivedNotes;

      this.renderCurrentView();
    } catch (error) {
      console.error("Error loading notes:", error);
      this.showError(`Gagal memuat catatan: ${error.message}`);
    } finally {
      this.hideLoading();
    }
  }

  renderCurrentView() {
    const notesToShow =
      this.currentView === "active" ? this.activeNotes : this.archivedNotes;

    this.noteList.setNotes(notesToShow);
    this.updateStats();
    this.updateViewSwitcher();
  }

  async addNote(title, body) {
    try {
      this.showLoading("Menambahkan catatan...");
      await NotesApi.createNote(title, body);
      await this.loadNotes();
      this.showSuccess("Catatan berhasil ditambahkan!");
      this.switchView("active");
      return true;
    } catch (error) {
      console.error("Error adding note:", error);
      this.showError(`Gagal menambahkan catatan: ${error.message}`);
      return false;
    } finally {
      this.hideLoading();
    }
  }

  async deleteNote(noteId) {
    try {
      this.showLoading("Menghapus catatan...");
      await NotesApi.deleteNote(noteId);
      await this.loadNotes();
      this.showSuccess("Catatan berhasil dihapus!");
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      this.showError(`Gagal menghapus catatan: ${error.message}`);
      return false;
    } finally {
      this.hideLoading();
    }
  }

  async archiveNote(noteId) {
    try {
      this.showLoading("Mengarsipkan catatan...");
      await NotesApi.archiveNote(noteId);
      await this.loadNotes();
      this.showSuccess("Catatan berhasil diarsipkan!");
      this.switchView("archived");
      return true;
    } catch (error) {
      console.error("Error archiving note:", error);
      this.showError(`Gagal mengarsipkan catatan: ${error.message}`);
      return false;
    } finally {
      this.hideLoading();
    }
  }

  async unarchiveNote(noteId) {
    try {
      this.showLoading("Mengaktifkan catatan...");
      await NotesApi.unarchiveNote(noteId);
      await this.loadNotes();
      this.showSuccess("Catatan berhasil diaktifkan!");
      this.switchView("active");
      return true;
    } catch (error) {
      console.error("Error unarchiving note:", error);
      this.showError(`Gagal mengaktifkan catatan: ${error.message}`);
      return false;
    } finally {
      this.hideLoading();
    }
  }

  setupEventListeners() {
    // Tambah catatan
    this.noteForm.addEventListener("note-added", async (e) => {
      const { title, body } = e.detail;
      await this.addNote(title, body);
    });

    // Hapus catatan
    document.addEventListener("note-deleted", async (e) => {
      const { id } = e.detail;
      const noteToDelete = this.notes.find((note) => note.id === id);
      if (noteToDelete) {
        const confirmed = await this.confirmAction(
          "Hapus Catatan",
          `Apakah Anda yakin ingin menghapus catatan "${noteToDelete.title}"?`,
          "Ya, Hapus",
        );
        if (confirmed) await this.deleteNote(id);
      }
    });

    // Arsipkan catatan
    document.addEventListener("note-archived", async (e) => {
      const { id } = e.detail;
      const noteToArchive = this.notes.find((note) => note.id === id);
      if (noteToArchive) {
        const confirmed = await this.confirmAction(
          "Arsipkan Catatan",
          `Apakah Anda yakin ingin mengarsipkan catatan "${noteToArchive.title}"?`,
          "Ya, Arsipkan",
        );
        if (confirmed) await this.archiveNote(id);
      }
    });

    // Aktifkan catatan
    document.addEventListener("note-unarchived", async (e) => {
      const { id } = e.detail;
      const noteToUnarchive = this.notes.find((note) => note.id === id);
      if (noteToUnarchive) {
        const confirmed = await this.confirmAction(
          "Aktifkan Catatan",
          `Apakah Anda yakin ingin mengaktifkan catatan "${noteToUnarchive.title}"?`,
          "Ya, Aktifkan",
        );
        if (confirmed) await this.unarchiveNote(id);
      }
    });
  }

  createViewSwitcher() {
    const viewSwitcher = document.createElement("div");
    viewSwitcher.className = "view-switcher";
    viewSwitcher.innerHTML = `
            <style>
                .view-switcher {
                    display: flex;
                    gap: 1rem;
                    margin: 1rem 0 2rem 0;
                    justify-content: center;
                    animation: fadeIn 0.6s ease-out 0.3s both;
                }
                .view-btn {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #6366f1;
                    background: white;
                    color: #6366f1;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .view-btn.active {
                    background: #6366f1;
                    color: white;
                }
                .view-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 480px) {
                    .view-switcher { flex-direction: column; gap: 0.5rem; }
                }
            </style>
            <button class="view-btn active" data-view="active">
                Catatan Aktif (${this.activeNotes.length})
            </button>
            <button class="view-btn" data-view="archived">
                Catatan Diarsipkan (${this.archivedNotes.length})
            </button>
        `;

    this.noteForm.parentNode.insertBefore(
      viewSwitcher,
      this.noteForm.nextSibling,
    );

    viewSwitcher.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const view = e.target.dataset.view;
        this.switchView(view);
      });
    });
  }

  updateViewSwitcher() {
    const activeBtn = document.querySelector('.view-btn[data-view="active"]');
    const archivedBtn = document.querySelector(
      '.view-btn[data-view="archived"]',
    );

    if (activeBtn) {
      activeBtn.innerHTML = `Catatan Aktif (${this.activeNotes.length})`;
    }
    if (archivedBtn) {
      archivedBtn.innerHTML = `Catatan Diarsipkan (${this.archivedNotes.length})`;
    }
  }

  switchView(view) {
    this.currentView = view;
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    this.renderCurrentView();
  }

  updateStats() {
    const totalNotes = this.notes.length;
    const activeNotes = this.activeNotes.length;
    const archivedNotes = this.archivedNotes.length;

    if (this.appHeader.shadowRoot) {
      const statsEl = this.appHeader.shadowRoot.querySelector("#stats");
      if (statsEl) {
        statsEl.innerHTML = `
                    <style>
                        .stats {
                            font-size: 1rem;
                            opacity: 0.9;
                            text-align: right;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-end;
                            gap: 1rem;
                            flex-wrap: wrap;
                        }
                        .stat-item {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }
                        .stat-badge {
                            background: rgba(255, 255, 255, 0.2);
                            padding: 0.25rem 0.5rem;
                            border-radius: 12px;
                            font-size: 0.875rem;
                            animation: bounceIn 0.6s ease-out;
                        }
                        @keyframes bounceIn {
                            0% { opacity: 0; transform: scale(0.3); }
                            50% { opacity: 1; transform: scale(1.05); }
                            70% { transform: scale(0.9); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    </style>
                    <div class="stats">
                        <div class="stat-item"><span>Aktif:</span><span class="stat-badge">${activeNotes}</span></div>
                        <div class="stat-item"><span>Arsip:</span><span class="stat-badge">${archivedNotes}</span></div>
                        <div class="stat-item"><span>Total:</span><span class="stat-badge">${totalNotes}</span></div>
                    </div>
                `;
      }
    }
  }

  showLoading(message = "Memuat...") {
    this.loadingIndicator.show();
  }
  hideLoading() {
    this.loadingIndicator.hide();
  }

  showError(message) {
    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text: message,
      confirmButtonText: "Mengerti",
      background: "#fff",
      color: "#374151",
    });
  }

  showSuccess(message) {
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: "#fff",
      color: "#374151",
    });
  }

  async confirmAction(title, text, confirmButtonText = "Ya") {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6b7280",
      confirmButtonText,
      cancelButtonText: "Batal",
      background: "#fff",
      color: "#374151",
    });
    return result.isConfirmed;
  }
}

document.addEventListener("DOMContentLoaded", () => new NotesApp());
