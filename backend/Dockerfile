# Imagen base optimizada
FROM node:18-alpine

#Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias PRIMERO (optimización de capas)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --only=production

# Copiar código fuente
COPY src/ ./src/

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/index.js"]