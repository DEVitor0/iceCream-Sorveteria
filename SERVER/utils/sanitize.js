const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

/**
 * @param {string|object} data
 * @returns {string|object}
 */
const sanitize = (data) => {
  if (typeof data === 'string') {
    return domPurify.sanitize(data);
  }

  if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (typeof data[key] === 'string') {
        data[key] = domPurify.sanitize(data[key]);
      }
    }
  }

  return data;
};

module.exports = sanitize;
