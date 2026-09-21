window.MarkdownViewer = window.MarkdownViewer || {};
(function (M) {
  var scales = new WeakMap();
  var sequence = 0;
  var renderQueue = Promise.resolve();
  var pans = new WeakMap();
  var activePointers = new WeakMap();

  function escapeText(text) {
    var d = document.createElement('div');
    d.textContent = text == null ? '' : String(text);
    return d.innerHTML;
  }

  function errorHtml(message) {
    return '<div class="mermaid-error"><strong>Mermaid描画エラー</strong><div>' + escapeText(message) + '</div></div>';
  }

  function makeBlock(source) {
    var block = document.createElement('section');
    block.className = 'mermaid-block';
    block.setAttribute('data-mermaid-block', 'true');
    block.innerHTML =
      '<div class="mermaid-toolbar"><strong>Mermaid</strong><span class="spacer"></span>' +
      '<button type="button" class="toolbar-btn mermaid-zoom-out" title="'+M.t('mermaidZoomOut')+'" aria-label="'+M.t('mermaidZoomOut')+'">−</button>' +
      '<select class="toolbar-select mermaid-zoom-select" title="'+M.t('mermaidZoom')+'" aria-label="'+M.t('mermaidZoom')+'">' +
      '<option value="0.5">50%</option>' +
      '<option value="0.67">67%</option>' +
      '<option value="0.75">75%</option>' +
      '<option value="0.8">80%</option>' +
      '<option value="0.9">90%</option>' +
      '<option value="1" selected>100%</option>' +
      '<option value="1.1">110%</option>' +
      '<option value="1.25">125%</option>' +
      '<option value="1.5">150%</option>' +
      '<option value="1.75">175%</option>' +
      '<option value="2">200%</option>' +
      '<option value="2.5">250%</option>' +
      '<option value="3">300%</option>' +
      '</select>' +
      '<button type="button" class="toolbar-btn mermaid-zoom-in" title="'+M.t('mermaidZoomIn')+'" aria-label="'+M.t('mermaidZoomIn')+'">+</button>' +
      '<button type="button" class="toolbar-btn mermaid-source-toggle" aria-pressed="false">'+M.t('mermaidSource')+'</button>' +
      '</div>' +
      '<div class="mermaid-canvas" role="img" aria-label="Mermaid図"></div>' +
      '<pre class="mermaid-source"><code>' + escapeText(source) + '</code></pre>';
    block._mermaidSource = source;
    return block;
  }

  function readPlaceholders(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.mv-mermaid-placeholder'));
  }

  function mountPlaceholders(root) {
    readPlaceholders(root).forEach(function (placeholder) {
      if (placeholder._mvMounted) return;
      var sourceNode = placeholder.querySelector('.mv-mermaid-source-data');
      var source = sourceNode ? sourceNode.value : '';
      var block = makeBlock(source);
      placeholder.replaceWith(block);
      placeholder._mvMounted = true;
    });
  }

  function draw(block) {
    var canvas = block.querySelector('.mermaid-canvas');
    var code = block._mermaidSource || '';
    if (!canvas) return Promise.resolve();

    var scale = scales.get(block) || 1;
    canvas.setAttribute('aria-busy', 'true');
    canvas.innerHTML = '<div class="mermaid-loading">図を描画しています…</div>';

    if (!window.mermaid || typeof window.mermaid.render !== 'function') {
      canvas.innerHTML = errorHtml('Mermaidが読み込まれていません。vendor/mermaid.min.js に公式Mermaid 10.9.8のUMD版を配置してください。');
      canvas.removeAttribute('aria-busy');
      return Promise.resolve();
    }

    renderQueue = renderQueue.then(async function () {
      try {
        var theme = document.documentElement.dataset.theme === 'dark' ? 'dark' :
          (document.documentElement.dataset.theme === 'high-contrast' ? 'base' : 'default');
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: theme
        });

        var id = 'mv-mermaid-' + (++sequence);
        var result = await window.mermaid.render(id, code);
        if (!result || typeof result.svg !== 'string') {
          throw new Error('Mermaid.render() がSVGを返しませんでした。');
        }

        // Critical: result.svg comes directly from Mermaid. Do not pass it through
        // marked or DOMPurify. Mermaid is already configured with securityLevel=strict.
        canvas.innerHTML = '';
        var stage = document.createElement('div');
        stage.className = 'mermaid-stage';
        var svgHolder = document.createElement('div');
        svgHolder.className = 'mermaid-svg-holder';
        svgHolder.innerHTML = result.svg;
        stage.appendChild(svgHolder);
        canvas.appendChild(stage);
        if (typeof result.bindFunctions === 'function') {
          result.bindFunctions(svgHolder);
        }

        var svg = svgHolder.querySelector('svg');
        if (svg) {
          var vb = (svg.getAttribute('viewBox') || '').trim().split(/[ ,]+/).map(Number);
          var naturalWidth = vb.length === 4 && isFinite(vb[2]) && vb[2] > 0 ? vb[2] : svg.getBBox().width;
          var naturalHeight = vb.length === 4 && isFinite(vb[3]) && vb[3] > 0 ? vb[3] : svg.getBBox().height;
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.style.width = naturalWidth + 'px';
          svg.style.height = naturalHeight + 'px';
          svg.style.maxWidth = 'none';
          svg.style.display = 'block';
          svg.style.transformOrigin = 'top left';
          var hadPan = pans.has(block);
          var pan = pans.get(block) || {x: 0, y: 0};
          var pad = 24;
          var scaledWidth = naturalWidth * scale;
          var scaledHeight = naturalHeight * scale;
          var viewportWidth = canvas.clientWidth || 0;
          var viewportHeight = canvas.clientHeight || 0;

          // The stage is resized only during an explicit render/zoom operation.
          // Panning must never resize the stage; it only changes the holder position.
          var stageWidth = Math.max(viewportWidth, scaledWidth + pad * 2);
          var stageHeight = Math.max(viewportHeight, scaledHeight + pad * 2, 160);
          stage.style.width = stageWidth + 'px';
          stage.style.height = stageHeight + 'px';

          var baseLeft = Math.max(pad, (stageWidth - scaledWidth) / 2);
          var baseTop = Math.max(pad, (stageHeight - scaledHeight) / 2);
          if (!hadPan) {
            pan = {x: 0, y: 0};
            pans.set(block, pan);
          }

          // Keep the diagram itself inside the stage when the zoom level changes.
          // This prevents a previously panned diagram from disappearing after zooming out.
          var minPanX = -baseLeft;
          var maxPanX = Math.max(minPanX, stageWidth - scaledWidth - baseLeft);
          var minPanY = -baseTop;
          var maxPanY = Math.max(minPanY, stageHeight - scaledHeight - baseTop);
          pan.x = Math.min(maxPanX, Math.max(minPanX, pan.x));
          pan.y = Math.min(maxPanY, Math.max(minPanY, pan.y));
          pans.set(block, pan);

          svgHolder.style.width = naturalWidth + 'px';
          svgHolder.style.height = naturalHeight + 'px';
          svgHolder.style.position = 'absolute';
          svgHolder.style.left = (baseLeft + pan.x) + 'px';
          svgHolder.style.top = (baseTop + pan.y) + 'px';
          svgHolder.style.transform = 'scale(' + scale + ')';
          svgHolder.style.transformOrigin = 'top left';
          canvas.dataset.panX = String(pan.x);
          canvas.dataset.panY = String(pan.y);
        }
      } catch (e) {
        canvas.innerHTML = errorHtml(e && e.message ? e.message : String(e));
      } finally {
        canvas.removeAttribute('aria-busy');
      }
    });

    return renderQueue;
  }

  function bind(block) {
    if (block.dataset.bound === '1') return;
    block.dataset.bound = '1';

    var canvas = block.querySelector('.mermaid-canvas');
    if (!pans.has(block)) {
      // Start with the diagram centered when it fits in the visible canvas.
      // This is calculated after the first SVG render as well, but keeping a
      // real pan state here lets subsequent redraws preserve the user's view.
      pans.set(block, {x: 0, y: 0});
    }
    canvas.addEventListener('pointerdown', function (event) {
      if (event.button !== 0) return;
      var target = event.target;
      if (!target.closest || !target.closest('svg')) return;
      var pan = pans.get(block) || {x: 0, y: 0};
      activePointers.set(block, {id: event.pointerId, startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y});
      canvas.classList.add('is-panning');
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    canvas.addEventListener('pointermove', function (event) {
      var state = activePointers.get(block);
      if (!state || state.id !== event.pointerId) return;
      pans.set(block, {x: state.panX + event.clientX - state.startX, y: state.panY + event.clientY - state.startY});
      var holder = canvas.querySelector('.mermaid-svg-holder');
      var stage = canvas.querySelector('.mermaid-stage');
      if (holder && stage) {
        var pan = pans.get(block);
        var scale = scales.get(block) || 1;
        var pad = 24;
        var svg = holder.querySelector('svg');
        var vb = svg ? (svg.getAttribute('viewBox') || '').trim().split(/[ ,]+/).map(Number) : [];
        var naturalWidth = vb.length === 4 && isFinite(vb[2]) && vb[2] > 0 ? vb[2] : holder.offsetWidth;
        var naturalHeight = vb.length === 4 && isFinite(vb[3]) && vb[3] > 0 ? vb[3] : holder.offsetHeight;
        var scaledWidth = naturalWidth * scale;
        var scaledHeight = naturalHeight * scale;
        var stageWidth = stage.clientWidth;
        var stageHeight = stage.clientHeight;
        var baseLeft = Math.max(pad, (stageWidth - scaledWidth) / 2);
        var baseTop = Math.max(pad, (stageHeight - scaledHeight) / 2);
        var minPanX = -baseLeft;
        var maxPanX = Math.max(minPanX, stageWidth - scaledWidth - baseLeft);
        var minPanY = -baseTop;
        var maxPanY = Math.max(minPanY, stageHeight - scaledHeight - baseTop);
        pan.x = Math.min(maxPanX, Math.max(minPanX, pan.x));
        pan.y = Math.min(maxPanY, Math.max(minPanY, pan.y));
        pans.set(block, pan);
        // IMPORTANT: do not modify stage width/height while panning.
        holder.style.left = (baseLeft + pan.x) + 'px';
        holder.style.top = (baseTop + pan.y) + 'px';
        holder.style.transform = 'scale(' + scale + ')';
        canvas.dataset.panX = String(pan.x);
        canvas.dataset.panY = String(pan.y);
      }
      event.preventDefault();
    });
    function endPan(event) {
      var state = activePointers.get(block);
      if (state && state.id === event.pointerId) activePointers.delete(block);
      canvas.classList.remove('is-panning');
    }
    canvas.addEventListener('pointerup', endPan);
    canvas.addEventListener('pointercancel', endPan);

    var zoomSelect = block.querySelector('.mermaid-zoom-select');
    var zoomLevels = Array.prototype.map.call(zoomSelect.options, function (option) { return Number(option.value); });
    function syncZoomSelect() {
      var current = scales.get(block) || 1;
      var nearest = zoomLevels.reduce(function (best, value) {
        return Math.abs(value - current) < Math.abs(best - current) ? value : best;
      }, zoomLevels[0]);
      zoomSelect.value = String(nearest);
    }
    block.querySelector('.mermaid-zoom-in').addEventListener('click', function () {
      var current = scales.get(block) || 1;
      var index = zoomLevels.findIndex(function (value) { return value >= current - 0.0001; });
      if (index < 0) index = zoomLevels.length - 1;
      if (zoomLevels[index] <= current + 0.0001) index++;
      scales.set(block, zoomLevels[Math.min(zoomLevels.length - 1, index)]);
      syncZoomSelect();
      draw(block);
    });
    block.querySelector('.mermaid-zoom-out').addEventListener('click', function () {
      var current = scales.get(block) || 1;
      var index = zoomLevels.findIndex(function (value) { return value >= current - 0.0001; });
      if (index < 0) index = zoomLevels.length - 1;
      if (zoomLevels[index] >= current - 0.0001) index--;
      scales.set(block, zoomLevels[Math.max(0, index)]);
      syncZoomSelect();
      draw(block);
    });
    zoomSelect.addEventListener('change', function () {
      scales.set(block, Number(this.value));
      draw(block);
    });
    syncZoomSelect();
    block.querySelector('.mermaid-source-toggle').addEventListener('click', function () {
      var show = block.classList.toggle('show-source');
      this.setAttribute('aria-pressed', String(show));
    });
  }

  M.refreshMermaidText = function () {
    document.querySelectorAll('.mermaid-block[data-mermaid-block="true"]').forEach(function (block) {
      var out=block.querySelector('.mermaid-zoom-out'); if(out){out.title=M.t('mermaidZoomOut');out.setAttribute('aria-label',M.t('mermaidZoomOut'));}
      var sel=block.querySelector('.mermaid-zoom-select'); if(sel){sel.title=M.t('mermaidZoom');sel.setAttribute('aria-label',M.t('mermaidZoom'));}
      var inn=block.querySelector('.mermaid-zoom-in'); if(inn){inn.title=M.t('mermaidZoomIn');inn.setAttribute('aria-label',M.t('mermaidZoomIn'));}
      var src=block.querySelector('.mermaid-source-toggle'); if(src)src.textContent=M.t('mermaidSource');
      var canvas=block.querySelector('.mermaid-canvas'); if(canvas)canvas.setAttribute('aria-label',M.t('mermaidDiagram'));
    });
  };

  M.renderMermaid = function (root) {
    if (!root) return;
    mountPlaceholders(root);
    var blocks = root.querySelectorAll('.mermaid-block[data-mermaid-block="true"]');
    Array.prototype.forEach.call(blocks, function (block) {
      if (!scales.has(block)) scales.set(block, 1);
      bind(block);
      draw(block);
    });
  };

  M.redrawMermaid = function () {
    var root = document.querySelector('.doc');
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('.mermaid-block[data-mermaid-block="true"]'), function (block) {
      draw(block);
    });
  };
})(window.MarkdownViewer);
