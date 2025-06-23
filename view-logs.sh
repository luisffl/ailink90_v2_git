#!/bin/bash

# Script para ver resumen de logs del sistema AILINK

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
    
    echo "🌐 ACTIVIDAD WEBHOOK:"
    grep "webhook" logs/debug.log | tail -5 | jq -r '.timestamp + " - " + .message'
    echo ""
    
    echo "🔌 ACTIVIDAD WEBSOCKET:"
    grep "websocket" logs/debug.log | tail -5 | jq -r '.timestamp + " - " + .message'
    echo ""
    
    echo "❌ ÚLTIMOS ERRORES:"
    grep '"level":"error"' logs/debug.log | tail -3 | jq -r '.timestamp + " - " + .message'
    echo ""
    
    echo "⚠️  ÚLTIMOS WARNINGS:"
    grep '"level":"warn"' logs/debug.log | tail -3 | jq -r '.timestamp + " - " + .message'
    echo ""
    
    echo "📈 REQUESTS MÁS LENTOS (>1000ms):"
    grep '"duration":[0-9][0-9][0-9][0-9]' logs/debug.log | tail -5 | jq -r '.timestamp + " - " + .metadata.method + " " + .metadata.url + " (" + (.metadata.duration|tostring) + "ms)"'
    echo ""
else
    echo "❌ No se encontró el archivo de logs: logs/debug.log"
fi

echo "=== FIN RESUMEN ==="