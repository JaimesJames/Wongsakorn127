import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosygameComponent } from './nosygame.component';

describe('NosygameComponent', () => {
  let component: NosygameComponent;
  let fixture: ComponentFixture<NosygameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosygameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NosygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
