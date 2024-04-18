new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    dataFiles: [],
    currentlySigning: "",
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
        await ncalayerClient.startKmdMultisign(this.$refs.fileUploadInputs.length, false, false);
      } catch (error) {
        alert(`Не удалось подключиться к KAZTOKEN mobile/desktop: ${error.toString()}`);
        return;
      }

      try {
        for (const fileUploadInput of this.$refs.fileUploadInputs) {
          const file = fileUploadInput.files[0];
          this.currentlySigning = file.name;
          const signature = await ncalayerClient.kmdMultisignNext(file);
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
