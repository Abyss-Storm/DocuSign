import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigiSignComponent } from './digi-sign.component';

describe('DigiSignComponent', () => {
  let component: DigiSignComponent;
  let fixture: ComponentFixture<DigiSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigiSignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigiSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
