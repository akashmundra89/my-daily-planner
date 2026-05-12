import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerService, Task } from '../planner.service';

interface CalDay {
  date: string;
  dayNum: number;
  otherMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  year     = new Date().getFullYear();
  month    = new Date().getMonth();
  selected = new Date().toISOString().slice(0, 10);
  today    = new Date().toISOString().slice(0, 10);
  weeks: CalDay[][] = [];

  dowLabels  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(public planner: PlannerService) {}

  ngOnInit(): void { this.buildCalendar(); }

  get monthLabel(): string { return `${this.monthNames[this.month]} ${this.year}`; }

  navigate(dir: number): void {
    this.month += dir;
    if (this.month > 11) { this.month = 0; this.year++; }
    else if (this.month < 0) { this.month = 11; this.year--; }
    this.buildCalendar();
  }

  buildCalendar(): void {
    const firstDay    = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const daysInPrev  = new Date(this.year, this.month, 0).getDate();
    const cells: CalDay[] = [];

    // Previous month tail
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(this.year, this.month - 1, daysInPrev - i);
      cells.push({ date: d.toISOString().slice(0,10), dayNum: daysInPrev - i, otherMonth: true });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(this.year, this.month, i);
      cells.push({ date: d.toISOString().slice(0,10), dayNum: i, otherMonth: false });
    }
    // Next month head
    let next = 1;
    while (cells.length % 7 !== 0) {
      const d = new Date(this.year, this.month + 1, next++);
      cells.push({ date: d.toISOString().slice(0,10), dayNum: next - 1, otherMonth: true });
    }

    // Split into weeks
    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7)
      this.weeks.push(cells.slice(i, i + 7));
  }

  tasksOnDay(dateStr: string): Task[] {
    return this.planner.tasks.filter(t => this.planner.taskOnDate(t, dateStr));
  }

  get selectedDayTasks(): Task[] {
    return this.tasksOnDay(this.selected)
      .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]));
  }

  get selectedLabel(): string {
    const d = new Date(this.selected + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  dotColor(category: string): string {
    const map: Record<string, string> = {
      work: '#378ADD', personal: '#534AB7',
      health: '#1D9E75', finance: '#639922', other: '#888780'
    };
    return map[category] || '#888780';
  }
}
