// The four prescribed scenes, using the existing dialogue, action and input code.
export class Story {
  constructor(api){this.a=api;}
  get s(){return this.a.state();}
  seen(block){return this.s.seenBlocks.includes(block);}
  say(block,done=()=>{},options={}){this.a.talk(block,()=>{this.a.commit({type:'seen',block});done();},options);}
  chain(blocks,done=()=>{}){const next=blocks.find(b=>!this.seen(b));if(next)this.say(next,()=>this.chain(blocks,done));else done();}
  entered(){
    const s=this.s,f=s.flags;
    if(f.finaleStarted){this.finale();return;}
    if(s.scene==='gate'){
      if(f.rangerRescued&&!f.keyReturned)this.rescueTalk(()=>this.gateReturn());
      else if(!this.seen('gate/intro'))this.say('gate/intro');
    }
    if(s.scene==='camp'&&!f.rescueBriefed)this.campIntro();
    else if(s.scene==='camp'&&f.rangerRescued)this.rescueTalk();
    else if(s.scene==='camp'&&f.signalSent&&!f.ropeThrown)this.throwRope();
    if(s.scene==='home')this.homeIntro();
    if(s.scene==='shore'&&!this.seen('shore/arrival'))this.shoreIntro();
    else if(s.scene==='shore'&&f.bellRetrieved&&!this.seen('shore/need_ladle')&&!this.seen('shore/have_ladle'))this.bellTalk();
  }
  gateReturn(){this.chain(this.s.flags.gateBriefed?['gate/return']:['gate/recovered_first'],()=>this.a.commit({type:'return_key'}));}
  keeper(){if(this.s.flags.rangerRescued&&!this.s.flags.keyReturned)this.rescueTalk(()=>this.gateReturn());else if(!this.s.flags.gateBriefed&&!this.s.flags.rangerRescued)this.say('gate/greeting',()=>this.a.commit({type:'talk_gate'}));else if(!this.s.flags.keyReturned)this.say('gate/gate_hint');else this.a.gatePuzzle();}
  campIntro(){const lines=this.a.lines.filter(l=>l.scene==='camp'&&l.block==='arrival');if(!this.s.flags.gateBriefed)lines[0]=this.a.lines.find(l=>l.id==='camp_early_arrival_01');this.say('camp/arrival',()=>this.a.commit({type:'inspect_camp'}),{lines});}
  shoreIntro(done=()=>{}){if(this.seen('shore/arrival')){done();return;}if(!this.s.flags.rescueBriefed&&!this.seen('shore/early'))this.say('shore/early',()=>this.shoreIntro(done));else this.say('shore/arrival',done,{skip:this.seen('shore/early')?2:0});}
  homeIntro(){if(!this.s.flags.rescueBriefed){if(!this.seen('home/early'))this.say('home/early');}else if(!this.s.flags.ladleTaken){if(!this.seen('home/arrival'))this.say('home/arrival');}else if(!this.seen('home/ladle_taken'))this.say('home/ladle_taken');}
  rod(){if(this.s.flags.rodGranted){this.say('shore/float_hint');return;}
    this.shoreIntro(()=>this.chain(['shore/rod_request'],()=>this.a.context('Отвлечь Сергея',[
      ['Сказать про ладью',()=>this.rodBranch('rook')],['Сказать про дракона',()=>this.rodBranch('dragon')]
    ])));
  }
  rodBranch(branch){this.say(`shore/${branch}`,()=>this.a.commit({type:'grant_rod'}));}
  retrieve(){if(this.s.flags.bellRetrieved){this.bellTalk();return;}if(!this.s.inventory.includes('rod')){this.say('shore/no_rod');return;}
    this.a.animate('retrieve_bell',1.8,()=>{this.a.commit({type:'retrieve_bell'});this.bellTalk();});}
  bellTalk(){this.chain(['shore/bell_retrieved',this.s.flags.ladleTaken?'shore/have_ladle':'shore/need_ladle']);}
  cupboard(){const s=this.s;
    if(!s.flags.rescueBriefed&&!this.seen('home/early_cupboard')){this.say('home/early_cupboard',()=>this.cupboard());return;}
    if(s.flags.ladleTaken){this.say(s.flags.rescueBriefed?'home/ladle_taken':'home/ladle_early');return;}
    if(!s.flags.boxHeld){this.say('home/cupboard');return;}
    this.a.animate('take_ladle',.6,()=>{this.a.commit({type:'take_ladle'});this.say(s.flags.rescueBriefed?'home/ladle_taken':'home/ladle_early');});
  }
  kick(){if(!this.seen('home/potatoes')){this.say('home/potatoes',()=>this.kick());return;}
    if(!this.s.flags.boxMovedOnce)this.a.animate('kick_box',1.3,()=>this.say('home/returned_box',()=>this.a.commit({type:'kick_box'})));
    else if(!this.seen('home/repeat_box'))this.a.animate('kick_box',.9,()=>this.say('home/repeat_box'));
    else this.say('home/box_hint');
  }
  hold(which){if(!this.s.flags.boxMovedOnce){this.kick();return;}if(this.s.flags.boxHeld){this.cupboard();return;}
    this.say(which==='self'?'home/hold_self':'home/hold_request',()=>this.a.commit({type:'hold_box'}));}
  hang(){if(this.s.flags.bellHung){this.ring();return;}if(!this.s.inventory.includes('bell')){this.say('camp/bell_hint');return;}
    this.a.animate('hang_bell',.65,()=>{this.a.commit({type:'hang_bell'});this.say('camp/hang');});}
  ring(){const f=this.s.flags;
    if(f.rangerRescued){this.rescueTalk();return;}
    if(!f.rescueBriefed){this.campIntro();return;}
    if(f.signalSent){this.throwRope();return;}
    if(!f.bellHung){this.say('camp/signal_hint');return;}
    if(!this.s.inventory.includes('ladle')){this.say('camp/no_ladle');return;}
    this.a.animate('signal',2.1,()=>{this.a.commit({type:'signal'});this.throwRope();});
  }
  throwRope(){if(this.s.flags.ropeThrown){this.a.context('Верёвка уже на берегу',[['Подать конец Антону',()=>this.pull()]]);return;}
    this.chain(['camp/ring'],()=>this.a.animate('throw_rope',.9,()=>this.a.commit({type:'throw_rope'})));}
  pull(){if(!this.s.flags.ropeThrown||this.s.flags.rangerRescued)return;
    this.a.animate('rescue',2.3,()=>{this.a.commit({type:'rescue'});this.rescueTalk();});}
  rescueTalk(done=()=>{}){if(!this.s.flags.rangerRescued){done();return;}this.chain(['camp/rescue',this.s.flags.gateBriefed?'camp/key_known':'camp/key_early','camp/rescue_end'],done);}
  inspect(z){
    let block=z.block;
    if(this.s.scene==='shore'&&z.id==='chess')block=this.s.flags.bellRetrieved?'chess_after':'chess_before';
    if(this.s.scene==='home'&&z.id==='fort')block=this.seen('home/fort')?'fort_again':'fort';
    if(this.s.scene==='shore'&&z.id==='lizard'){this.a.animate('lizard',.6,()=>this.say('shore/lizard'));return;}
    if(block)this.say(`${this.s.scene}/${block}`);else this.person(z.id);
  }
  person(id){
    const f=this.s.flags;
    if(id==='danka'){this.say('camp/arrival',()=>{},{lines:this.a.lines.filter(l=>l.id==='camp_arrival_03')});return;}
    if(id==='sergey'){this.rod();return;}
    if(id==='linochka'){if(f.rescueBriefed&&!this.seen('home/arrival')&&!f.ladleTaken)this.homeIntro();else this.cupboard();return;}
    if(id==='victor'){this.a.context('Виктор', [['Поговорить',()=>this.say('home/game_memory')],['Попросить удержать коробку',()=>this.hold('victor')]]);return;}
    if(id==='irina'){this.say(f.rescueBriefed?'home/ladle_taken':'home/early');return;}
    if(id==='vinnik'){if(!f.rangerRescued){this.say('camp/dance_offer');return;}this.say('camp/dance_after',()=>this.a.animate('dance',3.5,()=>{}));return;}
    if(['katya','alsu','sanka'].includes(id)){this.say(f.rangerRescued?'camp/hook':f.bellHung?'camp/signal_hint':'camp/hook');return;}
    if(id==='ranger'){f.rangerRescued?this.rescueTalk():!f.rescueBriefed?this.campIntro():this.say('camp/shout_again');return;}
    if(id==='anton'){if(!f.rescueBriefed)this.campIntro();else if(f.rangerRescued)this.a.context('Антон',[['Вспомнить зимний поход',()=>this.say('camp/winter')],['Поговорить о спасении',()=>this.rescueTalk()]]);else if(f.ropeThrown)this.throwRope();else this.say(f.bellHung?'camp/signal_hint':'camp/bell_hint');return;}
    this.say('camp/winter');
  }
  click(z,p,looking=false){
    if(this.s.flags.finaleStarted){this.finale();return;}
    if(z.id==='path'){this.a.travel();return;}
    if(looking){this.inspect(z);return;}
    const menu=(title,opts)=>this.a.context(title,[['Осмотреть',()=>this.inspect(z)],...opts],p);
    if(this.s.scene==='shore'&&z.id==='float')menu(z.label,[['Зацепить петлю удочкой',()=>this.retrieve()]]);
    else if(this.s.scene==='shore'&&z.id==='rod')this.rod();
    else if(this.s.scene==='home'&&z.id==='cupboard')menu(z.label,[['Открыть шкафчик',()=>this.cupboard()]]);
    else if(this.s.scene==='home'&&z.id==='box')menu(z.label,[['Подвинуть ногой',()=>this.kick()],['Попросить Виктора придержать',()=>this.hold('victor')],['Придержать самостоятельно',()=>this.hold('self')]]);
    else if(this.s.scene==='home'&&z.id==='candy')menu(z.label,[['Вспомнить леденцы',()=>this.a.animate('candy',.8,()=>this.say('home/candy'))]]);
    else if(this.s.scene==='camp'&&z.id==='hook')menu(z.label,[['Повесить колокол',()=>this.hang()],['Подать сигнал половником',()=>this.ring()]]);
    else if(this.s.scene==='camp'&&z.id==='rope')this.pull();
    else if(z.cursor==='speech')this.person(z.id);
    else this.inspect(z);
  }
  apply(item,z){const sc=this.s.scene;
    if(item==='rod'&&sc==='shore'&&z.id==='float')this.retrieve();
    else if(item==='bell'&&sc==='camp'&&z.id==='hook')this.hang();
    else if(item==='ladle'&&sc==='camp'&&z.id==='hook')this.ring();
    else if(item==='ladle'&&sc==='camp'&&z.id==='wood')this.say('camp/wood_hit');
    else if(item==='ladle'&&sc==='shore'&&z.id==='inventory-bell'){this.a.audio.sfx('bell');this.say('shore/test_bell');}
    else this.hint();
  }
  hint(){const f=this.s.flags;
    if(f.finaleStarted){this.finale();return;}
    if(this.s.scene==='home'){if(f.boxHeld)this.cupboard();else this.say('home/box_hint');}
    else if(this.s.scene==='shore')this.say(f.rodGranted?'shore/float_hint':'shore/rod_hint');
    else if(this.s.scene==='camp'){if(!f.rescueBriefed)this.campIntro();else if(f.ropeThrown&&!f.rangerRescued)this.throwRope();else if(f.rangerRescued)this.rescueTalk();else this.say(f.bellHung?'camp/signal_hint':'camp/bell_hint');}
    else this.keeper();
  }
  finale(){const f=this.s.flags;if(f.finaleComplete){this.a.finish();return;}
    if(!this.seen('finale/arrival')){this.say('finale/arrival',()=>this.finale());return;}
    if(!f.ladleWashed){this.a.animate('wash_ladle',1.7,()=>{this.a.commit({type:'wash_ladle'});this.finale();});return;}
    if(!this.seen('finale/washed')){this.say('finale/washed',()=>this.finale());return;}
    if(!this.seen('finale/dinner')){this.say('finale/dinner',()=>this.a.animate('dinner',2.2,()=>this.finale()));return;}
    if(!this.seen('finale/gift')){this.a.animate('gift',.6,()=>this.say('finale/gift',()=>this.finale()));return;}
    if(!f.evening){this.a.animate('evening',1.8,()=>{this.a.commit({type:'evening'});this.finale();});return;}
    if(!this.seen('finale/goodnight')){this.say('finale/goodnight',()=>this.finale());return;}
    this.a.finish(true);
  }
}
