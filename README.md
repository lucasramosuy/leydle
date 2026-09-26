# Leydle

Una palabra jurídica de cinco letras por día, en hora de Uruguay. Proyecto independiente para `/normativa/leydle/`, con estética hermana de [Normativa Uruguay](https://lucasramos.uy/normativa/). No requiere cuenta, API, cookies ni servicios pagos.

## Modos

- Fácil: 8 intentos, dos pistas (materia y una orientación).
- Avanzado: 6 intentos, sin pistas.
- Difícil: 5 intentos; cada jugada debe respetar las pistas ya obtenidas, incluidas las cantidades de letras repetidas.

Acepta tildes como equivalentes sin borrar la Ñ. Muestra definición y enlace a un artículo de Normativa al terminar, permite compartir una grilla sin revelar la solución y guarda el progreso de cada modo y las estadísticas solo en `localStorage` del navegador. El mismo término del día vale para todos los modos, y la fecha cambia a medianoche en Montevideo. La lista curada de soluciones rota; el vocabulario de intentos combina los términos extraídos del corpus de Normativa con un diccionario general de palabras españolas de cinco letras. Las soluciones siguen siendo únicamente los 24 términos jurídicos seleccionados.

## Desarrollo

El sitio es HTML/CSS/JS estático y no tiene dependencias de ejecución. `npm test` corre las pruebas; para probar manualmente: `python3 -m http.server 8000` y abrir `http://localhost:8000/`. Se puede publicar directamente como sitio estático desde la raíz del repositorio, detrás del router de `lucasramos.uy`. Los enlaces a los artículos apuntan al corpus publicado. La publicación bajo `/normativa/leydle/` necesita enrutar ese prefijo antes de la ruta general `/normativa/` en el Worker del dominio; fusionar este PR por sí solo no lo pone en producción.

### Fuentes del vocabulario

- Normativa Uruguay: [API v1](https://lucasramos.uy/normativa/api/), datos [repositorio `normativa`, rama `api`](https://github.com/lucasramosuy/normativa/tree/api/data). Diccionario de soluciones revisado manualmente con enlaces a artículos concretos; las definiciones son orientativas, redactadas para el juego, no texto oficial de IMPO.
- Intentos válidos: unión de los términos de cinco letras del corpus de Normativa y [el diccionario español de cinco letras de Wordle-Solver](https://github.com/rodyuzuriaga/Wordle-Solver/blob/main/resources/5_caracteres/spanish_5.txt), normalizados para ignorar tildes sin borrar la Ñ. La fuente adicional está publicada bajo [licencia MIT](https://github.com/rodyuzuriaga/Wordle-Solver/blob/main/LICENSE), cuya copia está en `WORDLIST-LICENSE`. AEIOU se admite además como excepción pedida por Lucas para probar todas las vocales. La lista de soluciones jurídicas no cambia.

## Límites conocidos

La lista de soluciones inicial contiene 24 términos y luego rota; no promete un término nunca repetido. Las estadísticas viven solo en el dispositivo y se pierden al borrar datos del sitio. No hay récord global, registro de usuarios ni copia en servidor. El enlace del artículo muestra un uso del término en una norma publicada, no necesariamente una definición legal formal del concepto.
