import test from 'node:test';import assert from 'node:assert/strict';import {clean,grade,constraints,dayKey,answerFor,puzzleNumber,MODES,valid,shareText,editGuess} from './game.js';
import {guesses as generalGuesses} from './1-data.js';
import {answers} from './data.js';
test('tildes flexibles, Ñ conservada',()=>{assert.equal(clean('áéíóú'),'AEIOU');assert.equal(clean('niño'),'NIÑO');assert.ok(valid('FUERO'));assert.ok(valid('árbol'))});
test('palabras comunes fuera del corpus legal son intentos, no soluciones',()=>{assert.ok(valid('ABEJA'));assert.ok(valid('MANGO'));assert.ok(valid('PÁJAR'));assert.ok(valid('AÉREO'));assert.ok(valid('AUDIO'));assert.ok(valid('AEIOU'));assert.ok(!valid('ZZZZZ'));assert.ok(!valid('ABCDEF'))});
test('la puntuación de letras repetidas no sobreasigna aciertos',()=>{assert.deepEqual(grade('PAPAS','PARTE'),[2,2,0,0,0]);assert.deepEqual(grade('ACTOR','FUERO'),[0,0,0,1,1]);assert.deepEqual(grade('FIRME','FUERO'),[2,0,1,0,1])});
test('difícil exige posición, presencia, ausencia y cantidades',()=>{let h=[{guess:'ACTOR',grade:grade('ACTOR','FUERO')},{guess:'FIRME',grade:grade('FIRME','FUERO')}];assert.ok(constraints(h,'FUEGO'));assert.equal(constraints(h,'FUERO'),null)});
test('modos y día uruguayo',()=>{assert.equal(MODES.facil.hints,2);assert.equal(MODES.facil.attempts,8);assert.equal(MODES.avanzado.attempts,6);assert.equal(MODES.dificil.attempts,5);assert.equal(dayKey(new Date('2026-09-26T02:59:59Z')),'2026-09-25');assert.equal(dayKey(new Date('2026-09-26T03:00:00Z')),'2026-09-26');assert.equal(answerFor('2026-09-25').word,'FUERO');assert.equal(puzzleNumber('2026-09-25'),1);assert.equal(puzzleNumber('2026-09-28'),4)});
test('resultado compartido incluye grilla y URL',()=>{let s=shareText('2026-09-25','avanzado',['ACTOR','FUERO'],'FUERO');assert.match(s,/2\/6/);assert.match(s,/🟩🟩🟩🟩🟩/);assert.match(s,/https:\/\/lucasramos\.uy\/normativa\/leydle\//)});

test('diccionario ampliado conserva intentos y excepción de las vocales',()=>{assert.equal(generalGuesses.size,12395);assert.ok(valid('ABEJA'));assert.ok(valid('AMPAY'));assert.ok(valid('VAMOS'));assert.ok(valid('AEIOU'));assert.ok(!valid('ZZZZZ'));assert.ok([...generalGuesses].every(w=>/^[A-ZÑ]{5}$/.test(w)))});

test('banco de 96 respuestas jurídicas: distintas, aceptadas y con artículos',()=>{assert.equal(answers.length,96);assert.equal(new Set(answers.map(a=>a.word)).size,96);for(const a of answers){assert.match(a.word,/^[A-ZÑ]{5}$/);assert.ok(valid(a.word),a.word);assert.ok(a.category&&a.hint&&a.definition);assert.match(a.source,/^https:\/\/lucasramos\.uy\/normativa\/normas\/[a-z0-9-]+\/articulo\/[^/]+\/$/)}assert.equal(answerFor('2026-09-25').word,'FUERO');assert.equal(answerFor('2026-10-18').word,'LISTA');assert.equal(answerFor('2026-10-19').word,'AUTOS');assert.equal(answerFor('2026-12-30').word,'FUERO')});

test('edición de letra intermedia y borrado desde selección o final',()=>{assert.equal(editGuess('CASAS','R',2),'CARAS');assert.equal(editGuess('CASAS','BORRAR',2),'CAAS');assert.equal(editGuess('CASAS','BORRAR'),'CASA');assert.equal(editGuess('CASAS','R'),'CASAS');assert.equal(editGuess('CAS','A'),'CASA')});

test('grilla compartida exacta: victoria, derrota y sin revelar palabra ni fuente',()=>{
 const win=shareText('2026-09-30','avanzado',['PLAZO','FALLO','CULPA'],'CULPA');
 assert.equal(win,'Leydle 2026-09-30 · Avanzado 3/6\n🟨🟨🟨⬛⬛\n⬛🟨🟩⬛⬛\n🟩🟩🟩🟩🟩\nhttps://lucasramos.uy/normativa/leydle/');
 for(const mode of Object.keys(MODES)){
 const loss=shareText('2026-09-30',mode,Array(MODES[mode].attempts).fill('PLAZO'),'CULPA');
 assert.ok(loss.includes(`X/${MODES[mode].attempts}`));
 assert.equal(loss.split('\n').slice(1,-1).length,MODES[mode].attempts);
 assert.ok(!loss.includes('CULPA'));assert.ok(!loss.includes('/articulo/'));
 }
});
