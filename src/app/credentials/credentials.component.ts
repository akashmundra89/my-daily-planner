import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerService, Credential } from '../planner.service';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent {

  name   = '';
  org    = '';
  expiry = '';
  type: Credential['type'] = 'Certification';

  constructor(public planner: PlannerService) {}

  add(): void {
    if (!this.name.trim()) return;
    this.planner.addCredential({
      name:   this.name.trim(),
      org:    this.org.trim(),
      expiry: this.expiry,
      type:   this.type
    });
    this.name = this.org = this.expiry = '';
  }
}
