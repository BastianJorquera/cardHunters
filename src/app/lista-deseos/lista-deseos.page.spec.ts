import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDeseosPage } from './lista-deseos.page';

describe('ListaDeseosPage', () => {
  let component: ListaDeseosPage;
  let fixture: ComponentFixture<ListaDeseosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDeseosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
