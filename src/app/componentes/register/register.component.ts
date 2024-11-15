import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { ApiService } from '../../servicios/api.service';// Asegúrate de tener el ApiService configurado
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    // Inicializa el formulario con validaciones
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  // Método para manejar el registro
  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, password, role } = this.registerForm.value;

      // Llama al API para registrar el usuario
      this.apiService.register(username, password, role).subscribe(
        response => {
          console.log('Usuario registrado exitosamente', response);
          // Redirige al login o a otra página después de un registro exitoso
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al registrar usuario', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
