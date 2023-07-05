const qrcode = require("qrcode");
const { db } = require("../settings/setting");
module.exports = class qr {
  constructor(qr_code) {
    this.code = qr_code;
  }
  async generateQR(lec_id) {
    const qrRef = db.collection("Qr").doc(lec_id);
    const doc = await qrRef.get();
    console.log(doc.data());
    if (doc.exists) {
      console.log("I am here");
      const code = doc.data().qr_code;
      const url = await qrcode.toDataURL(code);
      return { code, url };
    } else {
      const qrCode = {
        lecture_id: lec_id,
        qr_code: this.code,
        date: new Date().toISOString().slice(0, 10),
      };
      const code = this.code;
      const url = await qrcode.toDataURL(this.code);

      await qrRef.set(qrCode);
      return { code, url };
    }
  }
};
