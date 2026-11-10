'use strict';
const department=document.getElementById('department'),doctor=document.getElementById('doctor');
const doctorsByDepartment={'Терапия':['Иванова А. А.','Смирнов П. В.'],'Кардиология':['Петров И. С.','Орлова Е. Н.'],'Педиатрия':['Кузнецова М. А.','Волков Д. С.']};
department?.addEventListener('change',()=>{
 doctor.replaceChildren();const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Выберите врача';doctor.append(placeholder);
 (doctorsByDepartment[department.value]||[]).forEach(name=>{const option=document.createElement('option');option.textContent=name;doctor.append(option)});
});
document.querySelector('.validate-form')?.addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const date=document.getElementById('appointmentDate').value;
 if(date<new Date().toISOString().slice(0,10)){alert('Выберите сегодняшнюю или будущую дату.');return}
 const status=document.createElement('p');status.className='result';status.setAttribute('role','status');
 status.textContent=`Заявка проверена: ${department.value}, врач ${doctor.value}, дата ${date}. Это демонстрация, реальная запись не создана.`;
 form.append(status);form.reset();doctor.innerHTML='<option value="">Сначала выберите отделение</option>';
});
document.querySelectorAll('#symptoms input').forEach(input=>input.addEventListener('change',()=>{
 const count=document.querySelectorAll('#symptoms input:checked').length;
 document.getElementById('symptomResult').textContent=`Отмечено: ${count}${count>=2?' — обратитесь к врачу для профессиональной оценки состояния.':''}`;
}));
document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false})}));
