import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSpinner, IonButton, IonButtons, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText,
  LoadingController, AlertController 
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service'; // <--- Importar servicio
import { AsistenciaService } from '../../services/asistencia.service'; // <--- Importar servicio
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera'; // <--- Importar Camera
import { addIcons } from 'ionicons';
import { logOutOutline, locationOutline, checkmarkCircle, closeCircle, cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonSpinner, IonButton, IonButtons, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText
  ]
})
export class HomePage implements OnInit {
  userData: any = null;
  
  // Variables para la ubicación
  distancia: number | null = null;
  estaEnZona = false;
  validandoUbicacion = false;
  mensajeUbicacion = '';

  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController); // Para mostrar mensajes de éxito/error
  private authService = inject(AuthService);
  private locationService = inject(LocationService); // <--- Inyectar servicio
  private asistenciaService = inject(AsistenciaService); // <--- Inyectar
  private router = inject(Router);

  constructor() {
    // Añadimos los iconos necesarios
    addIcons({ 
      'log-out-outline': logOutOutline,
      'location-outline': locationOutline,
      'checkmark-circle': checkmarkCircle,
      'close-circle': closeCircle,
      'camera-outline': cameraOutline
    });
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando perfil...',
      spinner: 'crescent',
    });
    
    await loading.present();

    this.authService.getUsuarioData().subscribe({
      next: (data) => {
        this.userData = data;
        loading.dismiss();
      },
      error: (err) => {
        console.error(err);
        loading.dismiss();
      }
    });
  }

  // Nueva función para validar ubicación
  async verificarUbicacion() {
    this.validandoUbicacion = true;
    this.mensajeUbicacion = 'Obteniendo GPS...';

    try {
      const resultado = await this.locationService.validarUbicacion();
      this.distancia = resultado.distancia;
      this.estaEnZona = resultado.permitido;

      if (this.estaEnZona) {
        this.mensajeUbicacion = 'Ubicación válida. Estás en zona de trabajo.';
      } else {
        this.mensajeUbicacion = `Fuera de rango. Estás a ${this.distancia} metros.`;
      }
    } catch (error) {
      console.error(error);
      this.mensajeUbicacion = 'Error: Activa el GPS y concede permisos.';
    } finally {
      this.validandoUbicacion = false;
    }
  }

  //Funcion para tomar foto y registrar asistencia (Entrada/Salida)
  async tomarFotoYRegistrar(tipo: 'Entrada' | 'Salida') {
  console.log('Iniciando proceso para:', tipo);
  
  // 1. BLOQUEO
  const duplicado = await this.asistenciaService.yaRegistroHoy(tipo);
  
  if (duplicado === true) {
    alert(`ATENCIÓN: Ya registraste tu ${tipo} el día de hoy. No puedes repetir el registro.`);
    return; // <--- ESTO ES LO QUE EVITA QUE SE ABRA LA CÁMARA
  }

  // 2. CÁMARA (Solo llega aquí si duplicado es false)
  try {
    const image = await Camera.getPhoto({
      quality: 40,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction: CameraDirection.Front
    });
    
    // ... resto del código para guardar ...
    if (image.base64String) {
      const pos = await this.locationService.getCurrentPosition();
      await this.asistenciaService.registrarAsistencia(tipo, image.base64String, pos.coords.latitude, pos.coords.longitude);
      alert('Registro guardado');
    }
  } catch (e) {
    console.log('Usuario canceló la cámara');
  }
}


  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }
}