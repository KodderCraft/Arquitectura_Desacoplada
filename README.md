# Arquitectura Desacoplada

Sitio educativo e interactivo para aprender los principios de la arquitectura desacoplada. Está construido con HTML, CSS y JavaScript nativos; no necesita backend, dependencias, compilación ni conexión a Internet para sus contenidos principales.

## Estructura

```text
Arquitectura_Desacoplada/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── video/       # Videos locales opcionales
└── README.md
```

El diagrama educativo está dibujado con SVG integrado en el HTML. No hay imágenes, iconos ni fuentes remotos.

## Ejecutar

Abre `index.html` directamente en un navegador moderno. También puedes abrir la carpeta en VS Code y hacer doble clic en el archivo. No es necesario iniciar un servidor local ni instalar herramientas.

El menú, el diagrama, las animaciones y el cuestionario funcionan en el navegador. Las respuestas no se envían ni se guardan. Solo el reproductor opcional de YouTube necesita conexión.

## Configurar un video

Edita el objeto `videoConfig` al comienzo de `js/script.js` y elige una de estas opciones:

- Para un video de YouTube, asigna a `youtubeId` el identificador real del video, de 11 caracteres. La página usa el dominio de privacidad mejorada de YouTube y requerirá conexión al reproducirlo.
- Para un archivo local, deja `youtubeId` vacío y asigna a `localVideoPath` una ruta relativa, por ejemplo `assets/video/arquitectura.mp4`. También se admite `.webm`.

Deja ambos valores vacíos para mostrar el aviso de video sin configurar. La página no inventa ni carga automáticamente un video.

## Contenido

- Conceptos, características, ventajas y desafíos del desacoplamiento.
- Diagrama SVG seleccionable con ratón o teclado, explicaciones y restablecimiento.
- Cuestionario de cinco preguntas con evaluación, retroalimentación y reinicio locales.
- Navegación responsive, progreso de lectura, animaciones de entrada y preferencia de movimiento reducido.
