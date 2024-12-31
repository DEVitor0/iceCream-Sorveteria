class IntersectionObserverEffect {
  constructor(element) {
    this.element = element;
    this.queue = Promise.resolve();
  }

  addToQueue(callback, delay) {
    this.queue = this.queue.then(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            callback();
            resolve();
          }, delay);
        }),
    );
  }

  // eslint-disable-next-line no-unused-vars
  callback(entries, observer) {
    let delayTime = 0;

    const sortedEntries = Array.from(entries).sort((a, b) => {
      const order = [
        'header',
        'main-title',
        'main-block',
        'main-iceCream-image',
        'main-text',
        'main-buttons',
        'main-button-icon',
        'main-comment',
      ];
      return order.indexOf(a.target.id) - order.indexOf(b.target.id);
    });

    sortedEntries.forEach((entry) => {
      if (entry.isIntersecting) {
        const iten = entry.target;

        switch (iten.id) {
          case 'header':
            this.addToQueue(() => this.addVisible(iten), delayTime);
            delayTime += 80;
            break;

          case 'main-title':
            this.addToQueue(() => this.addVisibleFromLeft(iten), delayTime);
            delayTime += 80;
            break;

          case 'main-block':
            this.addToQueue(() => this.addVisible(iten), delayTime);
            break;

          case 'main-iceCream-image':
            this.addToQueue(() => {
              this.addVisible(iten);
              if (iten.tagName === 'IMG' && !iten.complete) {
                return new Promise((resolve) => {
                  iten.onload = resolve;
                  iten.onerror = resolve;
                });
              }
            }, delayTime);
            break;

          case 'main-text':
            this.addToQueue(() => this.addVisibleFromLeft(iten), delayTime);
            delayTime += 80;
            break;

          case 'main-buttons':
            this.addToQueue(() => this.addVisible(iten), delayTime);
            break;

          case 'main-button-icon':
            this.addToQueue(() => this.addVisible(iten), delayTime);
            delayTime += 100;
            break;

          case 'main-comment':
            this.addToQueue(
              () => iten.classList.add('visible-from-right'),
              delayTime,
            );
            delayTime += 80;
            break;

          default:
            console.error(`Undefined Id: ${iten.id}`);
            break;
        }
      } else {
        console.log(`Out of viewport: ${entry.target.id}`);
      }
    });
  }

  addVisible(iten) {
    iten.classList.add('visible');
  }

  addVisibleFromLeft(iten) {
    iten.classList.add('visible-from-left');
  }

  startObserving() {
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          this.callback(entries, observer);
        },
        {
          rootMargin: '0px',
          threshold: 0.1,
        },
      );

      const elements = document.querySelectorAll('.looking-main');
      if (elements.length === 0) {
        console.error('No elements found with the class .looking-main');
      }

      elements.forEach((element) => {
        observer.observe(element);
      });
    }, 100);
  }
}

export default IntersectionObserverEffect;
