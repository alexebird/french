//var port = chrome.runtime.connect({name: "the_port"});

var entityFns = {
  show: function (heatmap) {
    $('.songs > li:not(.sectionTitle) .pt-buddy').remove();
    $('.songs > li:not(.sectionTitle) > .songInfo').before('<div class="pt-buddy"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      //console.log('' + i + ' -> ' + val);
      $('.songs .songTitle > a[href$="/' + slug + '"]')
        .first()
        .closest('li')
        .find('.pt-buddy > div')
        .css('height', '' + val + '%');
    });
  },
  year: function(heatmap) {
    $('.showsByYear > li > a > .pt-buddy').remove();
    $('.showsByYear > li > a > span').before('<div class="pt-buddy"><div></div></div>');

    $.each(heatmap, function(slug) {
      var val = normalize(heatmap[slug].value);
      $('.showsByYear > li > a[href$="/' + slug + '"]')
        .first()
        .closest('li')
        .find('.pt-buddy > div')
        .css('height', '' + val + '%');
    });
  },
  years: function(heatmap) {

  }
};

function normalize(val) {
  return (1 - parseFloat(val)) * 100.0;
}

$(document).ready(function() {
  console.debug('document ready');
  //chrome.runtime.sendMessage('ready');
  //port.postMessage({status: 'ready', url: window.location.pathname});
  if (lastHeatmap) {
    console.debug('already have heatmap');
    entityFns[lastHeatmap.entity](lastHeatmap.heatmap);
  }
  else {
    console.debug('still waiting');
  }
});

var lastHeatmap = null;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResp) {
  var heatmap = msg.hm;
  lastHeatmap = heatmap;
  console.debug('from background: ' + msg.who);
  console.debug(heatmap);
  entityFns[heatmap.entity](heatmap.heatmap);
});
