import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorcontrasteComponent } from './colorcontraste.component';

describe('ColorcontrasteComponent', () => {
  let component: ColorcontrasteComponent;
  let fixture: ComponentFixture<ColorcontrasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorcontrasteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorcontrasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
