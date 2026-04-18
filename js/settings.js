function app() {
  return {
    ...coreApp(),

    resetDailyLimit() {
      if (confirm('Apakah Anda yakin ingin reset pengeluaran harian?')) {
        this.dailySpent = 0;
        this.saveToLocal();
      }
    },

    exportToCSV() {
      if (this.histories.length === 0) {
        alert('Tidak ada riwayat transaksi untuk diekspor!');
        return;
      }

      // Buat Header CSV
      const headers = ['Tanggal', 'Nama Catatan', 'Jenis', 'Sumber', 'Nominal (Rp)'];
      const csvRows = [headers.join(',')];

      // Isi Data CSV
      this.histories.forEach(h => {
        // pastikan string aman jika ada koma di dalamnya
        const name = `"${(h.name || '').replace(/"/g, '""')}"`;
        // gunakan rawDate jika ada (biar lebih detail YYYY-MM-DD), jika tidak fallback ke date
        const date = h.rawDate || h.date;
        const row = [date, name, h.type, h.source, h.amount];
        csvRows.push(row.join(','));
      });

      // Konversi ke URI file dan buat element <a> untuk mendownloadnya
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.setAttribute('href', url);
      link.setAttribute('download', `Riwayat_Keuangan_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
