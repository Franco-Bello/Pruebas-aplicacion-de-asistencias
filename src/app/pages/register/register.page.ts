import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
  IonLabel, IonInput, IonButton, IonBackButton, IonButtons 
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
    IonLabel, IonInput, IonButton, IonBackButton, IonButtons,
    CommonModule, FormsModule
  ]
})
export class RegisterPage {
  // Variables para el formulario
  nombre = '';
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onRegister() {
    if (this.nombre && this.email && this.password) {
      try {
        // Llamamos a la función que creamos en el AuthService
        await this.authService.register(this.email, this.password, this.nombre);
        console.log('Usuario registrado y perfil creado en Firestore');
        
        // Si sale bien, lo mandamos directo al Home
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } catch (error) {
        console.error('Error en el registro:', error);
        alert('Error al registrar: ' + error);
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}