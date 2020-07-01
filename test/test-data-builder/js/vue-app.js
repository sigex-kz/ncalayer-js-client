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
        result = await this.ncalayerClient[this.task.exec](...this.task.params);
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
