import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Resource } from '../resource.model';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resource-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent implements OnInit {

  skillOptions = ['Angular', 'React', 'Node', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'JavaScript', 'TypeScript'];
  isSubmitting = false;

  resource: Resource = {
    id: '',
    name: '',
    skillset: [],
    primarySkill: '',
    experience: 0,
    designation: '',
    resumeName: '',
    resumeUrl: '',
    selected: false,
    requested: false
  };

  resources: Resource[] = [];

  constructor(private firestoreService: FirestoreService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.firestoreService.getAllResources().subscribe(data => {
      this.resources = data;
    });
  }

  toggleSkillSelection(event: Event, skill: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.resource.skillset.push(skill);
    } else {
      this.resource.skillset = this.resource.skillset.filter(s => s !== skill);
    }
  }

  async submit(event?: Event) {
    if (event) event.preventDefault();
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const newResource: Resource = {
      ...this.resource,
      skillset: [...new Set(this.resource.skillset)],
      selected: false,
      requested: false
    };

    this.firestoreService.addResource(newResource).then(() => {
      this.resetForm();
      this.isSubmitting = false;
    }).catch(err => {
      console.error('Error adding resource:', err);
      this.isSubmitting = false;
    });
  }

  resetForm() {
    this.resource = {
      id: '',
      name: '',
      skillset: [],
      primarySkill: '',
      experience: 0,
      designation: '',
      resumeName: '',
      resumeUrl: '',
      selected: false,
      requested: false
    };
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }
}
