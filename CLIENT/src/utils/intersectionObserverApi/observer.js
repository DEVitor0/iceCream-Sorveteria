class IntersectionObserverEffect {
  constructor() {
    this.sections = {};
  }

  addAnimation(sectionName, id, callback) {
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = { animations: {}, selector: null };
    }
    this.sections[sectionName].animations[id] = callback;
  }

  setSectionSelector(sectionName, selector) {
    if (!this.sections[sectionName]) {
      this.sections[sectionName] = { animations: {}, selector: null };
    }
    this.sections[sectionName].selector = selector;
  }

  callback(entries, animations) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = animations[element.id];

        if (animation) {
          // Adiciona um atraso baseado no índice do elemento
          setTimeout(() => {
            animation(element);
          }, index * 150); // 150ms de atraso entre cada elemento
        } else {
          console.warn(`No animation defined for ID: ${element.id}`);
        }
      }
    });
  }

  startObserving() {
    window.addEventListener('load', () => {
      Object.keys(this.sections).forEach((sectionName) => {
        const { animations, selector } = this.sections[sectionName];
        if (!selector) {
          console.error(`Selector not set for section: ${sectionName}`);
          return;
        }

        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.error(`No elements found with selector: ${selector}`);
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => this.callback(entries, animations),
          {
            rootMargin: '0px 0px -100px 0px', // Ajuste o rootMargin para detectar os elementos antes de entrarem na viewport
            threshold: 0.1,
          },
        );

        elements.forEach((element) => {
          observer.observe(element);
        });
      });
    });
  }
}

const observerEffect = new IntersectionObserverEffect();

// main section
observerEffect.setSectionSelector('main', '.looking-main');
observerEffect.addAnimation('main', 'header', (element) => {
  element.classList.add('visible');
});

observerEffect.addAnimation('main', 'main-title', (element) => {
  element.classList.add('visible-from-left');
});

observerEffect.addAnimation('main', 'main-block', (element) => {
  element.classList.add('visible');
});

observerEffect.addAnimation('main', 'main-iceCream-image', (element) => {
  element.classList.add('visible');
  if (element.tagName === 'IMG' && !element.complete) {
    element.onload = () => element.classList.add('visible');
    element.onerror = () => element.classList.add('visible');
  }
});

observerEffect.addAnimation('main', 'main-text', (element) => {
  element.classList.add('visible-from-left');
});

observerEffect.addAnimation('main', 'main-buttons', (element) => {
  element.classList.add('visible');
});

observerEffect.addAnimation('main', 'main-button-icon', (element) => {
  element.classList.add('visible');
});

observerEffect.addAnimation('main', 'main-comment', (element) => {
  element.classList.add('visible-from-right');
});

// services section
observerEffect.setSectionSelector('services', '.looking-services');
observerEffect.addAnimation('services', 'services-subtitle', (element) => {
  element.classList.add('visible-from-bottom');
});

observerEffect.addAnimation('services', 'services-title', (element) => {
  element.classList.add('visible-from-bottom');
});

observerEffect.addAnimation('services', 'services-container', (element) => {
  element.classList.add('visible');
});

const initializeObserver = () => {
  observerEffect.startObserving();
};

export default initializeObserver;
