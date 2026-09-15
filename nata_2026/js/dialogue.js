export class Dialogue {
  constructor(lines,speakers,renderer,audio,onChange) {Object.assign(this,{lines,speakers,renderer,audio,onChange});this.el=document.querySelector('#dialogue');this.active=null;document.querySelector('#next').onclick=()=>this.next();document.querySelector('#dialogue-close').onclick=()=>this.active?.index===this.active?.lines.length-1?this.next():this.close();}
  show(block,onComplete=()=>{},options={}) {
    if(this.active)return false;
    const [scene,name]=block.includes('/')?block.split('/'):['gate',block];
    const lines=(options.lines||this.lines.filter(l=>l.scene===scene&&l.block===name)).slice(options.skip||0);if(!lines.length)throw new Error(`Missing dialogue block: ${block}`);
    this.previousFocus=document.activeElement;this.active={block,lines,index:0,onComplete};this.el.hidden=false;this.render();document.querySelector(this.active.lines.length===1?'#dialogue-close':'#next').focus();return true;
  }
  render() {const a=this.active,l=a.lines[a.index];document.querySelector('#speaker').textContent=this.speakers[l.speaker];document.querySelector('#line').textContent=l.text;document.querySelector('#line-count').textContent=`${a.index+1} / ${a.lines.length}`;const next=document.querySelector('#next');next.textContent='Далее →';next.hidden=a.index===a.lines.length-1;if(next.hidden&&document.activeElement===next)document.querySelector('#dialogue-close').focus();this.renderer.portrait(l.speaker,document.querySelector('#portrait'));this.onChange(l.speaker,l);this.audio.playVoice(l.audio);}
  next() {if(!this.active)return;this.audio.stopVoice();if(++this.active.index<this.active.lines.length)this.render();else{const done=this.active.onComplete;this.close();done();}}
  close() {if(!this.active)return;this.audio.stopVoice();this.active=null;this.el.hidden=true;this.onChange(null);if(this.previousFocus?.isConnected)this.previousFocus.focus();}
}
