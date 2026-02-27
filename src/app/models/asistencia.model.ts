export interface Asistencia {
  uid: string;
  tipo: 'Entrada' | 'Salida';
  fecha: string;
  latitud: number;
  longitud: number;
  fotoBase64: string; // Guardaremos la imagen como texto aquí [cite: 158]
}