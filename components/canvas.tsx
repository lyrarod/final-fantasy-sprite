"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Lightbulb,
  LightbulbOff,
  Loader2,
  Pause,
  Play,
  SquareIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Character } from "@/class/character";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CharacterTypo = {
  slug?: string;
  name: string;
  image: string;
  icon?: string;
  animations: {
    name: string;
    width: number;
    height: number;
    frameX: number;
    frameY: number;
    sprite: string;
  }[];
};

export function CanvasComponent({ character }: { character: CharacterTypo }) {
  const { animations } = character;
  const [indexAnimation, setIndexAnimation] = React.useState<number>(0);
  const [canvas, setCanvas] = React.useState<{ width: number; height: number }>(
    {
      width: animations[indexAnimation].width,
      height: animations[indexAnimation].height,
    }
  );

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  let char: Character | null = null;

  React.useEffect(() => {
    if (!canvasRef.current) return;
    char = new Character(canvasRef.current, animations[indexAnimation]);
  }, [indexAnimation]);

  let loader = (
    <span className="flex items-center mr-1 gap-x-1">
      <Loader2 className="size-4 animate-spin" />
      <em className="text-xs">Loading...</em>
    </span>
  );

  return (
    <main className="flex flex-col items-center gap-6 sm:container">
      <div className="flex items-center justify-between w-full gap-2 p-4 border-b bg-background">
        <Link href="/" className="flex items-center gap-2">
          <Avatar className="border">
            <AvatarImage
              src={`/${character.slug}/${character.icon}`}
              className="object-cover"
              style={{ imageRendering: "pixelated" }}
            />
            <AvatarFallback>{character.name.at(0)}</AvatarFallback>
          </Avatar>
          <p className="text-lg italic select-none">{character.name}</p>
        </Link>

        <div className="flex items-center">
          <Button
            id="buttonLightMode"
            size={"icon"}
            variant={"outline"}
            title="Light On"
            onClick={() => {
              document.getElementById("canvas")!.style.backgroundColor = "#fff";
              document.getElementById("buttonDarkMode")!.style.display = "flex";
              document.getElementById("buttonLightMode")!.style.display =
                "none";
            }}
          >
            <Lightbulb className="fill-foreground" />
          </Button>
          <Button
            id="buttonDarkMode"
            size={"icon"}
            variant={"outline"}
            title="Light Off"
            className="hidden"
            onClick={() => {
              document.getElementById("canvas")!.style.backgroundColor = "#000";
              document.getElementById("buttonLightMode")!.style.display =
                "flex";
              document.getElementById("buttonDarkMode")!.style.display = "none";
            }}
          >
            <LightbulbOff className="fill-foreground" />
          </Button>
        </div>
      </div>

      <canvas
        id="canvas"
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        className="hidden w-full transition bg-black border rounded max-w-fit"
        style={{ imageRendering: "pixelated" }}
      ></canvas>

      <canvas
        id="loaderCanvas"
        width={canvas.width}
        height={canvas.height}
        className="w-full border rounded bg-secondary max-w-fit animate-pulse"
      ></canvas>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Select>
          <SelectTrigger
            id="selectLoading"
            className="pointer-events-none select-none opacity-40 w-fit"
          >
            <SelectValue placeholder={loader} />
          </SelectTrigger>
        </Select>

        <Select
          defaultValue={String(indexAnimation)}
          onValueChange={(value) => {
            const index = Number(value);
            setIndexAnimation(index);
            setCanvas({
              width: animations[index].width,
              height: animations[index].height,
            });
          }}
        >
          <SelectTrigger
            id="selectAnimation"
            className="hidden select-none w-fit focus:ring-0"
          >
            <SelectValue placeholder="Select an animation" />
          </SelectTrigger>
          <SelectContent>
            {character.animations.map((animation, i) => (
              <SelectItem key={i} value={String(i)}>
                <div className="flex items-center mr-2 gap-x-2">
                  <Play className="size-3 fill-foreground" />
                  {animation.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          id="buttonRunAnimation"
          size={"sm"}
          variant={"default"}
          className="cursor-pointer pointer-events-none opacity-40"
          title="Run"
          onClick={() => char?.run()}
        >
          <Play className="fill-foreground" />
        </Button>

        <Button
          id="buttonPauseAnimation"
          size={"sm"}
          variant={"default"}
          className="hidden cursor-pointer"
          title="Pause"
          onClick={() => char?.pause()}
        >
          <Pause className="fill-foreground" />
        </Button>

        <Button
          id="buttonStopAnimation"
          size={"sm"}
          variant={"secondary"}
          className="cursor-pointer pointer-events-none opacity-40"
          title="Stop"
          onClick={() => char?.stop()}
        >
          <SquareIcon className="fill-foreground" />
        </Button>
      </div>
    </main>
  );
}
