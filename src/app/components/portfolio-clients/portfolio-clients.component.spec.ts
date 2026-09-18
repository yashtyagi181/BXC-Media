import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioClientsComponent } from './portfolio-clients.component';

describe('PortfolioClientsComponent', () => {
  let component: PortfolioClientsComponent;
  let fixture: ComponentFixture<PortfolioClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
