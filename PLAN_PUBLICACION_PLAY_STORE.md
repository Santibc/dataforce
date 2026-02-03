# Plan: Publicar App Bosmetrics en Google Play Store 2026

> **Progreso Actual:** ✅ Fase 1 COMPLETADA | 🔄 Fase 2 en curso
>
> **Última actualización:** 3 de Febrero 2026

---

## Resumen Ejecutivo

Publicar la app React Native "Bosmetrics" (com.bosmetrics) en Google Play Store siguiendo los requisitos actualizados de 2026, incluyendo:
- Formato Android App Bundle (AAB) obligatorio
- Verificación de desarrollador (nuevo en 2026)
- Target API Level 35 (Android 15)
- Play App Signing obligatorio

**Cuenta Play Console:** datafs.adm@gmail.com

---

## PROGRESO ACTUAL

### ✅ FASE 1: PREPARACIÓN DE LA APP - COMPLETADA

**Cambios realizados (Commit: 58a0cf6):**
- ✅ Keystore de producción generado: `android/app/bosmetrics-release.keystore`
- ✅ Signing configs configurado en `build.gradle`
- ✅ ProGuard y shrinkResources habilitados
- ✅ Versión actualizada a 1.0.0 (Build 1)
- ✅ `.env` con `PRODUCTION=true`
- ✅ Keystore agregado a `.gitignore`

**Credenciales del keystore:**
- Archivo: `bosmetrics-release.keystore`
- Alias: `bosmetrics`
- Contraseña: `Bosmetrics2024!`
- ⚠️ **IMPORTANTE:** Hacer backup del keystore en ubicación segura

---

## FASE 1: PREPARACIÓN DE LA APP ✅

### 1.1 Generar Keystore de Producción ✅

**Problema Crítico Actual:** La app usa keystore de debug para release builds.

**Acción:**
```bash
cd f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android/app
keytool -genkeypair -v -keystore bosmetrics-release.keystore -alias bosmetrics -keyalg RSA -keysize 2048 -validity 10000
```

**Información requerida:**
- Contraseña del keystore (guardar de forma segura)
- Nombre y apellido
- Unidad organizativa: Bosmetrics
- Organización: Bosmetrics
- Ciudad/Localidad
- Estado/Provincia
- Código de país: US (o el correspondiente)

**IMPORTANTE:**
- Guardar el keystore en un lugar seguro (fuera del repositorio)
- Anotar las contraseñas en un gestor seguro
- Hacer backup del keystore - si se pierde, no se pueden hacer actualizaciones

**NOTA:** Los datos del certificado (CN, OU, O, etc.) NO son validados por Google. Son solo para referencia interna. Google usa Play App Signing y verificará tu identidad de forma separada en la Fase 3.

**Archivos a modificar:**
- `android/gradle.properties`
- `android/app/build.gradle`

### 1.2 Configurar Firma de Release ✅

**Archivo:** `android/gradle.properties`

Agregar al final:
```properties
BOSMETRICS_RELEASE_STORE_FILE=bosmetrics-release.keystore
BOSMETRICS_RELEASE_KEY_ALIAS=bosmetrics
BOSMETRICS_RELEASE_STORE_PASSWORD=<contraseña-keystore>
BOSMETRICS_RELEASE_KEY_PASSWORD=<contraseña-alias>
```

**Archivo:** `android/app/build.gradle`

Modificar sección signingConfigs:
```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        if (project.hasProperty('BOSMETRICS_RELEASE_STORE_FILE')) {
            storeFile file(BOSMETRICS_RELEASE_STORE_FILE)
            storePassword BOSMETRICS_RELEASE_STORE_PASSWORD
            keyAlias BOSMETRICS_RELEASE_KEY_ALIAS
            keyPassword BOSMETRICS_RELEASE_KEY_PASSWORD
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release  // CAMBIAR de .debug a .release
        shrinkResources true  // CAMBIAR a true
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

### 1.3 Habilitar Optimizaciones ✅

**Archivo:** `android/gradle.properties`

Cambiar:
```properties
android.enableProguardInReleaseBuilds=true
android.enableShrinkResourcesInReleaseBuilds=true
```

**Beneficio:** Reduce el tamaño del APK/AAB en 30-50%

### 1.4 Actualizar Versión de la App ✅

**Archivo:** `android/app/build.gradle`

Cambiar:
```gradle
defaultConfig {
    versionCode 1
    versionName "1.0.0"  // CAMBIAR de "0.0.1" a "1.0.0"
}
```

### 1.5 Verificar Target SDK ✅

**Requisito 2026:** Target API Level 35 (Android 15)

**Archivo:** `android/build.gradle`

Verificar (ya está correcto):
```gradle
compileSdkVersion = 34  // Actualizar a 35 cuando esté disponible
targetSdkVersion = 34   // Actualizar a 35 cuando esté disponible
```

**NOTA:** Si API 35 no está disponible aún, usar 34 temporalmente. Google puede requerir 35 más adelante en 2026.

---

## FASE 2: GENERACIÓN DEL ANDROID APP BUNDLE (AAB)

### 2.1 Limpiar Build Anterior

```bash
cd f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android
./gradlew clean
```

**Propósito:** Eliminar archivos de builds anteriores para asegurar un build limpio.

### 2.2 Generar AAB de Release

**Opción A - Usar script npm (Recomendado):**
```bash
cd f:/xamppPro80/htdocs/dataforce/dataforce-app-develop
npm run build:android-aab
```

**Opción B - Usar gradlew directo:**
```bash
cd f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android
./gradlew bundleRelease
```

**Tiempo estimado:** 5-15 minutos dependiendo de la máquina

### 2.3 Ubicar el AAB Generado

**Ubicación:**
```
f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android/app/build/outputs/bundle/release/app-release.aab
```

**Verificación:**
- Tamaño aproximado: 30-50 MB (puede variar)
- Formato: .aab (Android App Bundle)
- Fecha de modificación reciente

### 2.4 Probar el Build Localmente (Opcional)

```bash
# Usar bundletool para generar APKs del AAB
bundletool build-apks --bundle=app-release.aab --output=app.apks --mode=universal

