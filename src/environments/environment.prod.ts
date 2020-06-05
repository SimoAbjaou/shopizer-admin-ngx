/**
 * @license
 */
export const environment = {
  production: true,
  googleApiKey: '',
  mode: 'MARKETPLACE',
  //apiUrl: 'http://aws-demo.shopizer.com:8080/api',
  apiUrl: 'http://localhost:8080/api',
  client: {
    language: {
      default: 'en',
      array: [
        'en',
        'es',
        'fr',
        'ru'
      ],
    },
  }
};
