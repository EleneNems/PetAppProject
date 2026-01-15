import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetStore } from './pet-store';

describe('PetStore', () => {
  let component: PetStore;
  let fixture: ComponentFixture<PetStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
