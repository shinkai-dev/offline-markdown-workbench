window.MarkdownViewer = window.MarkdownViewer || {};
(function (M) { var key = 'markdown-viewer-settings-v5', defaults = { theme: 'dark', fontSize: 16, lineHeight: 1.85, docWidth: 1000, tocOpen: true, numbered: false, language: 'ja' }; M.settings = Object.assign({}, defaults); M.loadSettings = function () { try {
    var raw = localStorage.getItem(key);
    var x = raw ? JSON.parse(raw) : null;
    if (!x) {
        var legacy = JSON.parse(localStorage.getItem('markdown-viewer-settings-v4') || '{}');
        delete legacy.tocOpen;
        x = Object.assign({}, legacy, { tocOpen: true });
    }
    delete x.docWidth;
    M.settings = Object.assign({}, defaults, x);
}
catch (e) {
    M.settings = Object.assign({}, defaults);
    if (M.notify)
        M.notify('設定を保存できないため一時設定で動作します');
} }; M.saveSettings = function () { try {
    var saved = Object.assign({}, M.settings);
    delete saved.docWidth;
    localStorage.setItem(key, JSON.stringify(saved));
}
catch (e) {
    if (M.notify)
        M.notify('設定の保存に失敗しました');
} }; M.loadSettings(); })(window.MarkdownViewer);
