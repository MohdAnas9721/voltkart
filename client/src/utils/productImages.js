import { imageFallback } from '../services/api';

const demoAssets = {
  houseWire: '/demo-products/house-wires.svg',
  flexibleWire: '/demo-products/flexible-wires.svg',
  cable: '/demo-products/multicore-wires.svg',
  armoured: '/demo-products/armoured-cables.svg',
  coaxial: '/demo-products/coaxial-cables.svg',
  control: '/demo-products/control-cables.svg',
  bulb: '/demo-products/led-bulbs.svg',
  flood: '/demo-products/flood-lights.svg',
  mcb: '/demo-products/mcb.svg',
  rccb: '/demo-products/rccb.svg',
  rcbo: '/demo-products/rcbo.svg',
  switch: '/demo-products/switches.svg',
  plate: '/demo-products/modular-plates.svg',
  fan: '/demo-products/ceiling-fans.svg',
  exhaust: '/demo-products/exhaust-fans.svg',
  extension: '/demo-products/extension-boards.svg',
  tool: '/demo-products/tools.svg',
  weather: '/demo-products/weatherproof-devices.svg',
  fallback: '/demo-products/electrical-placeholder.svg'
};

const resolveStyle = (product = {}) => {
  const value = [
    product.subcategory?.name,
    product.category?.name,
    product.name,
    product.specifications?.Type
  ].filter(Boolean).join(' ').toLowerCase();

  if (value.includes('house wire')) return demoAssets.houseWire;
  if (value.includes('flexible wire') || value.includes('flexible cable')) return demoAssets.flexibleWire;
  if (value.includes('armoured')) return demoAssets.armoured;
  if (value.includes('coaxial') || value.includes('rg6')) return demoAssets.coaxial;
  if (value.includes('control')) return demoAssets.control;
  if (value.includes('multicore') || value.includes('cable')) return demoAssets.cable;
  if (value.includes('bulb') || value.includes('panel') || value.includes('batten') || value.includes('downlight') || value.includes('strip')) return demoAssets.bulb;
  if (value.includes('flood') || value.includes('street')) return demoAssets.flood;
  if (value.includes('rcbo')) return demoAssets.rcbo;
  if (value.includes('rccb')) return demoAssets.rccb;
  if (value.includes('mcb') || value.includes('isolator') || value.includes('surge') || value.includes('protection')) return demoAssets.mcb;
  if (value.includes('plate') || value.includes('cover')) return demoAssets.plate;
  if (value.includes('switch') || value.includes('socket') || value.includes('dimmer')) return demoAssets.switch;
  if (value.includes('exhaust')) return demoAssets.exhaust;
  if (value.includes('fan')) return demoAssets.fan;
  if (value.includes('extension') || value.includes('spike') || value.includes('board')) return demoAssets.extension;
  if (value.includes('tool') || value.includes('tester') || value.includes('screwdriver') || value.includes('cutter') || value.includes('plier')) return demoAssets.tool;
  if (value.includes('weather') || value.includes('ip65') || value.includes('outdoor')) return demoAssets.weather;
  return demoAssets.fallback;
};

export const getDemoProductImage = (product = {}) => {
  return resolveStyle(product);
};

export const isDemoPlaceholder = (src = '') =>
  !src || src.includes('placehold.co') || src.includes('placeholder') || src === imageFallback;

export const getProductImage = (product = {}, index = 0) => {
  const src = product.images?.[index] || product.images?.[0];
  return isDemoPlaceholder(src) ? getDemoProductImage(product) : src;
};

export const getProductGallery = (product = {}) => {
  const images = product.images?.length ? product.images : [imageFallback, imageFallback, imageFallback];
  return images.map((src) => (isDemoPlaceholder(src) ? getDemoProductImage(product) : src));
};
