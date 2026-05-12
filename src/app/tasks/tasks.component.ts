import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerService, Task } from '../planner.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  // ── Form fields ──────────────────────────
  text     = '';
  time     = '';
  note     = '';
  priority: Task['priority'] = 'medium';
  category: Task['category'] = 'work';
  recur:    Task['recur']    = 'none';

  // ── Search & filter state ────────────────
  searchQuery    = '';
  filterPriority = 'all';
  filterCategory = 'all';

  // ── Note editing state ───────────────────
  editingNoteId:   number | null = null;
  editingNoteText  = '';
  expandedNoteIds  = new Set<number>();

  constructor(public planner: PlannerService) {}

  addTask(): void {
    if (!this.text.trim()) return;
    this.planner.addTask({
      text:     this.text.trim(),
      time:     this.time,
      note:     this.note.trim(),
      priority: this.priority,
      category: this.category,
      recur:    this.recur,
      done:     false
    });
    this.text = this.time = this.note = '';
  }

  openNoteEditor(task: Task): void {
    this.editingNoteId   = this.editingNoteId === task.id ? null : task.id;
    this.editingNoteText = task.note || '';
  }

  saveNote(id: number): void {
    this.planner.updateNote(id, this.editingNoteText);
    this.editingNoteId = null;
  }

  toggleNoteExpand(id: number): void {
    this.expandedNoteIds.has(id)
      ? this.expandedNoteIds.delete(id)
      : this.expandedNoteIds.add(id);
  }

  // ── Computed getters ─────────────────────

  get filteredTasks(): Task[] {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return this.planner.tasks
      .filter(t => this.filterPriority === 'all' || t.priority === this.filterPriority)
      .filter(t => this.filterCategory === 'all' || t.category === this.filterCategory)
      .filter(t => !this.searchQuery ||
        t.text.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (t.note || '').toLowerCase().includes(this.searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  get completedCount(): number {
    return this.planner.tasks.filter(t => t.done).length;
  }

  get progress(): number {
    const total = this.planner.tasks.length;
    return total ? Math.round(this.completedCount / total * 100) : 0;
  }
}
