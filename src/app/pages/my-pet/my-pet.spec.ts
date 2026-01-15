import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPet } from './my-pet';

describe('MyPet', () => {
  let component: MyPet;
  let fixture: ComponentFixture<MyPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
