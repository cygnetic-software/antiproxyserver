const qrcode = require("qrcode");

const { connection } = require("../settings/setting");
module.exports = class qr {
  constructor(qr_code) {
    this.code = qr_code;
  }
  generateQR(data, lec_id, res) {
    qrcode.toDataURL(this.code, (err, url) => {
      const sql = "INSERT INTO Qr SET ?";
      const qrCode = {
        lecture_id: lec_id,
        qr_code: this.code,
        date: new Date().toISOString().slice(0, 10),
      };
      connection.query(sql, qrCode, (error, results) => {
        if (error) {
          throw error;
        }
        console.log("Data inserted into qr_codes table");
        res.status(200).json({ data: data, qrcode: url, code: this.code });
      });
    });
  }
};
