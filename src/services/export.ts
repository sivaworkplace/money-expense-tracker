import { AppData, Expense } from '@/types';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export class ExportService {
  static async exportToJSON(data: AppData): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    const filename = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;

    if (Capacitor.isNativePlatform()) {
      // Mobile: Use Filesystem API + Share
      try {
        const result = await Filesystem.writeFile({
          path: filename,
          data: jsonString,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });

        await Share.share({
          title: 'Export Expense Data',
          text: 'Expense Tracker Data Export',
          url: result.uri,
          dialogTitle: 'Save or Share your data'
        });

        alert('Data exported successfully! Choose where to save it.');
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please try again.');
      }
    } else {
      // Web: Use blob download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  static async exportToCSV(expenses: Expense[]): Promise<void> {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Payment Method'];
    const rows = expenses.map(expense => [
      expense.date.split('T')[0],
      expense.category,
      expense.description,
      expense.amount.toString(),
      expense.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;

    if (Capacitor.isNativePlatform()) {
      // Mobile: Use Filesystem API + Share
      try {
        const result = await Filesystem.writeFile({
          path: filename,
          data: csvContent,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });

        await Share.share({
          title: 'Export Expenses CSV',
          text: 'Expense Tracker CSV Export',
          url: result.uri,
          dialogTitle: 'Save or Share CSV'
        });

        alert('CSV exported successfully! Choose where to save it.');
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export CSV. Please try again.');
      }
    } else {
      // Web: Use blob download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  static async shareData(data: AppData): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const jsonString = JSON.stringify(data, null, 2);
      
      try {
        await Share.share({
          title: 'Expense Tracker Data',
          text: jsonString,
          dialogTitle: 'Share your expense data'
        });
      } catch (error) {
        console.error('Error sharing data:', error);
      }
    } else {
      await this.exportToJSON(data);
    }
  }

  static async importFromJSON(file: File): Promise<AppData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}

