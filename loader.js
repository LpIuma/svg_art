async function loadDrawing(){
  const art=document.getElementById('art'),loading=document.getElementById('loading');
  try{
    const response=await fetch('assets/CG_redrawn.svg');
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const markup=await response.text();
    const svg=new DOMParser().parseFromString(markup,'image/svg+xml');
    if(svg.querySelector('parsererror'))throw new Error('SVG 格式无法解析');
    const element=document.importNode(svg.documentElement,true);
    if(element.querySelectorAll('path').length!==56515)throw new Error('路径数量与预期不符');
    art.appendChild(element);
    const script=document.createElement('script');
    script.src='assets/animation.js';
    script.onload=()=>{
      for(const id of ['toggle','restart','finish','seek','prev-path','next-path','copy-code'])document.getElementById(id).disabled=false;
      element.style.visibility='visible';
      loading.hidden=true;
    };
    script.onerror=()=>{
      loading.querySelector('strong').textContent='载入失败';
      loading.querySelector('p').textContent='动画脚本加载失败，请刷新重试。';
      document.getElementById('status').textContent='载入失败';
    };
    document.body.appendChild(script);
  }catch(error){
    loading.querySelector('strong').textContent='载入失败';
    loading.querySelector('p').textContent=`${error.message}。请刷新重试；本页需要通过网站地址打开。`;
    document.getElementById('status').textContent='载入失败';
  }
}
document.getElementById('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.()};
loadDrawing();
