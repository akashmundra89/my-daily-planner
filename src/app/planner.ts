import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  text: string;
  note: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'health' | 'finance' | 'other';
  recur: 'none' | 'daily' | 'weekly' | 'weekdays' | 'weekend';
  done: boolean;
}

export interface Credential {
  id: number;
  name: string;
  org: string;
  expiry: string;
  type: 'Certification' | 'License' | 'Training' | 'Other';
}

@Injectable({ providedIn: 'root' })
export class PlannerService {

  tasks: Task[] = [];
  credentials: Credential[] = [];

  constructor() {
    this.load();
  }

  // ── TASKS ──────────────────────────────────────

  addTask(task: Omit<Task, 'id'>): void {
    this.tasks.push({ ...task, id: Date.now() });
    this.save();
  }

  toggleTask(id: number): void {
    const t = this.tasks.find(t => t.id === id);
    if (t) { t.done = !t.done; this.save(); }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  updateNote(id: number, note: string): void {
    const t = this.tasks.find(t => t.id === id);
    if (t) { t.note = note; this.save(); }
  }

  taskOnDate(task: Task, dateStr: string): boolean {
    const created = new Date(task.id);
    const createdStr = created.toISOString().slice(0, 10);
    if (!task.recur || task.recur === 'none') return createdStr === dateStr;
    if (dateStr < createdStr) return false;
    const dow = new Date(dateStr + 'T00:00:00').getDay();
    if (task.recur === 'daily') return true;
    if (task.recur === 'weekly') return dow === created.getDay();
    if (task.recur === 'weekdays') return dow >= 1 && dow <= 5;
    if (task.recur === 'weekend') return dow === 0 || dow === 6;
    return false;
  }

  // ── CREDENTIALS ────────────────────────────────

  addCredential(cred: Omit<Credential, 'id'>): void {
    this.credentials.push({ ...cred, id: Date.now() });
    this.save();
  }

  deleteCredential(id: number): void {
    this.credentials = this.credentials.filter(c => c.id !== id);
    this.save();
  }

  expiryStatus(exp: string): { cls: string; label: string } {
    if (!exp) return { cls: 'ok', label: 'No expiry' };
    const days = Math.ceil((new Date(exp).getTime() - Date.now()) / 86400000);
    if (days < 0) return { cls: 'exp', label: 'Expired' };
    if (days <= 30) return { cls: 'warn', label: `${days}d left` };
    return { cls: 'ok', label: `${days}d left` };
  }

  // ── PERSISTENCE ────────────────────────────────

  save(): void {
    localStorage.setItem('planner_tasks', JSON.stringify(this.tasks));
    localStorage.setItem('planner_creds', JSON.stringify(this.credentials));
  }

  load(): void {
    this.tasks = JSON.parse(localStorage.getItem('planner_tasks') || '[]');
    this.credentials = JSON.parse(localStorage.getItem('planner_creds') || '[]');
  }

  exportJSON(): void {
    const blob = new Blob(
      [JSON.stringify({ tasks: this.tasks, credentials: this.credentials }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'planner-backup.json';
    a.click();
  }

  importJSON(data: any): void {
    if (data.tasks) this.tasks = data.tasks;
    if (data.credentials) this.credentials = data.credentials;
    this.save();
  }
}