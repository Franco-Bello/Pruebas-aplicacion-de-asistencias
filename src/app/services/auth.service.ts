import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user 
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inyectamos las herramientas de Firebase
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Este es el observable que usará el Guard para saber si estás logueado
  user$ = user(this.auth);

  constructor() {}

  // 1. REGISTRO DE NUEVOS USUARIOS (Requisito 1.a del PDF)
  async register(email: string, pass: string, nombre: string) {
    // Crea el usuario en la pestaña "Authentication" de Firebase
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    
    // Guarda datos extra (como el nombre) en la base de datos Firestore
    return setDoc(doc(this.firestore, `usuarios/${credential.user.uid}`), {
      uid: credential.user.uid,
      nombre: nombre,
      email: email,
      rol: 'empleado'
    });
  }

  // 2. LOGIN CON CREDENCIALES (Requisito 1.b del PDF)
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 3. CERRAR SESIÓN
  logout() {
    return signOut(this.auth);
  }

   
  // 4. Esta función devuelve un Observable con los datos de Firestore del usuario actual
  getUsuarioData(): Observable<any> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          // Si hay un usuario logueado, buscamos su documento en la colección 'usuarios'
          const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
          return docData(userDocRef);
        } else {
          // Si no hay usuario, devolvemos null
        return of(null);
        }
      })
    );
  }

  // 5. Obtener el objeto de usuario actual (Promesa)
  getUsuarioActual() {
    return new Promise((resolve) => {
      const unsub = this.auth.onAuthStateChanged(user => {
        unsub();
        resolve(user);
      });
    });
  }

}