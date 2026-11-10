'use strict';
let shopItems=[];
function addProduct(name,price){shopItems.push({name,price});renderShop();const toast=document.getElementById('shopToast');toast.classList.remove('hidden');clearTimeout(window.shopToastTimer);window.shopToastTimer=setTimeout(()=>toast.classList.add('hidden'),3000)}
function renderShop(){
 document.getElementById('shopCount').textContent=shopItems.length;const cart=document.getElementById('shopCart');cart.replaceChildren();
 if(!shopItems.length)cart.textContent='Корзина пуста';
 shopItems.forEach((item,index)=>{const row=document.createElement('div');row.className='list-item';const text=document.createElement('span');text.textContent=`${item.name} — ${item.price} ₽`;const button=document.createElement('button');button.className='secondary';button.type='button';button.textContent='Удалить';button.addEventListener('click',()=>{shopItems.splice(index,1);renderShop()});row.append(text,button);cart.append(row)});
 document.getElementById('shopTotal').textContent=`Итого: ${shopItems.reduce((sum,item)=>sum+item.price,0).toLocaleString('ru-RU')} ₽`;
}
function filterProducts(){const category=document.getElementById('productCategory').value,max=Number(document.getElementById('maxPrice').value);document.getElementById('priceLabel').textContent=max;document.querySelectorAll('.product').forEach(card=>card.classList.toggle('hidden',(category!=='all'&&card.dataset.cat!==category)||Number(card.dataset.price)>max||(document.getElementById('onlyStock').checked&&card.dataset.stock!=='yes')))}