# Instalar en dispositivo
bundletool install-apks --apks=app.apks
```

**Nota:** Este paso es opcional pero recomendado para verificar que el AAB se generó correctamente.

---

## FASE 3: VERIFICACIÓN DE DESARROLLADOR (Nuevo en 2026)

**Requisito 2026:** Todos los desarrolladores deben verificar su identidad antes de publicar apps.

### 3.1 Acceder a Play Console

1. Ir a: https://play.google.com/console
2. Iniciar sesión con: datafs.adm@gmail.com
3. Contraseña: 40112V

### 3.2 Pagar One-time Registration Fee

**Costo:** $25 USD (pago único, una sola vez)

**Métodos de pago:**
- Tarjeta de crédito/débito
- Google Pay (si está configurado)

**IMPORTANTE:** Sin este pago, no puedes crear apps ni publicar.

### 3.3 Completar Verificación de Desarrollador

**Proceso (según Google 2026):**

1. En Play Console, ir a "Developer Account" o "Account Details"
2. Buscar sección "Developer Verification" o "Identity Verification"
3. Proporcionar:
   - **Documento de identidad oficial:** DNI, Pasaporte, Licencia de conducir
   - **Información de contacto verificable:** Email, teléfono
   - **Dirección física:** Dirección real donde se ubica el desarrollador
   - **Número de teléfono:** Para verificación por SMS/llamada
4. Tomar foto del documento (ambos lados si aplica)
5. Selfie de verificación (en algunos casos)
6. Enviar para revisión

**Tiempo de aprobación:** 1-7 días hábiles

**Estados posibles:**
- ⏳ Pending review (En revisión)
- ✅ Verified (Verificado)
- ❌ Needs more information (Requiere más info)

**IMPORTANTE:** Sin verificación completada, no se pueden publicar apps nuevas en 2026.

---

## FASE 4: CONFIGURACIÓN EN GOOGLE PLAY CONSOLE

### 4.1 Crear Nueva App (Si no existe)

1. En Play Console, click "Create app" o "All apps" > "Create app"
2. Completar información básica:
   - **App name:** Bosmetrics
   - **Default language:** English (US) o Spanish (Spain)
   - **App or game:** App
   - **Free or paid:** Free
   - **User program policies:** Aceptar que la app cumple con políticas
   - **US export laws:** Declarar si contiene encriptación
3. Click "Create app"

### 4.2 Configurar App Signing

**Play App Signing (Obligatorio desde 2021):**

1. En App > Setup > App signing
2. Opciones:
   - **Let Google create and manage my app signing key (Recommended)**
   - **Upload a key exported from Android Studio**

3. **Recomendado:** Seleccionar opción de que Google genere la clave
4. Cuando subas el primer AAB, Google automáticamente:
   - Generará la app signing key (clave de firma de app)
   - Usará tu keystore como upload key (clave de subida)
5. Descargar y guardar el certificado de upload key para tus registros

**¿Por qué Play App Signing?**
- Google gestiona la clave de firma de forma segura
- Si pierdes tu upload key, puedes solicitar reset (con app signing key no puedes)
- Optimizaciones automáticas por dispositivo

### 4.3 Completar Store Listing

**Dashboard > Grow > Store presence > Main store listing**

**Información requerida:**

#### Textos:
- **App name:** Bosmetrics (30 caracteres max)
- **Short description:** (Max 80 caracteres)
  - Ejemplo: "Gestión de turnos y performance para equipos de trabajo"
- **Full description:** (Max 4000 caracteres)
  - Incluir:
    - Qué hace la app
    - Principales funcionalidades
    - Beneficios para el usuario
    - Requisitos si aplica

#### Gráficos:
- **App icon:** 512x512 PNG, 32-bit con alpha
  - Ubicación sugerida: `assets/icon-512.png`

- **Feature graphic:** 1024x500 PNG o JPG
  - Banner principal de la app
  - Crear en herramienta de diseño (Figma, Canva, etc.)

- **Phone screenshots:** Mínimo 2, máximo 8 (recomendado 4-8)
  - Dimensiones: 16:9 o 9:16
  - Resolución mínima: 320px en lado corto
  - Formatos: PNG o JPG (24-bit, sin alpha)
  - **Recomendación:** Tomar screenshots de features principales:
    - Pantalla de login
    - Dashboard principal
    - Vista de calendario/turnos
    - Perfil de usuario

- **Tablet screenshots (Opcional):**
  - 7 pulgadas y 10 pulgadas
  - Solo si la app está optimizada para tablets

#### Información adicional:
- **App category:**
  - Business / Productivity (Negocios / Productividad)
  - Tools (Herramientas)
  - *Elegir la más apropiada según funcionalidad*

- **Tags (opcional):** Palabras clave para descubrimiento

- **Contact details:**
  - **Email:** datafs.adm@gmail.com (debe estar verificado)
  - **Phone (opcional):** Incluir si quieres soporte telefónico
  - **Website (opcional):** URL del sitio web de la empresa/app

- **Privacy Policy URL:** URL pública obligatoria
  - Ejemplo: `https://bosmetrics.com/privacy`
  - Debe ser accesible públicamente (no detrás de login)
  - Ver sección de Legal y Cumplimiento

### 4.4 Configurar Content Rating

**Dashboard > Policy > App content > Content rating**

**Proceso IARC (International Age Rating Coalition):**

1. Click "Start questionnaire"
2. **Seleccionar categoría de app:**
   - Utility, Productivity, Communication or Other
   - Reference, News, or Educational
   - etc.

3. **Responder cuestionario honesto sobre:**
   - **Violencia:** ¿Contiene violencia? ¿Qué tipo?
   - **Contenido sexual:** ¿Contenido sexual o desnudez?
   - **Lenguaje:** ¿Lenguaje fuerte o blasfemias?
   - **Drogas/alcohol:** ¿Referencias a drogas o alcohol?
   - **Miedo/horror:** ¿Contenido que puede asustar?
   - **Juegos de azar:** ¿Contiene apuestas con dinero real?
   - **Interacciones con otros usuarios:** ¿Los usuarios pueden comunicarse?
   - **Compras in-app:** ¿Permite compras?
   - **Ubicación:** ¿Comparte ubicación de usuarios?

4. **Obtener clasificación automática** para diferentes regiones:
   - ESRB (Estados Unidos)
   - PEGI (Europa)
   - USK (Alemania)
   - ClassInd (Brasil)
   - Etc.

5. **Guardar certificado:** Se genera automáticamente

**Ejemplo para app de gestión de turnos:**
- Violencia: No
- Contenido sexual: No
- Lenguaje: No
- Drogas: No
- Horror: No
- Juegos de azar: No
- Interacciones entre usuarios: Sí (mensajes, coordinación)
- Compras: Sí/No según tu modelo
- Ubicación: Sí/No según tu app

**Resultado típico:** Everyone / PEGI 3 / Para todos

