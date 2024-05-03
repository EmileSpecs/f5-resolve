import _ from 'underscore';

/**
 * Interpolates a template string with the given data.
 * 
 * @param {string | object} template - The template string or object.
 * @param {object} data - The data to interpolate.
 * 
 * @returns {any} - The interpolated object.
 */
export const interpolate = (template: any, data: any): any => {
  if (typeof template !== 'string') {
    template = JSON.stringify(template);
  }

  const compiled = _.template(template, {
    interpolate: /\$\{(.+?)\}/g
  });

  const result = compiled(data);

  return JSON.parse(result);
}