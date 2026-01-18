import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPet } from './add-pet';

describe('AddPet', () => {
  let component: AddPet;
  let fixture: ComponentFixture<AddPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