### 4.5 Configurar Target Audience and Content

**Dashboard > Policy > App content > Target audience and content**

1. **Seleccionar rango de edad objetivo:**
   - Ages 13+ (13 años o más) - Común para apps de productividad
   - Ages 18+ (18 años o más) - Si es app empresarial
   - All ages (Todas las edades) - Si es apropiada para todos

2. **¿La app está diseñada para niños?**
   - No (para apps de negocios/productividad)
   - Yes - Requiere compliance adicional COPPA

3. **Declaración de publicidad:**
   - ¿Contiene anuncios? Sí/No
   - Si sí: ¿Son apropiados para niños? (si aplica)

### 4.6 Configurar Privacy & Security (Data Safety)

**Dashboard > Policy > App content > Data safety**

**Objetivo:** Declarar qué datos recopila la app y cómo se usan.

**Secciones:**

#### 1. Data collection and security
**¿Recopila o comparte datos de usuarios?**
- Yes - La mayoría de apps
- No - Solo si no recopila ningún dato

#### 2. Data types collected
Seleccionar tipos de datos que recopila:

**Datos personales:**
- ✅ **Name** (Nombre) - Si pides nombre en registro
- ✅ **Email address** (Email) - Para login
- ✅ **Phone number** (Teléfono) - Si lo recopilas
- ⬜ **Physical address** (Dirección física)
- ⬜ **User IDs** (IDs de usuario)

**Datos de ubicación:**
- ⬜ **Approximate location** (Ubicación aproximada)
- ⬜ **Precise location** (Ubicación precisa)

**Archivos y fotos:**
- ⬜ **Photos** (Fotos)
- ⬜ **Videos** (Videos)
- ⬜ **Files and docs** (Archivos y documentos)

**Actividad de la app:**
- ✅ **App interactions** (Interacciones en la app)
- ⬜ **In-app search history** (Historial de búsqueda)
- ✅ **App diagnostics** (Diagnósticos) - Si usas analytics

**Información del dispositivo:**
- ✅ **Device or other IDs** (IDs de dispositivo) - Para notificaciones push

#### 3. Purpose of data collection
Para cada tipo de dato, especificar:
- **App functionality** (Funcionalidad de la app)
- **Analytics** (Analíticas)
- **Developer communications** (Comunicaciones del desarrollador)
- **Advertising or marketing** (Publicidad)
- **Fraud prevention, security** (Prevención de fraude)
- **Personalization** (Personalización)
- **Account management** (Gestión de cuenta)

#### 4. Data handling
- **¿Datos encriptados en tránsito?** Yes (HTTPS)
- **¿Datos encriptados en reposo?** Yes/No según tu backend
- **¿Usuarios pueden solicitar eliminación de datos?** Yes (GDPR compliance)

#### 5. Justificación de permisos Android

**Permisos que usa Bosmetrics (de AndroidManifest.xml):**

- **INTERNET:**
  - Propósito: Comunicación con servidor backend
  - Justificación: "Necesario para sincronizar datos de turnos y performance con el servidor"

- **READ_EXTERNAL_STORAGE:**
  - Propósito: [Definir según uso real]
  - Ejemplo: "Para seleccionar fotos de perfil"

- **WRITE_EXTERNAL_STORAGE:**
  - Propósito: [Definir según uso real]
  - Ejemplo: "Para guardar reportes exportados"

- **RECORD_AUDIO:**
  - Propósito: [Definir según uso real]
  - **⚠️ IMPORTANTE:** Si no se usa, ELIMINAR del AndroidManifest

- **SYSTEM_ALERT_WINDOW:**
  - Propósito: [Definir según uso real]
  - Ejemplo: "Para mostrar notificaciones flotantes de turnos"
  - **⚠️ Permiso peligroso:** Justificar claramente o eliminar

- **VIBRATE:**
  - Propósito: Notificaciones hápticas
  - Justificación: "Para alertas de notificaciones"

**Recomendación:** Revisar AndroidManifest y ELIMINAR permisos no utilizados antes de publicar.

### 4.7 Configurar Pricing & Distribution

**Dashboard > Release > Setup > Countries / regions**

1. **Countries:** Seleccionar países donde estará disponible
   - Opción 1: All countries (Todos los países)
   - Opción 2: Seleccionar países específicos
   - **Recomendación:** Empezar con tu país + países vecinos

2. **Pricing:**
   - ✅ Free (Gratis)
   - ⬜ Paid (De pago) - Requiere configuración de merchant

3. **Contains ads:**
   - Yes - Si la app muestra anuncios
   - No - Si no tiene publicidad

4. **In-app purchases:**
   - Yes - Si permite compras dentro de la app
   - No - Si no tiene compras

5. **App access:**
   - **All or some functionality is restricted**
   - **All functionality is available without restrictions**
   - Si la app requiere login para funcionar: Seleccionar "restricted"

6. **Content guidelines:**
   - Confirmar que cumples con políticas de contenido
   - Confirmar que cumples con leyes de exportación de EE.UU.

7. **Google Play for Education:**
   - Yes - Si quieres que esté disponible en programa educativo
   - No - Para apps de negocios típicamente "No"

---

## FASE 5: SUBIDA Y TESTING

### 5.1 Crear Release en Internal Testing

**Dashboard > Release > Testing > Internal testing**

**¿Por qué Internal Testing primero?**
- Probar el AAB antes de llegar a producción
- Identificar crashes early
- Verificar que la app funciona en dispositivos reales
- No requiere revisión de Google (aprobación instantánea)

**Pasos:**

1. Click "Create new release"

2. **Subir AAB:**
   - Opción A: Drag & drop `app-release.aab` a la zona de upload
   - Opción B: Click botón "Upload" y seleccionar archivo
   - Ubicación: `f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android/app/build/outputs/bundle/release/app-release.aab`

3. **Google procesará el AAB:**
   - Tiempo: 1-5 minutos
   - Google verificará:
     - Firma del AAB
     - Permisos
     - API level
     - Configuración
   - **Pre-launch report:** Google probará automáticamente en dispositivos reales

4. **Resolver advertencias/errores si aparecen:**
   - **Errores (bloquean publicación):**
     - AAB no firmado correctamente
     - Permisos peligrosos sin declarar
     - Target API muy antigua
   - **Advertencias (no bloquean pero revisar):**
     - APK size muy grande
     - Permisos no comunes
     - Código no optimizado

### 5.2 Completar Release Notes

**Release name:** 1.0.0 (Build 1)

**Release notes para testers (en inglés o español):**

