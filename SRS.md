# Especificación de requisitos de software: Leydle

**Estado:** refleja el código de `main` al 28/09/2026. Describe el producto existente; no aprueba funciones futuras.

## Propósito y alcance

Leydle es un juego diario de palabras jurídicas de cinco letras, en español, vinculado a artículos publicados en Normativa Uruguay. Funciona en el navegador, sin cuenta, API propia, cookies ni servicios pagos. Su público son lectores de Normativa que quieren aprender términos jugando. Quedan fuera el juego multijugador, los rankings globales y la sincronización entre dispositivos.

## Requisitos funcionales

- **RF-01. Partida diaria:** elegir una sola respuesta para cada fecha en `America/Montevideo`, igual en los tres modos. Cambiar la partida al llegar un nuevo día en esa zona horaria, incluso si la página sigue abierta. Las 96 respuestas curadas rotan, por lo que pueden repetirse.
- **RF-02. Modos:** permitir Fácil (8 intentos, pistas de materia y orientación), Avanzado (6 intentos, sin pistas) y Difícil (5 intentos, sin pistas). Cada modo conserva su propia partida del día.
- **RF-03. Jugadas:** aceptar entradas de cinco letras presentes en los vocabularios incorporados o la excepción `AEIOU`; normalizar mayúsculas y tildes sin confundir Ñ con N. Informar los rechazos sin consumir un intento.
- **RF-04. Evaluación:** marcar por posición letras acertadas, presentes en otra posición o ausentes; consumir correctamente las ocurrencias en palabras con letras repetidas. En Difícil, cada nueva jugada debe respetar posiciones y cantidades de letras ya reveladas.
- **RF-05. Resultado:** al ganar o agotar intentos, mostrar la palabra, su definición orientativa y un enlace al artículo publicado en Normativa. No presentar esa definición como texto oficial de IMPO.
- **RF-06. Compartir:** generar en el dispositivo, con Canvas y sin backend, una imagen vertical de 1080 × 1920 para historias con la identidad de Leydle (palabra del día, Nº de edición, modo, puntaje y grilla de intentos), con vista previa, descarga y Web Share API de archivos donde exista. Mantener como alternativa la copia de texto con grilla de emojis, fecha, modo e intentos sin revelar la respuesta, al portapapeles o con selección manual si falla.
- **RF-07. Persistencia local:** guardar filas por fecha y modo y resultados/racha en `localStorage`; validar los datos al recuperarlos y continuar sin persistencia cuando el navegador la bloquee. Las estadísticas son del dispositivo, no de una cuenta.
- **RF-08. Interacción:** admitir teclado físico y teclado en pantalla; ofrecer instrucciones, estadísticas y etiquetas accesibles para tablero, controles y estado.

## Datos e integraciones

`data.js` define respuestas (`word`, `category`, `hint`, `definition`, `source`) e intentos legales; `1-data.js` aporta el vocabulario general. `game.js` contiene reglas y persistencia, `app.js` la interfaz y `story.js` el dibujo de la imagen de resultado. Claves locales: `leydle:v1:<fecha>:<modo>` con `{rows}` y `leydle:v1:results` con resultados por `<fecha>:<modo>`. Los enlaces de fuente dependen de URLs de artículos publicados en Normativa; el juego no consulta la API en tiempo de ejecución. Las fuentes y licencias del vocabulario están detalladas en el README y en `WORDLIST-LICENSE` y `SPANISH-WORDLIST-LICENSE`.

## Restricciones y calidad

- Entrega estática HTML/CSS/JavaScript sin dependencias de ejecución ni backend; ninguna credencial debe viajar al cliente. Despliegue previsto bajo `/normativa/leydle/`, con una regla de enrutamiento que preceda a `/normativa/` en el Worker del dominio. El merge del repositorio no publica por sí solo la ruta.
- No prometer conservar datos al limpiar el almacenamiento del navegador ni compartir progreso entre dispositivos. La fecha depende del reloj del dispositivo, interpretado en hora uruguaya.
- Mantener pruebas de la lógica de juego (`game.test.js`) y verificar `app.js`/`game.js` con el script `check` del repositorio antes de publicar cambios de reglas. El gestor de paquetes del repositorio es pnpm; las pruebas no requieren dependencias externas.
