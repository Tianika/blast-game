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

export const getTileArray = async () => {
  const tiles = [];

  const arrPromise = TILE_DATAS.map(async ({ name, src }) => {
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

export async function addBonusButton(
  { btnClass, imgSrc, imgClass },
  container
) {
  const button = createElementWithClass('button', btnClass);
  const image = await loadImage(imgSrc);
  image.classList.add(imgClass);

  button.addEventListener('click', (event) => toggleClassActive(event));

  button.appendChild(image);
  container.appendChild(button);

  return button;
}
