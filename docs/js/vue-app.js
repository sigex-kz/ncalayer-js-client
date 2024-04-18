new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    dataFile: '',
    signature: null,
    waiting: false,
  },

  methods: {
    async sign() {
      this.signature = null;
      this.waiting = true;

      const ncalayerClient = new NCALayerClient();

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
          NCALayerClient.basicsCMSParamsDetached,
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
