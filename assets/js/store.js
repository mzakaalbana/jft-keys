window.Store = (function(){
  const KEY = 'jft-keys-progress';

  function load(){
    try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(_){ return {}; }
  }
  function save(data){
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  return { load, save };
})();