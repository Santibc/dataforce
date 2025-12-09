const prod = window.location.href.includes('app.bosmetrics.com');
const dev = {
  backEnd: 'https://dataforce-back.vadiun.net/api',
  backEndStripe: 'https://dataforce-back.vadiun.net',
  production: false,
};

const _prod = {
  backEnd: 'https://back.bosmetrics.com/api',
  backEndStripe: 'https://back.bosmetrics.com',
  production: true,
};

export const environment = prod ? _prod : dev;
