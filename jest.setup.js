require('@testing-library/jest-native/extend-expect');

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { server } = require('./src/mocks/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
