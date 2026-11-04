import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, updateDoc, doc, where, query, deleteDoc } from '@angular/fire/firestore';
import { Resource } from './resource.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  addResource(data: Resource) {
    const resourcesRef = collection(this.firestore, 'resources');
    return addDoc(resourcesRef, data);
  }

  getAllResources(): Observable<Resource[]> {
    const resourcesRef = collection(this.firestore, 'resources');
    return collectionData(resourcesRef, { idField: 'id' }) as Observable<Resource[]>;
  }

  updateResource(id: string, data: Partial<Resource>) { 
    const resourceDoc = doc(this.firestore, `resources/${id}`);
    return updateDoc(resourceDoc, data);
  }

  getRequestedResources(): Observable<Resource[]> {
    const resourcesRef = collection(this.firestore, 'resources');
    const requestedQuery = query(resourcesRef, where('requested', '==', true));
    return collectionData(requestedQuery, { idField: 'id' }) as Observable<Resource[]>;
  }

  deleteResource(id: string) {
    const resourceDoc = doc(this.firestore, `resources/${id}`);
    return deleteDoc(resourceDoc);
  }
}
