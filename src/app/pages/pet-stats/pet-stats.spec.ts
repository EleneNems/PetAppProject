import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetStats } from './pet-stats';

describe('PetStats', () => {
  let component: PetStats;
  let fixture: ComponentFixture<PetStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
