import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPhonesComponent } from './video-phones.component';

describe('VideoPhonesComponent', () => {
  let component: VideoPhonesComponent;
  let fixture: ComponentFixture<VideoPhonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPhonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPhonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