```
Versión 1.0.0 - Primera Release

Funcionalidades incluidas:
- Login y autenticación de usuarios
- Visualización de calendario de turnos
- Gestión de preferencias de usuario
- Vista de performance y métricas
- Notificaciones push
- Sincronización con backend en tiempo real

Por favor probar:
- Login con credenciales de prueba
- Navegación entre todas las pantallas
- Permisos solicitados
- Notificaciones
- Performance general

Reportar cualquier bug o comportamiento inesperado.
```

### 5.3 Configurar Testers Internos

**Opciones:**

1. **Crear lista de emails:**
   - Click "Create email list"
   - Nombre: "Internal Testers" o "QA Team"
   - Agregar emails de testers (máximo 100 para internal testing)
   - Ejemplo:
     - tu-email@gmail.com
     - qa-tester@bosmetrics.com
     - developer@bosmetrics.com

2. **Usar Google Groups (Opcional):**
   - Crear grupo en Google Groups
   - Agregar URL del grupo en Play Console

**Permisos de testers:**
- Pueden ver todas las versiones internal testing
- Reciben link directo para instalar
- No necesitan ser invitados individualmente (si usas lista)

### 5.4 Publicar Internal Testing

1. **Review release:**
   - Verificar:
     - ✅ AAB subido correctamente
     - ✅ Version name y code correctos (1.0.0, build 1)
     - ✅ Release notes completos
     - ✅ Testers configurados

2. Click **"Review release"**

3. **Confirmar:**
   - Revisar resumen de cambios
   - Click **"Start rollout to Internal testing"**

4. **Estado:**
   - ⏳ Processing (1-5 minutos)
   - ✅ Available to internal testers

### 5.5 Testing en Dispositivos Reales

**Distribución a testers:**

1. **Testers reciben email automático** con:
   - Link de instalación
   - Instrucciones para unirse al programa
   - Cómo dar feedback

2. **O compartir link manualmente:**
   - Ir a Internal testing > Testers tab
   - Copiar "Copy link" o "Share link"
   - Enviar por email/Slack/WhatsApp a testers

**Instalación para testers:**

1. Abrir link en dispositivo Android
2. Click "Become a tester"
3. Aceptar términos
4. Click "Download it on Google Play"
5. Instalar desde Play Store

**Testing checklist - Funcionalidades críticas:**

- [ ] **Login:**
  - Login exitoso con credenciales válidas
  - Error apropiado con credenciales inválidas
  - Recuperación de contraseña funciona

- [ ] **Backend de producción:**
  - App se conecta a `https://back.bosmetrics.com/api`
  - Datos se sincronizan correctamente
  - No hay errores de red

- [ ] **Navegación:**
  - Todas las pantallas cargan sin crashes
  - Transiciones suaves
  - Botón atrás funciona correctamente

- [ ] **Permisos:**
  - Permisos se solicitan en el momento apropiado
  - App funciona si se deniega permiso opcional
  - No crash al denegar permisos

- [ ] **Performance:**
  - App carga en < 3 segundos
  - No lags en scroll
  - Animaciones fluidas (60 FPS)

- [ ] **Notificaciones:**
  - Push notifications funcionan
  - Vibración funciona (si aplica)
  - Sonido apropiado

- [ ] **Memoria:**
  - No leaks de memoria
  - App no consume batería excesiva
  - Funciona bien con poca memoria

**Reportar bugs:**

- Crear issues en GitHub / Jira
- Incluir:
  - Dispositivo (modelo, Android version)
  - Pasos para reproducir
  - Screenshots/video del bug
  - Logs si están disponibles

**Si hay cambios críticos:**

1. Corregir bugs en código
2. Incrementar **versionCode** a 2
3. Incrementar **versionName** a 1.0.1 (o mantener 1.0.0)
4. Regenerar AAB
5. Subir nueva versión a Internal testing
6. Re-testear

**Testing duration recomendada:** 3-7 días mínimo

---

## FASE 6: PROMOCIÓN A PRODUCCIÓN

### 6.1 Promoción a Closed Testing (Opcional pero recomendado)

**¿Por qué Closed Testing?**
- Testing con grupo más amplio antes de producción
- Identificar issues que internal testing no detectó
- Feedback de usuarios reales
- Más tiempo de testing sin afectar producción

**Dashboard > Release > Testing > Closed testing**

**Pasos:**

1. Click "Create new release"

2. **Opción recomendada: Promote from Internal testing**
   - Click "Promote release"
   - Seleccionar release de Internal testing
   - Copiar AAB automáticamente

3. **Agregar testers:**
   - Crear lista de testers (hasta 100,000 users)
   - Agregar emails de beta testers
   - O usar Google Groups

4. **Configurar:**
   - **Managed publishing:** ON/OFF
     - ON: Tú controlas cuándo se publica (recomendado)
     - OFF: Se publica automáticamente después de revisión
   - **Staged rollout:** Empezar con 20% de testers

5. **Release notes para Closed Testing:**
   ```
   Beta v1.0.0

   Gracias por probar Bosmetrics en beta.

   Novedades en esta versión:
   - [Lista de features principales]

   Estamos buscando feedback sobre:
   - Facilidad de uso
   - Performance
   - Bugs o comportamientos inesperados

   Por favor reportar issues a: feedback@bosmetrics.com
   ```

6. **Publicar:** Click "Start rollout to Closed testing"

**Testing duration:** 1-2 semanas recomendado

**Feedback loop:**
- Revisar reviews de testers
- Analizar crashes en Play Console
- Hacer ajustes necesarios
- Subir nuevas versiones si es necesario

### 6.2 Pre-launch Report

**¿Qué es?**
Google automáticamente prueba tu app en dispositivos físicos reales y genera un reporte.

**Dashboard > Release > Testing > Pre-launch report**

**Google prueba:**
- **Dispositivos:** ~20 dispositivos Android populares
- **Android versions:** Diferentes versiones de Android
- **Tests automatizados:**
  - Monkey testing (interacciones aleatorias)
  - Crawl testing (navegar todas las pantallas)
  - Performance testing

**Revisar:**

1. **Crashes:**
   - ❌ Crashes críticos (deben corregirse)
   - ⚠️ Crashes menores (revisar si son comunes)
   - Stack traces completos disponibles

2. **Screenshots automáticos:**
   - Cómo se ve la app en diferentes dispositivos
   - Verificar UI se ve bien en todos los tamaños

3. **Performance:**
   - Tiempo de inicio de app
   - Uso de memoria
   - Uso de CPU
   - Uso de batería

