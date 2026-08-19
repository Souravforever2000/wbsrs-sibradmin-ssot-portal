export const environment = {
  production: false,
  apiUrl: '/api',
  // Keep the visual prototype usable before the SIBR API is deployed. Set this
  // to false in every deployed environment; feature services already expose the
  // REST contracts consumed by the real backend.
  useMockApi: true,
};
