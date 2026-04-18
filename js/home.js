function app() {
  const core = coreApp();
  const homeLogic = {
    chart: null,

    pageInit() {
      // Tunggu sebentar agar Alpine selesai mounting dan canvas tersedia
      setTimeout(() => this.updateChart(), 200);
    },

    updateChart() {
      const ctx = document.getElementById('historyChart');
      if (!ctx || typeof Chart === 'undefined') return;

      // Ambil data 7 hari terakhir (unik)
      const dataByDate = {};
      this.histories.forEach(h => {
        if (!dataByDate[h.date]) {
          dataByDate[h.date] = { income: 0, expense: 0 };
        }
        if (h.type === 'Pemasukkan') dataByDate[h.date].income += h.amount;
        else dataByDate[h.date].expense += h.amount;
      });

      // Sortir tanggal (asumsi format 'DD MMM')
      const sortedDates = Object.keys(dataByDate).slice(0, 7).reverse();

      const chartData = {
        labels: sortedDates,
        datasets: [
          {
            label: 'Pemasukkan',
            data: sortedDates.map(d => dataByDate[d].income),
            borderColor: '#10b981', // green-500
            backgroundColor: '#10b98120',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Pengeluaran',
            data: sortedDates.map(d => dataByDate[d].expense),
            borderColor: '#ef4444', // red-500
            backgroundColor: '#ef444420',
            tension: 0.4,
            fill: true
          }
        ]
      };

      if (this.chart) {
        this.chart.data = chartData;
        this.chart.update();
      } else {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { display: false },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 } }
              }
            }
          }
        });
      }
    },

    // Modal states
    showHistoryModal: false,
    historyEditId: null,

    // History Form
    formType: 'Pengeluaran',
    formSource: 'Tunai',
    formAmount: '',
    formName: '',
    formDate: '',

    openHistoryModal(history = null) {
      if (history) {
        this.historyEditId = history.id;
        this.formType = history.type;
        this.formSource = history.source;
        this.formAmount = history.amount;
        this.formName = history.name;
        this.formDate = history.rawDate || new Date().toISOString().split('T')[0];
      } else {
        this.historyEditId = null;
        this.formType = 'Pengeluaran';
        this.formSource = 'Tunai';
        this.formAmount = '';
        this.formName = '';
        this.formDate = new Date().toISOString().split('T')[0];
      }
      this.showHistoryModal = true;
    },

    saveHistory() {
      if (!this.formAmount || !this.formName || !this.formDate) return;
      const amt = parseInt(this.formAmount);
      
      const d = new Date(this.formDate);
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      if (this.historyEditId) {
        const index = this.histories.findIndex(h => h.id === this.historyEditId);
        if (index !== -1) {
          const old = this.histories[index];
          if (old.type === 'Pengeluaran') {
            if (old.source === 'Tunai') this.cash += old.amount;
            else this.cashless += old.amount;
            this.dailySpent = Math.max(0, this.dailySpent - old.amount);
          } else {
            if (old.source === 'Tunai') this.cash -= old.amount;
            else this.cashless -= old.amount;
          }

          if (this.formType === 'Pengeluaran') {
            if (this.formSource === 'Tunai') this.cash -= amt;
            else this.cashless -= amt;
            this.dailySpent += amt;
          } else {
            if (this.formSource === 'Tunai') this.cash += amt;
            else this.cashless += amt;
          }

          this.histories[index] = {
            ...old,
            name: this.formName,
            amount: amt,
            type: this.formType,
            source: this.formSource,
            date: dateStr,
            rawDate: this.formDate
          };
        }
      } else {
        this.histories.unshift({
          id: Date.now(),
          name: this.formName,
          amount: amt,
          type: this.formType,
          source: this.formSource,
          date: dateStr,
          rawDate: this.formDate
        });

        if (this.formType === 'Pengeluaran') {
          if (this.formSource === 'Tunai') this.cash -= amt;
          else this.cashless -= amt;
          this.dailySpent += amt;
        } else {
          if (this.formSource === 'Tunai') this.cash += amt;
          else this.cashless += amt;
        }
      }

      this.showHistoryModal = false;
      this.updateChart();
      this.saveToLocal();
    },

    deleteHistory(id) {
      if (!confirm('Hapus riwayat ini?')) return;
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
      this.showHistoryModal = false;
      this.updateChart();
      this.saveToLocal();
    }
  };

  return Object.assign(core, homeLogic);
}
