(function () {
  $share = $('.single-side-bar>.social-share');
  $('#J_Anchor').affix({
    offset: {
      top: $share.offset().top
        + $share.outerHeight()
    }
  })

  function debounce(fn) {
    var timer = null;
    return function() {
      timer && clearTimeout(timer);
      timer = setTimeout(fn, 50);
    }
  }

  function isInViewPort($elem) {
    var id = $elem.getAttribute('href');
    var $title = $(id)
    var bounding;
    if ($title) {
      bounding = $title[0].getBoundingClientRect();
    }

    if (
      bounding &&
      bounding.top >=0 &&
      bounding.left >=0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function activeAnchor() {
    var $anchors = $('#TableOfContents a[href^="#"]');
    var isActive = false;
    $anchors.each(function (_, $anchor) {
      if (isActive) {
        return;
      }
      if (isInViewPort($anchor)) {
        isActive = true;
        $anchors.removeClass('active')
        $anchor.className = 'active';
      }
    })
  }

  activeAnchor();
  window.addEventListener('scroll', debounce(activeAnchor));
})()