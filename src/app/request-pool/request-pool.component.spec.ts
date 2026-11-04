import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPoolComponent } from './request-pool.component';

describe('RequestPoolComponent', () => {
  let component: RequestPoolComponent;
  let fixture: ComponentFixture<RequestPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
