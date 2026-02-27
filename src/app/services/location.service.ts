import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // Requisito 5.a: Ubicación válida precargada (Ejemplo: Plaza San Martín, Cipolletti)
  // Cambia estas coordenadas por las que quieras usar para tu prueba
  private readonly TRABAJO_LAT = -38.6866788; 
  private readonly TRABAJO_LNG = -68.1594848;
  private readonly RADIO_MAXIMO_METROS = 2000; // Radio de tolerancia (Requisito 2.c)

  constructor() { }

  /**
   * Obtiene la posición actual pidiendo permisos primero.
   * Requisito Técnico: Uso de la API de Geolocation (Capacitor).
   */
  async getCurrentPosition() {
    // Guía del profesor: Siempre pedir permisos en tiempo de ejecución
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted') {
      await Geolocation.requestPermissions();
    }

    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true // Mayor precisión para el GPS
    });
  }

  /**
   * Valida si el usuario está dentro del rango permitido.
   * Requisito Técnico: Validación de distancia (Fórmula de Haversine).
   */
  async validarUbicacion(): Promise<{ permitido: boolean, distancia: number }> {
    const position = await this.getCurrentPosition();
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const distancia = this.calcularDistancia(
      userLat, userLng, 
      this.TRABAJO_LAT, this.TRABAJO_LNG
    );

    return {
      permitido: distancia <= this.RADIO_MAXIMO_METROS,
      distancia: Math.round(distancia)
    };
  }

  // Lógica matemática para calcular la distancia entre dos coordenadas (Haversine)
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }
}