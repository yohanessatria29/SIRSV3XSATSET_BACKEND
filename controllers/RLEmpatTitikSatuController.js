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
import { Op } from "sequelize";

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
          jumlahPasienHidupDanMatiUmurKurangDari1JamL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmurKurangDari1JamP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1JamSampai23JamL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1JamSampai23JamP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1HariSampai7HariL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1HariSampai7HariP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur8HariSampai28HariL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur8HariSampai28HariP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL: Joi.number().min(0).max(99999999).required(),
          jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP: Joi.number().min(0).max(99999999).required(),
          jumlahPasienKeluarMatiL: Joi.number().min(0).required(),
          jumlahPasienKeluarMatiP: Joi.number().min(0).required(),
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
    parseInt(req.body.periodeTahun) > parseInt(currentYear) ||
    (parseInt(req.body.periodeTahun) === parseInt(currentYear) && parseInt(req.body.periodeBulan) >= parseInt(currentMonth))
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
          { status_rawat_inap: 1 },{ is_active: 1 }
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
        .filter(k => k !== "jumlahPasienKeluarMatiL");

      const pKeys = keys
        .filter(k => k.endsWith("P"))
        .filter(k => k !== "jumlahPasienKeluarMatiP");

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
        val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamL) +
        val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamL) +
        val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariL) +
        val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariL) +
        val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL) +
        val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL) +
        val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL) +
        val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL) +
        val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL) +
        val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL);

      const totalP =
        val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamP) +
        val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamP) +
        val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariP) +
        val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariP) +
        val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP) +
        val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP) +
        val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP) +
        val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP) +
        val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP) +
        val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP);


      const total = totalL + totalP

      const totalKeluar = val(item.jumlahPasienKeluarMatiL) + val(item.jumlahPasienKeluarMatiP);
      const relErrors = [];
      if (totalKeluar > total) {
        relErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (val(item.jumlahPasienKeluarMatiL) > totalL) {
        relErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (val(item.jumlahPasienKeluarMatiP) > totalP) {
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
        jmlh_pas_hidup_mati_umur_gen_0_1jam_l: val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamL),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p: val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamP),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l: val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamL),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p: val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamP),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l: val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariL),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p: val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariP),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l: val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariL),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p: val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariP),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l: val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p: val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l: val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p: val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP),
        jmlh_pas_hidup_mati_umur_gen_1_4th_l: val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL),
        jmlh_pas_hidup_mati_umur_gen_1_4th_p: val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP),
        jmlh_pas_hidup_mati_umur_gen_5_9th_l: val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL),
        jmlh_pas_hidup_mati_umur_gen_5_9th_p: val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP),
        jmlh_pas_hidup_mati_umur_gen_10_14th_l: val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL),
        jmlh_pas_hidup_mati_umur_gen_10_14th_p: val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP),
        jmlh_pas_hidup_mati_umur_gen_15_19th_l: val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL),
        jmlh_pas_hidup_mati_umur_gen_15_19th_p: val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP),
        jmlh_pas_hidup_mati_umur_gen_20_24th_l: val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL),
        jmlh_pas_hidup_mati_umur_gen_20_24th_p: val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP),
        jmlh_pas_hidup_mati_umur_gen_25_29th_l: val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL),
        jmlh_pas_hidup_mati_umur_gen_25_29th_p: val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP),
        jmlh_pas_hidup_mati_umur_gen_30_34th_l: val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL),
        jmlh_pas_hidup_mati_umur_gen_30_34th_p: val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP),
        jmlh_pas_hidup_mati_umur_gen_35_39th_l: val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL),
        jmlh_pas_hidup_mati_umur_gen_35_39th_p: val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP),
        jmlh_pas_hidup_mati_umur_gen_40_44th_l: val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL),
        jmlh_pas_hidup_mati_umur_gen_40_44th_p: val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP),
        jmlh_pas_hidup_mati_umur_gen_45_49th_l: val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL),
        jmlh_pas_hidup_mati_umur_gen_45_49th_p: val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP),
        jmlh_pas_hidup_mati_umur_gen_50_54th_l: val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL),
        jmlh_pas_hidup_mati_umur_gen_50_54th_p: val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP),
        jmlh_pas_hidup_mati_umur_gen_55_59th_l: val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL),
        jmlh_pas_hidup_mati_umur_gen_55_59th_p: val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP),
        jmlh_pas_hidup_mati_umur_gen_60_64th_l: val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL),
        jmlh_pas_hidup_mati_umur_gen_60_64th_p: val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP),
        jmlh_pas_hidup_mati_umur_gen_65_69th_l: val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL),
        jmlh_pas_hidup_mati_umur_gen_65_69th_p: val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP),
        jmlh_pas_hidup_mati_umur_gen_70_74th_l: val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL),
        jmlh_pas_hidup_mati_umur_gen_70_74th_p: val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP),
        jmlh_pas_hidup_mati_umur_gen_75_79th_l: val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL),
        jmlh_pas_hidup_mati_umur_gen_75_79th_p: val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP),
        jmlh_pas_hidup_mati_umur_gen_80_84th_l: val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL),
        jmlh_pas_hidup_mati_umur_gen_80_84th_p: val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l: val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p: val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP),
        jmlh_pas_hidup_mati_gen_l: totalL,
        jmlh_pas_hidup_mati_gen_p: totalP,
        total_pas_hidup_mati: total,
        jmlh_pas_keluar_mati_gen_l: val(item.jumlahPasienKeluarMatiL),
        jmlh_pas_keluar_mati_gen_p: val(item.jumlahPasienKeluarMatiP),
        total_pas_keluar_mati: totalKeluar,
        user_id: req.user.userId,
      };
    });

    // const totalErrors = [];
    // dataDetail.forEach((d, i) => {
    //   const no = i + 1;
    //   if (d.total_pas_keluar_mati > d.total_pas_hidup_mati) {
    //     totalErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
    //   }
    //   if (d.jmlh_pas_keluar_mati_gen_l > d.jmlh_pas_hidup_mati_gen_l) {
    //     totalErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
    //   }
    //   if (d.jmlh_pas_keluar_mati_gen_p > d.jmlh_pas_hidup_mati_gen_p) {
    //     totalErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
    //   }
    // });

    // if (totalErrors.length > 0) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "Validasi total gagal",
    //     errors: totalErrors,
    //   });
    // }
    let transaction;
    try {
      transaction = await databaseSIRS.transaction();

      const resultInsertHeader = await rlEmpatTitikSatuHeader.create(
        {
          rs_id: req.user.satKerId,
          periode,
          user_id: req.user.userId,
        },
        { transaction,
           updateOnDuplicate: ["periode"]
         }
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
      await transaction.commit();
      // await transaction.rollback();
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
    jumlahPasienHidupDanMatiUmurKurangDari1JamL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmurKurangDari1JamP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1JamSampai23JamL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1JamSampai23JamP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1HariSampai7HariL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1HariSampai7HariP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur8HariSampai28HariL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur8HariSampai28HariP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL: Joi.number().default(0),
    jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP: Joi.number().default(0),
    jumlahPasienKeluarMatiL: Joi.number().default(0),
    jumlahPasienKeluarMatiP: Joi.number().default(0),
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
          { status_rawat_inap: 1 },{ is_active: 1 }
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
      const lKeys = keys.filter(k => k.endsWith("L")).filter(k => k !== "jumlahPasienKeluarMatiL");
      const pKeys = keys.filter(k => k.endsWith("P")).filter(k => k !== "jumlahPasienKeluarMatiP");

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
        item.jumlahPasienHidupDanMatiUmurKurangDari1JamL,
        item.jumlahPasienHidupDanMatiUmur1JamSampai23JamL,
        item.jumlahPasienHidupDanMatiUmur1HariSampai7HariL,
        item.jumlahPasienHidupDanMatiUmur8HariSampai28HariL,
        item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL,
        item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL,
        item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL,
        item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL,
        item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL,
        item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL,
        item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL,
        item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL,
        item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL,
        item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL,
        item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL,
        item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL,
        item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL,
        item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL,
        item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL,
        item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL,
        item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL,
        item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL,
        item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL,
        item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL,
        item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL,
      ].reduce((sum, x) => sum + val(x), 0);

      const totalP = [
        item.jumlahPasienHidupDanMatiUmurKurangDari1JamP,
        item.jumlahPasienHidupDanMatiUmur1JamSampai23JamP,
        item.jumlahPasienHidupDanMatiUmur1HariSampai7HariP,
        item.jumlahPasienHidupDanMatiUmur8HariSampai28HariP,
        item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP,
        item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP,
        item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP,
        item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP,
        item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP,
        item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP,
        item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP,
        item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP,
        item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP,
        item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP,
        item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP,
        item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP,
        item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP,
        item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP,
        item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP,
        item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP,
        item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP,
        item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP,
        item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP,
        item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP,
        item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP,
      ].reduce((sum, x) => sum + val(x), 0);

      const total = totalL + totalP;
      const totalKeluar = val(item.jumlahPasienKeluarMatiL) + val(item.jumlahPasienKeluarMatiP);
      const relErrors = [];

      if (totalKeluar > total) {
        relErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (val(item.jumlahPasienKeluarMatiL) > totalL) {
        relErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (val(item.jumlahPasienKeluarMatiP) > totalP) {
        relErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
      }

      toUpdate.push({
        id: Number(item.id),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_l: val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamL),
        jmlh_pas_hidup_mati_umur_gen_0_1jam_p: val(item.jumlahPasienHidupDanMatiUmurKurangDari1JamP),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_l: val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamL),
        jmlh_pas_hidup_mati_umur_gen_1_23jam_p: val(item.jumlahPasienHidupDanMatiUmur1JamSampai23JamP),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_l: val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariL),
        jmlh_pas_hidup_mati_umur_gen_1_7hr_p: val(item.jumlahPasienHidupDanMatiUmur1HariSampai7HariP),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_l: val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariL),
        jmlh_pas_hidup_mati_umur_gen_8_28hr_p: val(item.jumlahPasienHidupDanMatiUmur8HariSampai28HariP),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL),
        jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: val(item.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_l: val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL),
        jmlh_pas_hidup_mati_umur_gen_3_6bln_p: val(item.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_l: val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL),
        jmlh_pas_hidup_mati_umur_gen_6_11bln_p: val(item.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP),
        jmlh_pas_hidup_mati_umur_gen_1_4th_l: val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL),
        jmlh_pas_hidup_mati_umur_gen_1_4th_p: val(item.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP),
        jmlh_pas_hidup_mati_umur_gen_5_9th_l: val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL),
        jmlh_pas_hidup_mati_umur_gen_5_9th_p: val(item.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP),
        jmlh_pas_hidup_mati_umur_gen_10_14th_l: val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL),
        jmlh_pas_hidup_mati_umur_gen_10_14th_p: val(item.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP),
        jmlh_pas_hidup_mati_umur_gen_15_19th_l: val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL),
        jmlh_pas_hidup_mati_umur_gen_15_19th_p: val(item.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP),
        jmlh_pas_hidup_mati_umur_gen_20_24th_l: val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL),
        jmlh_pas_hidup_mati_umur_gen_20_24th_p: val(item.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP),
        jmlh_pas_hidup_mati_umur_gen_25_29th_l: val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL),
        jmlh_pas_hidup_mati_umur_gen_25_29th_p: val(item.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP),
        jmlh_pas_hidup_mati_umur_gen_30_34th_l: val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL),
        jmlh_pas_hidup_mati_umur_gen_30_34th_p: val(item.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP),
        jmlh_pas_hidup_mati_umur_gen_35_39th_l: val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL),
        jmlh_pas_hidup_mati_umur_gen_35_39th_p: val(item.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP),
        jmlh_pas_hidup_mati_umur_gen_40_44th_l: val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL),
        jmlh_pas_hidup_mati_umur_gen_40_44th_p: val(item.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP),
        jmlh_pas_hidup_mati_umur_gen_45_49th_l: val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL),
        jmlh_pas_hidup_mati_umur_gen_45_49th_p: val(item.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP),
        jmlh_pas_hidup_mati_umur_gen_50_54th_l: val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL),
        jmlh_pas_hidup_mati_umur_gen_50_54th_p: val(item.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP),
        jmlh_pas_hidup_mati_umur_gen_55_59th_l: val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL),
        jmlh_pas_hidup_mati_umur_gen_55_59th_p: val(item.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP),
        jmlh_pas_hidup_mati_umur_gen_60_64th_l: val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL),
        jmlh_pas_hidup_mati_umur_gen_60_64th_p: val(item.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP),
        jmlh_pas_hidup_mati_umur_gen_65_69th_l: val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL),
        jmlh_pas_hidup_mati_umur_gen_65_69th_p: val(item.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP),
        jmlh_pas_hidup_mati_umur_gen_70_74th_l: val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL),
        jmlh_pas_hidup_mati_umur_gen_70_74th_p: val(item.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP),
        jmlh_pas_hidup_mati_umur_gen_75_79th_l: val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL),
        jmlh_pas_hidup_mati_umur_gen_75_79th_p: val(item.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP),
        jmlh_pas_hidup_mati_umur_gen_80_84th_l: val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL),
        jmlh_pas_hidup_mati_umur_gen_80_84th_p: val(item.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_l: val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL),
        jmlh_pas_hidup_mati_umur_gen_lebih85th_p: val(item.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP),

        jmlh_pas_hidup_mati_gen_l: totalL,
        jmlh_pas_hidup_mati_gen_p: totalP,
        total_pas_hidup_mati: total,

        jmlh_pas_keluar_mati_gen_l: val(item.jumlahPasienKeluarMatiL),
        jmlh_pas_keluar_mati_gen_p: val(item.jumlahPasienKeluarMatiP),
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

    // collect relErrors from above iterations if any (we used relErrors inside loop but didn't aggregate outside)
    const relErrors = [];
    toUpdate.forEach((d, i) => {
      const no = i + 1;
      if (d.total_pas_keluar_mati > d.total_pas_hidup_mati) {
        relErrors.push(`Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`);
      }
      if (d.jmlh_pas_keluar_mati_gen_l > d.jmlh_pas_hidup_mati_gen_l) {
        relErrors.push(`Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`);
      }
      if (d.jmlh_pas_keluar_mati_gen_p > d.jmlh_pas_hidup_mati_gen_p) {
        relErrors.push(`Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`);
      }
    });

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


