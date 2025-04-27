import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KingleegameComponent } from './kingleegame.component';

describe('KingleegameComponent', () => {
  let component: KingleegameComponent;
  let fixture: ComponentFixture<KingleegameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KingleegameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KingleegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
