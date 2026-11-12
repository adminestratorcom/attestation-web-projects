'use strict';
function calcService(){
 const base=Number(document.getElementById('priceService')?.value||0);
 const complexity=Number(document.getElementById('complexity')?.value||1);
 const urgent=Number(document.getElementById('urgent')?.value||1);
 const total=Math.round(base*complexity*urgent);
 const result=document.getElementById('servicePriceResult');
 if(result) result.textContent='Ориентировочная стоимость: '+total.toLocaleString('ru-RU')+' ₽';
}
document.addEventListener('DOMContentLoaded',()=>{
 const booking=document.getElementById('serviceForm');
 if(booking) booking.addEventListener('submit',event=>{
  event.preventDefault();
  const date=document.getElementById('serviceDate');
  const result=document.getElementById('bookingResult');
  if(!booking.reportValidity()) return;
  if(date?.value && date.value < new Date().toISOString().slice(0,10)){
   date.setCustomValidity('Выберите сегодняшнюю или будущую дату.');date.reportValidity();date.setCustomValidity('');return;
  }
  const service=document.getElementById('serviceType')?.value||'Услуга';
  const time=document.getElementById('serviceTime')?.value||'';
  if(result) result.textContent='Заявка на «'+service+'» на '+date.value+' в '+time+' подготовлена. Это демонстрационная форма, отправка в организацию не выполняется.';
 });
 const reviewForm=document.getElementById('reviewForm');
 if(reviewForm) reviewForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!reviewForm.reportValidity()) return;
  const name=document.getElementById('reviewName').value.trim();
  const rating=document.getElementById('reviewRating').value;
  const message=document.getElementById('reviewText').value.trim();
  const row=document.createElement('div');row.className='list-item';
  const strong=document.createElement('strong');strong.textContent=name+' · '+'★'.repeat(Number(rating));
  const paragraph=document.createElement('p');paragraph.textContent=message;
  row.append(strong,paragraph);document.getElementById('reviews').prepend(row);reviewForm.reset();
 });
 document.querySelectorAll('.validate-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const note=document.createElement('p');note.className='result';note.textContent='Спасибо! Форма проверена в демонстрационном режиме; данные никуда не отправляются.';
  form.append(note);form.reset();
 }));
});
