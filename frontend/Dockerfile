FROM nginx:alpine

# Copiar archivos estáticos
COPY . /usr/share/nginx/html/

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar que los archivos se copiaron
RUN echo "=== Contenido del directorio HTML ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== Configuración nginx ===" && \
    cat /etc/nginx/conf.d/default.conf

EXPOSE 80