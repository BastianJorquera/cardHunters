import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPublicacionesPage } from './historial-publicaciones.page';

describe('HistorialPublicacionesPage', () => {
  let component: HistorialPublicacionesPage;
  let fixture: ComponentFixture<HistorialPublicacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPublicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
