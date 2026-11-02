import { Container } from 'pixi.js';
import type { Scene } from '../core/Scene';
import type { ScreenSize } from '../core/Viewport';
import { mainMap } from '../game/map/mainMap';
import { World } from '../game/World';
import { PlayerInput } from '../input/PlayerInput';
import { Button } from '../ui/Button';
import { createLabel } from '../ui/createLabel';
import { JoystickControl } from '../ui/JoystickControl';
import { WorldView } from '../view/WorldView';
import type { GoTo } from './types';

const MENU_BUTTON = { width: 84, height: 40, margin: 12 };
const WAVE_LABEL_POSITION = { x: 60, y: 32 };

export class RunScene implements Scene {
  readonly view = new Container();
  private readonly world = new World(mainMap);
  private readonly worldView = new WorldView(this.world);
  private readonly joystickControl = new JoystickControl();
  private readonly input = new PlayerInput(this.joystickControl.joystick);
  private readonly menuButton: Button;
  private readonly waveLabel = createLabel('', 18, { bold: true });
  private shownWave = -1;
  private finished = false;

  constructor(private readonly goTo: GoTo) {
    this.menuButton = new Button({
      label: 'Меню',
      width: MENU_BUTTON.width,
      height: MENU_BUTTON.height,
      onTap: () => goTo('menu'),
    });
    // Кнопка выше зоны джойстика, иначе касание достанется джойстику.
    this.waveLabel.position.set(WAVE_LABEL_POSITION.x, WAVE_LABEL_POSITION.y);
    this.view.addChild(this.worldView, this.joystickControl, this.menuButton, this.waveLabel);
  }

  resize(screen: ScreenSize): void {
    this.worldView.resize(screen);
    this.joystickControl.resize(screen);
    this.menuButton.position.set(
      screen.width - MENU_BUTTON.width / 2 - MENU_BUTTON.margin,
      MENU_BUTTON.height / 2 + MENU_BUTTON.margin,
    );
  }

  fixedUpdate(dt: number): void {
    if (this.finished) return;
    this.input.read();
    this.world.update(dt, this.input);
    if (this.world.hero.isDead) {
      this.finished = true;
      this.goTo('result', { outcome: 'died', lootValue: 0 });
    }
  }

  render(alpha: number): void {
    this.worldView.render(alpha);
    // Текст обновляем только при смене волны: перерисовка Text дорогая.
    const wave = this.world.spawner.waveNumber;
    if (wave !== this.shownWave) {
      this.shownWave = wave;
      this.waveLabel.text = `Волна ${wave}`;
    }
  }

  destroy(): void {
    this.input.dispose();
    this.view.destroy({ children: true });
  }
}
