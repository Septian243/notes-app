const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async createNote(title, body) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Gagal membuat catatan: ${error.message}`);
    }
  }

  static async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Gagal memuat catatan: ${error.message}`);
    }
  }

  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Gagal menghapus catatan: ${error.message}`);
    }
  }

  static async archiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Gagal mengarsipkan catatan: ${error.message}`);
    }
  }

  static async unarchiveNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      throw new Error(`Gagal mengaktifkan catatan: ${error.message}`);
    }
  }

  static async getArchivedNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      return responseJson.data;
    } catch (error) {
      throw new Error(`Gagal memuat catatan terarsip: ${error.message}`);
    }
  }
}

export default NotesApi;
