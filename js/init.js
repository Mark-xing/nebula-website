(function () {
  var language = (navigator.browserLanguage || navigator.language).toLowerCase();
  if (window.location.pathname == '/') {
    if (language.indexOf('zh') > -1) {
      window.location.href =  '/cn/'
    } else {
      window.location.href = '/en/'
    }
  }

  // popup after some time
  setTimeout(function (){
    $('#J_Star_Popup').popover({
      content: 
        '<img class="cross" src="/images/cross.png"></img>' +
        '<div class="item">' +
          '<p><span class="emoj">🌟</span>Like what we do?</p>' +
          '<p><a href="https://0x7.me/popup2github" target="_blank" onclick="gtag(\'event\', \'Link Click\', { event_category: \'Engagement\', event_label:  \'Star via popup\'})">Star us on GitHub</a></p>' +
        '</div>' +
        '<div class="item">' +
          '<p><span class="emoj">🙋‍♂️</span>Have a problem?</p>' +
          '<p><a href="https://discuss.nebula-graph.io" target="_blank">Ask us on our forum</a></p>' +
        '</div>' +
        '<img src="/images/popup-logo.png" class="popup-logo">',
      html: true,
      container: '#J_Star_Popup',
      placement: 'top',
    }).popover('show');
  }, 1000 * 30);
})()