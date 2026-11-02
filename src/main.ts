import { Game } from './core/Game';

const root = document.getElementById('app');
if (!root) throw new Error('Не найден элемент #app');

new Game().start(root).catch((error: unknown) => {
  console.error(error);
  root.textContent = 'Не удалось запустить игру: нужен браузер с поддержкой WebGL.';
  root.style.color = '#fff';
});