4. **Security:**
   - Warnings de seguridad
   - Vulnerabilidades detectadas
   - Permisos peligrosos

5. **Accessibility:**
   - Issues de accesibilidad
   - Contraste de colores
   - Tamaño de texto

**Acción requerida:**
- ❌ **Crashes críticos:** DEBEN corregirse antes de producción
- ⚠️ **Warnings importantes:** Revisar y corregir si es posible
- ℹ️ **Sugerencias:** Opcional pero recomendado

**Si hay crashes críticos:**
1. Analizar stack trace
2. Reproducir localmente
3. Corregir bug
4. Incrementar versionCode
5. Generar nuevo AAB
6. Volver a testear

### 6.3 Promoción a Production

**Dashboard > Release > Production**

**Pre-requisitos:**
- ✅ Testing completado exitosamente
- ✅ Pre-launch report sin crashes críticos
- ✅ Store listing completo 100%
- ✅ Content rating configurado
- ✅ Data safety completado
- ✅ Pricing & distribution configurado

**Pasos:**

1. Click **"Create new release"** en Production

2. **Opción A - Promote from testing (Recomendado):**
   - Click **"Promote release"**
   - Seleccionar release de Closed/Internal testing
   - AAB se copia automáticamente
   - Version code se mantiene igual

3. **Opción B - Upload new AAB:**
   - Subir AAB directamente
   - Usar si hiciste cambios después de testing

4. **Completar release notes para usuarios finales:**

   **Release notes para producción (público):**
   ```
   🎉 Bienvenido a Bosmetrics v1.0.0

   Bosmetrics te ayuda a gestionar turnos y mejorar el performance de tu equipo.

   Características principales:
   ✅ Calendario de turnos intuitivo
   ✅ Gestión de preferencias personalizadas
   ✅ Visualización de métricas de performance
   ✅ Notificaciones en tiempo real
   ✅ Sincronización automática

   Estamos emocionados de lanzar nuestra primera versión.
   ¡Gracias por usar Bosmetrics!

   Feedback: support@bosmetrics.com
   ```

   **Mejores prácticas para release notes:**
   - Usar emojis moderadamente
   - Destacar beneficios principales
   - Mantener tono positivo y profesional
   - Mencionar email de soporte
   - Máximo 500 caracteres (será visible en Play Store)

5. Click **"Review release"**

### 6.4 Configuración de Rollout

**Opciones de rollout:**

1. **Full rollout (100%):**
   - App disponible para todos los usuarios inmediatamente
   - Riesgoso para primera versión
   - Usar solo si estás muy confiado

2. **Staged rollout (Recomendado para v1.0.0):**
   - Empezar con porcentaje pequeño de usuarios
   - Incrementar gradualmente si no hay issues
   - **Ventajas:**
     - Detectar bugs antes de afectar a todos
     - Controlar carga del servidor
     - Tiempo para corregir issues críticos

**Configuración de Staged Rollout:**

1. En pantalla de review release, seleccionar **"Staged rollout"**

2. **Porcentaje inicial recomendado:** 20%
   - 20% de usuarios nuevos verán la app en Play Store
   - 80% no la verán hasta que incrementes

3. **Plan de incremento sugerido:**
   ```
   Día 0-2:   20% - Monitorear crashes y reviews
   Día 3-4:   50% - Si no hay issues críticos
   Día 5-6:   100% - Rollout completo
   ```

4. **Incrementar manualmente:**
   - Dashboard > Production > Release details
   - Click "Increase rollout"
   - Seleccionar nuevo porcentaje
   - Click "Update"

**Cuándo incrementar:**
- ✅ Crash rate < 1%
- ✅ ANR rate < 0.5%
- ✅ Rating promedio > 4.0
- ✅ No hay bugs críticos reportados
- ✅ Servidor backend manejando carga bien

**Cuándo detener/pausar rollout:**
- ❌ Crash rate > 2%
- ❌ Bugs críticos reportados
- ❌ Rating promedio < 3.5
- ❌ Servidor backend con problemas

### 6.5 Enviar a Revisión

1. **Último check antes de enviar:**
   - [ ] AAB correcto subido
   - [ ] Version name 1.0.0, version code 1
   - [ ] Release notes completos y sin typos
   - [ ] Rollout configurado (20% recomendado)
   - [ ] Toda la configuración de Play Console completa

2. Click **"Start rollout to Production"**

3. **Confirmación:**
   - Play Console muestra resumen final
   - **No se puede revertir después de confirmar**
   - Click **"Confirm"**

4. **Estado de revisión:**

   **Timeline típico:**
   - ⏳ **Pending publication** (1-4 horas)
     - Google está procesando la app
     - Verificaciones automáticas

   - 🔍 **Under review** (1-3 días típicamente)
     - Equipo de Google revisa manualmente
     - Verifican compliance con políticas
     - Revisan contenido, permisos, funcionalidad

   - ✅ **Published** (inmediato después de aprobación)
     - App disponible en Play Store
     - Visible según staged rollout %

   - ❌ **Rejected** (1-7 días)
     - Google rechazó la app
     - Email con razones del rechazo
     - Requiere cambios y resubmisión

5. **Notificaciones:**
   - Recibirás email en datafs.adm@gmail.com
   - Notificaciones en Play Console
   - Push notifications en app de Play Console (Android)

**Razones comunes de rechazo:**

1. **Política de privacidad:**
   - Falta URL de privacy policy
   - Privacy policy no accesible
   - No declara datos recopilados

2. **Permisos peligrosos:**
   - Permisos sin justificar en Data Safety
   - Uso de permisos peligrosos sin necesidad clara

3. **Contenido engañoso:**
   - Descripción no coincide con funcionalidad
   - Screenshots no muestran app real
   - Nombre de app confunde con otra marca

4. **Funcionalidad rota:**
   - App crashea al inicio
   - Features principales no funcionan
   - Requiere credenciales que Google no puede obtener

5. **Violación de marca:**
   - Uso de marcas registradas sin permiso
   - Icono similar a otra app

**Si es rechazada:**
1. Leer email detalladamente
2. Corregir issues mencionados
3. Actualizar Store Listing si es necesario
4. Subir nuevo AAB si es necesario (incrementar versionCode)
5. Resubmit para revisión
6. Tiempo de re-revisión: 1-2 días típicamente

---

## FASE 7: POST-PUBLICACIÓN

### 7.1 Monitoreo

**Dashboard > Release > Production > Monitor releases**

**Métricas críticas para monitorear (primeros 7 días):**

