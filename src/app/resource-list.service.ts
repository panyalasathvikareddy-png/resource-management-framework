import { Injectable } from '@angular/core';
import { Resource } from './resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceListService {

  private dataList: Resource[] = [];
  
  constructor() { }

  addResource(resource: Resource): void {
    console.log('Adding resource:', resource);
    this.dataList.push(resource);
  }

  getResources() : Resource[] {
    console.log('Getting resources:', this.dataList);
    return this.dataList;
  } 
  getRequestedResources(): Resource[] {
    return this.dataList.filter(r => r.requested);
  }

  moveToRequestPool(selectedResources: Resource[]): void {
    selectedResources.forEach(res => {
      res.requested = true;
    });
  }
}


