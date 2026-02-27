import { Component, OnInit, inject } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonIcon, IonCard, IonItem, IonAvatar, IonLabel, 
  IonBadge, IonCardContent, IonThumbnail 
} from '@ionic/angular/standalone'; // <--- IMPORTANTE

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true, // Asegúrate de que diga true
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonIcon, IonCard, IonItem, IonAvatar, IonLabel, 
    IonBadge, IonCardContent, IonThumbnail
  ] // <--- AGREGA ESTO
})
export class HistorialPage implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  asistencias: any[] = [];
  cargando = false;

  constructor() {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  // ESTE EVENTO ES CLAVE: Se dispara cada vez que la página se vuelve visible
  async ionViewWillEnter() {
    this.cargando = true;
    try {
      this.asistencias = await this.asistenciaService.getMisRegistros();
      console.log('Registros recuperados:', this.asistencias.length);
    } catch (error) {
      console.error('Error al cargar historial', error);
    } finally {
      this.cargando = false;
    }
  }

}