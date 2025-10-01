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

  const whereClause = {
    rs_id: req.user.satKerId,
    periode: req.query.periode,
  };

  rlEmpatTitikSatuDetail
    .findAll({
      include: {
        model: icd,
        attributes: ["id", "icd_code", "description_code", "icd_code_group", "description_code_group"],
      },
      attributes: [
        "id", 
        "periode",
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
        "jmlh_pas_keluar_mati_gen_l",
        "jmlh_pas_keluar_mati_gen_p",
        "total_pas_hidup_mati",
        "total_pas_keluar_mati",
      ],
      where: whereClause,
    })
    .then((results) => {
      // Mapping response data
      const modifiedResults = results.map(result => {
        return {
          id: result.id,
          periode: result.periode,
          jumlahPasienHidupDanMatiUmurKurangDari1JamL: result.jmlh_pas_hidup_mati_umur_gen_0_1jam_l,
          jumlahPasienHidupDanMatiUmurKurangDari1JamP: result.jmlh_pas_hidup_mati_umur_gen_0_1jam_p,
          jumlahPasienHidupDanMatiUmur1JamSampai23JamL: result.jmlh_pas_hidup_mati_umur_gen_1_23jam_l,
          jumlahPasienHidupDanMatiUmur1JamSampai23JamP: result.jmlh_pas_hidup_mati_umur_gen_1_23jam_p,
          jumlahPasienHidupDanMatiUmur1HariSampai7HariL: result.jmlh_pas_hidup_mati_umur_gen_1_7hr_l,
          jumlahPasienHidupDanMatiUmur1HariSampai7HariP: result.jmlh_pas_hidup_mati_umur_gen_1_7hr_p,
          jumlahPasienHidupDanMatiUmur8HariSampai28HariL: result.jmlh_pas_hidup_mati_umur_gen_8_28hr_l,
          jumlahPasienHidupDanMatiUmur8HariSampai28HariP: result.jmlh_pas_hidup_mati_umur_gen_8_28hr_p,
          jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL: result.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l,
          jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP: result.jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p,
          jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL: result.jmlh_pas_hidup_mati_umur_gen_3_6bln_l,
          jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP: result.jmlh_pas_hidup_mati_umur_gen_3_6bln_p,
          jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL: result.jmlh_pas_hidup_mati_umur_gen_6_11bln_l,
          jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP: result.jmlh_pas_hidup_mati_umur_gen_6_11bln_p,
          jumlahPasienHidupDanMatiUmur1TahunSampai4tTahun: result.jmlh_pas_hidup_mati_umur_gen_1_4th_l,
          jumlahPasienHidupDanMatiUmur5TahunSampai9tTahun: result.jmlh_pas_hidup_mati_umur_gen_5_9th_l,
          jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL: result.jmlh_pas_hidup_mati_umur_gen_10_14th_l,
          jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP: result.jmlh_pas_hidup_mati_umur_gen_10_14th_p,
          jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL: result.jmlh_pas_hidup_mati_umur_gen_15_19th_l,
          jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP: result.jmlh_pas_hidup_mati_umur_gen_15_19th_p,
          jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL: result.jmlh_pas_hidup_mati_umur_gen_20_24th_l,
          jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP: result.jmlh_pas_hidup_mati_umur_gen_20_24th_p,
          jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL: result.jmlh_pas_hidup_mati_umur_gen_25_29th_l,
          jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP: result.jmlh_pas_hidup_mati_umur_gen_25_29th_p,
          jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL: result.jmlh_pas_hidup_mati_umur_gen_30_34th_l,
          jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP: result.jmlh_pas_hidup_mati_umur_gen_30_34th_p,
          jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL: result.jmlh_pas_hidup_mati_umur_gen_35_39th_l,
          jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP: result.jmlh_pas_hidup_mati_umur_gen_35_39th_p,
          jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL: result.jmlh_pas_hidup_mati_umur_gen_40_44th_l,
          jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP: result.jmlh_pas_hidup_mati_umur_gen_40_44th_p,
          jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL: result.jmlh_pas_hidup_mati_umur_gen_45_49th_l,
          jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP: result.jmlh_pas_hidup_mati_umur_gen_45_49th_p,
          jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL: result.jmlh_pas_hidup_mati_umur_gen_50_54th_l,
          jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP: result.jmlh_pas_hidup_mati_umur_gen_50_54th_p,
          jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL: result.jmlh_pas_hidup_mati_umur_gen_55_59th_l,
          jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP: result.jmlh_pas_hidup_mati_umur_gen_55_59th_p,
          jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL: result.jmlh_pas_hidup_mati_umur_gen_60_64th_l,
          jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP: result.jmlh_pas_hidup_mati_umur_gen_60_64th_p,
          jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL: result.jmlh_pas_hidup_mati_umur_gen_65_69th_l,
          jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP: result.jmlh_pas_hidup_mati_umur_gen_65_69th_p,
          jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL: result.jmlh_pas_hidup_mati_umur_gen_70_74th_l,
          jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP: result.jmlh_pas_hidup_mati_umur_gen_70_74th_p,
          jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL: result.jmlh_pas_hidup_mati_umur_gen_75_79th_l,
          jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP: result.jmlh_pas_hidup_mati_umur_gen_75_79th_p,
          jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL: result.jmlh_pas_hidup_mati_umur_gen_80_84th_l,
          jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP: result.jmlh_pas_hidup_mati_umur_gen_80_84th_p,
          jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL: result.jmlh_pas_hidup_mati_umur_gen_lebih85th_l,
          jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP: result.jmlh_pas_hidup_mati_umur_gen_lebih85th_p,
          jumlahPasienHidupDanMatiL: result.jmlh_pas_hidup_mati_gen_l,
          jumlahPasienHidupDanMatiP: result.jmlh_pas_hidup_mati_gen_p,
          jumlahPasienKeluarDanMatiL: result.jmlh_pas_keluar_mati_gen_l,
          jumlahPasienKeluarDanMatiP: result.jmlh_pas_keluar_mati_gen_p,
          totalPasienHidupMati: result.total_pas_hidup_mati,
          totalPasienKeluarMati: result.total_pas_keluar_mati,
          icdCode: result.icd.icd_code
        };
      });

      res.status(200).send({
        status: true,
        message: "data found",
        data: modifiedResults,
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

  const dataDetail = [];
    const relErrorsAll = [];
    for (const [index, item] of value.data.entries()) {
      const idx = index+1
      console.log("tes ",idx)
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
        relErrors.push(`Data ke-${idx}: Jumlah Pasien Keluar Mati Lebih Dari Jumlah Pasien Hidup/Mati.`);
      }
      if (val(item.jumlahPasienKeluarMatiL) > totalL) {
        relErrors.push(`Data ke-${idx}: Jumlah Pasien Keluar Mati Laki-Laki Lebih Dari Jumlah Pasien Keluar Hidup/Mati Laki-Laki.`);
      }
      if (val(item.jumlahPasienKeluarMatiP) > totalP) {
        relErrors.push(`Data ke-${idx}: Jumlah Pasien Keluar Mati Perempuan Lebih Dari Jumlah Pasien Keluar Hidup/Mati Perempuan.`);
      }


      if (relErrors.length > 0) {
        relErrorsAll.push(...relErrors);
        continue;
      }

      dataDetail.push ({
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
      });
    };
        if (relErrorsAll.length > 0) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: relErrorsAll,
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
      message: "Gagal Input Data Harap Hubungi Admin.",
    });
  }
};

