import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAchatsComponent } from './add-achats.component';

describe('AddAchatsComponent', () => {
  let component: AddAchatsComponent;
  let fixture: ComponentFixture<AddAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAchatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
