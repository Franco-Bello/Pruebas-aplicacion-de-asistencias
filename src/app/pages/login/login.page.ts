import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
  IonLabel, IonInput, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, 
    IonLabel, IonInput, IonButton, IonIcon,
    CommonModule, FormsModule, RouterLink
  ]
})
export class LoginPage {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({ personCircleOutline });
  }

  async onLogin() {
    if (this.email && this.password) {
      try {
        await this.authService.login(this.email, this.password);
        console.log('Login exitoso');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } catch (error) {
        console.error('Error al iniciar sesión', error);
        alert('Credenciales incorrectas o usuario no existe.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}