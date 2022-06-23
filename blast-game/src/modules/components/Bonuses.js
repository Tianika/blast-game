import Game from './Game';
import { BONUSES } from '../../utils/constants';
import { createElementWithClass, loadImage } from '../../utils/helpers';
import { STRING_MAP } from '../../utils/locales';

class Bonuses extends Game {
  constructor(props) {
    super(props);

    this.bonusesContainer = createElementWithClass('div', 'bonusesContainer');
  }

  async draw() {
    const title = createElementWithClass('h3', 'bonusesTitle');
    title.innerText = STRING_MAP.bonuses;

    const bomb = createElementWithClass('button', 'bombButton');
    const imageBomb = await loadImage(BONUSES.bomb);
    imageBomb.classList.add('imageBomb');

    const teleport = createElementWithClass('button', 'teleportButton');
    const imageTeleport = await loadImage(BONUSES.teleport);
    imageTeleport.classList.add('imageTeleport');

    bomb.appendChild(imageBomb);
    teleport.appendChild(imageTeleport);

    this.bonusesContainer.appendChild(title);
    this.bonusesContainer.appendChild(bomb);
    this.bonusesContainer.appendChild(teleport);

    this.parent.appendChild(this.bonusesContainer);
  }
}

export default Bonuses;
