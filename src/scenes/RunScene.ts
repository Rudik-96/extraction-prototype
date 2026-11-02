import { Container } from 'pixi.js';
import type { Scene } from '../core/Scene';
import type { ScreenSize } from '../core/Viewport';
import { mainMap } from '../game/map/mainMap';
import { World } from '../game/World';
import { PlayerInput } from '../input/PlayerInput';
import { Button } from '../ui/Button';
import { JoystickControl } from '../ui/JoystickControl';
import { WorldView } from '../view/WorldView';
import type { GoTo } from './types';

const MENU_BUTTON = { width: 84, height: 40, margin: 12 };

export class RunScene implements Scene {
  readonly view = new Container();
  private readonly world = new World(mainMap);
  private readonly worldView = new WorldView(this.world);
  private readonly joystickControl = new JoystickControl();
  private readonly input = new PlayerInput(this.joystickControl.joystick);
  private readonly menuButton: Button;

  constructor(goTo: GoTo) {
    this.menuButton = new Button({
      label: 'Меню',
      width: MENU_BUTTON.width,
      height: MENU_BUTTON.height,
      onTap: () => goTo('menu'),
    });
    // Кнопка выше зоны джойстика, иначе касание достанется джойстику.
    this.view.addChild(this.worldView, this.joystickControl, this.menuButton);
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
    this.input.read();
    this.world.update(dt, this.input);
  }

  render(alpha: number): void {
    this.worldView.render(alpha);
  }

  destroy(): void {
    this.input.dispose();
    this.view.destroy({ children: true });
  }
}
