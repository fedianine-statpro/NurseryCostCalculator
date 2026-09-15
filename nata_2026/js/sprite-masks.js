// Conservative masks for the two supplied sheets with stray matte/adjacent-cell pixels.
// Keep the original art files intact and prepare each corrected sheet once at load time.
export function maskSprite(image,asset){
  if(!['nata_actions','sprite_irina'].includes(asset.key))return image;
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const c=canvas.getContext('2d');c.drawImage(image,0,0);
  const data=c.getImageData(0,0,canvas.width,canvas.height),[cw,ch]=asset.cell;
  for(let frame=0;frame<asset.frames;frame++){
    const ox=frame*cw,seen=new Uint8Array(cw*ch);let largest=[];
    const alpha=(x,y)=>data.data[((y*canvas.width)+ox+x)*4+3];
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
      const start=y*cw+x;if(seen[start]||!alpha(x,y))continue;
      const queue=[start];seen[start]=1;
      for(let i=0;i<queue.length;i++){
        const px=queue[i]%cw,py=Math.floor(queue[i]/cw);
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          const nx=px+dx,ny=py+dy,n=ny*cw+nx;
          if(nx<0||nx>=cw||ny<0||ny>=ch||seen[n]||!alpha(nx,ny))continue;
          seen[n]=1;queue.push(n);
        }
      }
      if(queue.length>largest.length)largest=queue;
    }
    const keep=new Set(largest);
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
      // The separate quest box must not also be baked into the kicking pose.
      // Keep the washing bucket: it occludes the leg in the supplied pose.
      const prop=asset.key==='nata_actions'&&frame===2&&x>=51&&y>=78;
      if(!keep.has(y*cw+x)||prop)data.data[((y*canvas.width)+ox+x)*4+3]=0;
    }
  }
  c.putImageData(data,0,0);return canvas;
}
