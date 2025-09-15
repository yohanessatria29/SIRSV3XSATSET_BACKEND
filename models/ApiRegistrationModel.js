import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";
import { sendEmail } from "../middleware/SmtpMail.js";
import { apiKeyDevelopment } from "./ApiKeyDevelopmentModel.js";
import { emailVerificationToken } from "./EmailVerificationTokenModel.js";

export const apiRegistration = databaseSIRS.define(
  "api_registration",
  {
    rs_id: {
      type: DataTypes.STRING,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
    },
    email_pendaftaran: {
      type: DataTypes.STRING,
    },
    nama_aplikasi: {
      type: DataTypes.STRING,
    },
    tujuan_penggunaan: {
      type: DataTypes.TEXT,
    },
    link_permohonan: {
      type: DataTypes.TEXT,
    },
    no_telp: {
      type: DataTypes.STRING,
    },
    status_verifikasi: {
      type: DataTypes.ENUM('pending','verified','expired'),
    },
    status_pendaftaran: {
      type: DataTypes.ENUM('pending','approved','rejected'),
    },
    catatan: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    modified_at: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

// apiRegistration.hasOne(apiKeyDevelopment, {
//   foreignKey: "registration_id",
// });

apiRegistration.hasMany(emailVerificationToken, {
  foreignKey: "registration_id",
});


// apiRegistration.hasOne(apiKeyDevelopment, {
//   foreignKey: "registration_id",
// });

// apiKeyDevelopment.belongsTo(apiRegistration, {
//   foreignKey: "registration_id",
// });

// emailVerificationToken.belongsTo(apiRegistration, {
//   foreignKey: "registration_id",
// });


export const insert= async(data, callback) => {


  const columnsRegistration = Object.keys(data.registration);                   
  const placeholdersRegistration = columnsRegistration.map(() => '?').join(', ');     
  const valuesRegistration = Object.values(data.registration); 
  
  const columnsEmailVerifToken = ['registration_id', ...Object.keys(data.emailVerifToken)];
  const placeholdersEmailVerifToken = columnsEmailVerifToken.map(() => '?').join(', ');
  let valuesEmailVerifToken = Object.values(data.emailVerifToken);    
  const transaction = await databaseSIRS.transaction()

  // console.log("anbjat ",data)

  try{

      const sqlInsertUser = `INSERT INTO api_registration (${columnsRegistration.join(', ')}) VALUES (${placeholdersRegistration})`
      
      const insertDataRegistration = await databaseSIRS.query(sqlInsertUser, {
          type: QueryTypes.INSERT,
          replacements: valuesRegistration,
          transaction: transaction
      })

      valuesEmailVerifToken = [insertDataRegistration[0], ...valuesEmailVerifToken]

          const sqlInsertEmailVerifToken = `INSERT INTO email_verification_token (${columnsEmailVerifToken.join(', ')}) VALUES (${placeholdersEmailVerifToken})`

          const insertEmailVerifToken = await databaseSIRS.query(sqlInsertEmailVerifToken, {
              type: QueryTypes.INSERT,
              replacements:valuesEmailVerifToken,
              transaction: transaction
          })
      const sendEmailResult = await sendEmail(data.emailDetail)
      // console.log('Email sent successfully:', sendEmailResult)

      await transaction.commit()
      console.log('Transaction committed successfully.');
      callback(null, insertDataRegistration[0])
  } catch (error) {
      // console.log("apa ",error)
      await transaction.rollback()
      callback(error, null)
  }
}

export const review= async(data, callback) => {


  const columnsRegistration = Object.keys(data.registration);                   
  const placeholdersRegistration = columnsRegistration.map(() => '?').join(', ');     
  const valuesRegistration = Object.values(data.registration); 
  
  const columnsEmailVerifToken = ['registration_id', ...Object.keys(data.emailVerifToken)];
  const placeholdersEmailVerifToken = columnsEmailVerifToken.map(() => '?').join(', ');
  let valuesEmailVerifToken = Object.values(data.emailVerifToken);    
  const transaction = await databaseSIRS.transaction()

  // console.log("anbjat ",data)

  try{

      const sqlInsertUser = `INSERT INTO api_registration (${columnsRegistration.join(', ')}) VALUES (${placeholdersRegistration})`
      
      const insertDataRegistration = await databaseSIRS.query(sqlInsertUser, {
          type: QueryTypes.INSERT,
          replacements: valuesRegistration,
          transaction: transaction
      })

      valuesEmailVerifToken = [insertDataRegistration[0], ...valuesEmailVerifToken]

          const sqlInsertEmailVerifToken = `INSERT INTO email_verification_token (${columnsEmailVerifToken.join(', ')}) VALUES (${placeholdersEmailVerifToken})`

          const insertEmailVerifToken = await databaseSIRS.query(sqlInsertEmailVerifToken, {
              type: QueryTypes.INSERT,
              replacements:valuesEmailVerifToken,
              transaction: transaction
          })
      const sendEmailResult = await sendEmail(data.emailDetail)
      console.log('Email sent successfully:', sendEmailResult)

      await transaction.commit()
      console.log('Transaction committed successfully.');
      callback(null, insertDataRegistration[0])
  } catch (error) {
      // console.log("apa ",error)
      await transaction.rollback()
      callback(error, null)
  }
}


export const get = async(data, callback) => {

  const sqlSelect = " SELECT "+ 
    " users.nama, "+ 
    " api_registration.rs_id, "+ 
    " api_registration.id as registration_id, api_registration.nama_lengkap, "+ 
    " api_registration.email_pendaftaran, api_registration.no_telp, api_registration.nama_aplikasi, "+ 
    " api_registration.link_permohonan, api_registration.status_verifikasi, "+ 
    " api_registration.status_pendaftaran, api_registration.tujuan_penggunaan, "+ 
    " api_registration.catatan as catatan_registration, api_registration.created_at as waktu_daftar, "+ 
    " email_verification_token.id as email_verification_token_id, "+ 
    " api_key_development.id as api_key_development_id, "+ 
    " api_key_development.api_key as api_key_dev, api_key_development.api_secret as api_secret_dev, "+ 

    " der.id as api_production_request_id, "+ 
    " der.link_bukti_development, der.`status`, "+ 
    " der.alasan_penolakan as catatan_req_prod, der.created_at as waktu_daftar_prod, "+ 


    " api_key_production.id as api_key_production_id, api_key_production.api_key, api_key_production.api_secret "

    const sqlFrom = " FROM api_registration "+ 
    " LEFT JOIN email_verification_token ON api_registration.id = email_verification_token.registration_id "+ 
    " LEFT JOIN api_key_development ON api_registration.id = api_key_development.registration_id "+ 

    " LEFT JOIN (SELECT * FROM api_production_request ORDER BY created_at DESC) AS der ON api_key_development.id = der.api_key_development_id "+ 

    " LEFT JOIN api_key_production ON der.id = api_key_production.id "+ 
    " INNER JOIN users ON users.satker_id = api_registration.rs_id "+
    " GROUP BY api_registration.email_pendaftaran "

    const sqlOrder = " ORDER BY api_registration.created_at DESC, der.created_at desc "

      
    const filter = [];
    const sqlFilterValue = [];

    // const provinsiId = req.query.provinsiId || null;
    // const kabKotaId = req.query.kabKotaId || null;
    // const jenis = req.query.jenis || null;
    // const nama = req.query.nama || null;

    // if (provinsiId != null) {
    //   filter.push("data_klinik.id_prov = ?");
    //   sqlFilterValue.push(provinsiId);
    // }

    // if (kabKotaId != null) {
    //   filter.push("data_klinik.id_kota = ?");
    //   sqlFilterValue.push(kabKotaId);
    // }

    // if (jenis != null) {
    //   filter.push("data_klinik.jenis_klinik = ?");
    //   sqlFilterValue.push(jenis);
    // }

    // if (nama != null) {
    //   filter.push("data_klinik.nama_klinik like ?");
    //   sqlFilterValue.push("%".concat(nama).concat("%"));
    // }

    let sqlFilter = "";

    if (filter.length == 0) {
      sqlFilter =''
    } else {
      filter.forEach((value, index) => {
        if (index == 0) {
          sqlFilter = sqlWhere.concat(value);
        } else if (index > 0) {
          sqlFilter = sqlFilter.concat(" and ").concat(value);
        }
      });
    }
    const sql = sqlSelect
    .concat(sqlFrom)
    // .concat(sqlFilter)
    .concat(sqlOrder)

    databaseSIRS.query(sql, {
          type: QueryTypes.SELECT,
          replacements: sqlFilterValue,
        }).then(
              (res) => {
                callback(null, res);
              },
              (error) => {
                throw error;
              }
            )
        .catch((error) => {
          callback(error, null);
        });

}