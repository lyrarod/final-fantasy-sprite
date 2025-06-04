type Animations = {
  name: string;
  width: number;
  height: number;
  frameX: number;
  frameY: number;
  sprite: string;
}[];

export class Character {
  width: number;
  height: number;
  x: number;
  y: number;
  frameX: number[];
  indexFrameX: number;
  frameY: number[];
  indexFrameY: number;
  sprite: HTMLImageElement;
  frameTimer: number;
  frameInterval: number;
  paused: boolean;
  isAttacking: boolean;
  buttonRunAnimation: HTMLButtonElement;
  buttonPauseAnimation: HTMLButtonElement;
  buttonStopAnimation: HTMLButtonElement;
  opacity: string;
  spriteIsLoaded: boolean;
  lastTime: number;
  raf: number;
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  currentAnimation: Animations[number];
  selectLoading: HTMLSelectElement;
  selectAnimation: HTMLSelectElement;
  loaderCanvas: HTMLDivElement;
  canvasElement: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, currentAnimation: Animations[number]) {
    this.ctx = canvas.getContext("2d")!;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.currentAnimation = currentAnimation;
    this.width = this.currentAnimation.width;
    this.height = this.currentAnimation.height;
    this.x = this.canvasWidth * 0.5 - this.width * 0.5;
    this.y = this.canvasHeight * 0.5 - this.height * 0.5;
    this.frameX = Array.from(
      { length: this.currentAnimation.frameX },
      (_, i) => i
    );
    this.indexFrameX = 0;
    this.frameY = Array.from(
      { length: this.currentAnimation.frameY },
      (_, i) => i
    );
    this.indexFrameY = 0;
    this.frameTimer = 0;
    this.frameInterval = 1000 / 8;
    this.paused = true;
    this.isAttacking = false;
    this.spriteIsLoaded = false;
    this.sprite = new Image();
    this.sprite.src = this.currentAnimation.sprite;
    this.sprite.onload = () => {
      this.spriteIsLoaded = true;

      setTimeout(() => {
        this.selectLoading.style.display = "none";
        this.selectAnimation.style.display = "flex";
        this.buttonRunAnimation.style.opacity = "1";
        this.buttonRunAnimation.style.pointerEvents = "all";
        this.loaderCanvas.style.display = "none";
        this.canvasElement.style.display = "flex";
      }, 1500);
    };

    this.raf = 0;
    this.lastTime = 0;

    this.loaderCanvas =
      (document.getElementById("loaderCanvas")! as HTMLDivElement) || null;

    this.canvasElement =
      (document.getElementById("canvas")! as HTMLCanvasElement) || null;

    this.buttonRunAnimation =
      (document.getElementById("buttonRunAnimation")! as HTMLButtonElement) ||
      null;

    this.buttonPauseAnimation =
      (document.getElementById("buttonPauseAnimation")! as HTMLButtonElement) ||
      null;

    this.selectAnimation =
      (document.getElementById("selectAnimation")! as HTMLSelectElement) ||
      null;

    this.selectLoading =
      (document.getElementById("selectLoading")! as HTMLSelectElement) || null;

    this.buttonStopAnimation =
      (document.getElementById("buttonStopAnimation")! as HTMLButtonElement) ||
      null;

    this.opacity = ".40";

    this.buttonRunAnimation.style.opacity = this.opacity;
    this.buttonRunAnimation.style.pointerEvents = "none";

    this.buttonStopAnimation.style.opacity = this.opacity;
    this.buttonStopAnimation.style.pointerEvents = "none";

    this.loaderCanvas.style.display = "flex";
    this.canvasElement.style.display = "none";

    this.start();
  }

  setPointerEvents(state: "none" | "all") {
    this.selectAnimation.style.pointerEvents = state;
    this.selectAnimation.style.opacity = "1";

    if (state === "none") {
      this.selectAnimation.style.opacity = this.opacity;
    }
  }

  toggleButtonRunPause() {
    this.buttonRunAnimation.style.display = "none";
    this.buttonPauseAnimation.style.display = "flex";

    if (this.paused) {
      this.buttonRunAnimation.style.display = "flex";
      this.buttonPauseAnimation.style.display = "none";
    }
  }

  run() {
    this.paused = false;
    this.toggleButtonRunPause();
    this.setPointerEvents("none");
    this.buttonStopAnimation.style.opacity = "1";
    this.buttonStopAnimation.style.pointerEvents = "all";
  }

  pause() {
    this.paused = true;
    this.toggleButtonRunPause();
    this.setPointerEvents("all");
  }

  stop() {
    this.paused = true;
    this.frameTimer = 0;
    this.indexFrameX = 0;
    this.indexFrameY = 0;
    this.toggleButtonRunPause();
    this.setPointerEvents("all");
    this.buttonStopAnimation.style.opacity = this.opacity;
    this.buttonStopAnimation.style.pointerEvents = "none";
  }

  drawCharacter() {
    if (!this.spriteIsLoaded) return;

    this.ctx?.drawImage(
      this.sprite,
      this.frameX[this.indexFrameX] * this.width,
      this.frameY[this.indexFrameY] * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(deltaTime: number) {
    this.drawCharacter();
    if (this.paused) return;

    if (this.frameTimer >= this.frameInterval) {
      this.indexFrameX++;

      if (this.indexFrameX >= this.frameX.length) {
        this.indexFrameX = 0;

        this.indexFrameY++;
        if (this.indexFrameY >= this.frameY.length) {
          this.indexFrameY = 0;
          if (
            !this.currentAnimation?.name.includes("Idle") &&
            !this.currentAnimation?.name.includes("Move") &&
            !this.currentAnimation?.name.includes("Standby") &&
            !this.currentAnimation?.name.includes("Magic")
          ) {
            this.stop();
          }
        }
      }

      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  loop = (timeStamp: number = 0) => {
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    // console.log("deltaTime:", Math.floor(deltaTime));

    this.raf = requestAnimationFrame(this.loop);
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.update(deltaTime);
  };

  start() {
    this.raf = requestAnimationFrame(this.loop);
  }
}
