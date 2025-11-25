import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarPublicacionPage } from './generar-publicacion.page';

describe('GenerarPublicacionPage', () => {
  let component: GenerarPublicacionPage;
  let fixture: ComponentFixture<GenerarPublicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarPublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
