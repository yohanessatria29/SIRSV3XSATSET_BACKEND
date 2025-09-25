import { databaseSIRS } from "../config/Database.js";
import {
  rlEmpatTitikSatuHeader,
  rlEmpatTitikSatuDetail,
  // get42,
  // get43,
} from "../models/RLEmpatTitikSatuModel.js";
import Joi from "joi";
import joiDate from "@joi/date"
import { icd } from "../models/ICDModel.js";

export const getDataRLEmpatTitikSatu = (req, res) => {
  const joi = Joi.extend(joiDate) 
  const schema = joi.object({
    rsId: joi.string().required(),
    periode: joi.date().format("YYYY-MM").required(),
    page: joi.number(),
    limit: joi.number()
})
const { error, value } = schema.validate(req.query);
if (error) {
  res.status(404).send({
    status: false,
    message: error.details[0].message,
  });
  return;
}


let whereClause = {}
if(req.user.jenisUserId == 4){
  if(req.query.rsId != req.user.satKerId){
    res.status(404).send({
      status: false,
      message: "Kode RS Tidak Sesuai",
    });
    return;
  }
  whereClause = {
    rs_id: req.user.satKerId,
    periode: req.query.periode,
  }
}else{
  whereClause = {
    rs_id: req.query.rsId,
    periode: req.query.periode,
  }
}

rlEmpatTitikSatuDetail
    .findAll({
        include: {
          model: icd,
          attributes: ["icd_code", "description_code", "icd_code_group", "description_code_group"],
        },  
        where : whereClause,
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const getDataRLEmpatTitikSatuById = (req, res) => {
  rlEmpatTitikSatuDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: icd,
        attributes: ["icd_code", "description_code", "icd_code_group", "description_code_group"],
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const insertDataRLEmpatTitikSatu = async (req, res) => {
  const schema = Joi.object({
    // periode: Joi.date().required(),
    periodeBulan: Joi.number().greater(0).less(13).required(),
    periodeTahun: Joi.number().greater(2022).required(),
    icdId: Joi.number(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jmlhPasHidupMatiUmurGen01JamL: Joi.number(),
          jmlhPasHidupMatiUmurGen01JamP: Joi.number(),
          jmlhPasHidupMatiUmurGen123JamL: Joi.number(),
          jmlhPasHidupMatiUmurGen123JamP: Joi.number(),
          jmlhPasHidupMatiUmurGen17hrL: Joi.number(),
          jmlhPasHidupMatiUmurGen17hrP: Joi.number(),
          jmlhPasHidupMatiUmurGen828hrL: Joi.number(),
          jmlhPasHidupMatiUmurGen828hrP: Joi.number(),
          jmlhPasHidupMatiUmurGen29hr3blnL: Joi.number(),
          jmlhPasHidupMatiUmurGen29hr3blnP: Joi.number(),
          jmlhPasHidupMatiUmurGen36blnL: Joi.number(),
          jmlhPasHidupMatiUmurGen36blnP: Joi.number(),
          jmlhPasHidupMatiUmurGen611blnL: Joi.number(),
          jmlhPasHidupMatiUmurGen611blnP: Joi.number(),
          jmlhPasHidupMatiUmurGen14thL: Joi.number(),
          jmlhPasHidupMatiUmurGen14thP: Joi.number(),
          jmlhPasHidupMatiUmurGen59thL: Joi.number(),
          jmlhPasHidupMatiUmurGen59thP: Joi.number(),
          jmlhPasHidupMatiUmurGen1014thL: Joi.number(),
          jmlhPasHidupMatiUmurGen1014thP: Joi.number(),
          jmlhPasHidupMatiUmurGen1519thL: Joi.number(),
          jmlhPasHidupMatiUmurGen1519thP: Joi.number(),
          jmlhPasHidupMatiUmurGen2024thL: Joi.number(),
          jmlhPasHidupMatiUmurGen2024thP: Joi.number(),
          jmlhPasHidupMatiUmurGen2529thL: Joi.number(),
          jmlhPasHidupMatiUmurGen2529thP: Joi.number(),
          jmlhPasHidupMatiUmurGen3034thL: Joi.number(),
          jmlhPasHidupMatiUmurGen3034thP: Joi.number(),
          jmlhPasHidupMatiUmurGen3539thL: Joi.number(),
          jmlhPasHidupMatiUmurGen3539thP: Joi.number(),
          jmlhPasHidupMatiUmurGen4044thL: Joi.number(),
          jmlhPasHidupMatiUmurGen4044thP: Joi.number(),
          jmlhPasHidupMatiUmurGen4549thL: Joi.number(),
          jmlhPasHidupMatiUmurGen4549thP: Joi.number(),
          jmlhPasHidupMatiUmurGen5054thL: Joi.number(),
          jmlhPasHidupMatiUmurGen5054thP: Joi.number(),
          jmlhPasHidupMatiUmurGen5559thL: Joi.number(),
          jmlhPasHidupMatiUmurGen5559thP: Joi.number(),
          jmlhPasHidupMatiUmurGen6064thL: Joi.number(),
          jmlhPasHidupMatiUmurGen6064thP: Joi.number(),
          jmlhPasHidupMatiUmurGen6569thL: Joi.number(),
          jmlhPasHidupMatiUmurGen6569thP: Joi.number(),
          jmlhPasHidupMatiUmurGen7074thL: Joi.number(),
          jmlhPasHidupMatiUmurGen7074thP: Joi.number(),
          jmlhPasHidupMatiUmurGen7579thL: Joi.number(),
          jmlhPasHidupMatiUmurGen7579thP: Joi.number(),
          jmlhPasHidupMatiUmurGen8084thL: Joi.number(),
          jmlhPasHidupMatiUmurGen8084thP: Joi.number(),
          jmlhPasHidupMatiUmurGenLebih85thL: Joi.number(),
          jmlhPasHidupMatiUmurGenLebih85thP: Joi.number(),
          jmlhPasKeluarMatiGenL: Joi.number(),
          jmlhPasKeluarMatiGenP: Joi.number(),
        })
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  let transaction;
  try {
    const periode = String(req.body.periodeTahun)+"-"+String(req.body.periodeBulan)+"-1"
    transaction = await databaseSIRS.transaction();
    const resultInsertHeader = await rlEmpatTitikSatuHeader.create(
      {
        rs_id: req.user.satKerId,
        periode: periode,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
    
    let totalL = 
        value.jmlhPasHidupMatiUmurGen01JamL +
        value.jmlhPasHidupMatiUmurGen123JamL +
        value.jmlhPasHidupMatiUmurGen17hrL +
        value.jmlhPasHidupMatiUmurGen828hrL +
        value.jmlhPasHidupMatiUmurGen29hr3blnL +
        value.jmlhPasHidupMatiUmurGen36blnL +
        value.jmlhPasHidupMatiUmurGen611blnL +
        value.jmlhPasHidupMatiUmurGen14thL +
        value.jmlhPasHidupMatiUmurGen59thL +
        value.jmlhPasHidupMatiUmurGen1014thL +
        value.jmlhPasHidupMatiUmurGen1519thL +
        value.jmlhPasHidupMatiUmurGen2024thL +
        value.jmlhPasHidupMatiUmurGen2529thL +
        value.jmlhPasHidupMatiUmurGen3034thL +
        value.jmlhPasHidupMatiUmurGen3539thL +
        value.jmlhPasHidupMatiUmurGen4044thL +
        value.jmlhPasHidupMatiUmurGen4549thL +
        value.jmlhPasHidupMatiUmurGen5054thL +
        value.jmlhPasHidupMatiUmurGen5559thL +
        value.jmlhPasHidupMatiUmurGen6064thL +
        value.jmlhPasHidupMatiUmurGen6569thL +
        value.jmlhPasHidupMatiUmurGen7074thL +
        value.jmlhPasHidupMatiUmurGen7579thL +
        value.jmlhPasHidupMatiUmurGen8084thL +
        value.jmlhPasHidupMatiUmurGenLebih85thL 

      let totalP = 
        value.jmlhPasHidupMatiUmurGen01JamP +
        value.jmlhPasHidupMatiUmurGen123JamP +
        value.jmlhPasHidupMatiUmurGen17hrP +
        value.jmlhPasHidupMatiUmurGen828hrP +
        value.jmlhPasHidupMatiUmurGen29hr3blnP +
        value.jmlhPasHidupMatiUmurGen36blnP +
        value.jmlhPasHidupMatiUmurGen611blnP +
        value.jmlhPasHidupMatiUmurGen14thP +
        value.jmlhPasHidupMatiUmurGen59thP +
        value.jmlhPasHidupMatiUmurGen1014thP +
        value.jmlhPasHidupMatiUmurGen1519thP +
        value.jmlhPasHidupMatiUmurGen2024thP +
        value.jmlhPasHidupMatiUmurGen2529thP +
        value.jmlhPasHidupMatiUmurGen3034thP +
        value.jmlhPasHidupMatiUmurGen3539thP +
        value.jmlhPasHidupMatiUmurGen4044thP +
        value.jmlhPasHidupMatiUmurGen4549thP +
        value.jmlhPasHidupMatiUmurGen5054thP +
        value.jmlhPasHidupMatiUmurGen5559thP +
        value.jmlhPasHidupMatiUmurGen6064thP +
        value.jmlhPasHidupMatiUmurGen6569thP +
        value.jmlhPasHidupMatiUmurGen7074thP +
        value.jmlhPasHidupMatiUmurGen7579thP +
        value.jmlhPasHidupMatiUmurGen8084thP +
        value.jmlhPasHidupMatiUmurGenLebih85thP 


      let total = totalL + totalP

      let totalKeluar = value.jmlhPasKeluarMatiGenL + value.jmlhPasKeluarMatiGenP

      return {
        rl_empat_titik_satu_id: resultInsertHeader.id,
        rs_id: req.user.satKerId,
        periode: periode,
        icd_id: req.body.icdId,
        jmlh_pas_hidup_mati_umur_gen_0_1jam_l : value.jmlhPasHidupMatiUmurGen01JamL,
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p : value.jmlhPasHidupMatiUmurGen01JamP,
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l : value.jmlhPasHidupMatiUmurGen123JamL,
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p : value.jmlhPasHidupMatiUmurGen123JamP,
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l : value.jmlhPasHidupMatiUmurGen17hrL,
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p : value.jmlhPasHidupMatiUmurGen17hrP,
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l : value.jmlhPasHidupMatiUmurGen828hrL,
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p : value.jmlhPasHidupMatiUmurGen828hrP,
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l : value.jmlhPasHidupMatiUmurGen29hr3blnL,
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p : value.jmlhPasHidupMatiUmurGen29hr3blnP,
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l : value.jmlhPasHidupMatiUmurGen36blnL,
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p : value.jmlhPasHidupMatiUmurGen36blnP,
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l : value.jmlhPasHidupMatiUmurGen611blnL,
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p : value.jmlhPasHidupMatiUmurGen611blnP,
        jmlh_pas_hidup_mati_umur_gen_1_4th_l : value.jmlhPasHidupMatiUmurGen14thL,
        jmlh_pas_hidup_mati_umur_gen_1_4th_p : value.jmlhPasHidupMatiUmurGen14thP,
        jmlh_pas_hidup_mati_umur_gen_5_9th_l : value.jmlhPasHidupMatiUmurGen59thL,
        jmlh_pas_hidup_mati_umur_gen_5_9th_p : value.jmlhPasHidupMatiUmurGen59thP,
        jmlh_pas_hidup_mati_umur_gen_10_14th_l : value.jmlhPasHidupMatiUmurGen1014thL,
        jmlh_pas_hidup_mati_umur_gen_10_14th_p : value.jmlhPasHidupMatiUmurGen1014thP,
        jmlh_pas_hidup_mati_umur_gen_15_19th_l : value.jmlhPasHidupMatiUmurGen1519thL,
        jmlh_pas_hidup_mati_umur_gen_15_19th_p : value.jmlhPasHidupMatiUmurGen1519thP,
        jmlh_pas_hidup_mati_umur_gen_20_24th_l : value.jmlhPasHidupMatiUmurGen2024thL,
        jmlh_pas_hidup_mati_umur_gen_20_24th_p : value.jmlhPasHidupMatiUmurGen2024thP,
        jmlh_pas_hidup_mati_umur_gen_25_29th_l : value.jmlhPasHidupMatiUmurGen2529thL,
        jmlh_pas_hidup_mati_umur_gen_25_29th_p : value.jmlhPasHidupMatiUmurGen2529thP,
        jmlh_pas_hidup_mati_umur_gen_30_34th_l : value.jmlhPasHidupMatiUmurGen3034thL,
        jmlh_pas_hidup_mati_umur_gen_30_34th_p : value.jmlhPasHidupMatiUmurGen3034thP,
        jmlh_pas_hidup_mati_umur_gen_35_39th_l : value.jmlhPasHidupMatiUmurGen3539thL,
        jmlh_pas_hidup_mati_umur_gen_35_39th_p : value.jmlhPasHidupMatiUmurGen3539thP,
        jmlh_pas_hidup_mati_umur_gen_40_44th_l : value.jmlhPasHidupMatiUmurGen4044thL,
        jmlh_pas_hidup_mati_umur_gen_40_44th_p : value.jmlhPasHidupMatiUmurGen4044thP,
        jmlh_pas_hidup_mati_umur_gen_45_49th_l : value.jmlhPasHidupMatiUmurGen4549thL,
        jmlh_pas_hidup_mati_umur_gen_45_49th_p : value.jmlhPasHidupMatiUmurGen4549thP,
        jmlh_pas_hidup_mati_umur_gen_50_54th_l : value.jmlhPasHidupMatiUmurGen5054thL,
        jmlh_pas_hidup_mati_umur_gen_50_54th_p : value.jmlhPasHidupMatiUmurGen5054thP,
        jmlh_pas_hidup_mati_umur_gen_55_59th_l : value.jmlhPasHidupMatiUmurGen5559thL,
        jmlh_pas_hidup_mati_umur_gen_55_59th_p : value.jmlhPasHidupMatiUmurGen5559thP,
        jmlh_pas_hidup_mati_umur_gen_60_64th_l : value.jmlhPasHidupMatiUmurGen6064thL,
        jmlh_pas_hidup_mati_umur_gen_60_64th_p : value.jmlhPasHidupMatiUmurGen6064thP,
        jmlh_pas_hidup_mati_umur_gen_65_69th_l : value.jmlhPasHidupMatiUmurGen6569thL,
        jmlh_pas_hidup_mati_umur_gen_65_69th_p : value.jmlhPasHidupMatiUmurGen6569thP,
        jmlh_pas_hidup_mati_umur_gen_70_74th_l : value.jmlhPasHidupMatiUmurGen7074thL,
        jmlh_pas_hidup_mati_umur_gen_70_74th_p : value.jmlhPasHidupMatiUmurGen7074thP,
        jmlh_pas_hidup_mati_umur_gen_75_79th_l : value.jmlhPasHidupMatiUmurGen7579thL,
        jmlh_pas_hidup_mati_umur_gen_75_79th_p : value.jmlhPasHidupMatiUmurGen7579thP,
        jmlh_pas_hidup_mati_umur_gen_80_84th_l : value.jmlhPasHidupMatiUmurGen8084thL,
        jmlh_pas_hidup_mati_umur_gen_80_84th_p : value.jmlhPasHidupMatiUmurGen8084thP,
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l : value.jmlhPasHidupMatiUmurGenLebih85thL,
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p : value.jmlhPasHidupMatiUmurGenLebih85thP,
        jmlh_pas_hidup_mati_gen_l : totalL,
        jmlh_pas_hidup_mati_gen_p : totalP,
        total_pas_hidup_mati : total,
        jmlh_pas_keluar_mati_gen_l : value.jmlhPasKeluarMatiGenL,
        jmlh_pas_keluar_mati_gen_p : value.jmlhPasKeluarMatiGenP,
        total_pas_keluar_mati : totalKeluar,
        user_id : req.user.id,
      };
    });

    if (dataDetail[0].total_pas_keluar_mati > dataDetail[0].total_pas_hidup_mati) {
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    } else if (dataDetail[0].jmlh_pas_keluar_mati_gen_l > dataDetail[0].jmlh_pas_hidup_mati_gen_l){
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Laki-Laki Lebih Dari Jumlah Pasien Hidup/Mati Laki-Laki",
      });
    } else if (dataDetail[0].jmlh_pas_keluar_mati_gen_p > dataDetail[0].jmlh_pas_hidup_mati_gen_p){
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Perempuan Lebih Dari Jumlah Pasien Hidup/Mati Perempuan",
      });
    } else {
      const resultInsertDetail = await rlEmpatTitikSatuDetail.bulkCreate(dataDetail, {
        transaction,
        updateOnDuplicate: [
          "jmlh_pas_hidup_mati_umur_gen_0_1jam_l",
          "jmlh_pas_hidup_mati_umur_gen_0_1jam_p",
          "jmlh_pas_hidup_mati_umur_gen_1_23jam_l",
          "jmlh_pas_hidup_mati_umur_gen_1_23jam_p",
          "jmlh_pas_hidup_mati_umur_gen_1_7hr_l",
          "jmlh_pas_hidup_mati_umur_gen_1_7hr_p",
          "jmlh_pas_hidup_mati_umur_gen_8_28hr_l",
          "jmlh_pas_hidup_mati_umur_gen_8_28hr_p",
          "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l",
          "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p",
          "jmlh_pas_hidup_mati_umur_gen_3_6bln_l",
          "jmlh_pas_hidup_mati_umur_gen_3_6bln_p",
          "jmlh_pas_hidup_mati_umur_gen_6_11bln_l",
          "jmlh_pas_hidup_mati_umur_gen_6_11bln_p",
          "jmlh_pas_hidup_mati_umur_gen_1_4th_l",
          "jmlh_pas_hidup_mati_umur_gen_1_4th_p",
          "jmlh_pas_hidup_mati_umur_gen_5_9th_l",
          "jmlh_pas_hidup_mati_umur_gen_5_9th_p",
          "jmlh_pas_hidup_mati_umur_gen_10_14th_l",
          "jmlh_pas_hidup_mati_umur_gen_10_14th_p",
          "jmlh_pas_hidup_mati_umur_gen_15_19th_l",
          "jmlh_pas_hidup_mati_umur_gen_15_19th_p",
          "jmlh_pas_hidup_mati_umur_gen_20_24th_l",
          "jmlh_pas_hidup_mati_umur_gen_20_24th_p",
          "jmlh_pas_hidup_mati_umur_gen_25_29th_l",
          "jmlh_pas_hidup_mati_umur_gen_25_29th_p",
          "jmlh_pas_hidup_mati_umur_gen_30_34th_l",
          "jmlh_pas_hidup_mati_umur_gen_30_34th_p",
          "jmlh_pas_hidup_mati_umur_gen_35_39th_l",
          "jmlh_pas_hidup_mati_umur_gen_35_39th_p",
          "jmlh_pas_hidup_mati_umur_gen_40_44th_l",
          "jmlh_pas_hidup_mati_umur_gen_40_44th_p",
          "jmlh_pas_hidup_mati_umur_gen_45_49th_l",
          "jmlh_pas_hidup_mati_umur_gen_45_49th_p",
          "jmlh_pas_hidup_mati_umur_gen_50_54th_l",
          "jmlh_pas_hidup_mati_umur_gen_50_54th_p",
          "jmlh_pas_hidup_mati_umur_gen_55_59th_l",
          "jmlh_pas_hidup_mati_umur_gen_55_59th_p",
          "jmlh_pas_hidup_mati_umur_gen_60_64th_l",
          "jmlh_pas_hidup_mati_umur_gen_60_64th_p",
          "jmlh_pas_hidup_mati_umur_gen_65_69th_l",
          "jmlh_pas_hidup_mati_umur_gen_65_69th_p",
          "jmlh_pas_hidup_mati_umur_gen_70_74th_l",
          "jmlh_pas_hidup_mati_umur_gen_70_74th_p",
          "jmlh_pas_hidup_mati_umur_gen_75_79th_l",
          "jmlh_pas_hidup_mati_umur_gen_75_79th_p",
          "jmlh_pas_hidup_mati_umur_gen_80_84th_l",
          "jmlh_pas_hidup_mati_umur_gen_80_84th_p",
          "jmlh_pas_hidup_mati_umur_gen_lebih85th_l",
          "jmlh_pas_hidup_mati_umur_gen_lebih85th_p",
          "jmlh_pas_hidup_mati_gen_l",
          "jmlh_pas_hidup_mati_gen_p",
          "total_pas_hidup_mati",
          "jmlh_pas_keluar_mati_gen_l",
          "jmlh_pas_keluar_mati_gen_p",
          "total_pas_keluar_mati"
        ],
      });
      await transaction.commit();
      res.status(201).send({
        status: true,
        message: "data created",
        data: {
          id: resultInsertHeader.id,
        },
      })
    }
    // if (
    //   dataDetail[0].total_pas_keluar_mati <= dataDetail[0].total_pas_hidup_mati &&
    //   dataDetail[0].jmlh_pas_keluar_mati_gen_l <= dataDetail[0].jmlh_pas_hidup_mati_gen_l &&
    //   dataDetail[0].jmlh_pas_keluar_mati_gen_p <= dataDetail[0].jmlh_pas_hidup_mati_gen_p
      
    // ) {
    //   const resultInsertDetail = await rlEmpatTitikSatuDetail.bulkCreate(dataDetail, {
    //     transaction,
    //     updateOnDuplicate: [
    //       "jmlh_pas_hidup_mati_umur_gen_0_1jam_l",
    //       "jmlh_pas_hidup_mati_umur_gen_0_1jam_p",
    //       "jmlh_pas_hidup_mati_umur_gen_1_23jam_l",
    //       "jmlh_pas_hidup_mati_umur_gen_1_23jam_p",
    //       "jmlh_pas_hidup_mati_umur_gen_1_7hr_l",
    //       "jmlh_pas_hidup_mati_umur_gen_1_7hr_p",
    //       "jmlh_pas_hidup_mati_umur_gen_8_28hr_l",
    //       "jmlh_pas_hidup_mati_umur_gen_8_28hr_p",
    //       "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l",
    //       "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p",
    //       "jmlh_pas_hidup_mati_umur_gen_3_6bln_l",
    //       "jmlh_pas_hidup_mati_umur_gen_3_6bln_p",
    //       "jmlh_pas_hidup_mati_umur_gen_6_11bln_l",
    //       "jmlh_pas_hidup_mati_umur_gen_6_11bln_p",
    //       "jmlh_pas_hidup_mati_umur_gen_1_4th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_1_4th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_5_9th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_5_9th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_10_14th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_10_14th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_15_19th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_15_19th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_20_24th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_20_24th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_25_29th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_25_29th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_30_34th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_30_34th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_35_39th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_35_39th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_40_44th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_40_44th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_45_49th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_45_49th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_50_54th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_50_54th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_55_59th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_55_59th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_60_64th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_60_64th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_65_69th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_65_69th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_70_74th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_70_74th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_75_79th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_75_79th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_80_84th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_80_84th_p",
    //       "jmlh_pas_hidup_mati_umur_gen_lebih85th_l",
    //       "jmlh_pas_hidup_mati_umur_gen_lebih85th_p",
    //       "jmlh_pas_hidup_mati_gen_l",
    //       "jmlh_pas_hidup_mati_gen_p",
    //       "total_pas_hidup_mati",
    //       "jmlh_pas_keluar_mati_gen_l",
    //       "jmlh_pas_keluar_mati_gen_p",
    //       "total_pas_keluar_mati"
    //     ],
    //   });
    //   await transaction.commit();
    //   res.status(201).send({
    //     status: true,
    //     message: "data created",
    //     data: {
    //       id: resultInsertHeader.id,
    //     },
    //   });
    // } else {
    //   res.status(400).send({
    //     status: false,
    //     message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
    //   });
    //   await transaction.rollback();
    // }
  } catch (error) {
    if (transaction) {
      if (error.name == "SequelizeForeignKeyConstraintError") {

        res.status(400).send({
          status: false,
          message: "Gagal Input Data, Jenis Kegiatan Salah.",
        });
      } else {
	//console.log(error)
        res.status(400).send({
          status: false,
          message: "Gagal Input Data.",
        });
      }
      await transaction.rollback();
    }
  }
};

export const updateDataRLEmpatTitikSatu = async (req, res) => {
  const schema = Joi.object({
    jmlh_pas_hidup_mati_umur_gen_0_1jam_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_0_1jam_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_23jam_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_23jam_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_7hr_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_7hr_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_8_28hr_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_8_28hr_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_3_6bln_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_3_6bln_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_6_11bln_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_6_11bln_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_4th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_1_4th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_5_9th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_5_9th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_10_14th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_10_14th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_15_19th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_15_19th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_20_24th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_20_24th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_25_29th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_25_29th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_30_34th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_30_34th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_35_39th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_35_39th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_40_44th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_40_44th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_45_49th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_45_49th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_50_54th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_50_54th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_55_59th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_55_59th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_60_64th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_60_64th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_65_69th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_65_69th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_70_74th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_70_74th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_75_79th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_75_79th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_80_84th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_80_84th_p: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_lebih85th_l: Joi.number().min(0),
          jmlh_pas_hidup_mati_umur_gen_lebih85th_p: Joi.number().min(0),
          jmlh_pas_keluar_mati_gen_l: Joi.number().min(0),
          jmlh_pas_keluar_mati_gen_p: Joi.number().min(0),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  let transaction;
  try {
    let jumlahL = req.body.jmlh_pas_hidup_mati_umur_gen_0_1jam_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_23jam_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_7hr_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_8_28hr_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_3_6bln_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_6_11bln_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_4th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_5_9th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_10_14th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_15_19th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_20_24th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_25_29th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_30_34th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_35_39th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_40_44th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_45_49th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_50_54th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_55_59th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_60_64th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_65_69th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_70_74th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_75_79th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_80_84th_l +
    req.body.jmlh_pas_hidup_mati_umur_gen_lebih85th_l

    let jumlahP =req.body.jmlh_pas_hidup_mati_umur_gen_0_1jam_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_23jam_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_7hr_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_8_28hr_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_3_6bln_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_6_11bln_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_1_4th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_5_9th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_10_14th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_15_19th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_20_24th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_25_29th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_30_34th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_35_39th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_40_44th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_45_49th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_50_54th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_55_59th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_60_64th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_65_69th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_70_74th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_75_79th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_80_84th_p +
    req.body.jmlh_pas_hidup_mati_umur_gen_lebih85th_p 

    let jumlahall = jumlahL + jumlahP;
    let totalKeluar = req.body.jmlh_pas_keluar_mati_gen_l + req.body.jmlh_pas_keluar_mati_gen_p

    const dataUpdate = {
      jmlh_pas_hidup_mati_umur_gen_0_1jam_l : req.body.jmlh_pas_hidup_mati_umur_gen_0_1jam_l,
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p : req.body.jmlh_pas_hidup_mati_umur_gen_0_1jam_p,
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l : req.body.jmlh_pas_hidup_mati_umur_gen_1_23jam_l,
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p : req.body.jmlh_pas_hidup_mati_umur_gen_1_23jam_p,
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l : req.body.jmlh_pas_hidup_mati_umur_gen_1_7hr_l,
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p : req.body.jmlh_pas_hidup_mati_umur_gen_1_7hr_p,
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l : req.body.jmlh_pas_hidup_mati_umur_gen_8_28hr_l,
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p : req.body.jmlh_pas_hidup_mati_umur_gen_8_28hr_p,
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l : req.body.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l,
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p : req.body.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p,
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l : req.body.jmlh_pas_hidup_mati_umur_gen_3_6bln_l,
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p : req.body.jmlh_pas_hidup_mati_umur_gen_3_6bln_p,
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l : req.body.jmlh_pas_hidup_mati_umur_gen_6_11bln_l,
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p : req.body.jmlh_pas_hidup_mati_umur_gen_6_11bln_p,
        jmlh_pas_hidup_mati_umur_gen_1_4th_l : req.body.jmlh_pas_hidup_mati_umur_gen_1_4th_l,
        jmlh_pas_hidup_mati_umur_gen_1_4th_p : req.body.jmlh_pas_hidup_mati_umur_gen_1_4th_p,
        jmlh_pas_hidup_mati_umur_gen_5_9th_l : req.body.jmlh_pas_hidup_mati_umur_gen_5_9th_l,
        jmlh_pas_hidup_mati_umur_gen_5_9th_p : req.body.jmlh_pas_hidup_mati_umur_gen_5_9th_p,
        jmlh_pas_hidup_mati_umur_gen_10_14th_l : req.body.jmlh_pas_hidup_mati_umur_gen_10_14th_l,
        jmlh_pas_hidup_mati_umur_gen_10_14th_p : req.body.jmlh_pas_hidup_mati_umur_gen_10_14th_p,
        jmlh_pas_hidup_mati_umur_gen_15_19th_l : req.body.jmlh_pas_hidup_mati_umur_gen_15_19th_l,
        jmlh_pas_hidup_mati_umur_gen_15_19th_p : req.body.jmlh_pas_hidup_mati_umur_gen_15_19th_p,
        jmlh_pas_hidup_mati_umur_gen_20_24th_l : req.body.jmlh_pas_hidup_mati_umur_gen_20_24th_l,
        jmlh_pas_hidup_mati_umur_gen_20_24th_p : req.body.jmlh_pas_hidup_mati_umur_gen_20_24th_p,
        jmlh_pas_hidup_mati_umur_gen_25_29th_l : req.body.jmlh_pas_hidup_mati_umur_gen_25_29th_l,
        jmlh_pas_hidup_mati_umur_gen_25_29th_p : req.body.jmlh_pas_hidup_mati_umur_gen_25_29th_p,
        jmlh_pas_hidup_mati_umur_gen_30_34th_l : req.body.jmlh_pas_hidup_mati_umur_gen_30_34th_l,
        jmlh_pas_hidup_mati_umur_gen_30_34th_p : req.body.jmlh_pas_hidup_mati_umur_gen_30_34th_p,
        jmlh_pas_hidup_mati_umur_gen_35_39th_l : req.body.jmlh_pas_hidup_mati_umur_gen_35_39th_l,
        jmlh_pas_hidup_mati_umur_gen_35_39th_p : req.body.jmlh_pas_hidup_mati_umur_gen_35_39th_p,
        jmlh_pas_hidup_mati_umur_gen_40_44th_l : req.body.jmlh_pas_hidup_mati_umur_gen_40_44th_l,
        jmlh_pas_hidup_mati_umur_gen_40_44th_p : req.body.jmlh_pas_hidup_mati_umur_gen_40_44th_p,
        jmlh_pas_hidup_mati_umur_gen_45_49th_l : req.body.jmlh_pas_hidup_mati_umur_gen_45_49th_l,
        jmlh_pas_hidup_mati_umur_gen_45_49th_p : req.body.jmlh_pas_hidup_mati_umur_gen_45_49th_p,
        jmlh_pas_hidup_mati_umur_gen_50_54th_l : req.body.jmlh_pas_hidup_mati_umur_gen_50_54th_l,
        jmlh_pas_hidup_mati_umur_gen_50_54th_p : req.body.jmlh_pas_hidup_mati_umur_gen_50_54th_p,
        jmlh_pas_hidup_mati_umur_gen_55_59th_l : req.body.jmlh_pas_hidup_mati_umur_gen_55_59th_l,
        jmlh_pas_hidup_mati_umur_gen_55_59th_p : req.body.jmlh_pas_hidup_mati_umur_gen_55_59th_p,
        jmlh_pas_hidup_mati_umur_gen_60_64th_l : req.body.jmlh_pas_hidup_mati_umur_gen_60_64th_l,
        jmlh_pas_hidup_mati_umur_gen_60_64th_p : req.body.jmlh_pas_hidup_mati_umur_gen_60_64th_p,
        jmlh_pas_hidup_mati_umur_gen_65_69th_l : req.body.jmlh_pas_hidup_mati_umur_gen_65_69th_l,
        jmlh_pas_hidup_mati_umur_gen_65_69th_p : req.body.jmlh_pas_hidup_mati_umur_gen_65_69th_p,
        jmlh_pas_hidup_mati_umur_gen_70_74th_l : req.body.jmlh_pas_hidup_mati_umur_gen_70_74th_l,
        jmlh_pas_hidup_mati_umur_gen_70_74th_p : req.body.jmlh_pas_hidup_mati_umur_gen_70_74th_p,
        jmlh_pas_hidup_mati_umur_gen_75_79th_l : req.body.jmlh_pas_hidup_mati_umur_gen_75_79th_l,
        jmlh_pas_hidup_mati_umur_gen_75_79th_p : req.body.jmlh_pas_hidup_mati_umur_gen_75_79th_p,
        jmlh_pas_hidup_mati_umur_gen_80_84th_l : req.body.jmlh_pas_hidup_mati_umur_gen_80_84th_l,
        jmlh_pas_hidup_mati_umur_gen_80_84th_p : req.body.jmlh_pas_hidup_mati_umur_gen_80_84th_p,
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l : req.body.jmlh_pas_hidup_mati_umur_gen_lebih85th_l,
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p : req.body.jmlh_pas_hidup_mati_umur_gen_lebih85th_p,
        jmlh_pas_hidup_mati_gen_l : jumlahL,
        jmlh_pas_hidup_mati_gen_p : jumlahP,
        total_pas_hidup_mati : jumlahall,
        jmlh_pas_keluar_mati_gen_l : req.body.jmlh_pas_keluar_mati_gen_l,
        jmlh_pas_keluar_mati_gen_p : req.body.jmlh_pas_keluar_mati_gen_p,
        total_pas_keluar_mati : totalKeluar,
    };
    transaction = await databaseSIRS.transaction();
    if (totalKeluar<=jumlahall) {
     const update = await rlEmpatTitikSatuDetail.update(dataUpdate, {
        where: {
          id: req.params.id, 
          rs_id : req.user.satKerId
        },
      });
      if (update[0] != 0) {
        await transaction.commit();
        res.status(201).send({
          status: true,
          message: "Data Diperbaharui",
        });
      } else {
        await transaction.rollback();
        res.status(400).send({
          status: false,
          message: "Data Tidak Berhasil di Ubah",
        });
      }
    } else {
      await transaction.rollback();
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    }
  } catch (error) {
    await transaction.rollback();
    res.status(400).send({
      status: false,
      message: error,
    });
  }
};

export const deleteDataRLEmpatTitikSatu = async (req, res) => {
  let transaction;
  try {
    transaction = await databaseSIRS.transaction();
    const count = await rlEmpatTitikSatuDetail.destroy({
      where: {
        id: req.params.id, rs_id : req.user.satKerId
      },
    });
    if (count != 0) {
      await transaction.commit();
      res.status(201).send({
        status: true,
        message: "Data Berhasil di Hapus",
        data: {
          deleted_rows: count,
        },
      });
    } else {
      await transaction.rollback();
      res.status(404).send({
        status: false,
        message: "Data Tidak Berhasil di Hapus",
      });
    }
  } catch (error) {
    await transaction.rollback();
    res.status(404).send({
      status: false,
      message: error,
    });
  }
};


export const getDataRLEmpatTitikSatuExternal = (req, res) => {

  // let whereClause = {}

  //   if(req.query.rsId != req.user.satKerId){
  //     res.status(404).send({
  //       status: false,
  //       message: "Kode RS Tidak Sesuai",
  //     });
  //     return;
  //   }
  const whereClause = {
    rs_id: req.user.satKerId,
    periode: req.query.periode,
  }

  rlEmpatTitikSatuDetail
    .findAll({
      include: {
        model: icd,
        attributes: ["id", "icd_code", "description_code", "icd_code_group", "description_code_group"],
      },
      attributes: ["id", "periode", "jmlh_pas_hidup_mati_umur_gen_0_1jam_l",
        "jmlh_pas_hidup_mati_umur_gen_0_1jam_p",
        "jmlh_pas_hidup_mati_umur_gen_1_23jam_l",
        "jmlh_pas_hidup_mati_umur_gen_1_23jam_p",
        "jmlh_pas_hidup_mati_umur_gen_1_7hr_l",
        "jmlh_pas_hidup_mati_umur_gen_1_7hr_p",
        "jmlh_pas_hidup_mati_umur_gen_8_28hr_l",
        "jmlh_pas_hidup_mati_umur_gen_8_28hr_p",
        "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l",
        "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p",
        "jmlh_pas_hidup_mati_umur_gen_3_6bln_l",
        "jmlh_pas_hidup_mati_umur_gen_3_6bln_p",
        "jmlh_pas_hidup_mati_umur_gen_6_11bln_l",
        "jmlh_pas_hidup_mati_umur_gen_6_11bln_p",
        "jmlh_pas_hidup_mati_umur_gen_1_4th_l",
        "jmlh_pas_hidup_mati_umur_gen_1_4th_p",
        "jmlh_pas_hidup_mati_umur_gen_5_9th_l",
        "jmlh_pas_hidup_mati_umur_gen_5_9th_p",
        "jmlh_pas_hidup_mati_umur_gen_10_14th_l",
        "jmlh_pas_hidup_mati_umur_gen_10_14th_p",
        "jmlh_pas_hidup_mati_umur_gen_15_19th_l",
        "jmlh_pas_hidup_mati_umur_gen_15_19th_p",
        "jmlh_pas_hidup_mati_umur_gen_20_24th_l",
        "jmlh_pas_hidup_mati_umur_gen_20_24th_p",
        "jmlh_pas_hidup_mati_umur_gen_25_29th_l",
        "jmlh_pas_hidup_mati_umur_gen_25_29th_p",
        "jmlh_pas_hidup_mati_umur_gen_30_34th_l",
        "jmlh_pas_hidup_mati_umur_gen_30_34th_p",
        "jmlh_pas_hidup_mati_umur_gen_35_39th_l",
        "jmlh_pas_hidup_mati_umur_gen_35_39th_p",
        "jmlh_pas_hidup_mati_umur_gen_40_44th_l",
        "jmlh_pas_hidup_mati_umur_gen_40_44th_p",
        "jmlh_pas_hidup_mati_umur_gen_45_49th_l",
        "jmlh_pas_hidup_mati_umur_gen_45_49th_p",
        "jmlh_pas_hidup_mati_umur_gen_50_54th_l",
        "jmlh_pas_hidup_mati_umur_gen_50_54th_p",
        "jmlh_pas_hidup_mati_umur_gen_55_59th_l",
        "jmlh_pas_hidup_mati_umur_gen_55_59th_p",
        "jmlh_pas_hidup_mati_umur_gen_60_64th_l",
        "jmlh_pas_hidup_mati_umur_gen_60_64th_p",
        "jmlh_pas_hidup_mati_umur_gen_65_69th_l",
        "jmlh_pas_hidup_mati_umur_gen_65_69th_p",
        "jmlh_pas_hidup_mati_umur_gen_70_74th_l",
        "jmlh_pas_hidup_mati_umur_gen_70_74th_p",
        "jmlh_pas_hidup_mati_umur_gen_75_79th_l",
        "jmlh_pas_hidup_mati_umur_gen_75_79th_p",
        "jmlh_pas_hidup_mati_umur_gen_80_84th_l",
        "jmlh_pas_hidup_mati_umur_gen_80_84th_p",
        "jmlh_pas_hidup_mati_umur_gen_lebih85th_l",
        "jmlh_pas_hidup_mati_umur_gen_lebih85th_p",
        "jmlh_pas_hidup_mati_gen_l",
        "jmlh_pas_hidup_mati_gen_p",
        "jmlh_pas_keluar_mati_gen_l",
        "jmlh_pas_keluar_mati_gen_p",
        "total_pas_hidup_mati",
        "total_pas_keluar_mati"],
      where: whereClause,
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};


export const insertDataRLEmpatTitikSatuExternal = async (req, res) => {
  const schema = Joi.object({
    periodeBulan: Joi.number().greater(0).less(13).required(),
    periodeTahun: Joi.number().required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          icd10: Joi.string().required(),
          jmlhPasHidupMatiUmurGen01JamL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen01JamP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen123JamL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen123JamP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen17hrL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen17hrP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen828hrL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen828hrP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen29hr3blnL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen29hr3blnP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen36blnL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen36blnP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen611blnL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen611blnP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen14thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen14thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen59thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen59thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen1014thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen1014thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen1519thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen1519thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen2024thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen2024thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen2529thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen2529thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen3034thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen3034thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen3539thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen3539thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen4044thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen4044thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen4549thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen4549thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen5054thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen5054thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen5559thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen5559thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen6064thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen6064thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen6569thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen6569thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen7074thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen7074thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen7579thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen7579thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen8084thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGen8084thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGenLebih85thL: Joi.number().min(0).max(99999999).required(),
          jmlhPasHidupMatiUmurGenLebih85thP: Joi.number().min(0).max(99999999).required(),
          jmlhPasKeluarMatiGenL: Joi.number().min(0).required(),
          jmlhPasKeluarMatiGenP: Joi.number().min(0).required(),
        })
      )
      .max(100)
      .required(),
  });


  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: false,
      message: " parameter salah",
      details: error.details.map(d => d.message),
    });
  }

  if ((value.data?.length || 0) > 100) {
    return res.status(400).send({
      status: false,
      message: "Data Tidak Bisa Lebih Dari 100",
    });
  }

  const val = (x) => Number(x ?? 0);


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based value, so we add 1


  if (
    req.body.periodeTahun > currentYear ||
    (req.body.periodeTahun === currentYear && req.body.periodeBulan >= currentMonth)
  ) {
    return res.status(400).send({
      status: false,
      message: "Periode tidak boleh lebih dari bulan ini.",
    });
  }



  try {

    const idToIndexes = new Map();
    value.data.forEach((it, idx) => {
      const key = String(it.icd10);
      const arr = idToIndexes.get(key) || [];
      arr.push(idx + 1);
      idToIndexes.set(key, arr);
    });

    const dupMsgs = [];
    idToIndexes.forEach((positions, key) => {
      if (positions.length > 1) {
        dupMsgs.push(`ICD id ${key} duplikat pada data ke-${positions.join(", ")}.`);
      }
    });
    if (dupMsgs.length > 0) {
      return res.status(400).send({
        status: false,
        message: "Validasi ICD gagal (duplikat icd10).",
        errors: dupMsgs,
      });
    }

    const ids = Array.from(idToIndexes.keys()).map((k) => k);

    const masterRows = await icd.findAll({
      where: {
        [Op.and]: [
          { icd_code: { [Op.in]: ids } },
          { status_rawat_inap: 1 },
        ],
      },
      attributes: ["id", "icd_code", "description_code", "icd_code_group", "description_code_group", "status_top_10", "status_rawat_inap", "status_rawat_jalan", "status_laki", "status_perempuan"],
      raw: true,
    });

    const masterMap = new Map(masterRows.map(r => [r.icd_code, r]));
    const errors = [];

    // console.log("massteee ", masterMap)


    value.data.forEach((item, idx) => {
      const no = idx + 1;
      const idNum = item.icd10;
      const master = masterMap.get(item.icd10);

      if (!master) {
        errors.push(`Data ke-${no} (ICD ${idNum}) tidak tepat karena bukan kode penyakit rawat inap.`);
        return;
      }
      item.icdId = master.id;
      const { status_laki, status_perempuan } = master;
      const keys = Object.keys(item);

      const lKeys = keys
        .filter(k => k.endsWith("L"))
        .filter(k => k !== "jmlhPasKeluarMatiGenL");

      const pKeys = keys
        .filter(k => k.endsWith("P"))
        .filter(k => k !== "jmlhPasKeluarMatiGenP");

      if (Number(status_laki) === 0) {
        const filledL = lKeys.filter(k => val(item[k]) > 0);
        if (filledL.length > 0) {
          errors.push(
            `Data ke-${no} dengan ICD ID = ${item.icd10} parameter Untuk Jenis Kelamin L (Laki)  tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Perempuan.`
          );
        }
      }

      if (Number(status_perempuan) === 0) {
        const filledP = pKeys.filter(k => val(item[k]) > 0);
        if (filledP.length > 0) {
          errors.push(
            `Data ke-${no} (ICD ${item.icd10}) parameter Untuk Jenis Kelamin P (Perempuan) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Laki.`
          );
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: "Validasi  ICD gagal",
        errors,
      });
    }


    const periode = `${req.body.periodeTahun}-${String(req.body.periodeBulan).padStart(2, '0')}-01`;


    const dataDetail = value.data.map((item) => {


      const totalL =
        val(item.jmlhPasHidupMatiUmurGen01JamL) +
        val(item.jmlhPasHidupMatiUmurGen123JamL) +
        val(item.jmlhPasHidupMatiUmurGen17hrL) +
        val(item.jmlhPasHidupMatiUmurGen828hrL) +
        val(item.jmlhPasHidupMatiUmurGen29hr3blnL) +
        val(item.jmlhPasHidupMatiUmurGen36blnL) +
        val(item.jmlhPasHidupMatiUmurGen611blnL) +
        val(item.jmlhPasHidupMatiUmurGen14thL) +
        val(item.jmlhPasHidupMatiUmurGen59thL) +
        val(item.jmlhPasHidupMatiUmurGen1014thL) +
        val(item.jmlhPasHidupMatiUmurGen1519thL) +
        val(item.jmlhPasHidupMatiUmurGen2024thL) +
        val(item.jmlhPasHidupMatiUmurGen2529thL) +
        val(item.jmlhPasHidupMatiUmurGen3034thL) +
        val(item.jmlhPasHidupMatiUmurGen3539thL) +
        val(item.jmlhPasHidupMatiUmurGen4044thL) +
        val(item.jmlhPasHidupMatiUmurGen4549thL) +
        val(item.jmlhPasHidupMatiUmurGen5054thL) +
        val(item.jmlhPasHidupMatiUmurGen5559thL) +
        val(item.jmlhPasHidupMatiUmurGen6064thL) +
        val(item.jmlhPasHidupMatiUmurGen6569thL) +
        val(item.jmlhPasHidupMatiUmurGen7074thL) +
        val(item.jmlhPasHidupMatiUmurGen7579thL) +
        val(item.jmlhPasHidupMatiUmurGen8084thL) +
        val(item.jmlhPasHidupMatiUmurGenLebih85thL);

      const totalP =
        val(item.jmlhPasHidupMatiUmurGen01JamP) +
        val(item.jmlhPasHidupMatiUmurGen123JamP) +
        val(item.jmlhPasHidupMatiUmurGen17hrP) +
        val(item.jmlhPasHidupMatiUmurGen828hrP) +
        val(item.jmlhPasHidupMatiUmurGen29hr3blnP) +
        val(item.jmlhPasHidupMatiUmurGen36blnP) +
        val(item.jmlhPasHidupMatiUmurGen611blnP) +
        val(item.jmlhPasHidupMatiUmurGen14thP) +
        val(item.jmlhPasHidupMatiUmurGen59thP) +
        val(item.jmlhPasHidupMatiUmurGen1014thP) +
        val(item.jmlhPasHidupMatiUmurGen1519thP) +
        val(item.jmlhPasHidupMatiUmurGen2024thP) +
        val(item.jmlhPasHidupMatiUmurGen2529thP) +
        val(item.jmlhPasHidupMatiUmurGen3034thP) +
        val(item.jmlhPasHidupMatiUmurGen3539thP) +
        val(item.jmlhPasHidupMatiUmurGen4044thP) +
        val(item.jmlhPasHidupMatiUmurGen4549thP) +
        val(item.jmlhPasHidupMatiUmurGen5054thP) +
        val(item.jmlhPasHidupMatiUmurGen5559thP) +
        val(item.jmlhPasHidupMatiUmurGen6064thP) +
        val(item.jmlhPasHidupMatiUmurGen6569thP) +
        val(item.jmlhPasHidupMatiUmurGen7074thP) +
        val(item.jmlhPasHidupMatiUmurGen7579thP) +
        val(item.jmlhPasHidupMatiUmurGen8084thP) +
        val(item.jmlhPasHidupMatiUmurGenLebih85thP);


      const total = totalL + totalP

      const totalKeluar = val(item.jmlhPasKeluarMatiGenL) + val(item.jmlhPasKeluarMatiGenP);
      const relErrors = [];
      if (totalKeluar > total) {
        relErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (val(item.jmlhPasKeluarMatiGenL) > totalL) {
        relErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (val(item.jmlhPasKeluarMatiGenP) > totalP) {
        relErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
      }


      if (relErrors.length > 0) {
        return res.status(400).send({
          status: false,
          message: relErrors,
          // errors: relErrors,
        });
      }
      return {
        rl_empat_titik_satu_id: null,
        rs_id: req.user.satKerId,
        periode: periode,
        icd_id: item.icdId,
        jmlh_pas_hidup_mati_umur_gen_0_1jam_l: val(item.jmlhPasHidupMatiUmurGen01JamL),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p: val(item.jmlhPasHidupMatiUmurGen01JamP),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l: val(item.jmlhPasHidupMatiUmurGen123JamL),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p: val(item.jmlhPasHidupMatiUmurGen123JamP),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l: val(item.jmlhPasHidupMatiUmurGen17hrL),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p: val(item.jmlhPasHidupMatiUmurGen17hrP),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l: val(item.jmlhPasHidupMatiUmurGen828hrL),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p: val(item.jmlhPasHidupMatiUmurGen828hrP),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: val(item.jmlhPasHidupMatiUmurGen29hr3blnL),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: val(item.jmlhPasHidupMatiUmurGen29hr3blnP),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l: val(item.jmlhPasHidupMatiUmurGen36blnL),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p: val(item.jmlhPasHidupMatiUmurGen36blnP),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l: val(item.jmlhPasHidupMatiUmurGen611blnL),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p: val(item.jmlhPasHidupMatiUmurGen611blnP),
        jmlh_pas_hidup_mati_umur_gen_1_4th_l: val(item.jmlhPasHidupMatiUmurGen14thL),
        jmlh_pas_hidup_mati_umur_gen_1_4th_p: val(item.jmlhPasHidupMatiUmurGen14thP),
        jmlh_pas_hidup_mati_umur_gen_5_9th_l: val(item.jmlhPasHidupMatiUmurGen59thL),
        jmlh_pas_hidup_mati_umur_gen_5_9th_p: val(item.jmlhPasHidupMatiUmurGen59thP),
        jmlh_pas_hidup_mati_umur_gen_10_14th_l: val(item.jmlhPasHidupMatiUmurGen1014thL),
        jmlh_pas_hidup_mati_umur_gen_10_14th_p: val(item.jmlhPasHidupMatiUmurGen1014thP),
        jmlh_pas_hidup_mati_umur_gen_15_19th_l: val(item.jmlhPasHidupMatiUmurGen1519thL),
        jmlh_pas_hidup_mati_umur_gen_15_19th_p: val(item.jmlhPasHidupMatiUmurGen1519thP),
        jmlh_pas_hidup_mati_umur_gen_20_24th_l: val(item.jmlhPasHidupMatiUmurGen2024thL),
        jmlh_pas_hidup_mati_umur_gen_20_24th_p: val(item.jmlhPasHidupMatiUmurGen2024thP),
        jmlh_pas_hidup_mati_umur_gen_25_29th_l: val(item.jmlhPasHidupMatiUmurGen2529thL),
        jmlh_pas_hidup_mati_umur_gen_25_29th_p: val(item.jmlhPasHidupMatiUmurGen2529thP),
        jmlh_pas_hidup_mati_umur_gen_30_34th_l: val(item.jmlhPasHidupMatiUmurGen3034thL),
        jmlh_pas_hidup_mati_umur_gen_30_34th_p: val(item.jmlhPasHidupMatiUmurGen3034thP),
        jmlh_pas_hidup_mati_umur_gen_35_39th_l: val(item.jmlhPasHidupMatiUmurGen3539thL),
        jmlh_pas_hidup_mati_umur_gen_35_39th_p: val(item.jmlhPasHidupMatiUmurGen3539thP),
        jmlh_pas_hidup_mati_umur_gen_40_44th_l: val(item.jmlhPasHidupMatiUmurGen4044thL),
        jmlh_pas_hidup_mati_umur_gen_40_44th_p: val(item.jmlhPasHidupMatiUmurGen4044thP),
        jmlh_pas_hidup_mati_umur_gen_45_49th_l: val(item.jmlhPasHidupMatiUmurGen4549thL),
        jmlh_pas_hidup_mati_umur_gen_45_49th_p: val(item.jmlhPasHidupMatiUmurGen4549thP),
        jmlh_pas_hidup_mati_umur_gen_50_54th_l: val(item.jmlhPasHidupMatiUmurGen5054thL),
        jmlh_pas_hidup_mati_umur_gen_50_54th_p: val(item.jmlhPasHidupMatiUmurGen5054thP),
        jmlh_pas_hidup_mati_umur_gen_55_59th_l: val(item.jmlhPasHidupMatiUmurGen5559thL),
        jmlh_pas_hidup_mati_umur_gen_55_59th_p: val(item.jmlhPasHidupMatiUmurGen5559thP),
        jmlh_pas_hidup_mati_umur_gen_60_64th_l: val(item.jmlhPasHidupMatiUmurGen6064thL),
        jmlh_pas_hidup_mati_umur_gen_60_64th_p: val(item.jmlhPasHidupMatiUmurGen6064thP),
        jmlh_pas_hidup_mati_umur_gen_65_69th_l: val(item.jmlhPasHidupMatiUmurGen6569thL),
        jmlh_pas_hidup_mati_umur_gen_65_69th_p: val(item.jmlhPasHidupMatiUmurGen6569thP),
        jmlh_pas_hidup_mati_umur_gen_70_74th_l: val(item.jmlhPasHidupMatiUmurGen7074thL),
        jmlh_pas_hidup_mati_umur_gen_70_74th_p: val(item.jmlhPasHidupMatiUmurGen7074thP),
        jmlh_pas_hidup_mati_umur_gen_75_79th_l: val(item.jmlhPasHidupMatiUmurGen7579thL),
        jmlh_pas_hidup_mati_umur_gen_75_79th_p: val(item.jmlhPasHidupMatiUmurGen7579thP),
        jmlh_pas_hidup_mati_umur_gen_80_84th_l: val(item.jmlhPasHidupMatiUmurGen8084thL),
        jmlh_pas_hidup_mati_umur_gen_80_84th_p: val(item.jmlhPasHidupMatiUmurGen8084thP),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l: val(item.jmlhPasHidupMatiUmurGenLebih85thL),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p: val(item.jmlhPasHidupMatiUmurGenLebih85thP),
        jmlh_pas_hidup_mati_gen_l: totalL,
        jmlh_pas_hidup_mati_gen_p: totalP,
        total_pas_hidup_mati: total,
        jmlh_pas_keluar_mati_gen_l: val(item.jmlhPasKeluarMatiGenL),
        jmlh_pas_keluar_mati_gen_p: val(item.jmlhPasKeluarMatiGenP),
        total_pas_keluar_mati: totalKeluar,
        user_id: req.user.userId,
      };
    });

    const totalErrors = [];
    dataDetail.forEach((d, i) => {
      const no = i + 1;
      if (d.total_pas_keluar_mati > d.total_pas_hidup_mati) {
        totalErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (d.jmlh_pas_keluar_mati_gen_l > d.jmlh_pas_hidup_mati_gen_l) {
        totalErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (d.jmlh_pas_keluar_mati_gen_p > d.jmlh_pas_hidup_mati_gen_p) {
        totalErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
      }
    });

    if (totalErrors.length > 0) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: totalErrors,
      });
    }
    let transaction;
    try {
      transaction = await databaseSIRS.transaction();

      const resultInsertHeader = await rlEmpatTitikSatuHeader.create(
        {
          rs_id: req.user.satKerId,
          periode,
          user_id: req.user.userId,
        },
        { transaction }
      );

      dataDetail.forEach(d => {
        d.rl_empat_titik_satu_id = resultInsertHeader.id;
      });

      console.log("itemm ", dataDetail)

      await rlEmpatTitikSatuDetail.bulkCreate(dataDetail, {
        transaction,
        updateOnDuplicate: [
          "jmlh_pas_hidup_mati_umur_gen_0_1jam_l",
          "jmlh_pas_hidup_mati_umur_gen_0_1jam_p",
          "jmlh_pas_hidup_mati_umur_gen_1_23jam_l",
          "jmlh_pas_hidup_mati_umur_gen_1_23jam_p",
          "jmlh_pas_hidup_mati_umur_gen_1_7hr_l",
          "jmlh_pas_hidup_mati_umur_gen_1_7hr_p",
          "jmlh_pas_hidup_mati_umur_gen_8_28hr_l",
          "jmlh_pas_hidup_mati_umur_gen_8_28hr_p",
          "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l",
          "jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p",
          "jmlh_pas_hidup_mati_umur_gen_3_6bln_l",
          "jmlh_pas_hidup_mati_umur_gen_3_6bln_p",
          "jmlh_pas_hidup_mati_umur_gen_6_11bln_l",
          "jmlh_pas_hidup_mati_umur_gen_6_11bln_p",
          "jmlh_pas_hidup_mati_umur_gen_1_4th_l",
          "jmlh_pas_hidup_mati_umur_gen_1_4th_p",
          "jmlh_pas_hidup_mati_umur_gen_5_9th_l",
          "jmlh_pas_hidup_mati_umur_gen_5_9th_p",
          "jmlh_pas_hidup_mati_umur_gen_10_14th_l",
          "jmlh_pas_hidup_mati_umur_gen_10_14th_p",
          "jmlh_pas_hidup_mati_umur_gen_15_19th_l",
          "jmlh_pas_hidup_mati_umur_gen_15_19th_p",
          "jmlh_pas_hidup_mati_umur_gen_20_24th_l",
          "jmlh_pas_hidup_mati_umur_gen_20_24th_p",
          "jmlh_pas_hidup_mati_umur_gen_25_29th_l",
          "jmlh_pas_hidup_mati_umur_gen_25_29th_p",
          "jmlh_pas_hidup_mati_umur_gen_30_34th_l",
          "jmlh_pas_hidup_mati_umur_gen_30_34th_p",
          "jmlh_pas_hidup_mati_umur_gen_35_39th_l",
          "jmlh_pas_hidup_mati_umur_gen_35_39th_p",
          "jmlh_pas_hidup_mati_umur_gen_40_44th_l",
          "jmlh_pas_hidup_mati_umur_gen_40_44th_p",
          "jmlh_pas_hidup_mati_umur_gen_45_49th_l",
          "jmlh_pas_hidup_mati_umur_gen_45_49th_p",
          "jmlh_pas_hidup_mati_umur_gen_50_54th_l",
          "jmlh_pas_hidup_mati_umur_gen_50_54th_p",
          "jmlh_pas_hidup_mati_umur_gen_55_59th_l",
          "jmlh_pas_hidup_mati_umur_gen_55_59th_p",
          "jmlh_pas_hidup_mati_umur_gen_60_64th_l",
          "jmlh_pas_hidup_mati_umur_gen_60_64th_p",
          "jmlh_pas_hidup_mati_umur_gen_65_69th_l",
          "jmlh_pas_hidup_mati_umur_gen_65_69th_p",
          "jmlh_pas_hidup_mati_umur_gen_70_74th_l",
          "jmlh_pas_hidup_mati_umur_gen_70_74th_p",
          "jmlh_pas_hidup_mati_umur_gen_75_79th_l",
          "jmlh_pas_hidup_mati_umur_gen_75_79th_p",
          "jmlh_pas_hidup_mati_umur_gen_80_84th_l",
          "jmlh_pas_hidup_mati_umur_gen_80_84th_p",
          "jmlh_pas_hidup_mati_umur_gen_lebih85th_l",
          "jmlh_pas_hidup_mati_umur_gen_lebih85th_p",
          "jmlh_pas_hidup_mati_gen_l",
          "jmlh_pas_hidup_mati_gen_p",
          "total_pas_hidup_mati",
          "jmlh_pas_keluar_mati_gen_l",
          "jmlh_pas_keluar_mati_gen_p",
          "total_pas_keluar_mati"
        ],
      });
      // await transaction.commit();
      await transaction.rollback();
      res.status(201).send({
        status: true,
        message: "data created",
        data: {
          id: resultInsertHeader.id,
        },
      })
    } catch (err) {
      if (transaction) await transaction.rollback();
      if (err?.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).send({
          status: false,
          message: "Gagal Input Data, Parameter Tidak Tepat.",
        });
      }
      console.log("bang", err)
      return res.status(400).send({
        status: false,
        message: "Gagal Input Data.",
      });
    }


  } catch (err) {
    // error param
    console.log(err)
    return res.status(400).send({
      status: false,
      message: "Gagal Input Data 2.",
    });
  }
};


