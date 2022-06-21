class Scene {
  constructor() {
    this.root = document.querySelector('#root');
    this.scene = document.createElement('div');
    this.scene.classList.add('sceneWrapper');
  }

  clear() {
    this.scene.innerHTML = '';
    this.root.innerHTML = '';
  }

  draw() {
    this.clear();
    root.appendChild(this.scene);
  }
}

export default Scene;
