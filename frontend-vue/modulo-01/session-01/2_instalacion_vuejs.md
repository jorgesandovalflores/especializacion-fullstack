# Instalación de Vue.js

## Requisitos previos
Antes de instalar Vue.js, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada: LTS)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

Puedes verificar la instalación ejecutando:

```sh
node -v
npm -v
```

## Instalación de Vue.js

### 1. Usando Vue CLI (recomendado)
Vue CLI es una herramienta oficial para crear proyectos Vue de manera rápida y eficiente.

#### Instalar Vue CLI
```sh
npm install -g @vue/cli
```

#### Verificar la instalación
```sh
vue --version
```

#### Crear un nuevo proyecto Vue
```sh
vue create my-vue-app
```
Sigue las instrucciones interactivas para configurar el proyecto.

#### Ejecutar el proyecto
```sh
cd my-vue-app
npm run serve
```
Accede a `http://localhost:8080/` en tu navegador.

### 2. Usando Vite (alternativa rápida)
Vite es un bundler moderno y rápido para Vue.

#### Crear un proyecto con Vite
```sh
npm create vite@latest my-vue-app --template vue
```

#### Instalar dependencias y ejecutar el proyecto
```sh
cd my-vue-app
npm install
npm run dev
```

El servidor iniciará en `http://localhost:5173/`.

### 3. Usando Vue CDN (sin instalación)
Si solo necesitas probar Vue rápidamente, puedes incluirlo en un HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue con CDN</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">{{ message }}</div>
    <script>
        const { createApp } = Vue;
        createApp({
            data() {
                return { message: '¡Hola Vue!' };
            }
        }).mount('#app');
    </script>
</body>
</html>
```

¡Listo! Ahora puedes empezar a desarrollar con Vue.js.