export const updateDataRLEmpatTitikSatuExternal = async (req, res) => {
  const itemSchema = Joi.object({
    id: Joi.number().integer().required(),
    jmlhPasHidupMatiUmurGen01JamL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen01JamP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen123JamL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen123JamP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen17hrL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen17hrP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen828hrL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen828hrP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen29hr3blnL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen29hr3blnP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen36blnL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen36blnP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen611blnL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen611blnP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen14thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen14thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen59thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen59thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen1014thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen1014thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen1519thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen1519thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen2024thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen2024thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen2529thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen2529thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen3034thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen3034thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen3539thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen3539thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen4044thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen4044thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen4549thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen4549thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen5054thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen5054thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen5559thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen5559thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen6064thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen6064thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen6569thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen6569thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen7074thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen7074thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen7579thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen7579thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen8084thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGen8084thP: Joi.number().default(0),
    jmlhPasHidupMatiUmurGenLebih85thL: Joi.number().default(0),
    jmlhPasHidupMatiUmurGenLebih85thP: Joi.number().default(0),
    jmlhPasKeluarMatiGenL: Joi.number().default(0),
    jmlhPasKeluarMatiGenP: Joi.number().default(0),
  });

  const schema = Joi.object({
    data: Joi.array()
      .items(itemSchema)
      .unique((a, b) => Number(a.id) === Number(b.id))
      .max(100)
      .required(),
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return res.status(400).send({
      status: false,
      message: "Validasi schema gagal",
      details: error.details.map((d) => d.message),
    });
  }

  if ((value.data?.length || 0) > 100) {
    return res.status(400).send({
      status: false,
      message: "Data Tidak Bisa Lebih Dari 100",
    });
  }

  const val = (x) => Number(x ?? 0);

  try {
    const idPos = new Map();
    value.data.forEach((it, idx) => {
      const id = Number(it.id);
      const arr = idPos.get(id) || [];
      arr.push(idx + 1);
      idPos.set(id, arr);
    });
    const dupIds = [];
    idPos.forEach((pos, id) => {
      if (pos.length > 1) dupIds.push(`ID ${id} duplikat pada data ke-${pos.join(", ")}`);
    });
    if (dupIds.length) {
      return res.status(400).send({
        status: false,
        message: "Validasi gagal (duplikat id).",
        errors: dupIds,
      });
    }

    const ids = Array.from(idPos.keys());
    const existing = await rlEmpatTitikSatuDetail.findAll({
      where: { id: ids, rs_id: req.user.satKerId },
      attributes: ["id", "rs_id", "icd_id"],
      raw: true,
    });

    const existingMap = new Map(existing.map((r) => [r.id, r, r.rs_id]));
    value.data.forEach((item, idx) => {
      const id = Number(item.id);
      const existingItem = existingMap.get(id);
      if (existingItem) {
          item.icd_id = existingItem.icd_id;
      }
  });

    const notFoundOrNotOwned = [];
    ids.forEach((id) => {
      if (!existingMap.has(id)) {
        notFoundOrNotOwned.push(`Data dengan ${id} tidak ditemukan atau kepemilikan data tidak sesuai.`);
      }
    });
    if (notFoundOrNotOwned.length > 0) {
      return res.status(404).send({
        status: false,
        message: "Verifikasi kepemilikan gagal.",
        errors: notFoundOrNotOwned,
      });
    }

    let icds = existing.map(item => item.icd_id);
    const masterIcd = await icd.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.in]: icds } },
          { status_rawat_inap: 1 },
        ],
      },
      attributes: ["id", "icd_code", "description_code", "icd_code_group", "description_code_group", "status_top_10", "status_rawat_inap", "status_rawat_jalan", "status_laki", "status_perempuan"],
      raw: true,
    });

    const masterMap = new Map(masterIcd.map(r => [r.id, r]));

    let toUpdate = [];
    const errorsIcd = [];

    value.data.forEach((item, idx) => {

      const no = idx + 1;
      const cek = masterMap.get(item.icd_id);
      const keys = Object.keys(item);
      const lKeys = keys.filter(k => k.endsWith("L")).filter(k => k !== "jmlhPasKeluarMatiGenL");
      const pKeys = keys.filter(k => k.endsWith("P")).filter(k => k !== "jmlhPasKeluarMatiGenP");

      const { status_laki, status_perempuan } = cek;

      if (Number(status_laki) === 0) {
        console.log("laki ",status_laki)
        const filledL = lKeys.filter(k => val(item[k]) > 0);
        if (filledL.length > 0) {
          errorsIcd.push(
            `Data ke-${no} dengan ICD ID = ${item.icd_id} parameter Untuk Jenis Kelamin L (Laki) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Perempuan.`
          );
        }
      }

      // Validasi untuk perempuan
      if (Number(status_perempuan) === 0) {
        const filledP = pKeys.filter(k => val(item[k]) > 0);
        if (filledP.length > 0) {
          errorsIcd.push(
            `Data ke-${no} dengan ICD ID = ${item.icd_id} parameter Untuk Jenis Kelamin P (Perempuan) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Laki.`
          );
        }
      }

      const totalL = [
        item.jmlhPasHidupMatiUmurGen01JamL,
        item.jmlhPasHidupMatiUmurGen123JamL,
        item.jmlhPasHidupMatiUmurGen17hrL,
        item.jmlhPasHidupMatiUmurGen828hrL,
        item.jmlhPasHidupMatiUmurGen29hr3blnL,
        item.jmlhPasHidupMatiUmurGen36blnL,
        item.jmlhPasHidupMatiUmurGen611blnL,
        item.jmlhPasHidupMatiUmurGen14thL,
        item.jmlhPasHidupMatiUmurGen59thL,
        item.jmlhPasHidupMatiUmurGen1014thL,
        item.jmlhPasHidupMatiUmurGen1519thL,
        item.jmlhPasHidupMatiUmurGen2024thL,
        item.jmlhPasHidupMatiUmurGen2529thL,
        item.jmlhPasHidupMatiUmurGen3034thL,
        item.jmlhPasHidupMatiUmurGen3539thL,
        item.jmlhPasHidupMatiUmurGen4044thL,
        item.jmlhPasHidupMatiUmurGen4549thL,
        item.jmlhPasHidupMatiUmurGen5054thL,
        item.jmlhPasHidupMatiUmurGen5559thL,
        item.jmlhPasHidupMatiUmurGen6064thL,
        item.jmlhPasHidupMatiUmurGen6569thL,
        item.jmlhPasHidupMatiUmurGen7074thL,
        item.jmlhPasHidupMatiUmurGen7579thL,
        item.jmlhPasHidupMatiUmurGen8084thL,
        item.jmlhPasHidupMatiUmurGenLebih85thL,
      ].reduce((sum, x) => sum + val(x), 0);

      const totalP = [
        item.jmlhPasHidupMatiUmurGen01JamP,
        item.jmlhPasHidupMatiUmurGen123JamP,
        item.jmlhPasHidupMatiUmurGen17hrP,
        item.jmlhPasHidupMatiUmurGen828hrP,
        item.jmlhPasHidupMatiUmurGen29hr3blnP,
        item.jmlhPasHidupMatiUmurGen36blnP,
        item.jmlhPasHidupMatiUmurGen611blnP,
        item.jmlhPasHidupMatiUmurGen14thP,
        item.jmlhPasHidupMatiUmurGen59thP,
        item.jmlhPasHidupMatiUmurGen1014thP,
        item.jmlhPasHidupMatiUmurGen1519thP,
        item.jmlhPasHidupMatiUmurGen2024thP,
        item.jmlhPasHidupMatiUmurGen2529thP,
        item.jmlhPasHidupMatiUmurGen3034thP,
        item.jmlhPasHidupMatiUmurGen3539thP,
        item.jmlhPasHidupMatiUmurGen4044thP,
        item.jmlhPasHidupMatiUmurGen4549thP,
        item.jmlhPasHidupMatiUmurGen5054thP,
        item.jmlhPasHidupMatiUmurGen5559thP,
        item.jmlhPasHidupMatiUmurGen6064thP,
        item.jmlhPasHidupMatiUmurGen6569thP,
        item.jmlhPasHidupMatiUmurGen7074thP,
        item.jmlhPasHidupMatiUmurGen7579thP,
        item.jmlhPasHidupMatiUmurGen8084thP,
        item.jmlhPasHidupMatiUmurGenLebih85thP,
      ].reduce((sum, x) => sum + val(x), 0);

      const total = totalL + totalP;
      const totalKeluar = val(item.jmlhPasKeluarMatiGenL) + val(item.jmlhPasKeluarMatiGenP);
      const relErrors = [];

      if (totalKeluar > total) {
        relErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (val(item.jmlhPasKeluarMatiGenL) > totalL) {
        relErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (val(item.jmlhPasKeluarMatiGenP) > totalP) {
        relErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
      }
   
      toUpdate.push({
        id: Number(item.id),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_l: val(item.jmlhPasHidupMatiUmurGen01JamL),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p: val(item.jmlhPasHidupMatiUmurGen01JamP),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l: val(item.jmlhPasHidupMatiUmurGen123JamL),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p: val(item.jmlhPasHidupMatiUmurGen123JamP),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l: val(item.jmlhPasHidupMatiUmurGen17hrL),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p: val(item.jmlhPasHidupMatiUmurGen17hrP),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l: val(item.jmlhPasHidupMatiUmurGen828hrL),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p: val(item.jmlhPasHidupMatiUmurGen828hrP),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: val(item.jmlhPasHidupMatiUmurGen29hr3blnL),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: val(item.jmlhPasHidupMatiUmurGen29hr3blnP),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l: val(item.jmlhPasHidupMatiUmurGen36blnL),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p: val(item.jmlhPasHidupMatiUmurGen36blnP),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l: val(item.jmlhPasHidupMatiUmurGen611blnL),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p: val(item.jmlhPasHidupMatiUmurGen611blnP),
        jmlh_pas_hidup_mati_umur_gen_1_4th_l: val(item.jmlhPasHidupMatiUmurGen14thL),
        jmlh_pas_hidup_mati_umur_gen_1_4th_p: val(item.jmlhPasHidupMatiUmurGen14thP),
        jmlh_pas_hidup_mati_umur_gen_5_9th_l: val(item.jmlhPasHidupMatiUmurGen59thL),
        jmlh_pas_hidup_mati_umur_gen_5_9th_p: val(item.jmlhPasHidupMatiUmurGen59thP),
        jmlh_pas_hidup_mati_umur_gen_10_14th_l: val(item.jmlhPasHidupMatiUmurGen1014thL),
        jmlh_pas_hidup_mati_umur_gen_10_14th_p: val(item.jmlhPasHidupMatiUmurGen1014thP),
        jmlh_pas_hidup_mati_umur_gen_15_19th_l: val(item.jmlhPasHidupMatiUmurGen1519thL),
        jmlh_pas_hidup_mati_umur_gen_15_19th_p: val(item.jmlhPasHidupMatiUmurGen1519thP),
        jmlh_pas_hidup_mati_umur_gen_20_24th_l: val(item.jmlhPasHidupMatiUmurGen2024thL),
        jmlh_pas_hidup_mati_umur_gen_20_24th_p: val(item.jmlhPasHidupMatiUmurGen2024thP),
        jmlh_pas_hidup_mati_umur_gen_25_29th_l: val(item.jmlhPasHidupMatiUmurGen2529thL),
        jmlh_pas_hidup_mati_umur_gen_25_29th_p: val(item.jmlhPasHidupMatiUmurGen2529thP),
        jmlh_pas_hidup_mati_umur_gen_30_34th_l: val(item.jmlhPasHidupMatiUmurGen3034thL),
        jmlh_pas_hidup_mati_umur_gen_30_34th_p: val(item.jmlhPasHidupMatiUmurGen3034thP),
        jmlh_pas_hidup_mati_umur_gen_35_39th_l: val(item.jmlhPasHidupMatiUmurGen3539thL),
        jmlh_pas_hidup_mati_umur_gen_35_39th_p: val(item.jmlhPasHidupMatiUmurGen3539thP),
        jmlh_pas_hidup_mati_umur_gen_40_44th_l: val(item.jmlhPasHidupMatiUmurGen4044thL),
        jmlh_pas_hidup_mati_umur_gen_40_44th_p: val(item.jmlhPasHidupMatiUmurGen4044thP),
        jmlh_pas_hidup_mati_umur_gen_45_49th_l: val(item.jmlhPasHidupMatiUmurGen4549thL),
        jmlh_pas_hidup_mati_umur_gen_45_49th_p: val(item.jmlhPasHidupMatiUmurGen4549thP),
        jmlh_pas_hidup_mati_umur_gen_50_54th_l: val(item.jmlhPasHidupMatiUmurGen5054thL),
        jmlh_pas_hidup_mati_umur_gen_50_54th_p: val(item.jmlhPasHidupMatiUmurGen5054thP),
        jmlh_pas_hidup_mati_umur_gen_55_59th_l: val(item.jmlhPasHidupMatiUmurGen5559thL),
        jmlh_pas_hidup_mati_umur_gen_55_59th_p: val(item.jmlhPasHidupMatiUmurGen5559thP),
        jmlh_pas_hidup_mati_umur_gen_60_64th_l: val(item.jmlhPasHidupMatiUmurGen6064thL),
        jmlh_pas_hidup_mati_umur_gen_60_64th_p: val(item.jmlhPasHidupMatiUmurGen6064thP),
        jmlh_pas_hidup_mati_umur_gen_65_69th_l: val(item.jmlhPasHidupMatiUmurGen6569thL),
        jmlh_pas_hidup_mati_umur_gen_65_69th_p: val(item.jmlhPasHidupMatiUmurGen6569thP),
        jmlh_pas_hidup_mati_umur_gen_70_74th_l: val(item.jmlhPasHidupMatiUmurGen7074thL),
        jmlh_pas_hidup_mati_umur_gen_70_74th_p: val(item.jmlhPasHidupMatiUmurGen7074thP),
        jmlh_pas_hidup_mati_umur_gen_75_79th_l: val(item.jmlhPasHidupMatiUmurGen7579thL),
        jmlh_pas_hidup_mati_umur_gen_75_79th_p: val(item.jmlhPasHidupMatiUmurGen7579thP),
        jmlh_pas_hidup_mati_umur_gen_80_84th_l: val(item.jmlhPasHidupMatiUmurGen8084thL),
        jmlh_pas_hidup_mati_umur_gen_80_84th_p: val(item.jmlhPasHidupMatiUmurGen8084thP),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l: val(item.jmlhPasHidupMatiUmurGenLebih85thL),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p: val(item.jmlhPasHidupMatiUmurGenLebih85thP),

        jmlh_pas_hidup_mati_gen_l: totalL,
        jmlh_pas_hidup_mati_gen_p: totalP,
        total_pas_hidup_mati: total,

        jmlh_pas_keluar_mati_gen_l: val(item.jmlhPasKeluarMatiGenL),
        jmlh_pas_keluar_mati_gen_p: val(item.jmlhPasKeluarMatiGenP),
        total_pas_keluar_mati: totalKeluar,
      });

    });

    if (errorsIcd.length) {
      return res.status(400).send({
        status: false,
        message: "Validasi ICD gagal",
        errors: errorsIcd,
      });
    }

    if (relErrors.length) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: relErrors,
      });
    }

    let transaction;
    try {
      transaction = await databaseSIRS.transaction();

      for (const item of toUpdate) {
        await rlEmpatTitikSatuDetail.update(item, {
          where: { id: item.id },
          transaction,
        });
      }
      // await transaction.rollback();
      await transaction.commit();
      return res.status(200).send({
        status: true,
        message: "Data updated successfully",
        data: { updated: toUpdate.length },
      });
    } catch (err) {
      console.log(err);
      if (transaction) await transaction.rollback();
      return res.status(400).send({
        status: false,
        message: "Failed to update data.",
      });
    }
  } catch (err) {
    // console.log("zulkifli ", err);
    return res.status(400).send({
      status: false,
      message: "Failed to process update.",
    });
  }
};




