module.exports = {
  files: [
    {
      fileId: "1GUmSDRtfrPMisnCyJeXsAO1i4fMb_z61Dae045RWDC4",
      type: "sheet",
      name: "data",
      dataDir: "src/data/",
    },
  ],
  /**
   * The dataMutators option makes it possible to modify what's returned by
   * the data fetchers. This is a good place to restructure the raw data, or
   * to do joins with other data you may have.
   */
  dataMutators: {
    data(originalData) {
      originalData.description = originalData.data.reduce((obj, item) => {
        obj[item.department] = item.description;
        return obj;
      }, {});
      return originalData;
    },
  },

  /**
   * `createAPI` makes it possible to bake out a series of JSON files that get
   * deployed with your project. This is a great way to break up data that users
   * only need a small slice of based on choices they make. The toolkit expects
   * this to return an array of objects. Each object should have a "key" and
   * a "value" - the "key" determines the URL, the "value" is what is saved at
   * that URL.
   */
  apis: [],
};
