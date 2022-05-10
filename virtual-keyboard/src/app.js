// eslint-disable-next-line import/extensions
import Keyboard from './components/keyboard.js';

class App {
  root;

  loader;

  configUrls;

  isLoadingValue;

  textarea;

  input;

  keyBoardRoot;

  keyBoard;

  constructor(root, configUrls) {
    this.root = root;
    this.root.classList.add('app');
    this.configUrls = configUrls;

    this.loader = document.createElement('div');
    this.loader.classList.add('loader');
    this.root.append(this.loader);

    this.textarea = document.createElement('div');
    this.textarea.classList.add('textarea');
    this.textarea.classList.add('hidden');
    this.input = document.createElement('textarea');
    this.input.classList.add('text');
    this.textarea.append(this.input);
    this.root.append(this.textarea);

    this.keyBoardRoot = document.createElement('div');
    this.keyBoardRoot.classList.add('keyboard');
    this.keyBoardRoot.classList.add('hidden');
    this.root.append(this.keyBoardRoot);
  }

  init() {
    this.startLoading();
    Promise.all(this.configUrls.map((url) => fetch(url).then((resp) => resp.json())))
      .then((config) => {
        setTimeout(() => {
          this.keyBoard = new Keyboard(this.keyBoardRoot, this.input, config);
          this.keyBoard.init();
          this.stopLoading();
        }, 1000);
      });
  }

  set isLoading(value) {
    this.isLoadingValue = value;
    if (value) {
      this.textarea.classList.add('hidden');
      this.keyBoardRoot.classList.add('hidden');
      this.loader.classList.remove('hidden');
    } else {
      this.textarea.classList.remove('hidden');
      this.keyBoardRoot.classList.remove('hidden');
      this.loader.classList.add('hidden');
    }
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }
}

export default App;
