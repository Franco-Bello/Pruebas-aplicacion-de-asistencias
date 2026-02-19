import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// --- IMPORTA LOS MÓDULOS DE AUTENTICACIÓN DE FIREBASE ---
import { provideAuth, getAuth } from '@angular/fire/auth';

// --- ESTOS SON LOS IMPORTES DE FIREBASE QUE NECESITAS ---
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment'; 
// -------------------------------------------------------

// --- INICIALIZACIÓN DE FIREBASE AQUÍ ---
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

        // --- INICIALIZACIÓN AQUÍ ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),

    //Modulo de autenticación de Firebase
    provideAuth(() => getAuth()),
  ],
});
