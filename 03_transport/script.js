'use strict';
const $t=id=>document.getElementById(id);
function searchRoutes(){
  const query=$t('routeSearch').value.trim().toLocaleLowerCase('ru');
  const date=$t('routeDate').value;
  let shown=0;
  document.querySelectorAll('.route').forEach((card,index)=>{
    const routeMatch=!query||card.dataset.route.includes(query)||card.textContent.toLocaleLowerCase('ru').includes(query);
    const dateMatch=!date||!card.dataset.date||card.dataset.date===date;
    const visible=routeMatch&&dateMatch; card.classList.toggle('hidden',!visible); if(visible)shown++;
  });
  let empty=$t('routeEmpty');
  if(!empty){empty=document.createElement('p');empty.id='routeEmpty';empty.className='notice';$t('routes').after(empty)}
  empty.textContent=shown?'': 'Подходящие рейсы не найдены. Измените направление или дату.';
}
function calcFare(){
  const distance=Number($t('distance').value), rate=Number($t('fare').value);
  if(!Number.isFinite(distance)||!Number.isFinite(rate)||distance<=0||rate<0){$t('fareResult').textContent='Введите расстояние больше нуля и неотрицательный тариф.';return}
  $t('fareResult').textContent=`Стоимость: ${(distance*rate).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})} ₽`;
}
let seconds=900;
function updateCountdown(){
  const el=$t('countdown'); if(!el)return;
  const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;
  el.textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
  if(seconds>0)seconds--; else seconds=900;
}
updateCountdown();setInterval(updateCountdown,1000);
