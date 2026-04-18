function app() {
  return {
    ...coreApp(),

    // Modal states
    showNoteModal: false,
    noteFormTitle: '',
    noteFormContent: '',
    noteEditId: null,

    openNoteModal(note = null) {
      if (note) {
        this.noteEditId = note.id;
        this.noteFormTitle = note.title;
        this.noteFormContent = note.content;
      } else {
        this.noteEditId = null;
        this.noteFormTitle = '';
        this.noteFormContent = '';
      }
      this.showNoteModal = true;
    },

    saveNote() {
      if (!this.noteFormTitle) return;

      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      // Auto-detect checklist mode
      const lines = this.noteFormContent.split('\n');
      const hasListPattern = lines.some(line => line.trim().startsWith('- '));
      const isChecklist = hasListPattern;

      if (this.noteEditId) {
        const index = this.notes.findIndex(n => n.id === this.noteEditId);
        if (index !== -1) {
          this.notes[index] = {
            ...this.notes[index],
            title: this.noteFormTitle,
            content: this.noteFormContent,
            isChecklist: isChecklist,
            date: dateStr
          };
        }
      } else {
        this.notes.unshift({
          id: Date.now(),
          title: this.noteFormTitle,
          content: this.noteFormContent,
          isChecklist: isChecklist,
          date: dateStr
        });
      }
      this.showNoteModal = false;
      this.saveToLocal();
    },

    deleteNote(id) {
      if (confirm('Hapus catatan ini?')) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.saveToLocal();
      }
    },

    parseChecklist(content) {
      return content.split('\n').filter(line => line.trim() !== '').map(line => {
        let text = line.trim();
        let checked = false;
        if (text.startsWith('[x] ')) {
          checked = true;
          text = text.substring(4);
        } else if (text.startsWith('[ ] ')) {
          text = text.substring(4);
        } else if (text.startsWith('- ')) {
          text = text.substring(2);
        }
        return { text, checked };
      });
    },

    toggleChecklistItem(note, itemIndex) {
      let lines = note.content.split('\n').filter(line => line.trim() !== '');
      let line = lines[itemIndex];

      if (line.startsWith('[x] ')) {
        lines[itemIndex] = '[ ] ' + line.substring(4);
      } else if (line.startsWith('[ ] ')) {
        lines[itemIndex] = '[x] ' + line.substring(4);
      } else if (line.startsWith('- ')) {
        lines[itemIndex] = '[x] ' + line.substring(2);
      } else {
        lines[itemIndex] = '[x] ' + line;
      }

      note.content = lines.join('\n');
      this.saveToLocal();
    }
  }
}
