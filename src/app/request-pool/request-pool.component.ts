import { Component, OnInit } from '@angular/core';
import { Resource } from '../resource.model';
import { FirestoreService } from '../firestore.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-pool',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './request-pool.component.html',
  styleUrl: './request-pool.component.css'
})
export class RequestPoolComponent implements OnInit {

  requestedResources: Resource[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.loadRequestedResources();
  }

  loadRequestedResources() {
    this.firestoreService.getRequestedResources().subscribe((data: Resource[]) => {
      this.requestedResources = data;
    });
  }

  async bulkAccept() {
    for (const res of this.requestedResources) {
      if (res.selected && res.id) {
        await this.firestoreService.updateResource(res.id, { allocated: true, selected: false });
        // console.log(`Accepted: ${res.name}`);
        res.selected = false;
        res.allocated = true; // Mark as allocated

      }
    }
  }

  async bulkReject() {
    for (const res of this.requestedResources) {
      if (res.selected && res.id) {
        await this.firestoreService.updateResource(res.id, { requested: false, selected: false });
        // console.log(`Rejected: ${res.name}`);
      }
    }
    this.loadRequestedResources();
  }
}
