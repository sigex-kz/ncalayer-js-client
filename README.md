# ncalayer-js-client

JS клиент для [NCALayer](https://ncl.pki.gov.kz/) стремящийся быть максимально простым в
использовании.

**Поддерживает новый модуль kz.gov.pki.knca.basics (https://github.com/pkigovkz/sdkinfo/wiki/KNCA-Basics-Module), пример использования приведен ниже в этом файле.**

**Поддерживает [HTTP API KAZTOKEN mobile/desktop](https://kaztoken.kz/products/kaztoken-desktop/#%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-api-%D0%BC%D1%83%D0%BB%D1%8C%D1%82%D0%B8%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-sigex).**
Поддержка реализована в функции `basicsSignCMS` - в том случае, если в конструкторе не запрещено использовать HTTP API (`allowKmdHttpApi`)
и библиотека определила что доступен HTTP API KAZTOKEN mobile/desktop, будет использован он, так как он позволяет подписывать документы
значительно большего размера чем WebSocket API NCALayer и KAZTOKEN mobile/desktop.

Разработан для веб интерфейса [https://sigex.kz](https://sigex.kz).

Документация по API: [https://sigex-kz.github.io/ncalayer-js-client/](https://sigex-kz.github.io/ncalayer-js-client/api/).

Документация по NCALayer доступна в составе [SDK НУЦ](https://pki.gov.kz/developers/),
либо на странице документации приложения [KAZTOKEN mobile](https://kaztoken.kz/mobile-docs/)
повторяющего API NCALayer.

Демо: [https://sigex-kz.github.io/ncalayer-js-client/](https://sigex-kz.github.io/ncalayer-js-client/).

Демо мультиподписания: [https://sigex-kz.github.io/ncalayer-js-client/multisign.html](https://sigex-kz.github.io/ncalayer-js-client/multisign.html).

Демо мультиподписания с использованием HTTP API KAZTOKEN desktop: [https://sigex-kz.github.io/ncalayer-js-client/kmdMultisign.html](https://sigex-kz.github.io/ncalayer-js-client/kmdMultisign.html).

## Использование

Одним из следующих образов:
- скопировать себе `ncalayer-client.js` и загрузить его на странице;
- `npm install ncalayer-js-client`.

## Пример использования нового модуля kz.gov.pki.knca.basics

```js
async function connectAndSign() {
  const ncalayerClient = new NCALayerClient();

  try {
    await ncalayerClient.connect();
  } catch (error) {
    alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
    return;
  }

  const documentInBase64 = 'MTEK';

  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncalayerClient.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      documentInBase64, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerSignAny,
    );
  } catch (error) {
    if (error.canceledByUser) {
      alert('Действие отменено пользователем.');
    }

    alert(error.toString());
    return;
  }

  return base64EncodedSignature;
}
```

## Пример мультиподписания с использованием KAZTOKEN mobile/desktop

```js
async function connectAndSign() {
  const ncalayerClient = new NCALayerClient();

  try {
    await ncalayerClient.connect();
  } catch (error) {
    alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
    return;
  }

  const documentsInBase64 = [
    'MTEK',
    'MTEK',
    'MTEK',
  ];

  // Функция мультиподписания доступна, значит можно передать массив документов
  // и получить массив подписей
  if (ncalayerClient.multisignAvailable) {
    let base64EncodedSignatures;
    try {
      base64EncodedSignatures = await ncalayerClient.basicsSignCMS(
        NCALayerClient.basicsStorageAll,
        documentsInBase64, // здесь поддерживаются Array<String | ArrayBuffer | Blob | File>, строки интерпретируются как Base64
        NCALayerClient.basicsCMSParamsDetached,
        NCALayerClient.basicsSignerSignAny,
      );
    } catch (error) {
      if (error.canceledByUser) {
        alert('Действие отменено пользователем.');
      }

      alert(error.toString());
      return;
    }

    return base64EncodedSignatures;
  }

  // Иначе подписываем документы по одному
  const base64EncodedSignatures = [];
  for (const documentInBase64 of documentsInBase64) {
    try {
      const base64EncodedSignature = await ncalayerClient.basicsSignCMS(
        NCALayerClient.basicsStorageAll,
        documentInBase64,
        NCALayerClient.basicsCMSParamsDetached,
        NCALayerClient.basicsSignerSignAny,
      );
      base64EncodedSignatures.push(base64EncodedSignature);
    } catch (error) {
      if (error.canceledByUser) {
        alert('Действие отменено пользователем.');
      }

      alert(error.toString());
      return;
    }

  }
  return base64EncodedSignatures;
}
```

## Пример использования функции мультиподписания через HTTP API KAZTOKEN mobile/desktop
**Важно:** для работы этого API необходимо чтобы сервер, со страницы которого осуществляются
вызовы, устанавливал в заголовке
[`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
значение `connect-src https://127.0.0.1:24680;` иначе браузер не будет передавать в HTTP запросах
к KAZTOKEN mobile/desktop куки `operationCookie` и вызовы будут возвращать `401 Unauthorized`.

```js
async function connectAndSign() {
  const ncalayerClient = new NCALayerClient();

  const documentsInBase64 = [
    'MTEK',
    'MTEK',
    'MTEK',
  ];

  const kmdMultisignAvailable = await ncalayerClient.kmdMultisignAvailable();
  if (!kmdMultisignAvailable) {
    alert('На данном компьютере не удалось обнаружить KAZTOKEN mobile/desktop с поддержкой HTTP API');
    return;
  }

  try {
    await ncalayerClient.startKmdMultisign(documentsInBase64.length, true, false);
  } catch (error) {
    alert(`Не удалось подключиться к KAZTOKEN mobile/desktop: ${error.toString()}`);
    return;
  }

  const signatures = [];
  try {
    for (const documentInBase64 of documentsInBase64) {
      const signature = await ncalayerClient.kmdMultisignNext(documentInBase64);
      this.signatures.push(signature);
    }
  } catch (error) {
    if (error.canceledByUser) {
      alert('Действие отменено пользователем.');
    }

    alert(error.toString());
    return;
  }

  return signatures;
}
```

## Пример использования старого модуля commonUtils

Использование этого модуля не рекомендуется, так как НУЦ не будет его развивать и рекомендует переходить на kz.gov.pki.knca.basics.

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

  const documentInBase64 = 'MTEK';

  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncalayerClient.createCAdESFromBase64(storageType, documentInBase64);
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
- `npm run ts-check` - проверка с помощью TypeScript;
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
