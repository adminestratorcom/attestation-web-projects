'use strict';
document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{
  if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false});
}));
document.querySelectorAll('.validate-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault(); if(!form.reportValidity())return;
  const phone=form.querySelector('input[pattern]');
  const message=form.querySelector('textarea');
  if(phone&&!/^[+0-9()\\-\\s]{10,18}$/.test(phone.value.trim())){phone.setCustomValidity('Укажите телефон длиной 10–18 символов.');phone.reportValidity();phone.setCustomValidity('');return}
  if(message&&(message.value.trim().length<10||message.value.trim().length>500)){message.setCustomValidity('Сообщение должно содержать от 10 до 500 символов.');message.reportValidity();message.setCustomValidity('');return}
  const status=document.createElement('p');status.className='result';status.setAttribute('role','status');
  status.textContent='Форма заполнена корректно. В учебной версии сообщение не отправляется на сервер.';
  form.append(status);form.reset();
}));
