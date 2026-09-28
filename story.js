// Imagen de resultado 1080 × 1920 para historias: se dibuja en el navegador
// y nunca se sube a ningún servidor. Mismo patrón que Fotograma.
import {grade} from './game.js';

const W=1080,H=1920,X=72;
const INK='#202b29',TEAL='#176b62',PAPER='#fbfaf7',MUTED='#6e7d8a',YELLOW='#e8c979',MISS='#86928f',TILE='#fffefa',LINE='#deded8';

function fillRound(ctx,x,y,w,h,r,color){
 ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();
}

function smallCaps(ctx,text,x,y,{align='left',color=MUTED,size=23}={}){
 ctx.font=`700 ${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;
 if('letterSpacing' in ctx)ctx.letterSpacing='5px';
 ctx.fillText(text,x,y);ctx.letterSpacing='0px';ctx.textAlign='left';
}

function wrapLines(ctx,text,maxWidth,maxLines){
 const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let line='';
 for(const word of words){
  const probe=line?`${line} ${word}`:word;
  if(ctx.measureText(probe).width<=maxWidth){line=probe;continue}
  if(line)lines.push(line);line=word;
  if(lines.length===maxLines)break;
 }
 if(lines.length<maxLines&&line)lines.push(line);
 else if(line&&lines.length===maxLines)lines[maxLines-1]=lines[maxLines-1].replace(/\s?\S+$/,'…');
 return lines;
}

export function drawStory(canvas,{dayLabel,number,modeLabel,word,definition,rows,answer,attempts,won}){
 canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Este navegador no puede crear la imagen.');
 const pad=String(number).padStart(3,'0');
 // fondo papel y regla superior
 ctx.fillStyle=PAPER;ctx.fillRect(0,0,W,H);
 ctx.fillStyle=TEAL;ctx.fillRect(0,0,W,18);
 // marca
 ctx.textBaseline='alphabetic';ctx.textAlign='left';
 ctx.fillStyle=INK;ctx.font='700 72px Georgia, serif';
 ctx.fillText('Ley',X,140);
 const leyW=ctx.measureText('Ley').width;
 ctx.fillStyle=TEAL;ctx.font='italic 400 72px Georgia, serif';
 ctx.fillText('dle.',X+leyW,140);
 smallCaps(ctx,'UN TÉRMINO JURÍDICO CADA DÍA',W-X,133,{align:'right'});
 // pelo
 ctx.fillStyle=INK;ctx.fillRect(X,180,W-2*X,2);
 // edición y modo
 smallCaps(ctx,`LEYDLE Nº ${pad} · ${dayLabel}`,X,245,{color:TEAL,size:24});
 smallCaps(ctx,`MODO ${modeLabel.toLocaleUpperCase('es-UY')}`,W-X,245,{align:'right',size:24});
 // medir la definición y la grilla para balancear el bloque central
 ctx.font='400 33px Arial, sans-serif';
 const defLines=wrapLines(ctx,definition,W-2*X-80,2);
 const n=rows.length,cellGap=14;
 const cell=Math.min(165,(760-cellGap*4)/5,(820-cellGap*(n-1))/n);
 const gridW=cell*5+cellGap*4,gridH=cell*n+cellGap*(n-1);
 const tile=160,tileGap=16,tilesW=tile*5+tileGap*4,tileLeft=(W-tilesW)/2;
 // banda central equilibrada: titular → fichas → definición → grilla
 const headH=120,gapA=70,gapB=64,gapC=84,defH=defLines.length*46;
 const total=headH+gapA+tile+gapB+defH+gapC+gridH;
 const bandTop=285,bandBottom=1755;
 const startY=bandTop+Math.max(0,(bandBottom-bandTop-total)/2);
 // titular y puntaje
 ctx.fillStyle=TEAL;ctx.font='italic 400 84px Georgia, serif';
 ctx.fillText(won?'Bien jugado.':'Hasta mañana.',X,startY+84);
 ctx.textAlign='right';ctx.fillStyle=INK;ctx.font='700 60px Georgia, serif';
 ctx.fillText(`${won?rows.length:'X'} / ${attempts}`,W-X,startY+84);ctx.textAlign='left';
 // palabra del día en fichas
 const letters=[...answer],top=startY+headH+gapA;
 const finalMarks=won?grade(rows.at(-1),answer):null;
 letters.forEach((letter,i)=>{
  const x=tileLeft+i*(tile+tileGap);
  if(won){fillRound(ctx,x,top,tile,tile,8,[MISS,YELLOW,TEAL][finalMarks[i]]);ctx.fillStyle=finalMarks[i]===1?INK:'#ffffff';}
  else{fillRound(ctx,x,top,tile,tile,8,TILE);ctx.fillStyle=INK;ctx.strokeStyle=LINE;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x,top,tile,tile,8);ctx.stroke();}
  ctx.font='800 76px Arial, sans-serif';ctx.textAlign='center';
  ctx.fillText(letter,x+tile/2,top+tile/2+27);ctx.textAlign='left';
 });
 // definición
 ctx.font='400 33px Arial, sans-serif';ctx.fillStyle=MUTED;ctx.textAlign='center';
 const defY=top+tile+gapB+33;
 defLines.forEach((line,i)=>ctx.fillText(line,W/2,defY+i*46));
 ctx.textAlign='left';
 // grilla de intentos
 const gx=(W-gridW)/2,gy=defY+(defLines.length-1)*46+gapC;
 rows.forEach((row,r)=>grade(row,answer).forEach((mark,c)=>{
  const x=gx+c*(cell+cellGap),y=gy+r*(cell+cellGap);
  fillRound(ctx,x,y,cell,cell,6,[MISS,YELLOW,TEAL][mark]);
  ctx.fillStyle=mark===1?INK:'#ffffff';ctx.font=`800 ${Math.round(cell*0.48)}px Arial, sans-serif`;ctx.textAlign='center';
  ctx.fillText(row[c],x+cell/2,y+cell/2+cell*0.17);ctx.textAlign='left';
 }));
 // cierre
 ctx.fillStyle=INK;ctx.fillRect(X,H-105,W-2*X,2);
 smallCaps(ctx,'UNA IDEA DE NORMATIVA URUGUAY',X,H-62,{size:21});
 smallCaps(ctx,'LUCASRAMOS.UY',W-X,H-62,{align:'right',size:21});
 return canvas;
}

export function makeStoryBlob(data){
 const canvas=document.createElement('canvas');
 drawStory(canvas,data);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('No pudimos crear el archivo.')),'image/png'));
}
