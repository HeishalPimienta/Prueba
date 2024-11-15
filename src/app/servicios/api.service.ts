// src/app/servicios/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:3000"; // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método de inicio de sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }

  // Guardar token y datos de usuario en localStorage
  saveUserData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtener datos del usuario
  getUserData(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token JWT desde localStorage

    if (!token) {
      throw new Error('No se encontró el token');
    }

    return this.http.get(`${this.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}` // Enviar el token en el header Authorization
      }
    });
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);  // Obtiene los eventos del backend
  }

// Método para registrar un usuario
register(username: string, password: string, role: string): Observable<any> {
  const body = { username, password, role };
  return this.http.post(`${this.apiUrl}/register`, body);
}
  // Borrar datos del usuario y token
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para obtener eventos del usuario
  getUserEvents(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.apiUrl}/events`, { headers });
  }

  // Método para crear un nuevo evento
  createEvent(eventData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/events`, eventData, { headers });
  }

  // Método para eliminar un evento
  deleteEvent(eventId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(`${this.apiUrl}/events/${eventId}`, { headers });
  }
}
