$('#drop_zone').on('dragenter', function(event) {
  event.preventDefault();
}).on('dragover', function(event) {
  event.preventDefault();
}).on('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var files = e.target.files || e.originalEvent.dataTransfer.files,
    file,
    data;

  var color = $('#html5colorpicker').val();
  if (!files.length) {
    alert('please select file');
    return;
  }
  file = files[0];
  if (!/image\/svg\+xml/.test(file.type)) {
    alert('please select svg file');
    return;
  }
  fr = new FileReader();
  fr.readAsText(file);
  fr.onload = function(e) {
    var svgElement = document.createElement('template');
    svgElement.innerHTML = e.target.result;
    var svg = svgElement.content.querySelector('svg');
    svg.style.fill = color;
    if (svgElement.content.querySelector('path')) {
      var path = svgElement.content.querySelectorAll('path');
      [].forEach.call(path, function(e) {
        e.style.fill = color;
      });
    }
    if (svgElement.content.querySelector('rect')) {
      var rect = svgElement.content.querySelectorAll('rect');
      [].forEach.call(rect, function(e) {
        e.style.fill = color;
      });
    }
    if (svgElement.content.querySelector('text')) {
      var text = svgElement.content.querySelectorAll('text');
      [].forEach.call(text, function(e) {
        e.style.fill = color;
      });
    }
    if (svgElement.content.querySelector('polygon')) {
      var polygon = svgElement.content.querySelectorAll('polygon');
      [].forEach.call(polygon, function(e) {
        e.style.fill = color;
      });
    }

    function drawInlineSVG(rawSVG, callback) {
      var myCanvas = document.createElement("canvas");
      var ctx = myCanvas.getContext("2d");
      myCanvas.width = 100;
      myCanvas.height = 100;

      var svg = new Blob([rawSVG], {
          type: "image/svg+xml;charset=utf-8"
        }),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svg),
        img = new Image();
      img.onload = function() {
        ctx.drawImage(this, 0, 0);
        domURL.revokeObjectURL(url);
        callback(myCanvas);
      };
      img.src = url;
    }

    function download(data, ext) {
      var a = document.createElement("a");
      a.href = data;
      a.download = file.name.replace(/svg$/i, ext);
      a.click();
    }

    if ($('#svgpng input:checked').val() === 'SVG') {
      data = URL.createObjectURL(new Blob([svg.outerHTML], {
        type: 'image/svg+xml'
      }));
      download(data, 'svg');
    } else {
      drawInlineSVG(svg.outerHTML, function(canvas) {
        download(canvas.toDataURL(), 'png');
      });

    }

  };
});