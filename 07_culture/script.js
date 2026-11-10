'use strict';
const slides=['🎭 Театральный вечер','🎨 Выставка современного искусства','🎶 Живой концерт'];let slide=0;
function moveGallery(direction){slide=(slide+direction+slides.length)%slides.length;document.getElementById('gallery').textContent=slides[slide]}
setInterval(()=>moveGallery(1),5000);
function calcTickets(){const qty=Number(document.getElementById('ticketQty').value),price=Number(document.getElementById('ticketType').value);const out=document.getElementById('ticketResult');if(!Number.isInteger(qty)||qty<1||qty>20){out.textContent='Количество билетов должно быть от 1 до 20.';return}out.textContent=`Итого: ${(qty*price).toLocaleString('ru-RU')} ₽`}
let currentEventType='all';
function filterEvents(type,button){
 if(type)currentEventType=type;
 document.querySelectorAll('.chips button').forEach(x=>x.classList.remove('active'));button?.classList.add('active');
 const date=document.getElementById('eventDate')?.value;
 let count=0;document.querySelectorAll('.event').forEach(card=>{const visible=(currentEventType==='all'||card.dataset.type===currentEventType)&&(!date||card.dataset.date===date);card.classList.toggle('hidden',!visible);if(visible)count++});
 let empty=document.getElementById('eventEmpty');if(!empty){empty=document.createElement('p');empty.id='eventEmpty';empty.className='notice';document.querySelector('.event')?.parentElement?.after(empty)}if(empty)empty.textContent=count?'':'На выбранную дату мероприятий нет.';
}
