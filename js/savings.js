function app() {
  return {
    ...coreApp(),

    // Modal states
    showSavingModal: false,

    // Form
    savingFormName: '',
    savingFormTarget: '',

    saveSaving() {
      if (!this.savingFormName || !this.savingFormTarget) return;
      this.savings.push({
        id: Date.now(),
        name: this.savingFormName,
        target: parseInt(this.savingFormTarget),
        current: 0
      });
      this.showSavingModal = false;
      this.savingFormName = '';
      this.savingFormTarget = '';
      this.saveToLocal();
    },

    fillSaving(id) {
      const amtStr = prompt("Masukkan jumlah uang untuk ditabung:");
      if (amtStr && !isNaN(amtStr)) {
        const amt = parseInt(amtStr);
        const saving = this.savings.find(s => s.id === id);
        if (saving) {
          saving.current += amt;
          this.saveToLocal();
        }
      }
    },

    deleteSaving(id) {
      if (confirm('Hapus tabungan ini?')) {
        this.savings = this.savings.filter(s => s.id !== id);
        this.saveToLocal();
      }
    }
  }
}
