import { forEachComponent } from './each-component';

describe('forEachComponent', () => {
  test('regular', () => {
    const fakeLogger = global.createFakeLogger();
    const callback = jest.fn(() => {});
    const fakeOpenAPIFile = global.createFakeOpenAPIFile({
      components: {
        schemas: {
          TestComponent: {
            type: "string"
          }
        }
      },
    });

    forEachComponent(fakeOpenAPIFile, callback);

    expect(callback).toBeCalledTimes(1);
  });
});
