import { TAIL_DATAS } from './constants';

export const getRandomNum = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const loadImage = async (src) => {
  const image = new Image();
  image.src = src;

  await image.decode();

  return image;
};

export const getTailArray = async () => {
  const tails = [];

  const arrPromise = TAIL_DATAS.map(async ({ name, src }) => {
    const image = await loadImage(src);

    return { name, image };
  });

  for await (const { name, image } of arrPromise) {
    tails.push({ name, image });
  }

  return tails;
};

export function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

export function checkCoords(arr, newX, newY) {
  let result = false;

  arr.forEach(({ x, y }) => {
    if (newX === x && newY === y) {
      result = true;
    }
  });

  return result;
}
