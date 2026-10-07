/* Physical archive presentation. No biography is defined in this file. */
window.createArchiveUI = ({config, el, icon, button}) => {
  const visuals = config.visuals;
  const themes = ['archive','childhood','ledger','army','album','cuba','office','canada','outdoors','family'];
  function prop(name, className = '') {
    const frame = el('span', `physical-prop prop-${name} ${className}`);
    frame.setAttribute('aria-hidden', 'true');
    const image = el('img');
    image.alt = ''; image.draggable = false;
    image.addEventListener('error', () => frame.replaceChildren(icon(name === 'knight' ? 'chess' : name)));
    image.src = visuals.objects[name];
    frame.append(image); return frame;
  }
  function applyScene(scene, reaction = false) {
    document.body.dataset.theme = scene.theme || themes[scene.chapter];
    document.body.dataset.scene = scene.id;
    document.body.dataset.reaction = String(reaction);
  }
  function opening(scene, next) {
    const article = el('article', 'discovery');
    const heading = el('h1', 'sr-only', scene.title); heading.id = 'scene-title';
    article.append(heading, el('p', 'discovery-intro', scene.section));
    const stage = el('div', 'discovery-stage');
    const peek = el('img', 'peek-photo');
    peek.src = visuals.opening.photo; peek.alt = ''; peek.draggable = false;
    peek.addEventListener('error', () => { peek.hidden = true; });
    const cover = button('', next);
    cover.className = 'folder-cover';
    cover.setAttribute('aria-label', scene.next);
    const title = el('span', 'folder-lettering');
    title.append(el('span','folder-name',scene.title),el('span','folder-imprint',visuals.opening.imprint),el('span','folder-circulation',visuals.opening.circulation));
    cover.append(prop('folder','cover-object'), title, el('span','folder-open-label',`${scene.next} ↗`));
    stage.append(peek,prop('knight','desk-knight'),prop('pencil','desk-pencil'),prop('stamp','desk-stamp'),cover);
    article.append(stage,el('p','discovery-caption',scene.subtitle));
    return article;
  }
  function decoration(article, scene) {
    const margin = el('div','margin-objects');
    if ([1,8,9].includes(scene.chapter)) margin.append(prop('knight'));
    if ([2,6].includes(scene.chapter)) margin.append(prop('pencil'));
    if (scene.chapter === 8) margin.append(prop('float'));
    if (scene.chapter === 3) margin.append(el('span','file-clip'));
    article.append(margin);
  }
  function exhibit(target, item) {
    if (item.icon === 'chess') {
      const caption = el('figure', 'knight-exhibit');
      caption.append(prop('knight'),el('figcaption','',visuals.knightCaption));
      target.append(caption);
    }
    if (item.icon === 'flower') {
      const specimen = el('div', 'flower-exhibit');
      specimen.append(prop('flower'), el('span','exhibit-label',visuals.flowerCaption));
      target.append(specimen);
    }
  }
  function closedCase(target) {
    const folder = el('div', 'closed-case');
    folder.setAttribute('aria-hidden','true');
    folder.append(prop('flower')); target.append(folder);
  }
  function performance(target, scene, reaction) {
    if (scene.id === 'prediction') {
      target.classList.add('accountant-performance');
      const ledger = el('div','ledger-drop');
      const remnants = el('div','career-remnants');
      remnants.setAttribute('aria-hidden','true');
      scene.choices.forEach(choice => remnants.append(el('span','',choice.label)));
      ledger.append(remnants);
      ledger.append(el('span','ledger-binding'),el('p','ledger-label',visuals.ledgerLabel),prop('stamp','ledger-stamp'));
      const cells = el('div','ledger-cells'); cells.setAttribute('aria-hidden','true');
      for (let i=0;i<18;i++) cells.append(el('span'));
      ledger.append(cells); target.insertBefore(ledger,target.querySelector('.content'));
    }
    if (reaction.icon === 'measure') {
      target.classList.add('measurement-performance');
      const tape = el('div', 'tape-performance');
      tape.append(prop('measure'),el('p','measure-note',visuals.measureLabel));
      target.insertBefore(tape,target.querySelector('.content'));
    }
    if (scene.id === 'fish-result') {
      const catchPhoto = el('figure','modest-fish');
      catchPhoto.append(prop('fish'),el('figcaption','',visuals.fishCaption));
      target.insertBefore(catchPhoto,target.querySelector('.content'));
    }
    if (scene.id === 'achievement') {
      target.classList.add('classification-performance');
      const spread = el('div','classification-spread');
      const categories = el('div','classification-categories');
      scene.choices.forEach(choice => categories.append(el('span','category-card',choice.label)));
      spread.append(categories);
      visuals.classificationPhotos.forEach((photo,i) => {
        const figure = el('figure',`overlap-photo overlap-${i}`);
        const image=el('img'); image.src=photo.src;image.alt=photo.alt;image.draggable=false;
        image.addEventListener('error',()=>{figure.hidden=true;});
        figure.append(image);spread.append(figure);
      });
      target.insertBefore(spread,target.querySelector('.content'));
    }
  }
  function recordingDecor(card) {
    const machine=el('div','recording-machine');
    machine.setAttribute('aria-hidden','true');
    machine.append(prop('recorder'));
    const motion=el('div','reel-motion');motion.append(el('span','reel'),el('span','reel'));
    const meter=el('div','recording-meter');
    for(let i=0;i<7;i++) meter.append(el('i'));
    machine.append(motion,meter);card.append(machine);
  }
  function object(name) { return name === 'chess' ? prop('knight') : icon(name); }
  return {prop, applyScene, opening, decoration, exhibit, closedCase, performance, recordingDecor, object};
};
