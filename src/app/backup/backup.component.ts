import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerService } from '../planner.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent {

  importMsg   = '';
  importError = false;

  constructor(public planner: PlannerService) {}

  exportJSON(): void { this.planner.exportJSON(); }

  exportCSV(): void {
    const recurLabel: Record<string, string> = {
      none: '', daily: 'Daily', weekly: 'Weekly', weekdays: 'Weekdays', weekend: 'Weekends'
    };
    const rows = [
      'Text,Note,Priority,Category,Time,Recurring,Done',
      ...this.planner.tasks.map(t =>
        [`"${t.text}"`, `"${t.note || ''}"`, t.priority, t.category,
         t.time || '', recurLabel[t.recur] || '', t.done ? 'Yes' : 'No'].join(',')
      )
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'planner-tasks.csv';
    a.click();
  }

  onFileUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target!.result as string);
        this.planner.importJSON(data);
        this.importMsg = `Restored ${this.planner.tasks.length} tasks and ${this.planner.credentials.length} credentials.`;
        this.importError = false;
      } catch {
        this.importMsg = 'Invalid file. Please use a JSON backup from this app.';
        this.importError = true;
      }
    };
    reader.readAsText(file);
  }

  clearTasks(): void {
    if (confirm('Remove all tasks? This cannot be undone.')) {
      this.planner.tasks = [];
      this.planner.save();
    }
  }

  clearAll(): void {
    if (confirm('Clear ALL data including credentials? This cannot be undone.')) {
      this.planner.tasks = [];
      this.planner.credentials = [];
      this.planner.save();
    }
  }
}
