# Leydle

Una palabra jurídica de cinco letras por día, en hora de Uruguay. Proyecto independiente para `/normativa/leydle/`, con estética hermana de [Normativa Uruguay](https://lucasramos.uy/normativa/). No requiere cuenta, API, cookies ni servicios pagos.

## Modos

- Fácil: 8 intentos, dos pistas (materia y una orientación).
- Avanzado: 6 intentos, sin pistas.
- Difícil: 5 intentos; cada jugada debe respetar las pistas ya obtenidas, incluidas las cantidades de letras repetidas.

Acepta tildes como equivalentes sin borrar la Ñ. Muestra definición y enlace a un artículo de Normativa al terminar, permite compartir el resultado como imagen vertical para historias generada en el dispositivo, o como grilla de emojis sin revelar la solución mediante el menú nativo de compartir o el portapapeles y guarda el progreso de cada modo y las estadísticas solo en `localStorage` del navegador. El mismo término del día vale para todos los modos, y la fecha cambia a medianoche en Montevideo. La lista curada de soluciones rota; el vocabulario de intentos combina los términos extraídos del corpus de Normativa con un diccionario general de palabras españolas de cinco letras. Las soluciones siguen siendo únicamente los 96 términos jurídicos seleccionados.

## Desarrollo

El sitio es HTML/CSS/JS estático y no tiene dependencias de ejecución. `pnpm test` corre las pruebas; para probar manualmente: `python3 -m http.server 8000` y abrir `http://localhost:8000/`. Se puede publicar directamente como sitio estático desde la raíz del repositorio, detrás del router de `lucasramos.uy`. Los enlaces a los artículos apuntan al corpus publicado. La publicación bajo `/normativa/leydle/` necesita enrutar ese prefijo antes de la ruta general `/normativa/` en el Worker del dominio; fusionar este PR por sí solo no lo pone en producción.

### Fuentes del vocabulario

- Normativa Uruguay: [API v1](https://lucasramos.uy/normativa/api/), datos [repositorio `normativa`, rama `api`](https://github.com/lucasramosuy/normativa/tree/api/data). Diccionario de soluciones revisado manualmente con enlaces a artículos concretos; las definiciones son orientativas, redactadas para el juego, no texto oficial de IMPO.
- Intentos válidos: unión de los términos de cinco letras del corpus de Normativa, [la lista de Wordle-Solver](https://github.com/rodyuzuriaga/Wordle-Solver/blob/main/resources/5_caracteres/spanish_5.txt) y [an-array-of-spanish-words](https://github.com/words/an-array-of-spanish-words) (commit `612349c44d0a9127fb317f7d56d078eda7ae6e65`). La fuente nueva contiene unas 636.598 formas del español, no solo lemas de diccionario: admitimos plurales y conjugaciones habituales para no rechazar intentos razonables de un juego. No son nuevas soluciones, no es una lista oficial de la RAE ni una garantía de que cada forma sea de uso actual; por diseño se conservan también todas las palabras ya admitidas, incluso las raras. Se filtraron únicamente las entradas de **exactamente cinco caracteres alfabéticos españoles** (`a-z`, vocales acentuadas, `ü`, `ñ`), se pasaron a mayúsculas, se quitaron tildes/diéresis sin perder la Ñ, y se quitaron duplicados. Se excluyeron números, signos, espacios y cadenas de otras longitudes. El resultado de la fuente nueva aporta 2.848 intentos adicionales: de 9.547 a 12.395 en `1-data.js`. Las palabras legales de `data.js` se agregan en tiempo de ejecución. AEIOU continúa siendo la excepción explícita pedida por Lucas en `game.js`. Las licencias MIT de ambas fuentes están copiadas en `WORDLIST-LICENSE` y `SPANISH-WORDLIST-LICENSE`.


## Límites conocidos

La lista de soluciones contiene 96 términos (24 iniciales y 72 nuevos), conserva el orden inicial y luego rota cada 96 días; no promete un término nunca repetido. Las estadísticas viven solo en el dispositivo y se pierden al borrar datos del sitio. No hay récord global, registro de usuarios ni copia en servidor. El enlace del artículo muestra un uso del término en una norma publicada, no necesariamente una definición legal formal del concepto.

## Resultado y difusión

Al terminar una partida, la página lleva el foco a la tarjeta de resultado. La fuente se presenta con nombre de la norma y número de artículo, y la grilla queda visible. "Compartir resultado" abre el menú del dispositivo cuando existe Web Share API. "Copiar cuadraditos" copia fecha, dificultad, puntaje, emojis y enlace al juego, sin palabra ni enlace al artículo para no revelar la solución. Si falla el portapapeles aparece un campo seleccionable. Cancelar el menú no copia nada ni muestra errores. La imagen para historias sigue disponible como opción aparte; esa imagen sí muestra la solución.

Los nombres cortos de las normas que usa la tarjeta se cotejaron con el catálogo público de Normativa. La lectura del artículo ocurre solo al abrir su enlace: no se agrega una consulta de red al juego.
