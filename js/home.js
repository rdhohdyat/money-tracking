function app() {
  return {
    ...coreApp(),

    // Modal states
    showHistoryModal: false,

    // History Form
    formType: 'Pengeluaran',
    formSource: 'Tunai',
    formAmount: '',
    formName: '',

    saveHistory() {
      if (!this.formAmount || !this.formName) return;
      const amt = parseInt(this.formAmount);

      this.histories.unshift({
        id: Date.now(),
        name: this.formName,
        amount: amt,
        type: this.formType,
        source: this.formSource,
        date: 'Baru saja'
      });

      if (this.formType === 'Pengeluaran') {
        if (this.formSource === 'Tunai') this.cash -= amt;
        else this.cashless -= amt;
        this.dailySpent += amt;
      } else {
        if (this.formSource === 'Tunai') this.cash += amt;
        else this.cashless += amt;
      }

      this.showHistoryModal = false;
      this.formAmount = '';
      this.formName = '';
      this.saveToLocal();
    },

    deleteHistory(id) {
      const item = this.histories.find(h => h.id === id);
      if (item) {
        if (item.type === 'Pengeluaran') {
          if (item.source === 'Tunai') this.cash += item.amount;
          else this.cashless += item.amount;
          this.dailySpent = Math.max(0, this.dailySpent - item.amount);
        } else {
          if (item.source === 'Tunai') this.cash -= item.amount;
          else this.cashless -= item.amount;
        }
      }
      this.histories = this.histories.filter(h => h.id !== id);
      this.saveToLocal();
    }
  }
}
