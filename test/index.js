const assert = require('assert').strict;

const WebSocket = require('ws');

const { NCALayerClient } = require('../ncalayer-client.js');

const testData = require('./test-data.json');

let testDataEntry;
function nextTestDataEntry() {
  testDataEntry = testData.shift();
}

// Эмулятор NCALayer
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    assert.strictEqual(message, testDataEntry.request);
    ws.send(testDataEntry.response);
  });

  if (!testDataEntry.request) {
    ws.send(testDataEntry.response);
  }
});

// Клиентский код
(async () => {
  try {
    const ncalayerClient = new NCALayerClient('ws://127.0.0.1:8080');

    nextTestDataEntry();
    while (testDataEntry) {
      const task = JSON.parse(testDataEntry.task);
      console.log(task); // eslint-disable-line no-console

      let result;
      try {
        // eslint-disable-next-line no-await-in-loop
        result = await ncalayerClient[task.exec](...task.params);
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
})();
