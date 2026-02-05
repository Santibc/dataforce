# Google Play Console - Checklist de Tareas

## ANTES DE LA VERIFICACIÓN (Puedes hacer ahora)

### Dashboard → Grow → Store presence → Main store listing
- [ ] App name: Bosmetrics
- [ ] Short description (copiar de PLAY_STORE_CONTENT.md)
- [ ] Full description (copiar de PLAY_STORE_CONTENT.md)
- [ ] App icon: 512x512 (PENDIENTE - necesitas crearlo)
- [ ] Feature graphic: 1024x500 (PENDIENTE - necesitas crearlo)
- [ ] Screenshots: Mínimo 2 (PENDIENTE - tomar de la app)
- [ ] Contact email: datafs.adm@gmail.com
- [ ] Privacy policy URL: (PENDIENTE - necesitas crear y hospedar)

### Dashboard → Policy → App content → Content rating
- [ ] Click "Start questionnaire"
- [ ] Completar todas las preguntas (ver respuestas en PLAY_STORE_CONTENT.md)
- [ ] Submit questionnaire
- [ ] Verificar rating asignado

### Dashboard → Policy → App content → Target audience
- [ ] Target age: 18+
- [ ] Does this app primarily target children? NO
- [ ] Save

### Dashboard → Policy → App content → Data safety
- [ ] Declarar datos recopilados:
  - [ ] Personal info (Name, Email)
  - [ ] App activity (Usage metrics)
  - [ ] Device IDs
- [ ] Explicar uso de datos (ver detalles en PLAY_STORE_CONTENT.md)
- [ ] Prácticas de seguridad:
  - [x] Data encrypted in transit
  - [x] Users can request deletion
  - [x] Not sold to third parties
- [ ] Save

### Dashboard → Policy → App content → Privacy policy
- [ ] Crear privacy policy (usar generador o escribir propia)
- [ ] Hospedar en URL pública
- [ ] Agregar URL en Play Console
- [ ] Save

### Dashboard → Grow → Store presence → Store settings
- [ ] Category: Business
- [ ] Tags: business metrics, team management, analytics (opcional)
- [ ] Save

### Dashboard → Grow → Store presence → Pricing & distribution
- [ ] Pricing: Free
- [ ] Countries: Available everywhere (o seleccionar específicos)
- [ ] Contains ads: NO
- [ ] Content guidelines: Accept
- [ ] US export laws: Accept
- [ ] Save

### Dashboard → Policy → App content → App access
- [ ] Available to all users
- [ ] No special instructions needed
- [ ] Save

### Dashboard → Policy → App content → Ads
- [ ] Contains ads: NO
- [ ] Uses Advertising ID: NO
- [ ] Save

---

## DESPUÉS DE LA VERIFICACIÓN (Requiere cuenta verificada)

### Dashboard → Release → Testing → Internal testing
- [ ] Click "Create new release"
- [ ] Upload AAB: bosmetrics-v1.0.0-release.aab
- [ ] Review pre-launch report
- [ ] Add release notes (copiar de PLAY_STORE_CONTENT.md)
- [ ] Add internal testers (emails)
- [ ] Review release
- [ ] Start rollout to Internal testing

### App signing
- [ ] Google automáticamente configurará App Signing al subir primer AAB
- [ ] Descargar certificado de upload key para respaldo
- [ ] Save

### Probar en Internal Testing
- [ ] Instalar app desde link de testing
- [ ] Verificar todas las funcionalidades
- [ ] Confirmar que backend de producción funciona
- [ ] Reportar bugs si los hay

### Closed Testing (Opcional pero recomendado)
- [ ] Crear closed testing track
- [ ] Promover desde internal testing
- [ ] Agregar más testers
- [ ] Testing por 1-2 semanas
- [ ] Recopilar feedback

### Pre-launch Report
- [ ] Revisar crashes reportados por Google
- [ ] Revisar warnings de seguridad
- [ ] Corregir issues críticos si los hay
- [ ] Volver a subir AAB si es necesario

### Producción
- [ ] Click "Create new release" en Production
- [ ] Promover desde Internal/Closed testing o subir nuevo AAB
- [ ] Add production release notes
- [ ] Configurar rollout (20% staged rollout recomendado)
- [ ] Review release
- [ ] Start rollout to Production
- [ ] Esperar aprobación de Google (1-3 días)

---

## PENDIENTES CRÍTICOS

### Archivos gráficos necesarios:
1. **App Icon (512x512):**
   - Ubicación sugerida: `dataforce-app-develop/assets/playstore/icon-512.png`
   - Formato: PNG 32-bit, sin transparencia
   - Contenido: Logo de Bosmetrics centrado

2. **Feature Graphic (1024x500):**
   - Ubicación sugerida: `dataforce-app-develop/assets/playstore/feature-graphic.png`
   - Formato: PNG o JPG
   - Contenido: Banner horizontal promocional

3. **Screenshots (mínimo 2):**
   - Ubicación sugerida: `dataforce-app-develop/assets/playstore/screenshots/`
   - Formato: PNG o JPG
   - Tamaño: 16:9 o 9:16, mínimo 320px
   - Contenido: Capturas de pantalla de:
     - Login screen
     - Dashboard principal
     - Vista de métricas
     - Configuración de usuario

### Privacy Policy:
- **Opción 1:** Crear en https://www.privacypolicygenerator.info/
- **Opción 2:** Hospedar en GitHub Pages
- **Opción 3:** Crear en tu dominio bosmetrics.com/privacy-policy

### Cuenta de desarrollador:
- [ ] Pagar $25 USD (one-time fee)
- [ ] Completar verificación de identidad
- [ ] Puede tomar 1-7 días para aprobación

---

## PROGRESO ESTIMADO

**Completable ahora sin verificación:** ~60%
- Store listing (parcial - falta gráficos)
- Content rating (100%)
- Target audience (100%)
- Data safety (100%)
- Privacy policy (pendiente crear)
- Pricing & distribution (100%)
- App access (100%)
- Ads declaration (100%)

**Requiere verificación:** ~40%
- Subir AAB
- Internal testing
- Producción

---

## ORDEN RECOMENDADO DE EJECUCIÓN

1. ✅ Completar Content Rating (más fácil, sin dependencias)
2. ✅ Completar Target Audience (muy rápido)
3. ✅ Completar Pricing & Distribution (muy rápido)
4. ✅ Completar App Access (muy rápido)
5. ✅ Completar Ads Declaration (muy rápido)
6. ✅ Completar Data Safety (copiar respuestas del archivo)
7. ⏳ Crear Privacy Policy (externo, puede tomar 15-30 min)
8. ⏳ Crear gráficos (icon, feature, screenshots)
9. ✅ Completar Store Listing (cuando tengas gráficos)
10. ⏳ Esperar verificación de cuenta
11. ✅ Subir AAB a Internal Testing
12. ✅ Probar app
13. ✅ Publicar a Production

