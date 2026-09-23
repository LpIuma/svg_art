const slider=document.getElementById('comparison-range');
if(slider){const update=()=>{const value=Number(slider.value);document.getElementById('vector').style.clipPath=`inset(0 ${100-value}% 0 0)`;document.getElementById('divider').style.left=value+'%'};slider.addEventListener('input',update);update()}