#### 1. Crashes y ANRs

**Crashes:**
- **Target:** < 1% de sesiones
- **Critical:** > 2% requiere hotfix inmediato

**ANRs (Application Not Responding):**
- **Target:** < 0.5% de sesiones
- **Critical:** > 1% indica problemas de performance

**Cómo revisar:**
- Dashboard > Quality > Android vitals > Crashes & ANRs
- Ver stack traces
- Filtrar por Android version, dispositivo
- Identificar patrones comunes

**Acción si crashes > 2%:**
1. Identificar crash más común
2. Analizar stack trace
3. Reproducir localmente
4. Corregir y generar hotfix
5. Subir versión 1.0.1 inmediatamente

#### 2. Ratings y Reviews

**Dashboard > Grow > User feedback > Ratings and reviews**

**Monitorear:**
- ⭐ Rating promedio (target: > 4.0)
- Número de reviews
- Distribución de estrellas
- Keywords en reviews

**Responder a reviews:**
- Responder a reviews negativos con soluciones
- Agradecer reviews positivos
- Mencionar correcciones en próximas versiones
- Ser profesional y empático

**Ejemplo de respuesta a review negativo:**
```
Hola [nombre],

Gracias por tu feedback. Lamentamos que hayas tenido problemas con [issue].
Nuestro equipo está trabajando en una corrección que estará disponible en la
próxima actualización (v1.0.1) en los próximos días.

Si tienes más detalles, por favor contáctanos en support@bosmetrics.com

Gracias por tu paciencia.
- Equipo Bosmetrics
```

#### 3. Instalaciones y Desinstalaciones

**Métricas:**
- Instalaciones totales
- Instalaciones por día
- Desinstalaciones
- Retención (% usuarios que vuelven)

**Healthy metrics:**
- Retención día 1: > 30%
- Retención día 7: > 15%
- Retención día 30: > 5%
- Ratio desinstalación < 10%

**Si desinstalaciones altas:**
- Revisar reviews para entender por qué
- Analizar onboarding - ¿es confuso?
- Verificar performance - ¿es lenta?
- Revisar bugs reportados

#### 4. Performance (Android Vitals)

**Dashboard > Quality > Android vitals**

**Métricas clave:**
- **Startup time:** < 5 segundos
- **Memory usage:** < 100 MB típico
- **Battery consumption:** No excesivo
- **Network efficiency:** Minimizar requests

**Bad behavior threshold:**
- Startup time > 10 segundos: 😡 Usuarios frustrados
- Memory > 200 MB: 📱 Dispositivos lentos crash
- Battery drain: 🔋 Usuarios desinstalan

### 7.2 Actualizaciones Futuras

**Proceso para versiones 1.0.1, 1.0.2, etc.:**

#### Paso 1: Preparar cambios

1. **Hacer cambios en código:**
   - Fixes de bugs
   - Mejoras de features
   - Nuevas funcionalidades

2. **Incrementar versión:**
   - `android/app/build.gradle`:
   ```gradle
   defaultConfig {
       versionCode 2  // Incrementar +1 (2, 3, 4...)
       versionName "1.0.1"  // Incrementar según semver
   }
   ```

**Semantic Versioning (semver):**
- **1.0.0 → 1.0.1:** Patch (bugs fixes, cambios menores)
- **1.0.0 → 1.1.0:** Minor (nuevas features, compatible)
- **1.0.0 → 2.0.0:** Major (breaking changes, incompatible)

#### Paso 2: Generar AAB

```bash
cd f:/xamppPro80/htdocs/dataforce/dataforce-app-develop/android
./gradlew clean
./gradlew bundleRelease
```

#### Paso 3: Testing

1. Subir a **Internal testing** primero
2. Probar cambios específicos
3. Verificar que no introduce nuevos bugs
4. Testing duration: 1-3 días para hotfix, 1 semana para features

#### Paso 4: Promover a Production

1. Promote from Internal testing
2. **Release notes específicos:**
   ```
   v1.0.1 - Bug Fixes

   Correcciones en esta versión:
   • Corregido crash al abrir calendario
   • Mejorado tiempo de carga de dashboard
   • Corregido issue con notificaciones

   Gracias por reportar estos issues.
   ```

3. **Staged rollout recomendado:** 50% día 1, 100% día 2

#### Paso 5: Monitoreo post-update

- Revisar crash rate de nueva versión vs anterior
- Comparar ratings
- Verificar que correcciones funcionan

**Frecuencia de actualizaciones recomendada:**

- **Hotfixes críticos:** Inmediato (mismo día)
  - Crash rate > 2%
  - Bug que impide usar app
  - Vulnerabilidad de seguridad

- **Bug fixes menores:** 1-2 semanas
  - UI bugs
  - Performance improvements
  - UX improvements

- **Features nuevas:** Mensual o cada 2 meses
  - Nuevas pantallas
  - Nuevas integraciones
  - Mejoras significativas

- **Major updates:** Trimestral o semestral
  - Rediseño UI
  - Nueva arquitectura
  - Cambios breaking

**Comunicar actualizaciones:**
- In-app notifications para updates importantes
- Email a usuarios sobre features nuevas
- Social media announcements
- Blog posts para updates mayores

---

## CHECKLIST COMPLETO PRE-PUBLICACIÓN

