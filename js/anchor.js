(function () {
  $anchors = $('.single-side-bar>.blog-anchors');
  $notify = $('#nav-popup');
  $anchors.affix({
    offset: {
      top: $anchors.offset().top 
    }
  })

  $share = $('#J_Share');
  $share.affix({
    offset: {
      top: $share.offset().top
    }
  })

  $share.on('affix.bs.affix', function () {
    $anchors.css('top',  60 + ($notify.height() || 0));
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