export const deleteDataRLEmpatTitikSatuExternal = async (req, res) => {
   const schema = Joi.object({
    dataId: Joi.array()
      .items(
        Joi.Number().integer().required()
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
   const idsToDelete = req.body.dataId.map((v) => Number(v));
  let transaction;
   try {
    transaction = await databaseSIRS.transaction();

    const rows = await rlEmpatTitikSatuDetail.findAll({
      where: { id: { [Op.in]: idsToDelete } },
      attributes: ['id', 'rs_id'],
      raw: true,
      transaction,
    });

    const foundIds = rows.map(r => Number(r.id));
    const missingIds = idsToDelete.filter(id => !foundIds.includes(id));

    if (missingIds.length > 0) {
      await transaction.rollback();
      return res.status(404).send({
        status: false,
        message: "Data tidak ditemukan",
        missingIds,
      });
    }

    const notOwned = rows.filter(r => Number(r.rs_id) !== Number(req.user.satKerId));
    if (notOwned.length > 0) {
      await transaction.rollback();
      return res.status(403).send({
        status: false,
        message: "Beberapa data bukan milik RS Anda",
        details: notOwned.map(r => ({ id: r.id, rs_id: r.rs_id })),
      });
    }

    const deletedCount = await rlEmpatTitikSatuDetail.destroy({
      where: {
        id: { [Op.in]: idsToDelete },
        rs_id: req.user.satKerId,
      },
      transaction,
    });

    if (deletedCount > 0) {
      await transaction.commit();
      return res.status(200).send({
        status: true,
        message: "Data berhasil dihapus",
        data: { deleted_rows: deletedCount, requested_ids: idsToDelete },
      });
    } else {
      await transaction.rollback();
      return res.status(500).send({
        status: false,
        message: "Gagal menghapus data.",
      });
    }
  } catch (err) {
    if (transaction) {
      try { await transaction.rollback(); } catch (e) { /* ignore */ }
    }
    console.error("deleteManyRLEmpatTitikSatuExternal error:", err);
    return res.status(500).send({
      status: false,
      message: "Terjadi kesalahan pada server saat memproses penghapusan.",
      error: err?.message || err,
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