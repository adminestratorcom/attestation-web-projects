'use strict';
const $ = (id) => document.getElementById(id);
let foodCart = [];
function addFood(name, price) { foodCart.push({name,price}); renderFoodCart(); }
function renderFoodCart() {
  $('cartCount').textContent=foodCart.length;
  const list=$('cartItems'); list.replaceChildren();
  if (!foodCart.length) list.textContent='Пока пусто';
  foodCart.forEach((item,index)=>{
    const row=document.createElement('div'); row.className='list-item';
    const label=document.createElement('span'); label.textContent=item.name;
    const price=document.createElement('b'); price.textContent=`${item.price} ₽ `;
    const remove=document.createElement('button'); remove.type='button'; remove.className='secondary';
    remove.textContent='Удалить'; remove.setAttribute('aria-label',`Удалить ${item.name}`);
    remove.addEventListener('click',()=>{foodCart.splice(index,1);renderFoodCart()});
    price.append(remove); row.append(label,price); list.append(row);
  });
  $('cartTotal').textContent=`Итого: ${foodCart.reduce((sum,item)=>sum+item.price,0).toLocaleString('ru-RU')} ₽`;
}
function removeFood(index){foodCart.splice(index,1);renderFoodCart()}
function clearCart(){foodCart=[];renderFoodCart()}
function filterFood(tag,button){
  document.querySelectorAll('.chips button').forEach(x=>x.classList.remove('active'));
  button?.classList.add('active');
  document.querySelectorAll('.food').forEach(card=>card.classList.toggle('hidden',tag!=='all'&&!card.dataset.tags.split(' ').includes(tag)));
}
document.querySelectorAll('.validate-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  const date=form.querySelector('#bookDate')?.value;
  const time=form.querySelector('input[type="time"]')?.value;
  const guests=Number(form.querySelector('input[type="number"]')?.value);
  if(date && date < new Date().toISOString().slice(0,10)){alert('Нельзя выбрать прошедшую дату.');return}
  if(guests<1||guests>12){alert('Количество гостей должно быть от 1 до 12.');return}
  alert(`Заявка на ${date} в ${time}, гостей: ${guests}, проверена. Бронирование демонстрационное.`);
  form.reset();
}));
