const prod = window.location.href.includes('app.bosmetrics.com');
const dev = {
  backEnd: '/api',
  backEndStripe: 'https://app.bosmetrics.com',
  production: false,
};

const _prod = {
  backEnd: 'https://back.app.bosmetrics.com/api',
  backEndStripe: 'https://app.bosmetrics.com',
  production: true,
};

export const environment = prod ? _prod : dev;
