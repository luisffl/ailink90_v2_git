#!/bin/bash

# Script de diagnóstico para personal no técnico - AILINK
# Úsalo cuando un usuario reporte un problema

clear
echo "🔍 DIAGNÓSTICO AUTOMÁTICO DE PROBLEMAS - AILINK"
echo "=============================================="
echo ""
echo "Este diagnóstico te ayudará a entender qué está pasando"
echo "cuando un usuario reporta un problema."
echo ""

# Función para mostrar estado del servidor
check_server_status() {
    echo "📊 ESTADO DEL SERVIDOR:"
    echo "----------------------"
    
    # Verificar si el servidor está ejecutándose
    if pgrep -f "npm run dev" > /dev/null; then
        echo "✅ El servidor está FUNCIONANDO correctamente"
    else
        echo "❌ El servidor NO está funcionando - PROBLEMA CRÍTICO"
        echo "   → Necesitas reiniciar el servidor"
        return 1
    fi
    
    # Verificar archivos de log
    if [ -f "logs/debug.log" ]; then
        echo "✅ Los logs se están guardando correctamente"
    else
        echo "⚠️  No se encuentran logs - puede ser problema reciente"
    fi
    echo ""
}

# Función para analizar errores recientes
analyze_recent_errors() {
    echo "🚨 PROBLEMAS RECIENTES (últimas 2 horas):"
    echo "----------------------------------------"
    
    if [ -f "logs/debug.log" ]; then
        # Buscar errores de las últimas 2 horas
        current_time=$(date +%s)
        two_hours_ago=$((current_time - 7200))
        
        error_count=$(grep '"level":"error"' logs/debug.log | wc -l)
        warning_count=$(grep '"level":"warn"' logs/debug.log | wc -l)
        
        if [ $error_count -gt 0 ]; then
            echo "❌ Se encontraron $error_count errores"
            echo ""
            echo "ÚLTIMOS ERRORES:"
            grep '"level":"error"' logs/debug.log | tail -2 | while read line; do
                timestamp=$(echo $line | jq -r '.timestamp' 2>/dev/null || echo "Sin fecha")
                message=$(echo $line | jq -r '.message' 2>/dev/null || echo "Error desconocido")
                echo "   📅 $timestamp"
                echo "   💬 $message"
                echo ""
            done
        else
            echo "✅ No hay errores críticos recientes"
        fi
        
        if [ $warning_count -gt 0 ]; then
            echo "⚠️  Se encontraron $warning_count advertencias (no críticas)"
        else
            echo "✅ No hay advertencias recientes"
        fi
    else
        echo "❌ No se pueden revisar los logs - el archivo no existe"
    fi
    echo ""
}

# Función para verificar conectividad
check_connectivity() {
    echo "🌐 CONECTIVIDAD Y SERVICIOS:"
    echo "---------------------------"
    
    # Verificar webhook
    if [ -n "$WEBHOOK_URL" ]; then
        echo "✅ La URL del webhook está configurada"
    else
        echo "❌ La URL del webhook NO está configurada - los diagnósticos no funcionarán"
    fi
    
    # Verificar actividad reciente de usuarios
    if [ -f "logs/debug.log" ]; then
        webhook_activity=$(grep -c "webhook" logs/debug.log)
        websocket_activity=$(grep -c "websocket" logs/debug.log)
        
        echo "📈 Actividad reciente:"
        echo "   - Solicitudes de diagnóstico: $webhook_activity"
        echo "   - Conexiones de usuarios: $websocket_activity"
        
        if [ $webhook_activity -eq 0 ] && [ $websocket_activity -eq 0 ]; then
            echo "⚠️  Muy poca actividad - puede que los usuarios no puedan conectarse"
        fi
    fi
    echo ""
}

# Función para mostrar recomendaciones
show_recommendations() {
    echo "💡 ¿QUÉ HACER AHORA?"
    echo "-------------------"
    
    # Verificar el estado general y dar recomendaciones
    if ! pgrep -f "npm run dev" > /dev/null; then
        echo "🚨 ACCIÓN URGENTE:"
        echo "   1. El servidor no está funcionando"
        echo "   2. Contacta al equipo técnico INMEDIATAMENTE"
        echo "   3. Mientras tanto, informa a los usuarios que hay mantenimiento"
        echo ""
        return
    fi
    
    error_count=0
    if [ -f "logs/debug.log" ]; then
        error_count=$(grep -c '"level":"error"' logs/debug.log)
    fi
    
    if [ $error_count -gt 5 ]; then
        echo "⚠️  PROBLEMA MODERADO:"
        echo "   1. Hay varios errores acumulados"
        echo "   2. Monitorea si los usuarios siguen reportando problemas"
        echo "   3. Si persiste, contacta al equipo técnico"
    elif [ $error_count -gt 0 ]; then
        echo "ℹ️  SITUACIÓN NORMAL:"
        echo "   1. Hay algunos errores, pero es normal"
        echo "   2. El sistema está funcionando"
        echo "   3. Solo preocúpate si los usuarios siguen reportando problemas"
    else
        echo "✅ TODO ESTÁ BIEN:"
        echo "   1. No hay errores detectados"
        echo "   2. El sistema funciona correctamente"
        echo "   3. Si un usuario reporta problemas, pídele más detalles específicos"
    fi
    echo ""
}

# Función para mostrar información de contacto
show_contact_info() {
    echo "📞 CONTACTOS DE EMERGENCIA:"
    echo "--------------------------"
    echo "Si necesitas ayuda técnica:"
    echo "📧 Email técnico: ejemplo@tecnico.com"
    echo ""
    echo "Para informar a usuarios sobre problemas:"
    echo "💬 'Estamos trabajando en solucionarlo, intenta en unos minutos'"
    echo ""
}

# Ejecutar todas las verificaciones
main() {
    check_server_status
    if [ $? -eq 0 ]; then
        analyze_recent_errors
        check_connectivity
    fi
    show_recommendations
    show_contact_info
    
    echo "🔄 Para ejecutar este diagnóstico nuevamente:"
    echo "   ./diagnostico-problemas.sh"
    echo ""
    echo "📝 Para ver logs detallados:"
    echo "   ./view-logs.sh"
    echo ""
}

# Ejecutar diagnóstico
main