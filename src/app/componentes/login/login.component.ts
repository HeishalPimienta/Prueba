import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../servicios/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  mostrarMensaje(): void {
    Swal.fire({
      title: 'Guía Básica para Nuevos Usuarios',
      html: `
        <h1><strong>¡Bienvenido!</strong></h1>
        <p>Aquí te explicaremos cómo acceder a tu cuenta.</p>
        <h2><strong>Datos de acceso</strong></h2>
        <p><strong>Correo Electrónico:</strong> Tu correo institucional</p>
        <p>Ejemplo: <strong>jperez@uniguajira.edu.co</strong></p>
        <p><strong>Contraseña:</strong> Tu contraseña es tu cédula</p>
      `,
      imageUrl: 'assets/img/icon.png',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Ícono personalizado',
      confirmButtonText: 'Cerrar',
      background: 'black',
      color: 'white',
      confirmButtonColor: '#F0AF2B'
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apiService.login(username, password).subscribe(
        (response) => {
          console.log('Respuesta de login:', response);
          this.apiService.saveUserData(response.token, response.user);
          this.router.navigate(['calendario']);
        },
        (error) => {
          console.error('Error de login', error);
          Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
        }
      );
    }
  }
}