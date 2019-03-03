const {webview, alert, alertFailTitle, alertFailText} = require('./getElements');
const runPlugin = require('./runPlugin');
const {replaceFont} = require('./fontReplacer');

const ERROR_KEY_MESSAGE_NOT_FOUND_CURRENT_PAGE = 'null is not an object (evaluating \'document.currentPage\')';
const ERROR_KEY_MESSAGE_NOT_FOUND_SKETCH_APP = 'Looks like we can\'t find Sketch.app.';

function doneAlert() {
  alert.classList.remove('Alert--loading');
  alert.classList.add('Alert--done');
  setTimeout(function () {
    alert.classList.remove('Alert--done');
  }, 2000);
}

function failAlert(title, message) {
  alert.classList.remove('Alert--loading');
  alert.classList.add('Alert--fail');
  alertFailTitle.innerHTML = title;
  alertFailText.innerHTML = message;
}

function runHtmlToSketch() {
  alert.classList.add('Alert--loading');
  webview.executeJavaScript('webviewScript.page2layers();', false, function (result) {
    const jsonString = replaceFont(JSON.stringify(result));

    runPlugin(jsonString, function(message) {
      if (!message) {
        doneAlert();
        webview.reload();
      } else if (message.indexOf(ERROR_KEY_MESSAGE_NOT_FOUND_CURRENT_PAGE) !== -1) {
        failAlert('Can\'t find open sketch document page.<br>Please retry after open empty sketch document.', message);
      } else if (message.indexOf(ERROR_KEY_MESSAGE_NOT_FOUND_SKETCH_APP) !== -1) {
        failAlert('Can\'t find Sketch.app in Applications folder.<br>Please retry after move Sketch.app to Applications folder.', message);
      } else {
        failAlert('Unknown error', message);
      }
    });

  });
}

module.exports = runHtmlToSketch;
