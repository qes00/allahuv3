#!/bin/bash

# Colores para mejor legibilidad
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Preparando actualización para Vercel...${NC}"

# 1. Agregar todos los cambios
git add .

# 2. Pedir mensaje del commit
echo -e "Escribe una descripción de los cambios (Presiona Enter para usar 'actualización rápida'):"
read msg

if [ -z "$msg" ]; then
  msg="actualización rápida"
fi

# 3. Hacer commit
git commit -m "$msg"

# 4. Empujar a GitHub/Vercel
echo -e "${YELLOW}⬆️ Subiendo cambios...${NC}"
git push

echo -e "${GREEN}✅ ¡Listo! Vercel detectará los cambios y actualizará la web en unos 2 minutos.${NC}"
