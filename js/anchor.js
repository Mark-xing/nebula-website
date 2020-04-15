(function () {
  $anchors = $('#J_Anchor');
  $notify = $('#nav-popup');
  $anchors.affix({
    offset: {
      top: $anchors.offset().top 
    }
  })
  $anchors.on('affix.bs.affix', function () {
    var offset = $notify.css('display') === 'none' ? 0 : $notify.height();
    $anchors.css('top',  60 + offset);
  })

  $share = $('#J_Share');
  $share.affix({
    offset: {
      top: $share.offset().top
    }
  })

  function throttle(fn) {
    var timer = null;
    return function() {
      if (timer) {
        return;
      }
      timer = setInterval(fn, 100);
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
  window.addEventListener('scroll', throttle(activeAnchor));
})()