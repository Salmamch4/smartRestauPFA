import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAchatsComponent } from './update-achats.component';

describe('UpdateAchatsComponent', () => {
  let component: UpdateAchatsComponent;
  let fixture: ComponentFixture<UpdateAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAchatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
