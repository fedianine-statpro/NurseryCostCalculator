/* Russian, native keyboard-accessible controls; explicit master mute is remembered. */
window.bindArchiveSoundControls = (sound) => {
  const master=document.getElementById('sound'),toggle=document.getElementById('sound-settings'),panel=document.getElementById('sound-panel'),status=document.getElementById('sound-status');
  master.addEventListener('click',()=>sound.toggleMaster());
  toggle.addEventListener('click',()=>{
    panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));
  });
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();}});
  panel.querySelectorAll('[data-sound-setting]').forEach(input=>{
    input.addEventListener('input',()=>sound.set(input.dataset.soundSetting,input.type==='checkbox'?input.checked:Number(input.value)));
  });
  sound.subscribe(state=>{
    const active=state.unlocked&&!state.preferences.masterMuted;
    master.textContent=state.blocked?'Включить звук':!state.unlocked?'Включить звук':active?'Выключить весь звук':'Звук выключен · включить';
    master.setAttribute('aria-pressed',String(active&&!state.blocked));
    panel.querySelectorAll('[data-sound-setting]').forEach(input=>{
      const value=state.preferences[input.dataset.soundSetting];if(input.type==='checkbox')input.checked=value;else input.value=String(value);
      if(input.type==='range')input.setAttribute('aria-valuetext',`${Math.round(value*100)}%`);
    });
    status.textContent=state.blocked?'Звук включится при первом нажатии в игре. Можно также нажать «Включить звук».':
      !active?'Фоновый звук выключен. Семейные записи запускаются кнопкой ▶; общий звук должен быть включён.':
      state.foreground?'Семейная запись: музыка приглушена до тишины.':
      state.hidden?'Фоновый звук на паузе, пока вкладка скрыта.':
      !state.availableMusic?'Музыка ещё не добавлена. Семейные записи доступны.':
      state.failedAssets.length?(location.protocol==='file:'?'Для фонового звука откройте игру через localhost. Запустите start-local.ps1 в папке игры.':'Некоторые звуки недоступны. Можно продолжать чтение.'):
      state.playingMusic?'Фоновая музыка включена.':'Звук разрешён. На этой странице может быть тишина.';
  });
};
