function app() {
  return {
    ...coreApp(),

    resetDailyLimit() {
      if (confirm('Apakah Anda yakin ingin reset pengeluaran harian?')) {
        this.dailySpent = 0;
        this.saveToLocal();
      }
    }
  }
}
