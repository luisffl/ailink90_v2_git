#!/bin/bash

# Script simple para ver logs sin jq
echo "=== RESUMEN DE LOGS AILINK ==="
echo "Fecha: $(date)"
echo ""

if [ -f "logs/debug.log" ]; then
    echo "📊 ESTADÍSTICAS:"
    echo "- Total de líneas: $(wc -l < logs/debug.log)"
    echo "- Errores: $(grep -c '"level":"error"' logs/debug.log)"
    echo "- Warnings: $(grep -c '"level":"warn"' logs/debug.log)"  
    echo "- Info: $(grep -c '"level":"info"' logs/debug.log)"
    echo ""
    
    echo "🌐 ÚLTIMOS EVENTOS WEBHOOK:"
    grep "webhook" logs/debug.log | tail -3
    echo ""
    
    echo "🔌 ÚLTIMOS EVENTOS WEBSOCKET:"
    grep "websocket" logs/debug.log | tail -3
    echo ""
    
    echo "❌ ÚLTIMOS ERRORES:"
    grep '"level":"error"' logs/debug.log | tail -2
    echo ""
    
    echo "📈 REQUESTS RECIENTES:"
    grep '"service":"http"' logs/debug.log | tail -5
    echo ""
else
    echo "❌ No se encontró el archivo de logs"
fi

echo "=== FIN RESUMEN ==="