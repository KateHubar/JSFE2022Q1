class Keyboard {
  config;

  root;

  input;

  languages = ['en', 'ru'];

  language;

  commands;

  isUpperCase = true;

  constructor(root, input, config) {
    this.root = root;
    this.config = config;
    this.input = input;
    [this.language] = this.languages;
    this.commands = new Set();
  }

  init() {
    this.config.forEach((row) => {
      const htmlKeyboardRow = document.createElement('div');
      htmlKeyboardRow.classList.add('keyboard-row');
      row.forEach((key) => {
        const htmlKey = document.createElement('div');
        htmlKey.id = key.code;
        htmlKey.dataset.code = key.code;
        htmlKey.dataset.type = key.type;

        this.languages.forEach((lang, i, langs) => {
          if (key.symbol[lang]) {
            if (i === 0 || key.symbol[lang] !== key.symbol[langs[0]]) { htmlKey.dataset[`symbol${lang}`] = key.symbol[lang]; }
          }
          if (key.subsymbol[lang]) { htmlKey.dataset[`subsymbol${lang}`] = key.subsymbol[lang]; }
        });

        htmlKey.style.cssText += key.style;
        htmlKey.innerHTML = this.isUpperCase
          ? key.symbol[this.language].toUpperCase()
          : key.symbol[this.language].toLowerCase();

        htmlKey.classList.add('key');
        htmlKey.classList.add(`key-type-${key.type}`);

        if (htmlKey.dataset[`symbol${this.languages[1]}`]) {
          htmlKey.classList.add('key-type-location');
        }

        if (htmlKey.dataset[`subsymbol${this.languages[0]}`]) {
          htmlKey.classList.add('key-type-subsymbol');
        }

        htmlKeyboardRow.append(htmlKey);

        htmlKey.addEventListener('mousedown', (event) => {
          if (this.commands.has(event.target.dataset.code)) {
            this.deactivateBtn([event.target]);
          } else {
            this.input.dispatchEvent(new KeyboardEvent('keydown', {
              code: event.target.dataset.code,
            }));
          }
          this.refresh();
        });
        htmlKey.addEventListener('mouseup', (event) => {
          this.input.focus();
          if (event.target.dataset.type !== 'command-btn') {
            this.input.dispatchEvent(new KeyboardEvent('keyup', {
              code: event.target.dataset.code,
            }));
          }
        });
      });
      this.root.append(htmlKeyboardRow);
    });
    this.input.addEventListener('keydown', (event) => {
      const btn = this.root.querySelector(`#${event.code}`);
      if (btn) {
        this.activateBtn(btn, event);
        this.enterSymbol(btn, event);
      }
    });
    this.input.addEventListener('keyup', (event) => {
      this.refresh();
      if (event.code === 'ShiftLeft'
                || event.code === 'ShiftRight'
                || event.code === 'ControlLeft'
                || event.code === 'ControlRight'
                || event.code === 'AltLeft'
                || event.code === 'AltRight') {
        const code = event.code.replace(/Right|Left/g, '');
        const btns = this.root.querySelectorAll(`#${code}Left, #${code}Right`);
        this.deactivateBtn(btns);
      } else {
        const btn = this.root.querySelector(`#${event.code}`);
        this.deactivateBtn([btn]);
      }
    });
  }

  activateBtn(btn, event) {
    if (!this.commands.has(event.code)) {
      btn.classList.add('active');
    }
  }

  deactivateBtn(btns = []) {
    if (btns.length) {
      btns.forEach((btn) => {
        this.commands.delete(btn.dataset.code);
        btn.classList.remove('active');
      });
    }
  }

  enterSymbol(btn, event) {
    if (btn.dataset.type !== 'command-btn') {
      event.preventDefault();
      const value = btn.dataset[`symbol${this.language}`] || btn.dataset[`symbol${this.languages[0]}`];
      this.input.value += this.commands.has('ShiftRight') || this.commands.has('ShiftLeft') ? value.toUpperCase() : value.toLowerCase();
    }
    if (btn.dataset.type === 'command-btn') {
      if (!this.commands.has(event.code)) {
        this.commands.add(btn.dataset.code);
      }
    }
  }

  refresh() {
    if ((this.commands.has('ShiftRight') || this.commands.has('ShiftLeft'))
            && (this.commands.has('AltRight') || this.commands.has('AltLeft'))) {
      const indx = this.languages.indexOf(this.language) + 1;
      this.language = this.languages.length > indx ? this.languages[indx] : this.languages[0];
      const localBtns = this.root.querySelectorAll('.key-type-location');
      localBtns.forEach((btn) => {
        // eslint-disable-next-line no-param-reassign
        btn.innerHTML = btn.dataset[`symbol${this.language}`];
      });
    }
  }
}

export default Keyboard;
