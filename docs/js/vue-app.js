new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    dataFile: '',
    signature: null,
    waiting: false,
    logo: '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',
  },

  methods: {
    async sign() {
      this.signature = null;
      this.waiting = true;

      const ncalayerClient = new NCALayerClient();
      ncalayerClient.setLogoForBasicsSign(this.logo);

      try {
        await ncalayerClient.connect();
      } catch (error) {
        alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
        return;
      }

      try {
        this.signature = await ncalayerClient.basicsSignCMS(
          NCALayerClient.basicsStorageAll,
          this.$refs.fileUploadInput.files[0],
          NCALayerClient.basicsCMSParamsDetachedNoTSP,
          NCALayerClient.basicsSignerSignAny,
        );
        this.waiting = false;
      } catch (error) {
        if (error.canceledByUser) {
          alert('Действие отменено пользователем.');
        }

        alert(error.toString());
        return;
      }
    },
  },
});
