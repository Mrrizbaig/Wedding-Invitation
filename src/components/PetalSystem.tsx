import React, { useRef, useEffect, useCallback } from 'react';
import { random, clamp } from '../lib/utils';

interface PetalSystemProps { burst: boolean; onBurstEnd: () => void; }
interface Petal { x:number; y:number; vx:number; vy:number; rotation:number; rotationSpeed:number; size:number; opacity:number; depth:number; color:string; }

const PETAL_COLORS = ['#9D5A60','#C9B89A','#E8DDD0','#C9A45C','#B8876A'];

function createPetal(w:number,h:number,top=false):Petal {
  const depth=random(.15,1);
  return {
    x:random(0,w), y:top?random(-h*.3,0):random(0,h),
    vx:(random(0,1)>.5?1:-1)*random(.08,.35),
    vy:random(.28,.85)*(0.65+depth*.45),
    rotation:random(0,Math.PI*2),
    rotationSpeed:(random(0,1)>.5?1:-1)*random(.003,.012),
    size:random(6,13)*(0.65+depth*.55),
    opacity:random(.12,.38)*(0.5+depth*.5),
    depth,
    color:PETAL_COLORS[Math.floor(random(0,PETAL_COLORS.length-.01))],
  };
}

export default function PetalSystem({burst,onBurstEnd}:PetalSystemProps){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const petalsRef=useRef<Petal[]>([]);
  const frameRef=useRef(0);
  const burstRef=useRef(false);
  const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  const init=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const count=window.innerWidth<768?16:28;
    petalsRef.current=Array.from({length:count},()=>createPetal(c.width,c.height));
  },[]);

  useEffect(()=>{
    if(!burst || burstRef.current)return;
    burstRef.current=true;
    if(timerRef.current)clearTimeout(timerRef.current);
    timerRef.current=setTimeout(()=>{burstRef.current=false;onBurstEnd();},650);
  },[burst,onBurstEnd]);

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize=()=>{c.width=window.innerWidth;c.height=window.innerHeight;init();};
    resize();window.addEventListener('resize',resize);
    if(reduced)return()=>window.removeEventListener('resize',resize);
    const ctx=c.getContext('2d');if(!ctx)return;

    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      const bursting=burstRef.current;
      for(const p of petalsRef.current){
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha=clamp(p.opacity*(bursting?1.25:1),0,1);
        ctx.fillStyle=p.color;
        ctx.beginPath();
        ctx.ellipse(0,0,p.size*.55,p.size*.28,0,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
        const mult=bursting?2.2:1;
        p.x+=(p.vx+Math.sin(p.y*.012)*.08)*mult;
        p.y+=p.vy*mult;
        p.rotation+=p.rotationSpeed*mult;
        if(p.y>c.height+24){Object.assign(p,createPetal(c.width,c.height,true));p.y=-16;}
        if(p.x<-24)p.x=c.width+12;
        if(p.x>c.width+24)p.x=-12;
      }
      frameRef.current=requestAnimationFrame(draw);
    };
    frameRef.current=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frameRef.current);window.removeEventListener('resize',resize);if(timerRef.current)clearTimeout(timerRef.current);};
  },[init]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:40}} aria-hidden="true"/>;
}
