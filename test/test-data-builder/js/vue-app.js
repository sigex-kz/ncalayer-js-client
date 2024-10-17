new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    ncalayerClient: new NCALayerClient(), // eslint-disable-line no-undef
    testData: '',
    results: [],
    task: null,
    doingTask: false,
    tasks: [
      // connect
      {
        text: 'Удостовреьтесь в том, что NCALayer запущен.',
        exec: 'connect',
        params: [],
      },

      // getActiveTokens
      {
        text: 'Отключите все апаратные носители (токены и карты).',
        exec: 'getActiveTokens',
        params: [],
      },
      {
        text: 'Подключите апаратный носитель (токен или карту).',
        exec: 'getActiveTokens',
        params: [],
      },

      // getKeyInfo
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'getKeyInfo',
        params: [],
      },
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'getKeyInfo',
        params: [1],
      },
      {
        text: 'NCALyer отобразит окно выбора сертификата, выберите любой.',
        exec: 'getKeyInfo',
        params: ['AKKaztokenStore'],
      },
      {
        text: 'NCALyer отобразит окно выбора сертификата, нажмите Отмена.',
        exec: 'getKeyInfo',
        params: ['AKKaztokenStore'],
      },

      // createCAdESFromBase64
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'createCAdESFromBase64',
        params: ['AKKaztokenStore', 'MTEK', 123],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'createCAdESFromBase64',
        params: ['AKKaztokenStore', 'MTEK', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты аутентификации, выберите любой.',
        exec: 'createCAdESFromBase64',
        params: ['AKKaztokenStore', 'MTEK', 'AUTHENTICATION'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, выберите любой RSA, запомните какой именно.',
        exec: 'createCAdESFromBase64',
        params: ['AKKaztokenStore', 'MTEK'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, выберите тот же, что и в предыдущий раз.',
        exec: 'createCAdESFromBase64',
        params: ['AKKaztokenStore', 'MTEK', 'SIGNATURE', true],
      },

      // createCAdESFromBase64Hash
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'createCAdESFromBase64Hash',
        params: ['AKKaztokenStore', 0, '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'createCAdESFromBase64Hash',
        params: ['AKKaztokenStore', 'MjVkNGYyYTg2ZGViNWUyNTc0YmIzMjEwYjY3YmIyNGZjYzRhZmIxOWY5M2E3YjY1YTA1N2RhYTg3NGE5ZDE4ZSAgLQo=', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты аутентификации, выберите любой.',
        exec: 'createCAdESFromBase64Hash',
        params: ['AKKaztokenStore', 'MjVkNGYyYTg2ZGViNWUyNTc0YmIzMjEwYjY3YmIyNGZjYzRhZmIxOWY5M2E3YjY1YTA1N2RhYTg3NGE5ZDE4ZSAgLQo=', 'AUTHENTICATION'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты подписи, выберите любой.',
        exec: 'createCAdESFromBase64Hash',
        params: ['AKKaztokenStore', 'MjVkNGYyYTg2ZGViNWUyNTc0YmIzMjEwYjY3YmIyNGZjYzRhZmIxOWY5M2E3YjY1YTA1N2RhYTg3NGE5ZDE4ZSAgLQo='],
      },

      // createCMSSignatureFromBase64
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'createCMSSignatureFromBase64',
        params: ['AKKaztokenStore', 'MTEK', [7, 7, 7]],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'createCMSSignatureFromBase64',
        params: ['AKKaztokenStore', 'MTEK', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты аутентификации, выберите любой.',
        exec: 'createCMSSignatureFromBase64',
        params: ['AKKaztokenStore', 'MTEK', 'AUTHENTICATION'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, выберите любой RSA, запомните какой именно.',
        exec: 'createCMSSignatureFromBase64',
        params: ['AKKaztokenStore', 'MTEK'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, выберите тот же, что и в предыдущий раз.',
        exec: 'createCMSSignatureFromBase64',
        params: ['AKKaztokenStore', 'MTEK', 'SIGNATURE', true],
      },

      // signXml
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'signXml',
        params: ['AKKaztokenStore', 555, '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'signXml',
        params: ['AKKaztokenStore', '<this>is not a valid XML', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'signXml',
        params: ['AKKaztokenStore', '<tag>data</tag>', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты аутентификации, выберите любой.',
        exec: 'signXml',
        params: ['AKKaztokenStore', '<tag>data</tag>', 'AUTHENTICATION'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты подписи, выберите любой.',
        exec: 'signXml',
        params: ['AKKaztokenStore', '<tag>data</tag>'],
      },

      // signXmls
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'signXmls',
        params: ['AKKaztokenStore', '<tag>data</tag>', '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'signXmls',
        params: ['AKKaztokenStore', ['<tag>data</tag>', '<tag>data</tag>'], '123'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты аутентификации, выберите любой.',
        exec: 'signXmls',
        params: ['AKKaztokenStore', ['<tag>data</tag>', '<tag>data</tag>'], 'AUTHENTICATION'],
      },
      {
        text: 'NCALyer отобразит окно выбора ключа для подписания блока данных, отобразятся сертификаты подписи, выберите любой.',
        exec: 'signXmls',
        params: ['AKKaztokenStore', ['<tag>data</tag>', '<tag>data</tag>']],
      },

      // changeLocale
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'changeLocale',
        params: [2],
      },
      {
        text: 'Мы сменим язык, визуально это никак не отобразится.',
        exec: 'changeLocale',
        params: ['en'],
      },
      {
        text: 'Мы сменим язык, визуально это никак не отобразится.',
        exec: 'changeLocale',
        params: ['kz'],
      },

      // basicsSignCMS
      {
        text: 'Попытка отправки плохого запроса, ничего не отобразится.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageAll', 'MTEK', 555, '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных, отобразятся все сертификаты, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageAll', 'MTEK', '!!basicsCMSParams', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных, отобразятся все сертификаты, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageAll', 'MTEK', '!!basicsCMSParams', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных, отобразятся аппаратные хранилища, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageHardware', 'MTEK', '!!basicsCMSParams', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных, отобразятся файловые хранилища, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStoragePKCS12', 'MTEK', '!!basicsCMSParams', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных и формирования подписи без данных, отобразятся хранилища KAZTOKEN, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsDetached', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание плохого хеша и формирования подписи без данных, отобразятся хранилища KAZTOKEN, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsDetachedHash', '!!basicsSignerSignAny'],
      },
      {
        text: 'Подписание хеша и формирования подписи без данных, отобразятся хранилища KAZTOKEN, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'iUHBHfnY84CsJalfIy/Km9/A90p6Ox7DgEexE5C44p8=', '!!basicsCMSParamsDetachedHash', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, сертификаты подписи, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerSignAny'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, сертификаты подписи, только юридические лица, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerSignOrg'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, сертификаты подписи, только руководители юридических лиц, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerSignHead'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, сертификаты аутентификации, только физические лица, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerAuthPerson'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся файловые хранилища, можно выбирать и тестовые и боевые, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStoragePKCS12', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerTestAny'],
      },
      {
        text: 'Подписание блока данных и формирования подписи с данными, отобразятся хранилища KAZTOKEN, можно выбирать и тестовые и боевые, НАЖМИТЕ ОТМЕНА.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageKAZTOKEN', 'MTEK', '!!basicsCMSParamsAttached', '!!basicsSignerTestAny'],
      },
      {
        text: 'Подписание XML, отобразятся хранилища KAZTOKEN, отобразятся хранилища KAZTOKEN, выберите любой.',
        exec: 'basicsSignXML',
        params: ['!!basicsStorageKAZTOKEN', '<tag>data</tag>', '!!basicsXMLParams', '!!basicsSignerAny'],
      },
      {
        text: 'Подписание нескольких блоков данных, отобразятся все сертификаты, выберите любой.',
        exec: 'basicsSignCMS',
        params: ['!!basicsStorageAll', ['MTEK', 'MTEK', 'MTEK'], '!!basicsCMSParams', '!!basicsSignerAny'],
      },
    ],
  },

  methods: {
    nextTask() {
      if (this.tasks.length === 0) {
        this.testData = JSON.stringify(this.results, null, 2);
        return;
      }

      this.task = this.tasks.shift();
    },

    async execTask() {
      this.doingTask = true;

      let request;
      this.ncalayerClient.onRequestReady = (newRequest) => {
        request = newRequest;
      };

      let response;
      this.ncalayerClient.onResponseReady = (newResponse) => {
        response = newResponse;
      };

      let result;
      try {
        const params = this.task.params.map((param) => {
          if (typeof param === 'string' && param.startsWith('!!')) {
            const attrName = param.replace('!!', '');
            return NCALayerClient[attrName]; // eslint-disable-line no-undef
          }

          return param;
        });

        result = await this.ncalayerClient[this.task.exec](...params);
      } catch (error) {
        result = error.toString();
      }

      this.results.push({
        task: JSON.stringify(this.task),
        request,
        response,
        result: (typeof result === 'string') ? result : JSON.stringify(result),
      });

      this.doingTask = false;

      this.nextTask();
    },
  },

  mounted() {
    this.nextTask();
  },
});
