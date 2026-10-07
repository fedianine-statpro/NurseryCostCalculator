/* Scene engine. Personal content lives in story-data.js. No network is required. */
(() => {
  'use strict';
  const config = window.MAGAZINE;
  const scenes = config.scenes.filter(scene => scene.enabled !== false);
  const root = document.getElementById('scene');
  const storageKey = 'sergey-magazine-progress-v1';
  let index = 0;
  let introSeen = false;
  const sound = window.createArchiveSound(window.ARCHIVE_SOUND);
  window.bindArchiveSoundControls(sound);
  let inspected = new Set();
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch (_) { /* Private browsing still works. */ }
  const chapterNames = ['Открытие архива','Душанбе','Москва и университет','Армейский архив','Сергей и Ирина','Работа, Наташа и Куба','Корпоративный архив','Канада','Любимые занятия','Юбилейный выпуск'];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function paragraphs(target, lines, className = '') {
    (lines || []).forEach(line => target.append(el('p', className, line)));
  }
  function button(label, handler, secondary = false, cue = null) {
    const node = el('button', secondary ? 'action secondary' : 'action', label);
    node.type = 'button';
    if (label) node.setAttribute('aria-label',label);
    node.addEventListener('click', () => { if (cue) sound.cue(cue); handler(); });
    return node;
  }
  // Small original line drawings. Decorative SVG never replaces a text label.
  const drawings = {
    magazine:'M20 14h36v46H20z M26 23h24 M26 30h24 M26 38h9v12h-9z M40 38h10 M40 44h10 M26 55h24',
    chess:'M23 60h33 M27 53h25l-3-10 4-10-5-17-12-5-3 8-9 11 12 4-6 9z M41 23h1',
    hockey:'M48 12L31 51l-16 3 3 7 20-4 18-42 M50 59h13',
    boxing:'M24 48l-4-15 3-14 13-5 14 3 6 11-2 19-10 8H28z M28 55h18v9H28z M24 35l10 4 4-13',
    guitar:'M48 9l6 3-14 27c12 10 6 23-6 25-13 2-23-12-15-21 3-4 8-3 11-5z M36 42a5 5 0 1 0 0 10a5 5 0 1 0 0-10 M30 58l8 2 M34 47l17-34',
    record:'M38 12a26 26 0 1 0 0 52a26 26 0 1 0 0-52 M38 28a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M38 37h1 M23 23l-4 7 M54 47l-4 7',
    flower:'M38 37v28 M38 51l-12-8 M38 57l12-8 M38 20c-14-17-26 1-13 9-14 10 3 22 13 10 10 12 26 0 13-10 13-8 1-26-13-9z',
    document:'M23 10h23l11 12v43H23z M46 10v13h11 M29 33h21 M29 42h21 M29 51h21 M29 59h12',
    phone:'M23 15l10 12-7 7c4 8 8 12 16 16l7-7 12 10c-7 18-22 10-35-3S5 23 23 15z',
    coffee:'M19 25h33v24c0 18-33 18-33 0z M52 29h9c9 0 7 17-9 16 M15 65h42 M27 9v9 M39 8v10',
    tent:'M8 60l30-44 30 44z M38 16v44 M38 35L23 60 M34 13l8-5',
    fish:'M13 38c13-18 31-17 44 0-13 17-31 18-44 0z M57 38l13-12v24z M23 34h1 M37 24l8-8 4 11',
    measure:'M9 42h58 M9 29v25 M67 29v25 M9 42l8-6 M9 42l8 6 M67 42l-8-6 M67 42l-8 6 M26 17h24',
    icecream:'M24 34l14 32 14-32z M22 34c-12-8-4-21 5-18 1-15 22-15 23 0 9-3 17 10 5 18z M29 41l17 10 M34 53l7-11',
    animation:'M13 20h50v38H13z M13 20l8-10h50l-8 10 M27 10l-6 10 M42 10l-6 10 M57 10l-6 10 M32 30l13 9-13 9z',
    badge:'M38 11l8 17 19 3-14 13 3 20-16-9-17 9 4-20-15-13 20-3z',
    photo:'M13 16h50v46H13z M19 51l13-15 10 10 8-7 7 12 M48 26a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
    sun:'M38 25a13 13 0 1 0 0 26a13 13 0 1 0 0-26 M38 8v9 M38 59v9 M8 38h9 M59 38h9 M17 17l7 7 M52 52l7 7 M17 59l7-7 M52 24l7-7',
    house:'M10 35l28-23 28 23 M19 29v34h38V29 M32 63V44h13v19 M23 36h6'
  };
  function icon(name, className = 'illustration') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 76 76');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', className);
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', drawings[name] || drawings.document);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.4');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.append(path);
    return svg;
  }
  const archive = window.createArchiveUI({config, el, icon, button});
  function stamp(target, text) { if (text) target.append(el('div', 'stamp', text)); }
  function facts(target, entries) {
    if (!entries) return;
    const list = el('dl', 'facts');
    entries.forEach(([key, value]) => {
      const row = el('div', 'fact-row');
      row.append(el('dt', '', key), el('dd', '', value));
      list.append(row);
    });
    target.append(list);
  }
  function photograph(target, scene, optional = false, onLoad) {
    if (!scene.photo) return;
    const figure = el('figure', 'photograph');
    if (scene.kind === 'journal') figure.classList.add('journal-photo');
    figure.hidden = optional;
    const placeholder = el('div', 'photo-placeholder');
    placeholder.append(icon('photo'), el('span', '', 'Место для семейной фотографии'));
    const img = el('img');
    img.alt = scene.alt || scene.caption || '';
    img.hidden = true;
    img.addEventListener('load', () => {
      img.hidden = false; placeholder.hidden = true; figure.hidden = false;
      if (onLoad) onLoad();
    });
    img.addEventListener('error', () => {
      img.hidden = true; placeholder.hidden = false; figure.hidden = optional;
    });
    const caption = el('figcaption','',scene.caption);
    figure.append(placeholder,img,caption);
    target.append(figure);
    img.src = scene.photo;
  }
  function photoAlbum(target, id) {
    const photos = config.photoAlbums?.[id];
    if (!photos?.length) return;
    const album = el('section', 'photo-album');
    if (photos.some(photo => photo.kind === 'journal')) album.classList.add('journal-album');
    album.setAttribute('aria-label', 'Фотографии из семейного архива');
    album.hidden = true;
    target.append(album);
    photos.forEach(photo => photograph(album, photo, true, () => {
      album.hidden = false;
      album.dataset.count = album.querySelectorAll('figure:not([hidden])').length;
    }));
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({sceneId: scenes[index].id, introSeen})); } catch (_) { /* Continue without saving. */ }
  }
  function audioPlayer(target, id) {
    const clip = config.audioClips?.[id];
    if (!clip?.src) return;
    const card = el('section', 'audio-card');
    archive.recordingDecor(card);
    const title = el('h2', 'audio-title', clip.title);
    const audio = el('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.src = clip.src;
    audio.dataset.clip = id;
    audio.setAttribute('aria-label', clip.title);
    const status = el('p', 'audio-status', 'Нажмите ▶, чтобы послушать. Можно продолжить чтение в любой момент.');
    status.setAttribute('aria-live', 'polite');
    sound.registerRecording(audio,(state,muted) => {
      card.classList.toggle('playing',state==='playing');
      status.textContent = state==='playing' ? muted ? 'Запись запущена без звука. Включите общий звук и семейные записи в настройках.' : 'Запись звучит. Можно поставить на паузу или продолжить чтение.' :
        state==='paused' ? 'Запись на паузе. Нажмите ▶, чтобы продолжить.' :
        state==='ended' ? 'Запись завершена. Можно послушать ещё раз.' : 'Запись недоступна. Можно продолжать чтение.';
    });
    card.append(title);
    if (clip.caption) card.append(el('p', 'audio-caption', `${clip.caption} · ${clip.duration}`));
    card.append(audio, status); target.append(card);
  }
  function sceneAudio(target, id) {
    (config.sceneAudio?.[id] || []).forEach(clip => audioPlayer(target, clip));
    const bonus = config.bonusAudio?.[id];
    if (!bonus) return;
    const details = el('details', 'bonus-audio');
    details.append(el('summary', '', bonus.title));
    paragraphs(details, bonus.body);
    bonus.clips.forEach(clip => audioPlayer(details, clip));
    details.addEventListener('toggle', () => {
      if (!details.open) sound.stopContained(details);
    });
    target.append(details);
  }
  function focus(node) { node.tabIndex = -1; node.focus({preventScroll: true}); }
  function actions(target) { const area = el('div', 'actions'); target.append(area); return area; }
  function next() {
    const previous = scenes[index];
    if (scenes[index].id === 'cover') introSeen = true;
    index = Math.min(index + 1, scenes.length - 1);
    render();
    sound.navigate(previous,scenes[index]);
  }
  function showReaction(scene, reaction) {
    sound.leaveRecordings();
    archive.applyScene(scene,true);
    root.replaceChildren();
    const article = el('article', 'sheet reaction');
    archive.decoration(article,scene);
    article.append(el('p', 'eyebrow', scene.section), el('h1', '', reaction.title));
    article.querySelector('h1').id = 'scene-title';
    if (reaction.icon && !['measure','fish'].includes(reaction.icon)) article.append(icon(reaction.icon));
    stamp(article, reaction.stamp);
    const content = el('div', reaction.photo ? 'content with-photo' : 'content');
    const copy = el('div', 'copy');
    paragraphs(copy, reaction.body);
    content.append(copy);
    photograph(content, reaction);
    article.append(content);
    archive.performance(article,scene,reaction);
    photoAlbum(article, reaction.album);
    actions(article).append(button(scene.afterNext || scene.next || 'Дальше', next));
    root.append(article);
    sound.reaction(scene,reaction);
    focus(article.querySelector('h1'));
  }
  function inspection(target, scene) {
    const grid = el('div', 'folder-grid');
    const detail = el('section', 'inspection-detail');
    detail.setAttribute('aria-label', 'Содержимое выбранной папки');
    detail.hidden = true;
    const status = el('p', 'inspection-status');
    status.setAttribute('aria-live', 'polite');
    const bottom = actions(target);
    const proceed = button(scene.next || 'Дальше', next);
    proceed.hidden = true;
    bottom.append(proceed);
    const update = () => {
      status.textContent = `Открыто материалов: ${inspected.size} из ${scene.items.length}`;
      proceed.hidden = inspected.size !== scene.items.length;
    };
    scene.items.forEach((item, i) => {
      const b = button('', () => {
        sound.leaveRecordings();
        sound.inspect(item);
        inspected.add(i);
        b.classList.add('visited');
        b.querySelector('.folder-state').textContent = 'Просмотрено ✓';
        detail.replaceChildren(el('h2', '', item.title));
        paragraphs(detail, item.body);
        archive.exhibit(detail,item);
        photoAlbum(detail, item.album);
        if (item.illustration) {
          const clipping = el('figure', 'magazine-recreation');
          clipping.append(icon(item.illustration), el('figcaption', '', 'Редакционная иллюстрация · не оригинал детского журнала'));
          detail.append(clipping);
        }
        stamp(detail, item.stamp);
        if (item.source) detail.append(el('p', 'source', item.source));
        if (item.after) {
          detail.append(button(item.close, () => {
            detail.replaceChildren(el('h2', '', item.after[0]));
            paragraphs(detail, item.after.slice(1));
            stamp(detail, 'ДЕЛО ЗАКРЫТО');
            archive.closedCase(detail);
            sound.cue('stamp-official',{delay:100}); focus(detail.querySelector('h2'));
          }, true, null));
        }
        if (item.audio) audioPlayer(detail, item.audio);
        detail.hidden = false; update(); focus(detail.querySelector('h2'));
        detail.scrollIntoView({block:'nearest',behavior:'instant'});
      }, true);
      b.className = 'folder';
      b.append(icon(item.icon, 'folder-icon'), el('span', 'folder-label', item.label), el('span', 'folder-state', 'Открыть материал →'));
      grid.append(b);
    });
    target.insertBefore(grid, bottom);
    target.insertBefore(detail, bottom);
    target.insertBefore(status, bottom);
    update();
  }
  function render() {
    sound.leaveRecordings(); inspected = new Set();
    const scene = scenes[index];
    sound.changeScene(scene);
    archive.applyScene(scene);
    document.body.dataset.chapter = scene.chapter;
    document.body.dataset.sceneType = scene.type || 'article';
    document.getElementById('chapter-label').textContent = scene.chapter ? `${String(scene.chapter).padStart(2,'0')} / ${chapterNames[scene.chapter]}` : chapterNames[0];
    document.getElementById('page-label').textContent = `Страница ${index + 1} из ${scenes.length}`;
    const percent = Math.round((index + 1) / scenes.length * 100);
    document.getElementById('progress').style.width = `${percent}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', percent);
    root.replaceChildren();
    if (scene.id === 'cover') {
      const cover = archive.opening(scene,next);
      root.append(cover); save(); focus(cover.querySelector('h1')); window.scrollTo({top:0,behavior:'instant'}); return;
    }
    const article = el('article', `sheet ${scene.type || 'article'}`);
    archive.decoration(article,scene);
    const top = el('div', 'sheet-top');
    top.append(el('span', '', scene.section), el('span', '', scene.year));
    article.append(top, el('h1', '', scene.title));
    article.querySelector('h1').id = 'scene-title';
    if (scene.subtitle) article.append(el('p', 'subtitle', scene.subtitle));
    stamp(article, scene.stamp);
    const content = el('div', scene.photo ? 'content with-photo' : 'content');
    const copy = el('div', 'copy');
    if (scene.icon) copy.append(icon(scene.icon));
    paragraphs(copy, scene.body);
    facts(copy, scene.facts);
    if (scene.aside) {
      const aside = el('aside', 'correction'); paragraphs(aside, scene.aside); copy.append(aside);
    }
    if (scene.source) copy.append(el('p', 'source', scene.source));
    content.append(copy); photograph(content, scene); article.append(content);
    if (scene.type === 'montage') {
      const grid = el('div', 'montage-grid');
      scene.objects.forEach(([name, label]) => { const card = el('div', 'archive-object'); card.append(archive.object(name), el('span','',label)); grid.append(card); });
      article.append(grid);
    }
    if (scene.type === 'birthday') {
      const letter = el('div', 'family-letter'); paragraphs(letter, config.birthdayMessage); article.append(letter);
    }
    photoAlbum(article, scene.id);
    sceneAudio(article, scene.id);
    if (scene.type === 'inspect') inspection(article, scene);
    else if (scene.type === 'choice') {
      const area = actions(article); area.classList.add('choices');
      scene.choices.forEach(choice => {
        const b = button(choice.label, () => showReaction(scene, choice.reaction || scene.reaction), false, null);
        if (scene.id === 'prediction') b.classList.add('career-card');
        if (choice.icon) b.prepend(icon(choice.icon, 'choice-icon'));
        area.append(b);
      });
    } else if (scene.type === 'reveal') actions(article).append(button(scene.next, () => showReaction(scene, scene.reaction), false, null));
    else if (scene.type === 'end') actions(article).append(button(scene.next, startOver));
    else actions(article).append(button(scene.next || 'Дальше', next));
    root.append(article); save();
    focus(article.querySelector('h1'));
    window.scrollTo({top:0,behavior:'instant'});
  }
  function startOver() { index = 0; introSeen = false; render(); }
  function restartPrompt() {
    const area = document.getElementById('menu-panel');
    area.replaceChildren(el('span', '', 'Начать выпуск с первой страницы?'));
    area.append(button('Да, начать сначала', () => { closeMenu(); startOver(); }, true), button('Продолжить чтение', closeMenu, true));
    area.querySelector('button').focus();
  }
  function closeMenu() {
    const area = document.getElementById('menu-panel'); area.hidden = true;
    document.getElementById('menu').setAttribute('aria-expanded','false');
    area.replaceChildren(button('Начать сначала', restartPrompt, true), el('span','','Архив сохраняется на этом устройстве.'));
    document.getElementById('menu').focus();
  }

  document.getElementById('menu').addEventListener('click', () => {
    const area = document.getElementById('menu-panel');
    if (!area.hidden) closeMenu();
    else { area.hidden = false; document.getElementById('menu').setAttribute('aria-expanded','true'); }
  });
  document.getElementById('restart').addEventListener('click', restartPrompt);
  const savedIndex = saved && scenes.findIndex(scene => scene.id === saved.sceneId);
  if (Number.isInteger(savedIndex) && savedIndex > 0) {
    index = savedIndex; introSeen = Boolean(saved.introSeen);
    // The bookmark screen is an archive entrance, before the saved chapter opens.
    sound.changeScene(scenes.find(scene => scene.id === 'cover'));
    const welcome = el('article','sheet resume');
    welcome.append(el('p','eyebrow','Архив ждёт вас'),el('h1','','Выпуск остался открытым'),el('p','',`Вы остановились на странице «${scenes[index].title}».`));
    welcome.querySelector('h1').id = 'scene-title';
    actions(welcome).append(button('Продолжить с места остановки',render),button('Начать сначала',startOver,true));
    root.append(welcome);
    document.getElementById('chapter-label').textContent = 'Сохранённая закладка';
    document.getElementById('page-label').textContent = `Страница ${index+1} из ${scenes.length}`;
  } else render();
  sound.startDefault();
})();
