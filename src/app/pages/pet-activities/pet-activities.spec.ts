import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetActivities } from './pet-activities';

describe('PetActivities', () => {
  let component: PetActivities;
  let fixture: ComponentFixture<PetActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
