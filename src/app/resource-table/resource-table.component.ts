import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../resource.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { ResourceListService } from '../resource-list.service';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-resource-table',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './resource-table.component.html',
  styleUrl: './resource-table.component.css',
})
export class ResourceTableComponent implements OnInit {
  resources: Resource[] = [];
  role: string | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.firestoreService.getAllResources().subscribe((data: Resource[]) => {
      this.resources = data;
    });

    this.authService.role$.subscribe(r => {
      this.role = r;
    });
  }

  isManager(): boolean {
    return this.role === 'manager';
  }

  async sendToRequestPool() {
    if (!this.isManager()) {
      alert('Only managers can perform this action.');
      return;
    }

    const selected = this.resources.filter(r => r.selected && !r.requested);
    for (const res of selected) {
      if (res.id) {
        await this.firestoreService.updateResource(res.id, { requested: true, selected: false });
      }
    }
  }

  offboardSelected() {
    if (!this.isManager()) {
      alert('Only managers can perform this action.');
      return;
    }

    const selected = this.resources.filter(r => r.selected);
    if (selected.length === 0) {
      alert('Please select at least one member to offboard.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently offboard ${selected.length} member(s)?`)) {
      return;
    }

    selected.forEach(res => {
      if (res.id) {
        this.firestoreService.deleteResource(res.id).then(() => {
          this.resources = this.resources.filter(r => r.id !== res.id);
        });
      }
    });
  }
}
// Note: This component assumes that the FirestoreService has methods like getAllResources, updateResource, and deleteResource implemented.