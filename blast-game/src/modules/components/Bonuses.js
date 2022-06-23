import Game from './Game';
import { BONUSES } from '../../utils/constants';
import {
  addBonusButton,
  createElementWithClass,
  loadImage,
  toggleClassActive,
} from '../../utils/helpers';
import { STRING_MAP } from '../../utils/locales';

class Bonuses extends Game {
  constructor(props) {
    super(props);

    this.bonusBtnsData = [
      {
        btnClass: 'bombButton',
        imgSrc: BONUSES.bomb,
        imgClass: 'imageBomb',
      },
      {
        btnClass: 'teleportButton',
        imgSrc: BONUSES.teleport,
        imgClass: 'imageTeleport',
      },
    ];

    this.bonusesContainer = createElementWithClass('div', 'bonusesContainer');
  }

  async draw() {
    const title = createElementWithClass('h3', 'bonusesTitle');
    title.innerText = STRING_MAP.bonuses;

    const [bomb, teleport] = this.bonusBtnsData.map((data) => {
      addBonusButton(data, this.bonusesContainer);
    });

    this.bonusesContainer.appendChild(title);
    this.parent.appendChild(this.bonusesContainer);
  }
}

export default Bonuses;
