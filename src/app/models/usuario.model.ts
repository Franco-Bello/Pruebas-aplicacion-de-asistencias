export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: 'empleado' | 'admin';
  fechaCreacion?: Date;
}