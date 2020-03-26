//是否显示导航栏
var showNavBar = true;
//是否展开导航栏
var expandNavBar = true;
//是否给标题自动增加序号
var addSNToTitle = true;

$(document).ready(function () {
        var pathname = window.location.pathname
        var isEnglish = pathname.includes('/en/')
        if (pathname.includes('posts')) {
                var $wrapper = $(".wrapper");
                var $h1 = $wrapper.find("h1");
                var $h2 = $wrapper.find("h2");
                var $h3 = $wrapper.find("h3");
                var $h4 = $wrapper.find("h4");
                var $h5 = $wrapper.find("h5");
                var $h6 = $wrapper.find("h6");

                var headCounts = [$h1.length, $h2.length, $h3.length, $h4.length, $h5.length, $h6.length];
                var vH1Tag = null;
                var vH2Tag = null;
                var vH3Tag = null;
                for (var i = 0; i < headCounts.length; i++) {
                        if (headCounts[i] > 0) {
                                if (vH1Tag == null) {
                                        vH1Tag = 'h' + (i + 1);
                                } else if (vH2Tag == null) {
                                        vH2Tag = 'h' + (i + 1);
                                } else if (vH3Tag == null) {
                                        vH3Tag = 'h' + (i + 1);
                                        break;
                                }
                        }
                }
                if (vH1Tag == null) {
                        return;
                }
                var anchorTitle = isEnglish ? "Contents▲" : "目录▲";
                $(".J-blog-anchor").prepend(
                        '<p id="AnchorContentToggle" title="收起" style="cursor:pointer;">' + anchorTitle + '</p>' +
                        '<ul class="AnchorContent" id="AnchorContent"> </ul>');

                var vH1Index = 0;
                var vH2Index = 0;
                var vH3Index = 0;
                $wrapper.find(vH1Tag + (vH2Tag != null ? (',' + vH2Tag) : '') + (vH3Tag != null ? (',' + vH3Tag) : '')).each(function (i, item) {
                        var id = '';
                        var name = '';
                        var tag = $(item).get(0).tagName.toLowerCase();
                        var className = '';
                        if (tag == vH1Tag) {
                                id = name = ++vH1Index;
                                name = id;
                                vH2Index = 0;
                                className = 'item_h1';
                        } else if (tag == vH2Tag) {
                                id = vH1Index + '_' + ++vH2Index;
                                name = vH1Index + '.' + vH2Index;
                                vH3Index = 0;
                                className = 'item_h2';
                        } else if (tag == vH3Tag) {
                                id = vH1Index + '_' + vH2Index + '_' + ++vH3Index;
                                name = vH1Index + '.' + vH2Index + '.' + vH3Index ;
                                className = 'item_h3';
                        }

                        $(item).attr("id", "wow" + id);
                        $(item).addClass("wow_head");
                        var originText = $(item).text();

                        $("#AnchorContent").css('max-height', ($(window).height() - 180) + 'px');
                        $("#AnchorContent").append('<li><a class="nav_item ' + className + ' anchor-link" onclick="return false;" href="#" link="#wow' + id + '">' + originText + '</a></li>');
                });

                $("#AnchorContentToggle").click(function () {
                        var text = $(this).html();
                        if (text == "目录▲" || text == "Contents▲") {
                                var anchorTitle = isEnglish ? "Contents▼" : "目录▼";
                                $(this).html(anchorTitle);
                        } else {
                                var anchorTitle = isEnglish ? "Contents▲" : "目录▲";
                                $(this).html(anchorTitle);
                        }
                        $("#AnchorContent").toggle();
                });
                $(".anchor-link").click(function () {
                        $("html,body").animate({ scrollTop: $($(this).attr("link")).offset().top - 50 }, 500);
                });

                var headerNavs = $(".J-blog-anchor li .nav_item");
                var headerTops = [];
                $(".wow_head").each(function (i, n) {
                        headerTops.push($(n).offset().top);
                });
                $(window).scroll(function () {
                        var scrollTop = $(window).scrollTop();
                        $.each(headerTops, function (i, n) {
                                var distance = n - scrollTop;
                                if (distance >= 0) {
                                        $(".J-blog-anchor li .nav_item.current").removeClass('current');
                                        $(headerNavs[i]).addClass('current');
                                        return false;
                                }
                        });
                });

                if (!showNavBar) {
                        $('.J-blog-anchor').hide();
                }
                if (!expandNavBar) {
                        $(this).html("目录▼");
                        $(this).attr({ "title": "展开" });
                        $("#AnchorContent").hide();
                }
        }

});
