# Etapa 1: Compilación
FROM node:latest AS build

# Crear y establecer el directorio de trabajo
WORKDIR /home/app

# Copiar los archivos necesarios para la instalación
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Etapa 2: Ejecución
FROM node:latest

# Crear y establecer el directorio de trabajo
WORKDIR /home/app

# Copiar solo los archivos necesarios desde la etapa de compilación
COPY --from=build /home/app/package*.json ./
COPY --from=build /home/app/dist ./dist

# Copiar el archivo .env al contenedor
COPY .env .env

# Instalar solo las dependencias de producción BUENO Y LAS DE DESARROLLO TAMBIEN POR SI ACASO
RUN npm install 

# Exponer el puerto de la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "dist/app.js"]