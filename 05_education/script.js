'use strict';
const scheduleData={
'Понедельник':['09:00 — Математика','11:00 — Английский язык','13:00 — Информатика'],
'Вторник':['09:00 — История','11:00 — Физика','13:00 — Проектная работа'],
'Среда':['09:00 — Литература','11:00 — Математика','13:00 — Робототехника'],
'Четверг':['09:00 — Английский язык','11:00 — Химия','13:00 — Физкультура'],
'Пятница':['09:00 — Информатика','11:00 — История','13:00 — Клуб проектов']};
function showDay(day,button){
 document.querySelectorAll('.chips button').forEach(x=>x.classList.remove('active'));button?.classList.add('active');
 const target=document.getElementById('schedule');target.replaceChildren();
 (scheduleData[day]||[]).forEach(subject=>{const row=document.createElement('div');row.className='list-item';row.textContent=subject;target.append(row)});
 localStorage.setItem('lastStudyDay',day);
}
function filterCourses(){const value=document.getElementById('ageFilter').value;document.querySelectorAll('.course').forEach(card=>card.classList.toggle('hidden',value!=='all'&&card.dataset.age!=='all'&&card.dataset.age!==value))}
const quiz=document.getElementById('quiz');
quiz?.addEventListener('submit',event=>{
 event.preventDefault();if(!quiz.reportValidity())return;
 const score=[...new FormData(quiz).values()].reduce((sum,value)=>sum+Number(value),0);
 const result=document.getElementById('quizResult');result.textContent=`Ваш результат: ${score} из 3. ${score>=2?'Вам подходит активный формат обучения!':'Попробуйте разные форматы занятий.'}`;
 result.classList.remove('hidden');localStorage.setItem('studyQuizScore',String(score));
});
