// Shared core logic for all pages
function coreApp() {
  return {
    // Data states
    cash: 0,
    cashless: 0,
    dailyLimit: 0,
    dailySpent: 0,
    histories: [],
    savings: [],
    notes: [],

    init() {
      // Load data from localStorage on startup
      const savedData = localStorage.getItem('money_tracker_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.cash = data.cash ?? 0;
        this.cashless = data.cashless ?? 0;
        this.dailyLimit = data.dailyLimit ?? 0;
        this.dailySpent = data.dailySpent ?? 0;
        this.histories = data.histories ?? [];
        this.savings = data.savings ?? [];
        this.notes = data.notes ?? [];
      }

      // Watch for any changes and save to localStorage
      this.$watch('cash', () => this.saveToLocal());
      this.$watch('cashless', () => this.saveToLocal());
      this.$watch('dailyLimit', () => this.saveToLocal());
      this.$watch('dailySpent', () => this.saveToLocal());
      this.$watch('histories', () => this.saveToLocal());
      this.$watch('savings', () => this.saveToLocal());
      this.$watch('notes', () => this.saveToLocal());

      // If page has a specific init, call it
      if (this.pageInit) this.pageInit();
    },

    saveToLocal() {
      const dataToSave = {
        cash: this.cash,
        cashless: this.cashless,
        dailyLimit: this.dailyLimit,
        dailySpent: this.dailySpent,
        histories: this.histories,
        savings: this.savings,
        notes: this.notes
      };
      localStorage.setItem('money_tracker_data', JSON.stringify(dataToSave));
    },

    totalMoney() { return this.cash + this.cashless; },

    formatRupiah(num) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
    }
  }
}
