import { Component, inject, Renderer2 } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username: string = '';
  role: string = '';
  email: String = '';
  isAuthenticated: boolean = false;
  user: any;
 
  private renderer = inject(Renderer2);
  private apiService = inject(ApiService);
  private router = inject(Router);
  

  ngOnInit(): void {
    this.apiService.getUserData().subscribe({
      next: (data) => {
        this.username = data.username; // Asigna el nombre de usuario
        this.role = data.role;         // Asigna el rol del usuario
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario:', err);
      }
    });
  }


  logout(): void {
    this.apiService.logout();  // Llama al método logout del servicio
    this.isAuthenticated = false;  // Marca como no autenticado
    this.router.navigate(['/login']);  // Redirige al login
  }
  
  toggleSidebar() {
    const body = document.body;
    
    if (body.classList.contains('sidebar-collapse')) {
      // Remover clase para expandir
      this.renderer.removeClass(body, 'sidebar-collapse');
      this.renderer.addClass(body,"sidebar-open");
    } else {
      // Añadir clase para colapsar
      this.renderer.removeClass(body,'sidebar-open');
      this.renderer.addClass(body, 'sidebar-collapse');
    }
  }
  
}