### Técnico:
- [x] Keystore de producción generado y guardado de forma segura
- [x] build.gradle configurado con signing config de release
- [x] ProGuard y shrinkResources habilitados
- [x] Versión actualizada a 1.0.0 (versionCode: 1)
- [ ] AAB generado exitosamente
- [ ] AAB probado localmente
- [x] Backend apuntando a producción (https://back.bosmetrics.com/api/)
- [x] .env tiene PRODUCTION=true
- [ ] Todos los permisos justificados

### Play Console:
- [ ] Cuenta de desarrollador creada y verificada (2026)
- [ ] One-time fee de $25 pagado
- [ ] App creada en Play Console
- [ ] Store listing completo (nombre, descripción, íconos, screenshots)
- [ ] Privacy policy URL configurada
- [ ] Content rating completado
- [ ] Target audience definida
- [ ] Data safety completado
- [ ] Pricing & distribution configurado
- [ ] App signing configurado
- [ ] AAB subido a Internal testing
- [ ] Testing interno completado exitosamente
- [ ] Pre-launch report revisado
- [ ] Release notes preparados

### Legal y Cumplimiento:
- [ ] Política de privacidad creada y publicada
- [ ] Términos de servicio (si aplica)
- [ ] Cumplimiento COPPA si app atrae a niños
- [ ] Cumplimiento GDPR si hay usuarios europeos
- [ ] Permisos Android justificados en Data Safety

---

## ARCHIVOS CRÍTICOS A MODIFICAR

1. ✅ `android/gradle.properties` - Configuración de keystore
2. ✅ `android/app/build.gradle` - Signing configs, versión, optimizaciones
3. ✅ `android/app/bosmetrics-release.keystore` - Keystore de producción (BACKUP SEGURO)
4. ✅ `.env` - PRODUCTION=true

---

## TROUBLESHOOTING COMÚN

### Error: "App not signed"
**Síntomas:** Gradle build falla con error de firma

**Solución:**
- Verificar que signing config esté correctamente configurado en `build.gradle`
- Verificar que keystore existe en: `android/app/bosmetrics-release.keystore`
- Verificar contraseñas en `gradle.properties` son correctas
- Verificar que `BOSMETRICS_RELEASE_STORE_FILE` apunta al archivo correcto

### Error: "Upload key was not used to sign APK"
**Síntomas:** Play Console rechaza AAB con error de keystore

**Causa:** Intentando subir AAB firmado con diferente keystore

**Solución:**
- Asegurarse de usar el MISMO keystore siempre
- NO cambiar entre keystores
- Si perdiste keystore original, contactar soporte de Google Play

### Error: "Need to use Play App Signing"
**Síntomas:** Play Console requiere Play App Signing

**Solución:**
- En primer upload de AAB, aceptar usar Google Play App Signing
- Seleccionar "Let Google create and manage my app signing key"
- Google gestionará las claves automáticamente

### Advertencia: "Unoptimized APK"
**Síntomas:** AAB es muy grande (> 100 MB)

**Solución:**
- Habilitar ProGuard: `android.enableProguardInReleaseBuilds=true`
- Habilitar shrinkResources: `android.enableShrinkResourcesInReleaseBuilds=true`
- Esto reducirá tamaño del AAB en 30-50%
- Regenerar AAB después de habilitar

### Rechazo: "Permisos peligrosos sin justificar"
**Síntomas:** Google rechaza app por permisos no explicados

**Solución:**
1. Revisar permisos en `AndroidManifest.xml`
2. Eliminar permisos NO usados (RECORD_AUDIO, SYSTEM_ALERT_WINDOW si no se usan)
3. En Data Safety, justificar cada permiso con propósito claro
4. Re-submit

**Permisos peligrosos comunes:**
- RECORD_AUDIO
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- ACCESS_FINE_LOCATION
- SYSTEM_ALERT_WINDOW

### Rechazo: "Política de privacidad requerida"
**Síntomas:** Google rechaza por falta de privacy policy

**Solución:**
1. Crear página web con política de privacidad
   - Usar generadores: https://www.privacypolicygenerator.info/
   - O contratar abogado para draft profesional
2. Publicar en URL accesible públicamente (sin login)
3. Agregar URL en Store Listing > Privacy Policy
4. Re-submit

**Contenido mínimo de Privacy Policy:**
- Qué datos recopilas
- Cómo usas los datos
- Con quién compartes datos (si aplica)
- Cómo almacenas datos de forma segura
- Derechos de usuarios (GDPR, CCPA)
- Contacto para preguntas de privacidad

### Error: "Version code must be higher than X"
**Síntomas:** No puedes subir AAB con mismo versionCode

**Causa:** Ya existe release con ese versionCode

**Solución:**
- Incrementar versionCode en `build.gradle`
- versionCode debe ser único y siempre incrementar
- Regenerar AAB

### Crash: "Network security configuration"
**Síntomas:** App crashea al hacer requests HTTPS en Android 9+

**Solución:**
- Agregar network security config en `AndroidManifest.xml`
- Permitir cleartext traffic si es necesario (no recomendado)
- Asegurar backend usa HTTPS válido

### Pre-launch report: Múltiples crashes
**Síntomas:** Pre-launch report muestra crashes en múltiples dispositivos

**Solución:**
1. Analizar stack traces de crashes
2. Identificar patrón común
3. Reproducir localmente
4. Corregir bug
5. Incrementar versionCode
6. Regenerar AAB y re-testear

---

## RECURSOS Y REFERENCIAS

### Documentación Oficial:

**React Native:**
- [Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Generating Signed APK](https://reactnative.dev/docs/signed-apk-android)

**Android Developers:**
- [Prepare for Release](https://developer.android.com/studio/publish/preparing)
- [Upload App to Play Console](https://developer.android.com/studio/publish/upload-bundle)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)

**Google Play Console:**
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [Policy Center](https://play.google.com/about/developer-content-policy/)
- [Pre-launch Reports](https://support.google.com/googleplay/android-developer/answer/7002270)

### Guías de Publicación 2025-2026:

- [Complete Android App Publishing Guide 2025](https://foresightmobile.com/blog/complete-guide-to-android-app-publishing-in-2025)
  - Guía completa actualizada con nuevos requisitos

- [React Native Play Store Guide](https://medium.com/@nikhil_rattan_/google-play-publication-step-by-step-guide-react-native-c1ed9181d5dd)
  - Paso a paso específico para React Native

- [How to Publish React Native to Play Store](https://www.notjust.dev/blog/2022-06-30-how-to-publish-react-native-cli-app-to-google-play-store)
  - Tutorial con comandos específicos

### Nuevos Requisitos 2026:

**Developer Verification:**
- Obligatorio para todos los desarrolladores nuevos
- Requiere documento de identidad oficial
- Tiempo de aprobación: 1-7 días

**Target API Level 35 (Android 15):**
- Requerido para nuevas apps en 2026
- Actualizaciones existentes pueden usar API 34 temporalmente

**AAB Format:**
- Mandatory (APKs no aceptados desde 2021)
- Optimizaciones automáticas por dispositivo
- Tamaño de download menor

**Play App Signing:**
- Obligatorio para todas las apps nuevas
- Google gestiona clave de firma
- Upload key puede resetear si se pierde

### Tools útiles:

**Bundletool:**
- [Download](https://github.com/google/bundletool/releases)
- Probar AAB localmente
- Generar APKs de AAB

**Screenshot Tools:**
- [Fastlane Snapshot](https://docs.fastlane.tools/actions/snapshot/) - Automatizar screenshots
- Figma/Canva - Crear feature graphic

**Privacy Policy Generators:**
- https://www.privacypolicygenerator.info/
- https://www.freeprivacypolicy.com/

**Testing:**
- [Firebase Test Lab](https://firebase.google.com/docs/test-lab) - Testing en dispositivos reales
- [BrowserStack](https://www.browserstack.com/) - Testing cross-device

---

## VERIFICACIÓN FINAL

Antes de publicar a producción, verificar:

### Funcionalidad:
- [ ] Login funciona con backend de producción
- [ ] Navegación principal sin crashes
- [ ] Features críticas funcionan correctamente
- [ ] Notificaciones push funcionan
- [ ] Datos se sincronizan correctamente

### Performance:
- [ ] App carga en < 5 segundos
- [ ] No hay lags en scroll
- [ ] Consumo de memoria < 100 MB
- [ ] No drena batería excesivamente

### Seguridad:
- [ ] Todas las comunicaciones usan HTTPS
- [ ] Tokens almacenados de forma segura
- [ ] No hay API keys hardcodeados
- [ ] ProGuard ofusca código

### Calidad:
- [ ] Pre-launch report sin crashes críticos
- [ ] Crash rate < 1%
- [ ] ANR rate < 0.5%
- [ ] UI se ve bien en diferentes dispositivos

### Compliance:
- [ ] Permisos justificados en Data Safety
- [ ] Privacy policy publicada y accesible
- [ ] Content rating apropiado
- [ ] No viola políticas de Google Play

### Branding:
- [ ] Logo correcto (512x512)
- [ ] Nombre de app correcto
- [ ] Screenshots actualizados
- [ ] Feature graphic atractivo
- [ ] Descripción clara y sin typos

---

## TIMELINE ESTIMADO

### Fase 1: Preparación (COMPLETADA)
- ✅ **Tiempo real:** 2 horas
- ✅ Keystore generado
- ✅ Configuración gradle
- ✅ Versión actualizada

### Fase 2: Generación AAB
- ⏱️ **Tiempo estimado:** 30 minutos
- Limpiar build
- Generar AAB
- Verificar output

### Fase 3: Verificación Desarrollador
- ⏱️ **Tiempo estimado:** 1-7 días (espera de Google)
- Pagar $25 fee
- Subir documentos
- Esperar aprobación

### Fase 4: Configuración Console
- ⏱️ **Tiempo estimado:** 3-4 horas
- Store listing
- Screenshots
- Privacy policy
- Content rating
- Data safety

### Fase 5: Testing
- ⏱️ **Tiempo estimado:** 1-2 semanas
- Internal testing: 3-7 días
- Closed testing (opcional): 1-2 semanas
- Corrección de bugs encontrados

### Fase 6: Producción
- ⏱️ **Tiempo estimado:** 1-3 días
- Subir a producción
- Revisión de Google: 1-3 días
- Staged rollout: 2-5 días

### Fase 7: Post-publicación
- ⏱️ **Tiempo estimado:** Continuo
- Monitoreo diario primera semana
- Responder reviews
- Análisis de métricas

**Total estimado desde inicio:** 2-4 semanas hasta app disponible públicamente

---

## NOTAS IMPORTANTES

### 🔑 Keystore - Crítico
1. **NUNCA perder el keystore de producción**
   - Sin él, NO puedes publicar actualizaciones
   - Tendrías que crear app completamente nueva
   - Perderías todos los usuarios e instalaciones

2. **Hacer backups múltiples:**
   - USB drive encriptado
   - Cloud storage seguro (Google Drive con 2FA)
   - Password manager con archivos adjuntos
   - Disco duro externo

3. **Documentar contraseñas:**
   - Guardar en password manager (1Password, LastPass, Bitwarden)
   - Anotar en documento físico seguro
   - Compartir con personas de confianza en organización

### 🔐 Seguridad

1. **No commitear al repositorio:**
   - ✅ Keystore en `.gitignore`
   - ✅ Contraseñas en `.gitignore`
   - ❌ NUNCA push a GitHub público

2. **Acceso limitado:**
   - Solo personas autorizadas tienen keystore
   - Usar CI/CD con secrets encriptados
   - Rotar contraseñas si hay comprometimiento

### 🧪 Testing

1. **NO saltear Internal Testing:**
   - Previene bugs en producción
   - Detecta crashes early
   - Tiempo de corrección es menor

2. **Testing en dispositivos reales:**
   - Diferentes marcas (Samsung, Xiaomi, Google)
   - Diferentes versiones de Android
   - Diferentes tamaños de pantalla

3. **Automated testing recomendado:**
   - Unit tests para lógica crítica
   - Integration tests para flows principales
   - E2E tests para user journeys

### 📊 Staged Rollout

1. **Usar rollout gradual siempre:**
   - Empezar con 20% en primera versión
   - Incrementar a 50% después de 2-3 días
   - 100% después de 1 semana sin issues

2. **Beneficios:**
   - Detectar bugs antes de afectar a todos
   - Tiempo para hotfix si es necesario
   - Reducir impacto de problemas críticos

### 📈 Monitoreo

1. **Revisar diariamente primeros 7 días:**
   - Crash rate
   - ANR rate
   - Reviews negativos
   - Instalaciones/desinstalaciones

2. **Configurar alertas:**
   - Email si crash rate > 2%
   - Email si rating < 4.0
   - Slack notifications para reviews

### 🔄 Actualizaciones

1. **Preparar proceso antes de necesitarlo:**
   - Documentar steps para updates
   - Tener script de build automatizado
   - CI/CD configurado idealmente

2. **Comunicar updates a usuarios:**
   - In-app changelog
   - Email newsletters para updates mayores
   - Social media announcements

3. **Mantener backward compatibility:**
   - API versioning en backend
   - Migrations para cambios de schema
   - Graceful degradation para features nuevas

---

## CONTACTOS IMPORTANTES

**Google Play Support:**
- https://support.google.com/googleplay/android-developer/answer/7218994
- Solo disponible para desarrolladores con cuenta activa

**Bosmetrics:**
- Email: datafs.adm@gmail.com
- Proyecto: Bosmetrics (com.bosmetrics)

**Desarrolladores:**
- [Agregar contactos del equipo]

---

## CHANGELOG DE ESTE PLAN

**v1.0 - 3 Feb 2026:**
- Plan inicial creado
- Fase 1 completada
- Configuración para publicación en Google Play Store 2026
- Incluye nuevos requisitos: Developer verification, Play App Signing

---

Este plan cubre todos los aspectos críticos para una publicación exitosa en Google Play Store en 2026, incluyendo los nuevos requisitos de verificación de desarrollador y compliance.

**Para continuar:** Proceder con Fase 2 - Generación del AAB
