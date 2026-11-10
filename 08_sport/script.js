'use strict';
function calcBmi(){
 const height=Number(document.getElementById('height').value)/100,weight=Number(document.getElementById('weight').value);
 if(!Number.isFinite(height)||!Number.isFinite(weight)||height<1||height>2.5||weight<20||weight>350){document.getElementById('bmiResult').textContent='Введите рост от 100 до 250 см и вес от 20 до 350 кг.';return}
 const bmi=weight/(height*height),category=bmi<18.5?'ниже условного диапазона':bmi<25?'условно нормальный диапазон':bmi<30?'выше условного диапазона':'высокий показатель';
 document.getElementById('bmiResult').textContent=`ИМТ: ${bmi.toFixed(1)} — ${category}. ИМТ является ориентиром, а не диагнозом.`;
 const factor=Number(document.getElementById('activity').value),estimate=Math.round(weight*22*factor);
 document.getElementById('calorieResult').textContent=`Условная оценка суточной калорийности: ${estimate} ккал. Это упрощённая учебная оценка, не индивидуальная рекомендация.`;
}
let timerLeft=60,timerId=null;
function paintTimer(){document.getElementById('timer').textContent=`${String(Math.floor(timerLeft/60)).padStart(2,'0')}:${String(timerLeft%60).padStart(2,'0')}`}
function startTimer(){if(timerId)return;const input=Number(document.getElementById('timerInput').value);if(timerLeft===0)timerLeft=Math.max(1,input);timerId=setInterval(()=>{timerLeft=Math.max(0,timerLeft-1);paintTimer();if(timerLeft===0)pauseTimer()},1000)}
function pauseTimer(){clearInterval(timerId);timerId=null}
function resetTimer(){pauseTimer();timerLeft=Math.max(1,Number(document.getElementById('timerInput').value));paintTimer()}
function filterTraining(type,button){document.querySelectorAll('.chips button').forEach(x=>x.classList.remove('active'));button?.classList.add('active');document.querySelectorAll('.training').forEach(card=>card.classList.toggle('hidden',type!=='all'&&card.dataset.type!==type))}
