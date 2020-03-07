var qs = require("querystring");
const fetch = require("node-fetch");
const chalk = require("chalk");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
console.log("==================================================");
console.log(
  "Kode Kurir :\n------------\njne    | pos      | tiki\nwahana | jnt      | rpx\nsap    | sicepat  | pcp\njet    | dse      | first\nninja  | lion     | idl\nrex    | anteraja"
);
console.log("==================================================");
readline.question("Silahkan Input Kode Kurir (Ex. sicepat) => ", kurir => {
  readline.question("Silahkan Input Resi => ", resi => {
    var options = {
      method: "POST",
      body: qs.stringify({ waybill: `${resi}`, courier: `${kurir}` }),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    };
    //waybill : 000366912345 & 000366895881
    console.log("==================================================");
    console.log("==================================================");
    const ayo = () =>
      new Promise((resolve, reject) => {
        fetch("https://api.econxn.id/v1/couriers/waybill/", options)
          .then(res => res.json())
          .then(json => {
            if (
              json.status.description ==
              "Invalid waybill. Resi yang Anda masukkan salah atau belum terdaftar."
            ) {
              console.log(
                chalk.yellow(
                  "\nNomor Resi Tidak Bisa Di Track\natau Kurir Yang Anda Pilih Salah"
                )
              );
            } else if (json.status.description == "Data is incomplete.") {
              console.log(chalk.red("\nData Tidak Valid/Lengkap"));
            } else if (json.status.code == 429) {
              console.log(
                chalk.red("\nMAAF SERVER SUDAH MENCAPAI LIMIT HARIAN")
              );
            } else {
              console.log(
                "RESI | KURIR (LAYANAN) : " +
                  json.result.summary.waybill_number +
                  " | " +
                  json.result.summary.courier_name +
                  " (" +
                  json.result.summary.service_code +
                  ")"
              );
              console.log(
                "PENGIRIM (ASAL) : " +
                  json.result.summary.shipper_name +
                  " (" +
                  json.result.summary.origin +
                  ")"
              );
              console.log(
                "PENERIMA (TUJUAN) : " +
                  json.result.summary.receiver_name +
                  " (" +
                  json.result.summary.destination +
                  ")"
              );
              if (
                json.result.summary.status == "DELIVERED" ||
                json.result.summary.status == "TERKIRIM"
              ) {
                console.log(
                  chalk.green("STATUS : " + json.result.summary.status)
                );
              } else {
                console.log(
                  chalk.yellow("STATUS : " + json.result.summary.status)
                );
              }
              let n = Object.keys(json.result.manifest).length;
              if (n <= 1) {
                console.log(
                  "TGL PENGIRIMAN : " + chalk.yellow("BELUM TERSEDIA")
                );
              } else {
                console.log(
                  "TGL PENGIRIMAN : " +
                    json.result.manifest[1].manifest_date +
                    " " +
                    json.result.manifest[1].manifest_time
                );
              }
              console.log("==================================================");
              console.log("HISTORI : ");
              for (let i = 0; i <= n - 1; i++) {
                console.log(
                  json.result.manifest[i].manifest_date +
                    " " +
                    json.result.manifest[i].manifest_time +
                    " - " +
                    json.result.manifest[i].manifest_description
                );
              }
              console.log("==================================================");
              /*while (true) {
                console.log(json.result.manifest.manifest_code);
            }*/
            }
          })
          .catch(err => reject(err));
      });

    (async () => {
      const mulai = await ayo();
      console.log(mulai);
    })();
    readline.close();
  });
});
