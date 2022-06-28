import Game from './Game';
import { addBonusButton, createElementWithClass } from '../../utils/helpers';
import { STRING_MAP } from '../../utils/locales';

class Bonuses extends Game {
  constructor(props) {
    super(props);

    this.bonusBtnsData = [
      {
        btnClass: 'bombButton',
        imgClass: 'imageBomb',
      },
      {
        btnClass: 'teleportButton',
        imgClass: 'imageTeleport',
      },
    ];

    this.bonusesContainer = createElementWithClass('div', 'bonusesContainer');
  }

  draw() {
    const title = createElementWithClass('h3', 'bonusesTitle');
    title.innerText = STRING_MAP.bonuses;
    this.bonusesContainer.appendChild(title);

    const [bomb, teleport] = this.bonusBtnsData.map((data) => {
      return addBonusButton(data, this.bonusesContainer);
    });

    bomb.addEventListener('click', () => {
      teleport.classList.remove('active');
    });

    teleport.addEventListener('click', () => {
      bomb.classList.remove('active');
    });

    this.parent.appendChild(this.bonusesContainer);
  }
}

export default Bonuses;
