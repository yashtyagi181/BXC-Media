import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesDetailedComponent } from './case-studies-detailed.component';

describe('CaseStudiesDetailedComponent', () => {
  let component: CaseStudiesDetailedComponent;
  let fixture: ComponentFixture<CaseStudiesDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseStudiesDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
