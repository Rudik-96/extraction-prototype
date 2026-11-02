import { Container } from 'pixi.js';
import { BALANCE } from '../config/balance';
import type { Scene } from '../core/Scene';
import type { ScreenSize } from '../core/Viewport';
import type { DebugState } from '../debug/DebugState';
import { mainMap } from '../game/map/mainMap';
import { type RunOutcome, World } from '../game/World';
import { PlayerInput } from '../input/PlayerInput';
import type { Progress } from '../save/Progress';
import { Button } from '../ui/Button';
import { JoystickControl } from '../ui/JoystickControl';
import { RunHud } from '../ui/RunHud';
import { WorldView } from '../view/WorldView';
import type { GoTo } from './types';

const MENU_BUTTON = { width: 84, height: 40, margin: 12 };

export class RunScene implements Scene {
  readonly view = new Container();
  private readonly world: World;
  private readonly worldView: WorldView;
  private readonly joystickControl = new JoystickControl();
  private readonly input = new PlayerInput(this.joystickControl.joystick);
  private readonly hud = new RunHud();
  private readonly menuButton: Button;
  private finished = false;

  constructor(
    private readonly goTo: GoTo,
    private readonly progress: Progress,
    private readonly debug: DebugState,
  ) {
    this.world = new World(mainMap, progress.heroStats);
    debug.world = this.world;
    this.worldView = new WorldView(this.world);
    this.menuButton = new Button({
      label: 'Меню',
      width: MENU_BUTTON.width,
      height: MENU_BUTTON.height,
      onTap: () => goTo('menu'),
    });
    // Кнопка выше зоны джойстика, иначе касание достанется джойстику.
    this.view.addChild(this.worldView, this.joystickControl, this.hud, this.menuButton);
  }

  resize(screen: ScreenSize): void {
    this.worldView.resize(screen);
    this.joystickControl.resize(screen);
    this.hud.resize(screen);
    this.menuButton.position.set(
      screen.width - MENU_BUTTON.width / 2 - MENU_BUTTON.margin,
      MENU_BUTTON.height / 2 + MENU_BUTTON.margin,
    );
  }

  fixedUpdate(dt: number): void {
    if (this.finished) return;
    this.input.read();
    this.world.hero.immortal = this.debug.immortal;
    this.world.update(dt, this.input);
    if (this.world.outcome) this.finish(this.world.outcome);
  }

  render(alpha: number): void {
    this.worldView.render(alpha);
    this.hud.render(this.world);
  }

  destroy(): void {
    this.debug.world = null;
    this.input.dispose();
    this.view.destroy({ children: true });
  }

  private finish(outcome: RunOutcome): void {
    this.finished = true;
    const { world } = this;
    if (outcome === 'extracted') this.progress.addLoot(world.lootCollected);
    this.goTo('result', {
      outcome,
      lootValue: world.lootCollected,
      kills: world.kills,
      duration: BALANCE.run.duration - world.timeLeft,
    });
  }
}
