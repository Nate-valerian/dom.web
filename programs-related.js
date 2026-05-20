/* programs-related.js — renders a 3-card "Похожие программы" strip
   at the bottom of each program page. Detects current page from URL. */
(function(){
  var PROGRAMS = {
    'imperatritsa':                   {title:'Титул <em>Императрицы</em>',     price:'от 25 000 ₽', img:'photo-13.webp'},
    'imperator':                      {title:'Титул <em>Императора</em>',      price:'от 25 000 ₽', img:'photo-05.webp'},
    'naslednik-prestola':             {title:'Наследник <em>Престола</em>',    price:'от 20 000 ₽', img:'photo-03.webp'},
    'lila':                           {title:'<em>Лила</em>',                  price:'15 000 ₽',    img:'photo-04.webp'},
    'lila-gruppovaya':                {title:'Лила <em>— групповая</em>',      price:'7 500 ₽',     img:'photo-11.webp'},
    'immersive-5d':                   {title:'Иммерсивная <em>5D</em>',        price:'по запросу',  img:'intro-montage-01-poster.webp'},
    'immersive-date':                 {title:'Свидание <em>5D</em>',           price:'по запросу',  img:'photo-10.webp'},
    'vajci-tujna':                    {title:'Вайци <em>& Туйна</em>',         price:'от 6 000 ₽',  img:'photo-06.webp'},
    'chajnaya-ceremoniya':            {title:'Чайная <em>церемония</em>',      price:'от 2 500 ₽',  img:'photo-07.webp'},
    'chajnaya-ceremoniya-dlya-dvoih': {title:'Чайная <em>для двоих</em>',      price:'20 000 ₽',    img:'photo-10.webp'},
    'chajnaya-ceremoniya-gruppovaya': {title:'Чайная <em>групповая</em>',      price:'от 2 500 ₽',  img:'photo-15.webp'},
    'carskaya-dinastiya':             {title:'Царская <em>Династия</em>',      price:'от 38 000 ₽', img:'photo-08.webp'},
    'in-yan':                         {title:'Инь <em>& Ян</em>',              price:'от 25 000 ₽', img:'photo-09.webp'},
    'zhenskij-magnetizm':             {title:'Женский <em>Магнетизм</em>',     price:'от 8 500 ₽',  img:'photo-12.webp'},
    'zhenskie-arkhetipy':             {title:'<em>Архетипы</em>',              price:'от 8 500 ₽',  img:'photo-13.webp'},
    'svechi-i-gvozdi':                {title:'Свечи <em>и гвозди</em>',        price:'от 5 000 ₽',  img:'photo-14.webp'},
    'erotraverse':                    {title:'<em>Erotraverse</em>',           price:'от 5 000 ₽',  img:'photo-16.webp'},
    'cigun':                          {title:'<em>Цигун</em>',                 price:'от 5 000 ₽',  img:'photo-17.webp'},
    'igra-go':                        {title:'Игра <em>Го</em>',               price:'от 5 000 ₽',  img:'photo-20.webp'},
    'yoga':                           {title:'<em>Йога</em>',                  price:'от 4 000 ₽',  img:'photo-18.webp'},
    'mafiya':                         {title:'<em>Мафия</em>',                 price:'от 2 500 ₽',  img:'photo-19.webp'}
  };
  var RELATED = {
    'imperatritsa':                   ['naslednik-prestola','zhenskij-magnetizm','carskaya-dinastiya'],
    'imperator':                      ['carskaya-dinastiya','in-yan','igra-go'],
    'naslednik-prestola':             ['imperatritsa','vajci-tujna','chajnaya-ceremoniya'],
    'lila':                           ['lila-gruppovaya','zhenskie-arkhetipy','immersive-5d'],
    'lila-gruppovaya':                ['lila','zhenskie-arkhetipy','mafiya'],
    'immersive-5d':                   ['immersive-date','chajnaya-ceremoniya','lila'],
    'immersive-date':                 ['immersive-5d','carskaya-dinastiya','chajnaya-ceremoniya-dlya-dvoih'],
    'vajci-tujna':                    ['cigun','yoga','erotraverse'],
    'chajnaya-ceremoniya':            ['chajnaya-ceremoniya-gruppovaya','chajnaya-ceremoniya-dlya-dvoih','naslednik-prestola'],
    'chajnaya-ceremoniya-dlya-dvoih': ['carskaya-dinastiya','in-yan','immersive-date'],
    'chajnaya-ceremoniya-gruppovaya': ['chajnaya-ceremoniya','cigun','svechi-i-gvozdi'],
    'carskaya-dinastiya':             ['in-yan','immersive-date','chajnaya-ceremoniya-dlya-dvoih'],
    'in-yan':                         ['carskaya-dinastiya','immersive-date','chajnaya-ceremoniya-dlya-dvoih'],
    'zhenskij-magnetizm':             ['zhenskie-arkhetipy','imperatritsa','erotraverse'],
    'zhenskie-arkhetipy':             ['zhenskij-magnetizm','imperatritsa','lila-gruppovaya'],
    'svechi-i-gvozdi':                ['lila-gruppovaya','mafiya','chajnaya-ceremoniya-gruppovaya'],
    'erotraverse':                    ['zhenskij-magnetizm','vajci-tujna','cigun'],
    'cigun':                          ['yoga','vajci-tujna','erotraverse'],
    'igra-go':                        ['mafiya','imperator','lila'],
    'yoga':                           ['cigun','vajci-tujna','chajnaya-ceremoniya-gruppovaya'],
    'mafiya':                         ['igra-go','lila-gruppovaya','svechi-i-gvozdi']
  };

  function init(){
    var section = document.querySelector('.pg-related');
    if (!section) return;
    var slug = window.location.pathname.split('/').pop().replace('.html','');
    var related = (RELATED[slug] || [])
      .map(function(s){ return {slug:s, data:PROGRAMS[s]}; })
      .filter(function(r){ return r.data; });
    if (related.length === 0) return;
    var html = '<div class="pg-related-head">Похожие программы</div><div class="pg-related-grid">';
    related.forEach(function(r){
      var altText = r.data.title.replace(/<[^>]+>/g, '');
      html += '<a class="pg-related-card" href="' + r.slug + '.html">' +
        '<img src="../assets/gallery/' + r.data.img + '" alt="' + altText + '">' +
        '<div class="pg-related-info">' +
          '<div class="pg-related-title">' + r.data.title + '</div>' +
          '<div class="pg-related-price">' + r.data.price + '</div>' +
        '</div>' +
      '</a>';
    });
    html += '</div>';
    section.innerHTML = html;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