export const updateDataRLEmpatTitikSatuExternal = async (req, res) => {
  
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send({
      status: false,
      message: "Parameter id tidak valid",
    });
  }

  
  const schemaBody = Joi.object({
    jumlahPasienHidupDanMatiUmurKurangDari1JamL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmurKurangDari1JamP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1JamSampai23JamL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1JamSampai23JamP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1HariSampai7HariL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1HariSampai7HariP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur8HariSampai28HariL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur8HariSampai28HariP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL: Joi.number().integer().min(0).default(0),
    jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP: Joi.number().integer().min(0).default(0),
    jumlahPasienKeluarMatiL: Joi.number().integer().min(0).default(0),
    jumlahPasienKeluarMatiP: Joi.number().integer().min(0).default(0),
  }).required();

  const { error, value } = schemaBody.validate(req.body, { abortEarly: false, convert: true });
  if (error) {
    return res.status(400).send({
      status: false,
      message: "Validasi schema gagal",
      details: error.details.map(d => d.message),
    });
  }

  const val = x => Number(x ?? 0);

  try {
    
    const existing = await rlEmpatTitikSatuDetail.findOne({
      where: { id, rs_id: req.user.satKerId },
      attributes: ["id", "rs_id", "icd_id"],
      raw: true,
    });

    if (!existing) {
      return res.status(404).send({
        status: false,
        message: "Data tidak ditemukan atau bukan milik RS Anda.",
      });
    }

   
    const master = await icd.findOne({
      where: { id: existing.icd_id, status_rawat_inap: 1, is_active: 1 },
      attributes: ["id", "icd_code", "status_laki", "status_perempuan"],
      raw: true,
    });

    if (!master) {
      return res.status(400).send({
        status: false,
        message: "ICD terkait tidak valid (bukan untuk rawat inap atau tidak aktif).",
      });
    }

    
    const keys = Object.keys(value);
    const lKeys = keys.filter(k => k.endsWith("L")).filter(k => k !== "jumlahPasienKeluarMatiL");
    const pKeys = keys.filter(k => k.endsWith("P")).filter(k => k !== "jumlahPasienKeluarMatiP");

    if (Number(master.status_laki) === 0) {
      const filledL = lKeys.filter(k => val(value[k]) > 0);
      if (filledL.length > 0) {
        return res.status(400).send({
          status: false,
          message: `Parameter untuk Jenis Kelamin L (Laki) tidak boleh bernilai > 0 karena ICD khusus pasien Perempuan.`,
          details: filledL,
        });
      }
    }
    if (Number(master.status_perempuan) === 0) {
      const filledP = pKeys.filter(k => val(value[k]) > 0);
      if (filledP.length > 0) {
        return res.status(400).send({
          status: false,
          message: `Parameter untuk Jenis Kelamin P (Perempuan) tidak boleh bernilai > 0 karena ICD khusus pasien Laki.`,
          details: filledP,
        });
      }
    }

   
    const totalL = [
      value.jumlahPasienHidupDanMatiUmurKurangDari1JamL,
      value.jumlahPasienHidupDanMatiUmur1JamSampai23JamL,
      value.jumlahPasienHidupDanMatiUmur1HariSampai7HariL,
      value.jumlahPasienHidupDanMatiUmur8HariSampai28HariL,
      value.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL,
      value.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL,
      value.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL,
      value.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL,
      value.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL,
      value.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL,
      value.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL,
      value.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL,
      value.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL,
      value.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL,
      value.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL,
      value.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL,
      value.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL,
      value.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL,
      value.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL,
      value.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL,
      value.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL,
      value.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL,
      value.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL,
      value.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL,
      value.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL,
    ].reduce((s, x) => s + val(x), 0);

    const totalP = [
      value.jumlahPasienHidupDanMatiUmurKurangDari1JamP,
      value.jumlahPasienHidupDanMatiUmur1JamSampai23JamP,
      value.jumlahPasienHidupDanMatiUmur1HariSampai7HariP,
      value.jumlahPasienHidupDanMatiUmur8HariSampai28HariP,
      value.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP,
      value.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP,
      value.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP,
      value.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP,
      value.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP,
      value.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP,
      value.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP,
      value.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP,
      value.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP,
      value.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP,
      value.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP,
      value.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP,
      value.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP,
      value.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP,
      value.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP,
      value.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP,
      value.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP,
      value.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP,
      value.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP,
      value.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP,
      value.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP,
    ].reduce((s, x) => s + val(x), 0);

    const total = totalL + totalP;
    const totalKeluar = val(value.jumlahPasienKeluarMatiL) + val(value.jumlahPasienKeluarMatiP);

   
    if (totalKeluar > total) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: ["Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati."],
      });
    }
    if (val(value.jumlahPasienKeluarMatiL) > totalL) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: ["Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki."],
      });
    }
    if (val(value.jumlahPasienKeluarMatiP) > totalP) {
      return res.status(400).send({
        status: false,
        message: "Validasi total gagal",
        errors: ["Keluar Mati Perempuan > Hidup/Mati Perempuan."],
      });
    }


    const updateObj = {
      jmlh_pas_hidup_mati_umur_gen_0_1jam_l: val(value.jumlahPasienHidupDanMatiUmurKurangDari1JamL),
      jmlh_pas_hidup_mati_umur_gen_0_1jam_p: val(value.jumlahPasienHidupDanMatiUmurKurangDari1JamP),
      jmlh_pas_hidup_mati_umur_gen_1_23jam_l: val(value.jumlahPasienHidupDanMatiUmur1JamSampai23JamL),
      jmlh_pas_hidup_mati_umur_gen_1_23jam_p: val(value.jumlahPasienHidupDanMatiUmur1JamSampai23JamP),
      jmlh_pas_hidup_mati_umur_gen_1_7hr_l: val(value.jumlahPasienHidupDanMatiUmur1HariSampai7HariL),
      jmlh_pas_hidup_mati_umur_gen_1_7hr_p: val(value.jumlahPasienHidupDanMatiUmur1HariSampai7HariP),
      jmlh_pas_hidup_mati_umur_gen_8_28hr_l: val(value.jumlahPasienHidupDanMatiUmur8HariSampai28HariL),
      jmlh_pas_hidup_mati_umur_gen_8_28hr_p: val(value.jumlahPasienHidupDanMatiUmur8HariSampai28HariP),
      jmlh_pas_hidup_mati_umur_gen_29hr_3bln_l: val(value.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanL),
      jmlh_pas_hidup_mati_umur_gen_29hr_3bln_p: val(value.jumlahPasienHidupDanMatiUmur2HariSampai9Hari3BulanP),
      jmlh_pas_hidup_mati_umur_gen_3_6bln_l: val(value.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanL),
      jmlh_pas_hidup_mati_umur_gen_3_6bln_p: val(value.jumlahPasienHidupDanMatiUmur3BulanSampai6BulanP),
      jmlh_pas_hidup_mati_umur_gen_6_11bln_l: val(value.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanL),
      jmlh_pas_hidup_mati_umur_gen_6_11bln_p: val(value.jumlahPasienHidupDanMatiUmur6BulanSampai11BulanP),
      jmlh_pas_hidup_mati_umur_gen_1_4th_l: val(value.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunL),
      jmlh_pas_hidup_mati_umur_gen_1_4th_p: val(value.jumlahPasienHidupDanMatiUmur1TahunSampai4TahunP),
      jmlh_pas_hidup_mati_umur_gen_5_9th_l: val(value.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunL),
      jmlh_pas_hidup_mati_umur_gen_5_9th_p: val(value.jumlahPasienHidupDanMatiUmur5TahunSampai9TahunP),
      jmlh_pas_hidup_mati_umur_gen_10_14th_l: val(value.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunL),
      jmlh_pas_hidup_mati_umur_gen_10_14th_p: val(value.jumlahPasienHidupDanMatiUmur10TahunSampai14TahunP),
      jmlh_pas_hidup_mati_umur_gen_15_19th_l: val(value.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunL),
      jmlh_pas_hidup_mati_umur_gen_15_19th_p: val(value.jumlahPasienHidupDanMatiUmur15TahunSampai19TahunP),
      jmlh_pas_hidup_mati_umur_gen_20_24th_l: val(value.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunL),
      jmlh_pas_hidup_mati_umur_gen_20_24th_p: val(value.jumlahPasienHidupDanMatiUmur20TahunSampai24TahunP),
      jmlh_pas_hidup_mati_umur_gen_25_29th_l: val(value.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunL),
      jmlh_pas_hidup_mati_umur_gen_25_29th_p: val(value.jumlahPasienHidupDanMatiUmur25TahunSampai29TahunP),
      jmlh_pas_hidup_mati_umur_gen_30_34th_l: val(value.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunL),
      jmlh_pas_hidup_mati_umur_gen_30_34th_p: val(value.jumlahPasienHidupDanMatiUmur30TahunSampai34TahunP),
      jmlh_pas_hidup_mati_umur_gen_35_39th_l: val(value.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunL),
      jmlh_pas_hidup_mati_umur_gen_35_39th_p: val(value.jumlahPasienHidupDanMatiUmur35TahunSampai39TahunP),
      jmlh_pas_hidup_mati_umur_gen_40_44th_l: val(value.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunL),
      jmlh_pas_hidup_mati_umur_gen_40_44th_p: val(value.jumlahPasienHidupDanMatiUmur40TahunSampai44TahunP),
      jmlh_pas_hidup_mati_umur_gen_45_49th_l: val(value.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunL),
      jmlh_pas_hidup_mati_umur_gen_45_49th_p: val(value.jumlahPasienHidupDanMatiUmur45TahunSampai49TahunP),
      jmlh_pas_hidup_mati_umur_gen_50_54th_l: val(value.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunL),
      jmlh_pas_hidup_mati_umur_gen_50_54th_p: val(value.jumlahPasienHidupDanMatiUmur50TahunSampai54TahunP),
      jmlh_pas_hidup_mati_umur_gen_55_59th_l: val(value.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunL),
      jmlh_pas_hidup_mati_umur_gen_55_59th_p: val(value.jumlahPasienHidupDanMatiUmur55TahunSampai59TahunP),
      jmlh_pas_hidup_mati_umur_gen_60_64th_l: val(value.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunL),
      jmlh_pas_hidup_mati_umur_gen_60_64th_p: val(value.jumlahPasienHidupDanMatiUmur60TahunSampai64TahunP),
      jmlh_pas_hidup_mati_umur_gen_65_69th_l: val(value.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunL),
      jmlh_pas_hidup_mati_umur_gen_65_69th_p: val(value.jumlahPasienHidupDanMatiUmur65TahunSampai69TahunP),
      jmlh_pas_hidup_mati_umur_gen_70_74th_l: val(value.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunL),
      jmlh_pas_hidup_mati_umur_gen_70_74th_p: val(value.jumlahPasienHidupDanMatiUmur70TahunSampai74TahunP),
      jmlh_pas_hidup_mati_umur_gen_75_79th_l: val(value.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunL),
      jmlh_pas_hidup_mati_umur_gen_75_79th_p: val(value.jumlahPasienHidupDanMatiUmur75TahunSampai79TahunP),
      jmlh_pas_hidup_mati_umur_gen_80_84th_l: val(value.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunL),
      jmlh_pas_hidup_mati_umur_gen_80_84th_p: val(value.jumlahPasienHidupDanMatiUmur80TahunSampai84TahunP),
      jmlh_pas_hidup_mati_umur_gen_lebih85th_l: val(value.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunL),
      jmlh_pas_hidup_mati_umur_gen_lebih85th_p: val(value.jumlahPasienHidupDanMatiUmurLebihDariAtauSamaDengan85TahunP),

      jmlh_pas_hidup_mati_gen_l: totalL,
      jmlh_pas_hidup_mati_gen_p: totalP,
      total_pas_hidup_mati: total,

      jmlh_pas_keluar_mati_gen_l: val(value.jumlahPasienKeluarMatiL),
      jmlh_pas_keluar_mati_gen_p: val(value.jumlahPasienKeluarMatiP),
      total_pas_keluar_mati: totalKeluar,
    };

    
    let transaction;
    try {
      transaction = await databaseSIRS.transaction();
      await rlEmpatTitikSatuDetail.update(updateObj, { where: { id }, transaction });
      await transaction.commit();

      return res.status(200).send({
        status: true,
        message: "Data updated successfully",
        data: { id },
      });
    } catch (err) {
      if (transaction) await transaction.rollback();
      console.log(err);
      return res.status(400).send({
        status: false,
        message: "Failed to update data.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      status: false,
      message: "Failed to process update.",
    });
  }
};

