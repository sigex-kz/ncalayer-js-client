// @ts-check

((exports, WebSocket, window) => { // eslint-disable-line max-classes-per-file
  /**
   * Класс ошибок NCALayerError.
   */
  class NCALayerError extends Error {
    /**
     * Конструктор.
     *
     * @param {String} message описание ошибки.
     * @param {Boolean} [canceledByUser] была ли операция отменена пользователем.
     */
    constructor(message, canceledByUser) {
      super(message);
      this.name = 'NCALayerError';
      this.canceledByUser = canceledByUser;
    }
  }

  /**
   * Класс клиента NCALayer.
   */
  class NCALayerClient {
    /**
     * Конструктор.
     *
     * @param {String} [url = 'wss://127.0.0.1:13579'] опциональный URL для подключения к NCALayer.
     * @param {Boolean} [allowKmdHttpApi = true] допустимо ли использовать HTTP API
     * KAZTOKEN mobile/desktop
     * (https://kaztoken.kz/products/kaztoken-desktop/#%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-api-%D0%BC%D1%83%D0%BB%D1%8C%D1%82%D0%B8%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-sigex),
     * этот API работает в поточном режиме и позволяет подписывать документы очень больших размеров.
     * На данный момент реализована поддержка этого API только в функции `basicsSignCMS`.
     */
    constructor(url = 'wss://127.0.0.1:13579', allowKmdHttpApi = true) {
      this.url = url;
      /** @type {WebSocket | null} */
      this.wsConnection = null;
      this.responseProcessed = false;
      this.isKmd = false; // Работаем с KAZTOKEN mobile/desktop?
      this.allowKmdHttpApi = allowKmdHttpApi;
      this.kmdHttpApiUrl = 'https://127.0.0.1:24680/';
      this.isKmdHttpApiAvailable = false; // Доступен ли HTTP API KAZTOKEN mobile/desktop?
      this.KmdHTTPAPIOperationId = null;
      this.KmdHTTPAPIOperationInBase64 = false;
      this.KmdHTTPAPIOperationTotal = 0;
      this.KmdHTTPAPIOperationProcessed = 0;
      /** @type {String} */
      this.basicsLogo = '';

      // Нужно ли просить пользователя разрешить Local Network Access?
      this.isBrowserLNAPermissionPendingOrDenied = false;

      // Используются для упрощения тестирования
      /** @type {?function(String): void} */
      this.onRequestReady = null;
      /** @type {?function(String): void} */
      this.onResponseReady = null;
    }

    /**
     * Подключиться к NCALayer.
     *
     * @param {Boolean} [useHttpFetchForNCALayerDetection = false] позволяет активировать режим
     * определения наличия NCALayer с помощью предвариетльного HTTP запроса и таким образом
     * избежать принудительных задержек вводимых браузерами в том случае, если JS пытается
     * обратиться к недоступному WebSocket серверу. Иначе говоря этот режим полезен тогда,
     * когда у пользователя отсутствует NCALayer и `connect()` вызывается с фронтенда часто,
     * без этого режима `connect()` может подвисать на секунды и даже минуты.
     *
     * @returns {Promise<String>} версию NCALayer.
     *
     * @throws NCALayerError
     */
    async connect(useHttpFetchForNCALayerDetection = false) {
      if (this.wsConnection) {
        throw new NCALayerError('Подключение уже выполнено.');
      }

      if (useHttpFetchForNCALayerDetection) {
        try {
          const probeUrl = this.url.replace(/^ws(s?):/, 'http$1:');
          await fetch(probeUrl, {
            mode: 'no-cors',
            cache: 'no-store',
            credentials: 'omit',
            signal: AbortSignal.timeout(1000),
          });
        } catch (err) {
          await this.checkBrowserLNAPermissionState();
          throw new NCALayerError('Ошибка взаимодействия с NCALayer. В том случае, если на вашем компьютере не установлен NCALayer, пожалуйста установите его c портала НУЦ РК (https://ncl.pki.gov.kz/). Если же NCALayer установлен, но портал выдает ошибку, свяжитесь, пожалуйста, с нашей технической поддержкой.');
        }
      }

      const wsConnection = new WebSocket(this.url);
      this.wsConnection = wsConnection;

      return new Promise((resolve, reject) => {
        this.responseProcessed = false;
        this.setHandlers(resolve, reject);

        wsConnection.onmessage = async (msg) => {
          if (this.responseProcessed) {
            return;
          }
          this.responseProcessed = true;

          if (this.onResponseReady) {
            this.onResponseReady(msg.data);
          }

          const response = JSON.parse(msg.data);

          if (!response.result || !response.result.version) {
            reject(new NCALayerError('Ошибка взаимодействия с NCALayer.'));
            return;
          }

          // Идентификация KAZTOKEN mobile/desktop
          try {
            const request = {
              module: 'kz.digiflow.mobile.extensions',
              method: 'getVersion',
            };

            this.sendRequest(request);

            await new Promise((resolveInner, rejectInner) => {
              this.setHandlers(resolveInner, rejectInner);
            });
            this.isKmd = true;
          } catch (err) {
            /* игнорируем */
          }

          // Идентификация KAZTOKEN mobile/desktop HTTP API
          (async () => {
            try {
              const httpResponse = await fetch(
                this.kmdHttpApiUrl,
                { signal: AbortSignal.timeout(1000) },
              );

              if (httpResponse.ok) {
                this.isKmdHttpApiAvailable = true;
              }
            } catch (err) {
              /* игнорируем */
            }
          })();

          resolve(response.result.version);
        };
      });
    }

    /**
     * Доступна ли функия мультиподписания (подписание нескольких документов одной операцией).
     */
    get multisignAvailable() { // eslint-disable-line class-methods-use-this
      // eslint отключен для обеспечения обратной совместимости,
      // так как раньше этот метод использовал `this`.
      return true;
    }

    /**
     * Состояние разрешения LNA (Local Network Access) в браузере,
     * фактическая проверка выполняется в connect().
     * Подробности https://wicg.github.io/local-network-access/.
     * Вернет `true` в том случае, если LNA заблокирован (`denied`)
     * или ожидает действия пользователя (`prompt`).
     * В этом случае стоит попросить пользователя разрешить LNA.
     */
    get browserLNAPermissionPendingOrDenied() {
      return this.isBrowserLNAPermissionPendingOrDenied;
    }

    //
    // Типы хранилищ
    //

    /**
     * KAZTOKEN
     */
    static get basicsStorageKAZTOKEN() {
      return ['AKKaztokenStore'];
    }

    /**
     * Удостоверение личности
     */
    static get basicsStorageIDCard() {
      return ['AKKZIDCardStore'];
    }

    /**
     * eToken 72k
     */
    static get basicsStorageEToken72k() {
      return ['AKEToken72KStore'];
    }

    /**
     * eToken 5110
     */
    static get basicsStorageEToken5110() {
      return ['AKEToken5110Store'];
    }

    /**
     * JaCarta
     */
    static get basicsStorageJaCarta() {
      return ['AKJaCartaStore'];
    }

    /**
     * aKey
     */
    static get basicsStorageAKey() {
      return ['AKAKEYStore'];
    }

    /**
     * Файловле хранилище PKCS#12
     */
    static get basicsStoragePKCS12() {
      return ['PKCS12'];
    }

    /**
     * Файловле хранилище JKS
     */
    static get basicsStorageJKS() {
      return ['JKS'];
    }

    /**
     * Любые хранилища.
     */
    static get basicsStorageAll() {
      return null;
    }

    /**
     * Только аппаратные хранилища.
     */
    static get basicsStorageHardware() {
      return [
        'AKKaztokenStore',
        'AKKZIDCardStore',
        'AKEToken72KStore',
        'AKEToken5110Store',
        'AKAKEYStore',
      ];
    }

    //
    // Параметры подписания
    //

    /**
     * Параметры подписания CMS.
     *
     * @typedef {Object} BasicsCMSSigningParams
     * @property {Boolean} [decode] следует ли декодировать подписываемые данные из Base64.
     * @property {Boolean} [encapsulate] следует ли встраивать подписываемые данные в подпись.
     * @property {Boolean} [digested] являются ли подписываемые данные хешем.
     * @property {Object} [tsaProfile] профиль метки времени, пустой объект для значений
     * по умолчанию.
     */

    /**
     * Параметры подписания для формирования CMS по умолчанию.
     */
    static get basicsCMSParams() {
      return {};
    }

    /**
     * Параметры подписания для формирования CMS без вложенных данных из данных в Base64.
     */
    static get basicsCMSParamsDetached() {
      return {
        decode: true,
        encapsulate: false,
        digested: false,
        tsaProfile: {},
      };
    }

    /**
     * Параметры подписания для формирования CMS без вложенных данных из данных в Base64.
     * Без метки времени.
     */
    static get basicsCMSParamsDetachedNoTSP() {
      return {
        decode: true,
        encapsulate: false,
        digested: false,
      };
    }

    /**
     * Параметры подписания для формирования CMS без вложенных данных из хеша данных в Base64.
     */
    static get basicsCMSParamsDetachedHash() {
      return {
        decode: true,
        encapsulate: false,
        digested: true,
        tsaProfile: {},
      };
    }

    /**
     * Параметры подписания для формирования CMS с вложенными данными из данных в Base64.
     */
    static get basicsCMSParamsAttached() {
      return {
        decode: true,
        encapsulate: true,
        digested: false,
        tsaProfile: {},
      };
    }

    /**
     * Параметры подписания для формирования XML по умолчанию.
     */
    static get basicsXMLParams() {
      return {};
    }

    //
    // Параметры выбора сертификата
    //

    /**
     * Любой сертификат выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAny() {
      return {
        extKeyUsageOids: [],
      };
    }

    /**
     * Любой сертификат для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignAny() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4'],
      };
    }

    /**
     * Сертификат физического лица для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignPerson() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4', '1.2.398.3.3.4.1.1'],
      };
    }

    /**
     * Сертификат любого сотрудника юридического лица для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignOrg() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4', '1.2.398.3.3.4.1.2'],
      };
    }

    /**
     * Сертификат руководителя юридического лица для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignHead() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4', '1.2.398.3.3.4.1.2.1'],
      };
    }

    /**
     * Сертификат лица с правом подписи юридического лица для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignTrusted() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4', '1.2.398.3.3.4.1.2.2'],
      };
    }

    /**
     * Сертификат сотрудника юридического лица для подписания выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerSignEmployee() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.4', '1.2.398.3.3.4.1.2.5'],
      };
    }

    /**
     * Любой сертификат для аутентификации выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAuthAny() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2'],
      };
    }

    /**
     * Сертификат физического лица для аутентификации выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAuthPerson() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2', '1.2.398.3.3.4.1.1'],
      };
    }

    /**
     * Сертификат любого сотрудника юридического лица для аутентификации выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAuthOrg() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2', '1.2.398.3.3.4.1.2'],
      };
    }

    /**
     * Сертификат руководителя юридического лица для аутентификации выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAuthHead() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2', '1.2.398.3.3.4.1.2.1'],
      };
    }

    /**
     * Сертификат лица с правом подписи юридического лица для аутентификации выпущенный боевым УЦ
     * НУЦ.
     */
    static get basicsSignerAuthRight() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2', '1.2.398.3.3.4.1.2.2'],
      };
    }

    /**
     * Сертификат сотрудника юридического лица для аутентификации выпущенный боевым УЦ НУЦ.
     */
    static get basicsSignerAuthEmployee() {
      return {
        extKeyUsageOids: ['1.3.6.1.5.5.7.3.2', '1.2.398.3.3.4.1.2.5'],
      };
    }

    /**
     * Любой сертификат выпущенный боевым или тестовым УЦ НУЦ.
     */
    static get basicsSignerTestAny() {
      return {
        extKeyUsageOids: [],
        chain: [],
      };
    }

    /**
     * Настроить логотип который будет отображаться окном приложения NCALayer.
     *
     * @param {String | ArrayBuffer | Blob | File} logo логотип для отображения NCALayer
     * в виде строки Base64, либо ArrayBuffer, Blob или File.
     */
    async setLogoForBasicsSign(logo) {
      this.basicsLogo = /** @type {String} */ (await NCALayerClient.normalizeDataToSign(logo));
    }

    /**
     * Аргументы функции sign модуля kz.gov.pki.knca.basics.
     *
     * @typedef {Object} BasicsSignArgs
     * @property {Array<String> | null} allowedStorages массив строк с константами допустимых
     * для использования типов хранилищ.
     * @property {String} format тип вычисляемой подписи: 'xml', либо 'cms'.
     * @property {String | Array<String>} data подписываемые данные.
     * @property {Object} signingParams параметры подписания.
     * @property {Object} signerParams параметры выбора сертификата для подписания.
     * @property {String} locale язык пользовательского интерфейса.
     * @property {String} [logo] логотип для отображения NCALayer в виде строки Base64.
     */

    /**
     * Вычислить подпись под данными с указанными параметрами. **Новая функция sign 2022 года из
     * модуля kz.gov.pki.knca.basics (https://github.com/pkigovkz/sdkinfo/wiki/KNCA-Basics-Module)**.
     * Сигнатура функции сложная, поэтому рекомендуем пользоваться функциями помощниками
     * basicsSignXLM и basicsSignCMS.
     *
     * @param {Array<String> | null} allowedStorages массив строк с константами допустимых
     * для использования типов хранилищ (см. константы basicsStorage*).
     *
     * @param {String} format тип вычисляемой подписи: 'xml', либо 'cms'.
     *
     * @param {String | Array<String>} data подписываемые данные.
     *
     * @param {Object} signingParams параметры подписания (см. basicsCMSParams* и basicsXMLParams*).
     *
     * @param {Object} signerParams параметры выбора сертификата для подписания (см. константы
     * basicsSigner*).
     *
     * @param {String} locale язык пользовательского интерфейса.
     *
     * @param {Boolean} forceSingleSignature возвращать только одну подпись даже если получили
     * массив, используется для обеспечения обратной совместимости работы с CMS.
     *
     * @returns {Promise<String | Array<String>>} подпись или массив подписей.
     *
     * @throws NCALayerError
     */
    async basicsSign(
      allowedStorages,
      format,
      data,
      signingParams,
      signerParams,
      locale,
      forceSingleSignature = false,
    ) {
      const request = {
        module: 'kz.gov.pki.knca.basics',
        method: 'sign',
        args: /** @type {BasicsSignArgs} */ ({
          allowedStorages,
          format,
          data,
          signingParams,
          signerParams,
          locale,
        }),
      };

      if (this.basicsLogo) {
        request.args.logo = this.basicsLogo;
      }

      this.sendRequest(request);

      return new Promise((resolve, reject) => {
        this.setHandlers(resolve, reject, forceSingleSignature);
      });
    }

    /**
     * Вычислить CMS подпись под данными с указанными параметрами, это функция-помощник для
     * упрощения работы с функцией basicsSign.
     *
     * В том случае, если библиотека смогла обнаружить HTTP API KAZTOKEN desktop на локальном
     * компьютере, она будет пробовать использовать его для подписания в том случае, если это
     * не было запрещено при вызове конструктора (параметр `allowKmdHttpApi`).
     *
     * @param {Array<String> | null} allowedStorages массив строк с константами допустимых
     * для использования типов хранилищ (см. константы basicsStorage*).
     *
     * @param {String | ArrayBuffer | Blob | File | Array<String | ArrayBuffer | Blob | File>} data
     * данные, которые нужно подписать, в виде строки Base64, либо ArrayBuffer, Blob или File.
     * Так же поддерживается массив документов.
     *
     * @param {BasicsCMSSigningParams} signingParams параметры подписания (см basicsCMSParams*).
     *
     * @param {Object} signerParams параметры выбора сертификата для подписания (см. константы
     * basicsSigner*).
     *
     * @param {String} [locale = 'ru'] язык пользовательского интерфейса.
     *
     * @returns {Promise<String | Array<String>>} подпись, либо массив подписей если на подписание
     * был передан массиов документов.
     *
     * @throws NCALayerError
     */
    async basicsSignCMS(allowedStorages, data, signingParams, signerParams, locale = 'ru') {
      const dataIsArray = Array.isArray(data);

      // Использование HTTP API KAZTOKEN mobile/desktop
      if (this.allowKmdHttpApi && this.isKmdHttpApiAvailable) {
        try {
          const documents = dataIsArray ? data : [data];
          const base64 = (typeof (documents[0]) === 'string');

          let response = await fetch(
            this.kmdHttpApiUrl,
            {
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              body: JSON.stringify({
                numberOfDocuments: documents.length,
                base64,
                encapsulateContent: signingParams.encapsulate,
              }),
            },
          );

          if (!response) {
            throw new NCALayerError('Ошибка взаимодействия с KAZTOKEN mobile/desktop.');
          }

          if (!response.ok) {
            if (response.status === 409) {
              throw new NCALayerError('Операция отменена пользователем', true);
            }
            throw new NCALayerError(`KAZTOKEN mobile/desktop вернул ошибку '${response.status}: ${response.statusText}'`);
          }

          const operationId = await response.text();

          const signatures = [];
          // eslint-disable-next-line no-restricted-syntax
          for (const document of documents) {
            // eslint-disable-next-line no-await-in-loop
            response = await fetch(
              `${this.kmdHttpApiUrl}${operationId}`,
              {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: document,
              },
            );

            if (!response) {
              throw new NCALayerError('Ошибка взаимодействия с KAZTOKEN mobile/desktop.');
            }

            if (!response.ok) {
              if (response.status === 401) {
                throw new NCALayerError('Операция отменена пользователем', true);
              }
              throw new NCALayerError(`KAZTOKEN mobile/desktop вернул ошибку '${response.status}: ${response.statusText}'`);
            }

            let signature = '';
            if (base64) {
              // eslint-disable-next-line no-await-in-loop
              signature = await response.text();
            } else {
              // eslint-disable-next-line no-await-in-loop
              const signatureBytes = await response.arrayBuffer();
              signature = NCALayerClient.arrayBufferToB64(signatureBytes);
            }

            signatures.push(signature);
          }

          return dataIsArray ? signatures : signatures[0];
        } catch (err) {
          throw new NCALayerError(`Ошибка взаимодействия с KAZTOKEN mobile/desktop: ${err}`);
        }
      }

      const forceSingleSignature = !dataIsArray;
      return this.basicsSign(
        allowedStorages,
        'cms',
        await NCALayerClient.normalizeDataToSign(data),
        signingParams,
        signerParams,
        locale,
        forceSingleSignature,
      );
    }

    /**
     * Вычислить XML подпись под данными с указанными параметрами, это функция-помощник для
     * упрощения работы с функцией basicsSign.
     *
     * @param {Array<String> | null} allowedStorages массив строк с константами допустимых
     * для использования типов хранилищ (см. константы basicsStorage*).
     *
     * @param {String | Array<String>} data подписываемые данные - строка (либо массив строк) XML.
     *
     * @param {Object} signingParams параметры подписания (см basicsXMLParams*).
     *
     * @param {Object} signerParams параметры выбора сертификата для подписания (см. константы
     * basicsSigner*).
     *
     * @param {String} [locale = 'ru'] язык пользовательского интерфейса.
     *
     * @returns {Promise<String | Array<String>>} подпись или массив подписей.
     *
     * @throws NCALayerError
     */
    async basicsSignXML(allowedStorages, data, signingParams, signerParams, locale = 'ru') {
      return this.basicsSign(
        allowedStorages,
        'xml',
        data,
        signingParams,
        signerParams,
        locale,
      );
    }

    /**
     * Проверить доступность функции мультиподписания через HTTP API KAZTOKEN mobile/desktop.
     *
     * @returns {Promise<Boolean>} доступна ли функция.
     */
    async kmdMultisignAvailable() {
      try {
        const httpResponse = await fetch(
          this.kmdHttpApiUrl,
          { signal: AbortSignal.timeout(1000) },
        );

        if (httpResponse.ok) {
          return true;
        }
      } catch (err) {
        /* игнорируем */
      }

      return false;
    }

    /**
     * Инициировать процедуру мультиподписания через HTTP API KAZTOKEN mobile/desktop.
     * Не требует предварительного вызова `connect()`.
     *
     * @param {Number} numberOfDocuments количество документов которые будут подписаны
     * в рамках процедуры мультиподписания.
     *
     * @param {Boolean} base64 будут ли данные передаваться в base64 или в бинарном виде.
     *
     * @param {Boolean} encapsulateContent следудует ли встраивать подписываемые данные в подписи
     * (не рекомендуется, так как в этом случае требуется значительно больше ОЗУ для обработки).
     *
     * @throws NCALayerError
     */
    async startKmdMultisign(numberOfDocuments, base64, encapsulateContent) {
      let response;
      try {
        response = await fetch(
          this.kmdHttpApiUrl,
          {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({
              numberOfDocuments,
              base64,
              encapsulateContent,
            }),
          },
        );
      } catch (err) {
        throw new NCALayerError(`Ошибка взаимодействия с KAZTOKEN mobile/desktop: ${err}`);
      }

      if (!response) {
        throw new NCALayerError('Ошибка взаимодействия с KAZTOKEN mobile/desktop');
      }

      if (!response.ok) {
        if (response.status === 409) {
          throw new NCALayerError('Операция отменена пользователем', true);
        }
        throw new NCALayerError(`KAZTOKEN mobile/desktop вернул ошибку '${response.status}: ${response.statusText}'`);
      }

      try {
        this.KmdHTTPAPIOperationId = await response.text();
        this.KmdHTTPAPIOperationInBase64 = base64;
        this.KmdHTTPAPIOperationTotal = numberOfDocuments;
        this.KmdHTTPAPIOperationProcessed = 0;
      } catch (err) {
        throw new NCALayerError(`Ошибка взаимодействия с KAZTOKEN mobile/desktop: ${err}`);
      }
    }

    /**
     * Вычислить CMS подпись под данными в рамках процедуры мультиподписания через HTTP API
     * KAZTOKEN mobile/desktop.
     *
     * Можно вызывать только после того как процедура была инициализирована с помощью
     * `StartKmdMultisign` и только для того количества документов, которое было
     * указано при инициализации.
     *
     * @param {String | ArrayBuffer | Blob | File} data
     * данные, которые нужно подписать, в виде строки Base64, либо ArrayBuffer, Blob или File.
     *
     * @returns {Promise<String>} подпись в base64.
     *
     * @throws NCALayerError
     */
    async kmdMultisignNext(data) {
      if (!this.KmdHTTPAPIOperationId) {
        throw new NCALayerError('Процедура мультиподписания не была инициализирована');
      }

      let response;
      try {
        response = await fetch(
          `${this.kmdHttpApiUrl}${this.KmdHTTPAPIOperationId}`,
          {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: data,
          },
        );
      } catch (err) {
        throw new NCALayerError(`Ошибка взаимодействия с KAZTOKEN mobile/desktop: ${err}`);
      }

      if (!response) {
        throw new NCALayerError('Ошибка взаимодействия с KAZTOKEN mobile/desktop');
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new NCALayerError('Операция отменена пользователем', true);
        }
        throw new NCALayerError(`KAZTOKEN mobile/desktop вернул ошибку '${response.status}: ${response.statusText}'`);
      }

      let signature = '';
      if (this.KmdHTTPAPIOperationInBase64) {
        signature = await response.text();
      } else {
        const signatureBytes = await response.arrayBuffer();
        signature = NCALayerClient.arrayBufferToB64(signatureBytes);
      }

      this.KmdHTTPAPIOperationProcessed += 1;
      if (this.KmdHTTPAPIOperationProcessed === this.KmdHTTPAPIOperationTotal) {
        this.KmdHTTPAPIOperationId = null;
        this.KmdHTTPAPIOperationProcessed = 0;
        this.KmdHTTPAPIOperationTotal = 0;
      }

      return signature;
    }

    /**
     * Получить список активных типов устройств.
     *
     * @returns {Promise<String[]>} массив содержащий типы хранилищ экземпляры которых доступны в
     * данный момент.
     *
     * @throws NCALayerError
     */
    async getActiveTokens() {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'getActiveTokens',
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Получить информацию об одной записи (ключевой паре с сертификатом).
     *
     * @param {String} storageType тип хранилища на экземплярах которого следует искать записи.
     *
     * @returns {Promise<Object>} объект с информацией о записи.
     *
     * @throws NCALayerError
     */
    async getKeyInfo(storageType) {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'getKeyInfo',
        args: [
          storageType,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Вычислить подпись под данными и сформировать CMS (CAdES).
     *
     * @param {String} storageType тип хранилища который следует использовать для подписания.
     *
     * @param {String | ArrayBuffer | Blob | File | Array<String | ArrayBuffer | Blob | File>} data
     * данные, которые нужно подписать, в виде строки Base64, либо ArrayBuffer, Blob или File.
     * Так же поддерживается массив строк Base64, ArrayBuffer, Blob или File, но это будет работать
     * только с приложениями KAZTOKEN mobile/desktop, NCALayer не умеет подписывать массив
     * документов.
     *
     * @param {String} [keyType = 'SIGNATURE'] каким типом ключа следует подписывать, поддерживаемые
     * варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать
     * любой доступный в хранилище ключа.
     *
     * @param {Boolean} [attach = false] следует ли включить в подпись подписываемые данные.
     *
     * @returns {Promise<String>} CMS подпись в виде Base64 строки.
     *
     * @throws NCALayerError
     */
    async createCAdESFromBase64(storageType, data, keyType = 'SIGNATURE', attach = false) {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'createCAdESFromBase64',
        args: [
          storageType,
          keyType,
          await NCALayerClient.normalizeDataToSign(data),
          attach,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Вычислить подпись под хешем данных и сформировать CMS (CAdES).
     *
     * @param {String} storageType тип хранилища который следует использовать для подписания.
     *
     * @param {String | ArrayBuffer | Blob | File | Array<String | ArrayBuffer | Blob | File>} hash
     * хеш данных в виде строки Base64, либо ArrayBuffer, Blob или File.
     * Так же поддерживается массив строк Base64, ArrayBuffer, Blob или File, но это будет работать
     * только с приложениями KAZTOKEN mobile/desktop, NCALayer не умеет подписывать массив
     * хешей.
     *
     * @param {String} [keyType = 'SIGNATURE'] каким типом ключа следует подписывать, поддерживаемые
     * варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать
     * любой доступный в хранилище ключа.
     *
     * @returns {Promise<String>} CMS подпись в виде Base64 строки.
     *
     * @throws NCALayerError
     */
    async createCAdESFromBase64Hash(storageType, hash, keyType = 'SIGNATURE') {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'createCAdESFromBase64Hash',
        args: [
          storageType,
          keyType,
          await NCALayerClient.normalizeDataToSign(hash),
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Подписать блок данных и сформировать CMS (CAdES) подпись с интегрированной меткой времени
     * TSP. **Не рекомендуется использовать, разработчики NCALayer пометили как DEPRECATED (https://forum.pki.gov.kz/t/podpis-s-metkoj-vremeni-na-js/704/7)!**
     *
     * @param {String} storageType тип хранилища который следует использовать для подписания.
     *
     * @param {String | ArrayBuffer | Blob | File | Array<String | ArrayBuffer | Blob | File>} data
     * данные, которые нужно подписать, в виде строки Base64, либо ArrayBuffer, Blob или File.
     * Так же поддерживается массив строк Base64, ArrayBuffer, Blob или File, но это будет работать
     * только с приложениями KAZTOKEN mobile/desktop, NCALayer не умеет подписывать массив
     * документов.
     *
     * @param {String} [keyType = 'SIGNATURE'] каким типом ключа следует подписывать, поддерживаемые
     * варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать
     * любой доступный в хранилище ключа.
     *
     * @param {Boolean} [attach = false] следует ли включить в подпись подписываемые данные.
     *
     * @returns {Promise<String>} CMS подпись в виде Base64 строки.
     *
     * @throws NCALayerError
     */
    async createCMSSignatureFromBase64(storageType, data, keyType = 'SIGNATURE', attach = false) {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'createCMSSignatureFromBase64',
        args: [
          storageType,
          keyType,
          await NCALayerClient.normalizeDataToSign(data),
          attach,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Вычислить подпись под документом в формате XML.
     *
     * @param {String} storageType тип хранилища который следует использовать для подписания.
     *
     * @param {String} xml XML данные которые нужно подписать.
     *
     * @param {String} [keyType = 'SIGNATURE'] каким типом ключа следует подписывать, поддерживаемые
     * варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать
     * любой доступный в хранилище ключа.
     *
     * @param {String} [tbsElementXPath = ''] путь к подписываемому узлу XML.
     *
     * @param {String} [signatureParentElementXPath = ''] путь к узлу в который необходимо добавить
     * сформированную подпись.
     *
     * @returns {Promise<String>} XML документ содержащий XMLDSIG подпись.
     *
     * @throws NCALayerError
     */
    async signXml(storageType, xml, keyType = 'SIGNATURE', tbsElementXPath = '', signatureParentElementXPath = '') {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'signXml',
        args: [
          storageType,
          keyType,
          xml,
          tbsElementXPath,
          signatureParentElementXPath,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Вычислить подпись под каждым из массива документов в формате XML.
     *
     * @param {String} storageType тип хранилища который следует использовать для подписания.
     *
     * @param {String[]} xmls массив XML данных которые нужно подписать.
     *
     * @param {String} [keyType = 'SIGNATURE'] каким типом ключа следует подписывать, поддерживаемые
     * варианты 'SIGNATURE' и 'AUTHENTICATION', иное значение позволит пользователю выбрать
     * любой доступный в хранилище ключа.
     *
     * @param {String} [tbsElementXPath = ''] путь к подписываемому узлу XML.
     *
     * @param {String} [signatureParentElementXPath = ''] путь к узлу в который необходимо добавить
     * сформированную подпись.
     *
     * @returns {Promise<String[]>} массив XML документов содержащих XMLDSIG подписи.
     *
     * @throws NCALayerError
     */
    async signXmls(storageType, xmls, keyType = 'SIGNATURE', tbsElementXPath = '', signatureParentElementXPath = '') {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'signXmls',
        args: [
          storageType,
          keyType,
          xmls,
          tbsElementXPath,
          signatureParentElementXPath,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Изменить язык интерфейса NCALayer.
     *
     * @param {String} localeId новый идентификатор языка.
     *
     * @throws NCALayerError
     */
    async changeLocale(localeId) {
      const request = {
        module: 'kz.gov.pki.knca.commonUtils',
        method: 'changeLocale',
        args: [
          localeId,
        ],
      };

      this.sendRequest(request);

      return new Promise((resolve, reject) => { this.setHandlers(resolve, reject); });
    }

    /**
     * Константа определяющая имя файлового хранилища.
     */
    static get fileStorageType() {
      return 'PKCS12';
    }

    /**
     * @param {Object} request запрос для отправки в NCALayer.
     */
    sendRequest(request) {
      if (!this.wsConnection) {
        throw new NCALayerError('Подключение к NCALayer не установлено.');
      }
      const { wsConnection } = this;

      const jsonRequest = JSON.stringify(request);
      if (this.onRequestReady) {
        this.onRequestReady(jsonRequest);
      }

      wsConnection.send(jsonRequest);
    }

    /**
     * @param {function(any): void} resolve функция для возврата результата операции.
     * @param {function(any): void} reject функция для возврата ошибки.
     * @param {Boolean} [forceSingleSignature] возвращать только одну подпись даже если получили
     * массив.
     */
    setHandlers(resolve, reject, forceSingleSignature) {
      if (!this.wsConnection) {
        throw new NCALayerError('Подключение к NCALayer не установлено.');
      }
      const { wsConnection } = this;

      this.responseProcessed = false;

      wsConnection.onerror = async () => {
        if (this.responseProcessed) {
          return;
        }
        this.responseProcessed = true;

        await this.checkBrowserLNAPermissionState();

        reject(new NCALayerError('Ошибка взаимодействия с NCALayer. В том случае, если на вашем компьютере не установлен NCALayer, пожалуйста установите его c портала НУЦ РК (https://ncl.pki.gov.kz/). Если же NCALayer установлен, но портал выдает ошибку, свяжитесь, пожалуйста, с нашей технической поддержкой.'));
      };

      wsConnection.onclose = () => {
        if (this.responseProcessed) {
          return;
        }
        this.responseProcessed = true;

        reject(new NCALayerError('NCALayer закрыл соединение.'));
      };

      wsConnection.onmessage = (msg) => {
        if (this.responseProcessed) {
          return;
        }
        this.responseProcessed = true;

        if (this.onResponseReady) {
          this.onResponseReady(msg.data);
        }

        const response = JSON.parse(msg.data);

        // basics response
        if (response.hasOwnProperty('status')) { // eslint-disable-line no-prototype-builtins
          if (!response.status) {
            reject(new NCALayerError(`${response.code}: ${response.message} (${response.details})`));
            return;
          }

          if (!response.body.hasOwnProperty('result')) { // eslint-disable-line no-prototype-builtins
            reject(new NCALayerError('cancelled by user', true));
            return;
          }

          let { result } = response.body;
          if (forceSingleSignature && Array.isArray(result)) {
            [result] = result;
          }
          resolve(result);
          return;
        }

        // commonUtils response
        if (response.code !== '200') {
          reject(new NCALayerError(`${response.code}: ${response.message}`));
          return;
        }

        resolve(response.responseObject);
      };
    }

    async checkBrowserLNAPermissionState() {
      // Проверка разрешения LNA в браузере
      try {
        const ln = await navigator.permissions.query({
          // @ts-ignore 'loopback-network' is not widespread
          name: 'loopback-network',
        });
        if (ln.state === 'prompt' || ln.state === 'denied') {
          this.isBrowserLNAPermissionPendingOrDenied = true;
        }
      } catch (errLN) {
        try {
          const lna = await navigator.permissions.query({
            // @ts-ignore 'local-network-access' is not widespread
            name: 'local-network-access',
          });
          if (lna.state === 'prompt' || lna.state === 'denied') {
            this.isBrowserLNAPermissionPendingOrDenied = true;
          }
        } catch (errLNA) {
          /* игнорируем */
        }
      }
    }

    /**
     * @param {ArrayBuffer} arrayBuffer данные для кодирования.
     * @returns {String} данные закодированные в Base64.
     */
    static arrayBufferToB64(arrayBuffer) {
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    /**
     * @param {String | ArrayBuffer | Blob | File | Array<String | ArrayBuffer | Blob | File>} data
     * данные для подписания.
     * @returns {Promise<String | Array<String>>} данные в виде строки Base64 (или массива строк).
     */
    static async normalizeDataToSign(data) {
      /** @param {String | ArrayBuffer | Blob | File} dataBlock */
      const normalizeDataBlock = async (dataBlock) => {
        if (typeof dataBlock === 'string') {
          return dataBlock;
        }

        if (dataBlock instanceof Blob) {
          return NCALayerClient.arrayBufferToB64(await dataBlock.arrayBuffer());
        }

        return NCALayerClient.arrayBufferToB64(dataBlock);
      };

      if (Array.isArray(data)) {
        return Promise.all(data.map(normalizeDataBlock));
      }

      return normalizeDataBlock(data);
    }
  }

  exports.NCALayerClient = NCALayerClient; // eslint-disable-line no-param-reassign
})(
  typeof exports === 'undefined' ? this : exports,
  typeof WebSocket === 'undefined' ? require('ws') : WebSocket,
  typeof window === 'undefined' ? { btoa: /** @type {function(String): String} */ ((x) => x) } : window // eslint-disable-line comma-dangle
); // Заглушка для NodeJS
