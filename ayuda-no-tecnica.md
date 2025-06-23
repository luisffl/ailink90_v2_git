# Guía de Problemas AILINK - Para Personal No Técnico

## ¿Qué hacer cuando un usuario reporta un problema?

### 1. EJECUTA EL DIAGNÓSTICO AUTOMÁTICO
```bash
./diagnostico-problemas.sh
```

Este script te dirá exactamente qué está pasando en lenguaje simple.

### 2. INTERPRETACIÓN DE RESULTADOS

#### ✅ **"TODO ESTÁ BIEN"**
- **Qué significa**: El sistema funciona correctamente
- **Qué hacer**: Pregunta al usuario detalles específicos:
  - ¿En qué paso del formulario se quedó?
  - ¿Recibió algún mensaje de error?
  - ¿Hace cuánto tiempo ocurrió?

#### ⚠️ **"PROBLEMA MODERADO"**
- **Qué significa**: Hay algunos errores, pero el sistema funciona
- **Qué hacer**: 
  - Informa al usuario: "Detectamos algunos problemas técnicos, intenta nuevamente en 5 minutos"
  - Si persiste después de 15 minutos, contacta al equipo técnico

#### 🚨 **"ACCIÓN URGENTE"**
- **Qué significa**: El servidor no funciona - NADIE puede usar el sistema
- **Qué hacer**:
  - Contacta INMEDIATAMENTE al equipo técnico
  - Informa a todos los usuarios conocidos que hay mantenimiento temporalmente

### 3. RESPUESTAS ESTÁNDAR PARA USUARIOS

#### Si el sistema funciona bien:
*"Hola [nombre], revisé el sistema y está funcionando correctamente. ¿Podrías intentar nuevamente? Si el problema persiste, por favor envíame una captura de pantalla del error que ves."*

#### Si hay problemas moderados:
*"Hola [nombre], detectamos algunos problemas técnicos menores. Por favor intenta nuevamente en 5-10 minutos. Te aviso cuando esté completamente solucionado."*

#### Si hay problemas críticos:
*"Hola [nombre], estamos experimentando problemas técnicos temporales. Nuestro equipo técnico ya está trabajando en la solución. Te contactaré en cuanto esté resuelto, estimamos que será en las próximas horas."*

### 4. INFORMACIÓN ADICIONAL

#### Para ver más detalles técnicos:
```bash
./view-logs.sh
```

#### Para monitorear en tiempo real:
```bash
tail -f logs/debug.log
```

#### Contacto de emergencia técnica:
📧 **ejemplo@tecnico.com**

### 5. CASOS ESPECIALES

#### Usuario dice "no recibo el resultado del diagnóstico":
1. Ejecuta `./diagnostico-problemas.sh`
2. Si aparece "La URL del webhook NO está configurada" → Contacta equipo técnico URGENTE
3. Si todo parece normal → Pide al usuario que intente con otro navegador

#### Usuario dice "la página no carga":
1. Ejecuta `./diagnostico-problemas.sh`
2. Si dice "El servidor NO está funcionando" → Contacta equipo técnico URGENTE
3. Si el servidor funciona → Problema de internet del usuario

#### Usuario dice "el formulario no envía":
1. Ejecuta `./diagnostico-problemas.sh`
2. Revisa si hay errores de "webhook" en los logs
3. Si hay muchos errores de webhook → Contacta equipo técnico

### 6. RECORDATORIOS IMPORTANTES

- **NUNCA** toques archivos del código
- **NUNCA** reinicies el servidor sin consultar
- **SIEMPRE** usa los scripts de diagnóstico primero
- **SIEMPRE** documenta los problemas reportados
- Si tienes dudas, es mejor contactar al equipo técnico

---

*Esta guía fue creada para ayudarte a resolver problemas rápidamente sin conocimientos técnicos. Manténla siempre a mano.*