export const deleteDataRLEmpatTitikSatuExternal = async (req, res) => {

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send({
      status: false,
      message: "Parameter id tidak valid",
    });
  }

  let transaction;
  try {
    transaction = await databaseSIRS.transaction();

    const row = await rlEmpatTitikSatuDetail.findOne({
      where: { id },
      attributes: ["id", "rs_id"],
      raw: true,
      transaction,
      // lock: transaction.LOCK.UPDATE, 
    });

    if (!row) {
      await transaction.rollback();
      return res.status(404).send({
        status: false,
        message: "Data tidak ditemukan",
        id,
      });
    }

    if (Number(row.rs_id) !== Number(req.user.satKerId)) {
      await transaction.rollback();
      return res.status(403).send({
        status: false,
        message: "Data bukan milik RS Anda",
        id,
        rs_id: row.rs_id,
      });
    }

    const deletedCount = await rlEmpatTitikSatuDetail.destroy({
      where: { id, rs_id: req.user.satKerId },
      transaction,
    });

    if (deletedCount > 0) {
      await transaction.commit();
      return res.status(200).send({
        status: true,
        message: "Data berhasil dihapus",
        data: { deleted_rows: deletedCount, id },
      });
    } else {
      await transaction.rollback();
      return res.status(500).send({
        status: false,
        message: "Gagal menghapus data.",
        id,
      });
    }
  } catch (err) {
    if (transaction) {
      try { await transaction.rollback(); } catch (e) { console.log(err) }
    }
    console.error("deleteDataRLEmpatTitikSatuExternal error:", err);
    return res.status(500).send({
      status: false,
      message: "Terjadi kesalahan saat menghapus data.",
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