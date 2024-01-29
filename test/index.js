const assert = require('assert').strict;

const WebSocket = require('ws');

const { NCALayerClient } = require('../ncalayer-client');

const testData = require('./test-data.json');

let testDataEntry;
function nextTestDataEntry() {
  testDataEntry = testData.shift();
}

// Эмулятор NCALayer
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  if (testDataEntry.initMessage) {
    ws.send(testDataEntry.initMessage);
  }

  ws.on('message', (message) => {
    assert.strictEqual(message.toString(), testDataEntry.request);
    ws.send(testDataEntry.response);
  });
});

// Клиентский код
(async () => {
  try {
    const ncalayerClient = new NCALayerClient('ws://127.0.0.1:8080');

    nextTestDataEntry();
    while (testDataEntry) {
      const task = JSON.parse(testDataEntry.task);
      console.log(task); // eslint-disable-line no-console

      const params = task.params.map((param) => {
        if (typeof param === 'string' && param.startsWith('!!')) {
          const attrName = param.replace('!!', '');
          return NCALayerClient[attrName]; // eslint-disable-line no-undef
        }

        return param;
      });

      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await ncalayerClient[task.exec](...params);
      } catch (error) {
        result = error.toString();
      }

      let expectedResult = testDataEntry.result;
      try {
        const parsedResult = JSON.parse(expectedResult);
        // Следствие непродуманного подхода к хранению результата в тестовых данных.
        if (typeof parsedResult !== 'undefined' && typeof parsedResult !== 'number') {
          expectedResult = parsedResult;
        }
      } catch (error) {
        // В случае ошибки сохранится ожидаемый результат в не обработанном виде
      }

      assert.deepStrictEqual(result, expectedResult);

      nextTestDataEntry();
    }
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  wss.close();
  for (const ws of wss.clients) { // eslint-disable-line no-restricted-syntax
    ws.terminate();
  }
})();
