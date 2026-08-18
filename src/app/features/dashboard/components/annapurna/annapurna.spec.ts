import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Annapurna } from './annapurna';

describe('Annapurna', () => {
  let component: Annapurna;
  let fixture: ComponentFixture<Annapurna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Annapurna]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Annapurna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
