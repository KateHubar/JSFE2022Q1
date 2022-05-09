import { App } from "./app.js";

const keyboardConfig = [
    './src/assets/keyboard-config/keyboard-row-1.json',
    './src/assets/keyboard-config/keyboard-row-2.json',
    './src/assets/keyboard-config/keyboard-row-3.json',
    './src/assets/keyboard-config/keyboard-row-4.json',
    './src/assets/keyboard-config/keyboard-row-5.json'
];

const appRoot = document.createElement('div');
document.body.append(appRoot);
const app = new App(appRoot, keyboardConfig);
app.init();