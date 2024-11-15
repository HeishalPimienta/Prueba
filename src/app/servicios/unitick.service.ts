import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitickService {

    private usuarios: { nombre: string; email: string; password: string }[] = [];
  
    constructor() {}
  
    getUsuarios() {
      return this.usuarios;
    }
  
    agregarUsuario(usuario: { nombre: string; email: string; password: string }) {
      this.usuarios.push(usuario);
    }
  
    eliminarUsuario(index: number) {
      this.usuarios.splice(index, 1); // Elimina el usuario en la posición especificada
    }
  }
  

