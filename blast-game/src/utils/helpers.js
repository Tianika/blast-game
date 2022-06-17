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

  const arrPromise = TAIL_DATAS.map(async (data) => {
    const image = await loadImage(data.src);

    return image;
  });

  for await (const promise of arrPromise) {
    tails.push(promise);
  }

  return tails;
};
