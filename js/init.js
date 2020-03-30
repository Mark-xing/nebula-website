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
    $('#J-star-popup').popover({
      content: 
        '<span class="glyphicon glyphicon-remove"></span>' +
        '<div class="item">' +
          '<p><span class="emoj">🌟</span>Like what we do?</p>' +
          '<p><a href="https://0x7.me/popup2github" target="_blank">Star us on GitHub</a></p>' +
        '</div>' +
        '<div class="item">' +
          '<p><span class="emoj">🙋‍♂️</span>Have a problem?</p>' +
          '<p><a href="https://discuss.nebula-graph.io" target="_blank">Ask us on our forum</a></p>' +
        '</div>' +
        '<img src="/images/popup-logo.png" class="popup-logo">',
      html: true,
      container: '#J-star-popup',
      placement: 'top',
    }).popover('show');
  }, 1000 * 30);

})()