// export const getRLEmpatTitikDua = (req, res) => {
//   const joi = Joi.extend(joiDate) 
//   const schema = joi.object({
//     rsId: joi.string().required(),
//     periode: joi.date().format("YYYY-MM").required(),
//     page: joi.number(),
//     limit: joi.number()
// })

//   const { error, value } =  schema.validate(req.query)

//   if (error) {
//       res.status(400).send({
//           status: false,
//           message: error.details[0].message
//       })
//       return
//   }
//   if(req.user.jenisUserId == 4){
//     if(req.query.rsId != req.user.satKerId){
//       res.status(404).send({
//         status: false,
//         message: "Kode RS Tidak Sesuai",
//       });
//       return;
//     }
//   }

//   req.query.periode = req.query.periode+'-01'

//   get42(req, (err, results) => {
//       // console.log(results)
//       const message = results.length ? 'data found' : 'data not found'
//       res.status(200).send({
//           status: true,
//           message: message,
//           data: results
//       })
//   })
// }

// export const getRLEmpatTitikTiga = (req, res) => {
//   const joi = Joi.extend(joiDate) 

//   const schema = joi.object({
//     rsId: joi.string().required(),
//     periode: joi.date().format("YYYY-MM").required(),
// })
//   const { error, value } =  schema.validate(req.query)

//   if (error) {
//       res.status(400).send({
//           status: false,
//           message: error.details[0].message
//       })
//       return
//   }

//   if(req.user.jenisUserId == 4){
//     if(req.query.rsId != req.user.satKerId){
//       res.status(404).send({
//         status: false,
//         message: "Kode RS Tidak Sesuai",
//       });
//       return;
//     }
//   }

  
//   req.query.periode = req.query.periode+'-01'

//   get43(req, (err, results) => {
//       // console.log(req.user)
//       const message = results.length ? 'data found' : 'data not found'
//       res.status(200).send({
//           status: true,
//           message: message,
//           data: results
//       })
//   })
// }