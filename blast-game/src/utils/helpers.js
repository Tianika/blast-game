import { TILE_DATAS } from './constants';

export const getRandomNum = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const loadImage = async (src) => {
  const image = new Image();
  image.src = src;

  await image.decode();

  return image;
};

export const getTileArray = async (num) => {
  const tiles = [];

  const colorsForGame = TILE_DATAS.sort(() => Math.random() - 0.5);

  const arrPromise = colorsForGame.slice(0, num).map(async ({ name, src }) => {
    const image = await loadImage(src);

    return { name, image };
  });

  for await (const { name, image } of arrPromise) {
    tiles.push({ name, image });
  }

  return tiles;
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

export function createElementWithClass(tagName, className) {
  const element = document.createElement(tagName);
  element.classList.add(className);

  return element;
}

export function toggleClassActive({ currentTarget }) {
  if (currentTarget.classList.contains('active')) {
    currentTarget.classList.remove('active');
  } else {
    currentTarget.classList.add('active');
  }
}

export function addBonusButton({ btnClass, imgClass }, container) {
  const button = createElementWithClass('div', btnClass);
  const image = createElementWithClass('div', imgClass);

  button.addEventListener('click', (event) => toggleClassActive(event));

  button.appendChild(image);
  container.appendChild(button);

  return button;
}
