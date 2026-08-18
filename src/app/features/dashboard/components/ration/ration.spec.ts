import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ration } from './ration';

describe('Ration', () => {
  let component: Ration;
  let fixture: ComponentFixture<Ration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
