new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    dataFiles: [],
    signatures: [],
    waiting: false,
  },

  methods: {
    addDataFile() {
      this.dataFiles.push('');
    },

    async sign() {
      this.signatures.splice(0);
      this.waiting = true;

      const ncalayerClient = new NCALayerClient();

      try {
        await ncalayerClient.connect();
      } catch (error) {
        alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
        return;
      }

      const files = this.$refs.fileUploadInputs.map((fileUploadInput) => fileUploadInput.files[0]);
      try {
        const signatures = await ncalayerClient.basicsSignCMS(
          NCALayerClient.basicsStorageAll,
          files,
          NCALayerClient.basicsCMSParamsDetachedNoTSP,
          NCALayerClient.basicsSignerSignAny,
        );
        this.waiting = false;

        for (const signature of signatures) {
          this.signatures.push(signature);
        }
      } catch (error) {
        if (error.canceledByUser) {
          alert('Действие отменено пользователем.');
        }

        alert(error.toString());
        return;
      }
    },
  },

  mounted() {
    this.addDataFile();
  },
});
