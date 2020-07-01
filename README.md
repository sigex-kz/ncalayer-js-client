# ncalayer-js-client

[![Build Status](https://travis-ci.org/sigex-kz/ncalayer-js-client.svg?branch=master)](https://travis-ci.org/sigex-kz/ncalayer-js-client)

JS клиент для [NCALayer](https://pki.gov.kz/ncalayer/) стремящийся быть максимально простым в
использовании.

Разработан для веб интерфейса [https://sigex.kz](https://sigex.kz).

Документация по API: [API.md](API.md).

Документация по NCALayer доступна в составе [SDK НУЦ](https://pki.gov.kz/developers/),
либо на странице документации приложения [KAZTOKEN mobile](https://kaztoken.kz/mobile-docs/)
повторяющего API NCALayer.

## Использование

Одним из следующих образов:
- скопировать себе `ncalayer-client.js` и загрузить его на странице;
- `npm install ncalayer-js-client`.

## Пример использования

```js
async function connectAndSign() {
  const ncalayerClient = new NCALayerClient();

  try {
    await ncalayerClient.connect();
  } catch (error) {
    alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
    return;
  }

  let activeTokens;
  try {
    activeTokens = await ncalayerClient.getActiveTokens();
  } catch (error) {
    alert(error.toString());
    return;
  }

  // getActiveTokens может вернуть несколько типов хранилищ, для простоты проверим первый.
  // Иначе нужно просить пользователя выбрать тип носителя.
  const storageType = activeTokens[0] || NCALayerClient.fileStorageType;

  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncalayerClient.createCAdESFromBase64(storageType, 'MTEK');
  } catch (error) {
    alert(error.toString());
    return;
  }

  return base64EncodedSignature;
}
```

## Разработка

- `npm run lint` - проверка кода с помощью ESLint;
- `npm run test` - выполнение тестов;
- `npm run build-docs` - обновление документации из комментариев в коде;
- `npm run build` - все вышеперечисленное вместе, **рекомендуется выполнять перед коммитом**;
- `npm run test-data-builder` - запуск веб сервера на http://127.0.0.1:8080 со страницей подготовки данных для тестов.

### Подготовка данных для тестов

- запустить сервер публикующий страницу подготовки данных `npm run test-data-builder`;
- открыть [http://127.0.0.1:8080](http://127.0.0.1:8080);
- выполнить инструкции;
- проверить сформированные данные (в основном корректность формирования подписей);
- замаскировать в сформированных данных чувствительную информацию (подписи и сертификаты);
- записать сформированный блок данных в *test/test-data.json*.
