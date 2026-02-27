import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy 
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // REQUISITO 3.a: Control de duplicidad mejorado
async yaRegistroHoy(tipo: 'Entrada' | 'Salida'): Promise<boolean> {
  try {
    const user = this.auth.currentUser;
    if (!user) return false;

    const ahora = new Date();
    // Formato YYYY-MM-DD para evitar problemas de milisegundos
    //const hoyFecha = ahora.toISOString().split('T')[0]; 
    const hoyFecha = ahora.toLocaleDateString('en-CA'); // Retorna YYYY-MM-DD
    
    console.log(`Verificando ${tipo} para hoy: ${hoyFecha}`);

    const q = query(
      collection(this.firestore, 'asistencias'),
      where('uid', '==', user.uid),
      where('tipo', '==', tipo)
    );

    const querySnapshot = await getDocs(q);
    
    // Filtrado manual por fecha para evitar el error de "Índice faltante" de Firestore
    const registrosDeHoy = querySnapshot.docs.filter(doc => {
      const fechaDoc = doc.data()['fecha'].split('T')[0];
      return fechaDoc === hoyFecha;
    });

    console.log(`Total encontrados hoy: ${registrosDeHoy.length}`);
    return registrosDeHoy.length > 0;

  } catch (error) {
    console.error("ERROR EN VALIDACIÓN:", error);
    return false; 
  }
}

// NUEVO: Función para obtener el historial de asistencias (Punto 5.a del PDF)
  async getMisRegistros() {
    try {
      const user = this.auth.currentUser;
      if (!user) return [];

      // Consulta: Mis registros ordenados por fecha de más nuevo a más viejo
      const q = query(
        collection(this.firestore, 'asistencias'),
        where('uid', '==', user.uid),
        orderBy('fecha', 'desc') 
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener historial:", error);
      return [];
    }
  }

  async registrarAsistencia(tipo: 'Entrada' | 'Salida', fotoBase64: string, lat: number, lng: number) {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");

    const registro = {
      uid: user.uid,
      email: user.email,
      tipo: tipo,
      fecha: new Date().toISOString(), // Formato ISO estandarizado
      ubicacion: { 
        latitud: lat, 
        longitud: lng 
      },
      foto: fotoBase64 
    };

    return addDoc(collection(this.firestore, 'asistencias'), registro);
  }
}