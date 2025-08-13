import { databaseSIRS } from "../config/Database.js";
import Joi from "joi";
import { IcdRLLimaTitikSatu } from "../models/IcdRLLimaTitikSatuModel.js";
import joiDate from "@joi/date";
import {
  rlLimaTitikSatuDetail,
  rlLimaTitikSatuHeader,
  rlLimaTitikSatuSatuSehat,
} from "../models/RLLimaTitikSatuModel.js";
import { satu_sehat_id, users_sso } from "../models/UserModel.js";
import axios from "axios";
import dotenv from "dotenv";
import { AgeGroups } from "../models/AgeGroups.js";
dotenv.config();

export const getDataRLLimaTitikSatu = (req, res) => {
  const joi = Joi.extend(joiDate);
  const schema = joi.object({
    rsId: joi.string().required(),
    periode: joi.date().format("YYYY-M").required(),
    page: joi.number(),
    limit: joi.number(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  let whereClause = {};
  if (req.user.jenisUserId == 4) {
    if (req.query.rsId != req.user.satKerId) {
      res.status(404).send({
        status: false,
        message: "Kode RS Tidak Sesuai",
      });
      return;
    }
    whereClause = {
      rs_id: req.user.satKerId,
      periode: req.query.periode,
    };
  } else {
    whereClause = {
      rs_id: req.query.rsId,
      periode: req.query.periode,
    };
  }

  rlLimaTitikSatuDetail
    .findAll({
      include: {
        model: IcdRLLimaTitikSatu,
        attributes: [
          "icd_code",
          "description_code",
          "icd_code_group",
          "description_code_group",
        ],
      },
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

export const getDataRLLimaTitikSatuById = (req, res) => {
  rlLimaTitikSatuDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: IcdRLLimaTitikSatu,
        attributes: [
          "icd_code",
          "description_code",
          "icd_code_group",
          "description_code_group",
        ],
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

export const getDataRLLimaTitikSatuSatuSehat = async (req, res) => {
  const joi = Joi.extend(joiDate);
  const schema = joi.object({
    rsId: joi.string().required(),
    periode: joi.date().format("YYYY-MM").required(),
    page: joi.number(),
    limit: joi.number(),
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
  }

  if (req.user.jenisUserId == 4) {
    if (req.query.rsId != req.user.satKerId) {
      return res.status(404).send({
        status: false,
        message: "Kode RS Tidak Sesuai",
      });
    }

    // USER RS
    const koders = req.user.satKerId;
    const periodeget = req.query.periode;

    try {
      const satuSehat = await satu_sehat_id.findOne({
        where: { kode_baru_faskes: koders },
        attributes: ["organization_id"],
      });

      if (!satuSehat) {
        return res.status(404).send({
          status: false,
          message: "OrganizationId Tidak Ada",
        });
      }

      const organization_id = satuSehat.organization_id;

      const response = await axios.get(
        `${process.env.SATUSEHAT_BASE_URL}/rl51?month=${periodeget}&organization_id=${organization_id}`,
        {
          headers: {
            "X-API-Key": process.env.SATUSEHAT_API_KEY,
          },
        }
      );

      // const response = {
      //   data: {
      //     records: [
      //       {
      //         icd10: "I10",
      //         diagnosis: "Essential (primary) hypertension",
      //         new_cases: [
      //           {
      //             age_id: "001",
      //             age_name: "< 1 jam",
      //             male_new_cases: 20,
      //             female_new_cases: 22,
      //           },
      //           {
      //             age_id: "002",
      //             age_name: "1 jam - < 24 jam",
      //             male_new_cases: 10,
      //             female_new_cases: 12,
      //           },
      //         ],
      //         male_new_cases: 30,
      //         female_new_cases: 34,
      //         total_new_cases: 64,
      //         male_visits: 100,
      //         female_visits: 200,
      //         total_visits: 300,
      //       },
      //       {
      //         icd10: "E11",
      //         diagnosis: "Type 2 diabetes mellitus",
      //         new_cases: [
      //           {
      //             age_id: "003",
      //             age_name: "1-4 tahun",
      //             male_new_cases: 2,
      //             female_new_cases: 3,
      //           },
      //         ],
      //         male_new_cases: 2,
      //         female_new_cases: 3,
      //         total_new_cases: 5,
      //         male_visits: 4,
      //         female_visits: 5,
      //         total_visits: 9,
      //       },
      //     ],
      //   },
      // };

      // console.log(response.data.data.records);

      const records = response.data?.data?.records;

      // await delay(10000);

      // // SAVE DATA KE DB
      await saveRecords(records, organization_id, `${periodeget}-01`);

      res.status(200).send({
        status: true,
        message: "Data berhasil diambil dan disimpan",
        // data: responseData,
      });

      // res.status(200).send({
      //   status: true,
      //   message: "data found",
      //   data: response.data,
      // });
    } catch (err) {
      console.log(err);
      // Kalau error dari axios (seperti 404)
      // if (err.response) {
      //   const statusCode = err.response.status;
      //   const errorMessage =
      //     err.response.data?.message || "Error from external API";
      //   if (statusCode === 404) {
      //     return res.status(404).json({
      //       status: false,
      //       message: errorMessage,
      //       detail: "Data tidak ditemukan dari API Satusehat",
      //     });
      //   }
      //   // Untuk error lain dari API
      //   return res.status(statusCode).json({
      //     status: false,
      //     message: errorMessage,
      //     detail: "Error dari Satusehat",
      //   });
      // }
      // // Untuk error umum (misalnya timeout, DNS error, dll)
      // return res.status(500).json({
      //   status: false,
      //   message: "Gagal mengambil data dari Satusehat",
      //   detail: error.message,
      // });
    }
  } else {
    return res.status(404).send({
      status: false,
      message: "Untuk Dinkes belum bisa menarik data",
    });
  }
};

// fungsi delay pakai Promise agar bisa di-await
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getDataRLLimaTitikSatuSatuSehatShow = async (req, res) => {
  const joi = Joi.extend(joiDate);
  const schema = joi.object({
    rsId: joi.string().required(),
    periode: joi.date().format("YYYY-MM").required(),
    page: joi.number(),
    limit: joi.number(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
  }

  let koders;
  let periodeget;

  if (req.user.jenisUserId == 4) {
    if (req.query.rsId != req.user.satKerId) {
      return res.status(404).send({
        status: false,
        message: "Kode RS Tidak Sesuai",
      });
    }

    // USER RS
    koders = req.user.satKerId;
    periodeget = req.query.periode;
  } else {
    // return res.status(404).send({
    //   status: false,
    //   message: "Untuk Dinkes belum bisa menarik data",
    // });

    koders = req.query.rsId;
    periodeget = req.query.periode;
  }

  try {
    const satuSehat = await satu_sehat_id.findOne({
      where: { kode_baru_faskes: koders },
      attributes: ["organization_id"],
    });

    if (!satuSehat) {
      return res.status(404).send({
        status: false,
        message: "OrganizationId Tidak Ada",
      });
    }

    const organization_id = satuSehat.organization_id;

    const result = await rlLimaTitikSatuSatuSehat.findAll({
      where: {
        organization_id: organization_id, // bisa string atau number, sesuaikan tipe data db
        periode: periodeget,
      },
      attributes: [
        "icd_10",
        "diagnosis",
        "periode",
        "male_new_cases",
        "females_new_cases",
        "total_new_cases",
        "male_visits",
        "female_visits",
        "total_visits",
        "age_id",
      ],
      include: [
        {
          model: AgeGroups,
          attributes: ["name"], // alias 'age' nanti bisa rename di client
          required: false,
        },
        {
          model: satu_sehat_id,
          attributes: ["organization_id", "kode_baru_faskes"],
          required: false,
          include: [
            {
              model: users_sso,
              attributes: ["nama", "rs_id"],
              required: false,
            },
          ],
        },
      ],
      order: [
        ["icd_10", "ASC"],
        ["age_id", "ASC"],
      ],
    });

    const nestedData = groupByRSandAge(result);
    res.status(200).send({
      status: true,
      message: "data found",
      data: nestedData,
    });
    // .then((results) => {
    //   res.status(200).send({
    //     status: true,
    //     message: "data found",
    //     data: results,
    //   });
    // })
    // .catch((err) => {
    //   res.status(422).send({
    //     status: false,
    //     message: err,
    //   });
    //   return;
    // });
  } catch (err) {
    res.status(422).send({
      status: false,
      message: err,
    });
    return;
  }
};

function groupByRSandAge(data) {
  const rsMap = new Map();

  data.forEach((item) => {
    const orgId = item.satu_sehat_id.organization_id;
    const rsName = item.satu_sehat_id.users_sso.nama;
    const rsId = item.satu_sehat_id.users_sso.rs_id;
    const ageId = item.age_id;
    const ageName = item.age_groups_satusehat.name;

    if (!rsMap.has(orgId)) {
      rsMap.set(orgId, {
        organization_id: orgId,
        rs_id: rsId,
        rs_name: rsName,
        age_groups: new Map(),
      });
    }

    const rs = rsMap.get(orgId);

    if (!rs.age_groups.has(ageId)) {
      rs.age_groups.set(ageId, {
        age_id: ageId,
        age_name: ageName,
        records: [],
      });
    }

    const ageGroup = rs.age_groups.get(ageId);

    ageGroup.records.push({
      icd_10: item.icd_10,
      diagnosis: item.diagnosis,
      periode: item.periode,
      male_new_cases: item.male_new_cases,
      females_new_cases: item.females_new_cases,
      total_new_cases: item.total_new_cases,
      male_visits: item.male_visits,
      female_visits: item.female_visits,
      total_visits: item.total_visits,
    });
  });

  // Convert Map to Array with nested arrays
  return Array.from(rsMap.values()).map((rs) => ({
    organization_id: rs.organization_id,
    rs_id: rs.rs_id,
    rs_name: rs.rs_name,
    age_groups: Array.from(rs.age_groups.values()),
  }));
}

async function saveRecords(records, organization_id, periode) {
  for (const record of records) {
    for (const newCase of record.new_cases) {
      // 1. Pastikan age group tersedia
      const age = await AgeGroups.findByPk(newCase.age_id);
      if (!age) {
        await AgeGroups.create({
          id: newCase.age_id,
          name: newCase.age_name,
        });
      }

      // 2. Cek apakah data dengan kombinasi unik sudah ada
      const existing = await rlLimaTitikSatuSatuSehat.findOne({
        where: {
          organization_id,
          periode,
          icd_10: record.icd10,
          age_id: newCase.age_id,
        },
      });

      const total_new = newCase.male_new_cases + newCase.female_new_cases;

      const dataToSave = {
        diagnosis: record.diagnosis,
        male_new_cases: newCase.male_new_cases,
        females_new_cases: newCase.female_new_cases,
        total_new_cases: total_new,
        male_visits: record.male_visits,
        female_visits: record.female_visits,
        total_visits: record.total_visits,
      };

      if (existing) {
        // 3. Jika sudah ada, update
        await existing.update(dataToSave);
      } else {
        // 4. Jika belum ada, create
        await rlLimaTitikSatuSatuSehat.create({
          ...dataToSave,
          organization_id,
          periode,
          icd_10: record.icd10,
          age_id: newCase.age_id,
        });
      }
    }
  }
}

export const insertdataRLLimaTitikSatu = async (req, res) => {
  const schema = Joi.object({
    periodeBulan: Joi.number().greater(0).less(13).required(),
    periodeTahun: Joi.number().greater(2022).required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            icdId: Joi.number().required(),
            jumlah_L_dibawah_1_jam: Joi.number().min(0).required(),
            jumlah_P_dibawah_1_jam: Joi.number().min(0).required(),
            jumlah_L_1_sampai_23_jam: Joi.number().min(0).required(),
            jumlah_P_1_sampai_23_jam: Joi.number().min(0).required(),
            jumlah_L_1_sampai_7_hari: Joi.number().min(0).required(),
            jumlah_P_1_sampai_7_hari: Joi.number().min(0).required(),
            jumlah_L_8_sampai_28_hari: Joi.number().min(0).required(),
            jumlah_P_8_sampai_28_hari: Joi.number().min(0).required(),
            jumlah_L_29_hari_sampai_dibawah_3_bulan: Joi.number()
              .min(0)
              .required(),
            jumlah_P_29_hari_sampai_dibawah_3_bulan: Joi.number()
              .min(0)
              .required(),
            jumlah_L_3_bulan_sampai_dibawah_6_bulan: Joi.number()
              .min(0)
              .required(),
            jumlah_P_3_bulan_sampai_dibawah_6_bulan: Joi.number()
              .min(0)
              .required(),
            jumlah_L_6_bulan_sampai_11_bulan: Joi.number().min(0).required(),
            jumlah_P_6_bulan_sampai_11_bulan: Joi.number().min(0).required(),
            jumlah_L_1_sampai_4_tahun: Joi.number().min(0).required(),
            jumlah_P_1_sampai_4_tahun: Joi.number().min(0).required(),
            jumlah_L_5_sampai_9_tahun: Joi.number().min(0).required(),
            jumlah_P_5_sampai_9_tahun: Joi.number().min(0).required(),
            jumlah_L_10_sampai_14_tahun: Joi.number().min(0).required(),
            jumlah_P_10_sampai_14_tahun: Joi.number().min(0).required(),
            jumlah_L_15_sampai_19_tahun: Joi.number().min(0).required(),
            jumlah_P_15_sampai_19_tahun: Joi.number().min(0).required(),
            jumlah_L_20_sampai_24_tahun: Joi.number().min(0).required(),
            jumlah_P_20_sampai_24_tahun: Joi.number().min(0).required(),
            jumlah_L_25_sampai_29_tahun: Joi.number().min(0).required(),
            jumlah_P_25_sampai_29_tahun: Joi.number().min(0).required(),
            jumlah_L_30_sampai_34_tahun: Joi.number().min(0).required(),
            jumlah_P_30_sampai_34_tahun: Joi.number().min(0).required(),
            jumlah_L_35_sampai_39_tahun: Joi.number().min(0).required(),
            jumlah_P_35_sampai_39_tahun: Joi.number().min(0).required(),
            jumlah_L_40_sampai_44_tahun: Joi.number().min(0).required(),
            jumlah_P_40_sampai_44_tahun: Joi.number().min(0).required(),
            jumlah_L_45_sampai_49_tahun: Joi.number().min(0).required(),
            jumlah_P_45_sampai_49_tahun: Joi.number().min(0).required(),
            jumlah_L_50_sampai_54_tahun: Joi.number().min(0).required(),
            jumlah_P_50_sampai_54_tahun: Joi.number().min(0).required(),
            jumlah_L_55_sampai_59_tahun: Joi.number().min(0).required(),
            jumlah_P_55_sampai_59_tahun: Joi.number().min(0).required(),
            jumlah_L_60_sampai_64_tahun: Joi.number().min(0).required(),
            jumlah_P_60_sampai_64_tahun: Joi.number().min(0).required(),
            jumlah_L_65_sampai_69_tahun: Joi.number().min(0).required(),
            jumlah_P_65_sampai_69_tahun: Joi.number().min(0).required(),
            jumlah_L_70_sampai_74_tahun: Joi.number().min(0).required(),
            jumlah_P_70_sampai_74_tahun: Joi.number().min(0).required(),
            jumlah_L_75_sampai_79_tahun: Joi.number().min(0).required(),
            jumlah_P_75_sampai_79_tahun: Joi.number().min(0).required(),
            jumlah_L_80_sampai_84_tahun: Joi.number().min(0).required(),
            jumlah_P_80_sampai_84_tahun: Joi.number().min(0).required(),
            jumlah_L_diatas_85_tahun: Joi.number().min(0).required(),
            jumlah_P_diatas_85_tahun: Joi.number().min(0).required(),
            jumlah_kunjungan_L: Joi.number().min(0).required(),
            jumlah_kunjungan_P: Joi.number().min(0).required(),
          })
          .required()
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
    const periode =
      String(req.body.periodeTahun) +
      "-" +
      String(req.body.periodeBulan) +
      "-1";

    transaction = await databaseSIRS.transaction();
    const resultInsertHeader = await rlLimaTitikSatuHeader.create(
      {
        rs_id: req.user.satKerId,
        periode: periode,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      let totalL =
        value.jumlah_L_dibawah_1_jam +
        value.jumlah_L_1_sampai_23_jam +
        value.jumlah_L_1_sampai_7_hari +
        value.jumlah_L_8_sampai_28_hari +
        value.jumlah_L_29_hari_sampai_dibawah_3_bulan +
        value.jumlah_L_3_bulan_sampai_dibawah_6_bulan +
        value.jumlah_L_6_bulan_sampai_11_bulan +
        value.jumlah_L_1_sampai_4_tahun +
        value.jumlah_L_5_sampai_9_tahun +
        value.jumlah_L_10_sampai_14_tahun +
        value.jumlah_L_15_sampai_19_tahun +
        value.jumlah_L_20_sampai_24_tahun +
        value.jumlah_L_25_sampai_29_tahun +
        value.jumlah_L_30_sampai_34_tahun +
        value.jumlah_L_35_sampai_39_tahun +
        value.jumlah_L_40_sampai_44_tahun +
        value.jumlah_L_45_sampai_49_tahun +
        value.jumlah_L_50_sampai_54_tahun +
        value.jumlah_L_55_sampai_59_tahun +
        value.jumlah_L_60_sampai_64_tahun +
        value.jumlah_L_65_sampai_69_tahun +
        value.jumlah_L_70_sampai_74_tahun +
        value.jumlah_L_75_sampai_79_tahun +
        value.jumlah_L_80_sampai_84_tahun +
        value.jumlah_L_diatas_85_tahun;

      let totalP =
        value.jumlah_P_dibawah_1_jam +
        value.jumlah_P_1_sampai_23_jam +
        value.jumlah_P_1_sampai_7_hari +
        value.jumlah_P_8_sampai_28_hari +
        value.jumlah_P_29_hari_sampai_dibawah_3_bulan +
        value.jumlah_P_3_bulan_sampai_dibawah_6_bulan +
        value.jumlah_P_6_bulan_sampai_11_bulan +
        value.jumlah_P_1_sampai_4_tahun +
        value.jumlah_P_5_sampai_9_tahun +
        value.jumlah_P_10_sampai_14_tahun +
        value.jumlah_P_15_sampai_19_tahun +
        value.jumlah_P_20_sampai_24_tahun +
        value.jumlah_P_25_sampai_29_tahun +
        value.jumlah_P_30_sampai_34_tahun +
        value.jumlah_P_35_sampai_39_tahun +
        value.jumlah_P_40_sampai_44_tahun +
        value.jumlah_P_45_sampai_49_tahun +
        value.jumlah_P_50_sampai_54_tahun +
        value.jumlah_P_55_sampai_59_tahun +
        value.jumlah_P_60_sampai_64_tahun +
        value.jumlah_P_65_sampai_69_tahun +
        value.jumlah_P_70_sampai_74_tahun +
        value.jumlah_P_75_sampai_79_tahun +
        value.jumlah_P_80_sampai_84_tahun +
        value.jumlah_P_diatas_85_tahun;

      let total = totalL + totalP;

      let totalkunjungan = value.jumlah_kunjungan_L + value.jumlah_kunjungan_P;

      return {
        rl_lima_titik_satu_id: resultInsertHeader.id,
        rs_id: req.user.satKerId,
        periode: periode,
        icd_id: value.icdId,
        jumlah_L_dibawah_1_jam: value.jumlah_L_dibawah_1_jam,
        jumlah_P_dibawah_1_jam: value.jumlah_P_dibawah_1_jam,
        jumlah_L_1_sampai_23_jam: value.jumlah_L_1_sampai_23_jam,
        jumlah_P_1_sampai_23_jam: value.jumlah_P_1_sampai_23_jam,
        jumlah_L_1_sampai_7_hari: value.jumlah_L_1_sampai_7_hari,
        jumlah_P_1_sampai_7_hari: value.jumlah_P_1_sampai_7_hari,
        jumlah_L_8_sampai_28_hari: value.jumlah_L_8_sampai_28_hari,
        jumlah_P_8_sampai_28_hari: value.jumlah_P_8_sampai_28_hari,
        jumlah_L_29_hari_sampai_dibawah_3_bulan:
          value.jumlah_L_29_hari_sampai_dibawah_3_bulan,
        jumlah_P_29_hari_sampai_dibawah_3_bulan:
          value.jumlah_P_29_hari_sampai_dibawah_3_bulan,
        jumlah_L_3_bulan_sampai_dibawah_6_bulan:
          value.jumlah_L_3_bulan_sampai_dibawah_6_bulan,
        jumlah_P_3_bulan_sampai_dibawah_6_bulan:
          value.jumlah_P_3_bulan_sampai_dibawah_6_bulan,
        jumlah_L_6_bulan_sampai_11_bulan:
          value.jumlah_L_6_bulan_sampai_11_bulan,
        jumlah_P_6_bulan_sampai_11_bulan:
          value.jumlah_P_6_bulan_sampai_11_bulan,
        jumlah_L_1_sampai_4_tahun: value.jumlah_L_1_sampai_4_tahun,
        jumlah_P_1_sampai_4_tahun: value.jumlah_P_1_sampai_4_tahun,
        jumlah_L_5_sampai_9_tahun: value.jumlah_L_5_sampai_9_tahun,
        jumlah_P_5_sampai_9_tahun: value.jumlah_P_5_sampai_9_tahun,
        jumlah_L_10_sampai_14_tahun: value.jumlah_L_10_sampai_14_tahun,
        jumlah_P_10_sampai_14_tahun: value.jumlah_P_10_sampai_14_tahun,
        jumlah_L_15_sampai_19_tahun: value.jumlah_L_15_sampai_19_tahun,
        jumlah_P_15_sampai_19_tahun: value.jumlah_P_15_sampai_19_tahun,
        jumlah_L_20_sampai_24_tahun: value.jumlah_L_20_sampai_24_tahun,
        jumlah_P_20_sampai_24_tahun: value.jumlah_P_20_sampai_24_tahun,
        jumlah_L_25_sampai_29_tahun: value.jumlah_L_25_sampai_29_tahun,
        jumlah_P_25_sampai_29_tahun: value.jumlah_P_25_sampai_29_tahun,
        jumlah_L_30_sampai_34_tahun: value.jumlah_L_30_sampai_34_tahun,
        jumlah_P_30_sampai_34_tahun: value.jumlah_P_30_sampai_34_tahun,
        jumlah_L_35_sampai_39_tahun: value.jumlah_L_35_sampai_39_tahun,
        jumlah_P_35_sampai_39_tahun: value.jumlah_P_35_sampai_39_tahun,
        jumlah_L_40_sampai_44_tahun: value.jumlah_L_40_sampai_44_tahun,
        jumlah_P_40_sampai_44_tahun: value.jumlah_P_40_sampai_44_tahun,
        jumlah_L_45_sampai_49_tahun: value.jumlah_L_45_sampai_49_tahun,
        jumlah_P_45_sampai_49_tahun: value.jumlah_P_45_sampai_49_tahun,
        jumlah_L_50_sampai_54_tahun: value.jumlah_L_50_sampai_54_tahun,
        jumlah_P_50_sampai_54_tahun: value.jumlah_P_50_sampai_54_tahun,
        jumlah_L_55_sampai_59_tahun: value.jumlah_L_55_sampai_59_tahun,
        jumlah_P_55_sampai_59_tahun: value.jumlah_P_55_sampai_59_tahun,
        jumlah_L_60_sampai_64_tahun: value.jumlah_L_60_sampai_64_tahun,
        jumlah_P_60_sampai_64_tahun: value.jumlah_P_60_sampai_64_tahun,
        jumlah_L_65_sampai_69_tahun: value.jumlah_L_65_sampai_69_tahun,
        jumlah_P_65_sampai_69_tahun: value.jumlah_P_65_sampai_69_tahun,
        jumlah_L_70_sampai_74_tahun: value.jumlah_L_70_sampai_74_tahun,
        jumlah_P_70_sampai_74_tahun: value.jumlah_P_70_sampai_74_tahun,
        jumlah_L_75_sampai_79_tahun: value.jumlah_L_75_sampai_79_tahun,
        jumlah_P_75_sampai_79_tahun: value.jumlah_P_75_sampai_79_tahun,
        jumlah_L_80_sampai_84_tahun: value.jumlah_L_80_sampai_84_tahun,
        jumlah_P_80_sampai_84_tahun: value.jumlah_P_80_sampai_84_tahun,
        jumlah_L_diatas_85_tahun: value.jumlah_L_diatas_85_tahun,
        jumlah_P_diatas_85_tahun: value.jumlah_P_diatas_85_tahun,
        jumlah_kasus_baru_L: totalL,
        jumlah_kasus_baru_P: totalP,
        total_kasus_baru: total,
        jumlah_kunjungan_L: value.jumlah_kunjungan_L,
        jumlah_kunjungan_P: value.jumlah_kunjungan_P,
        total_jumlah_kunjungan: totalkunjungan,
        user_id: req.user.id,
      };
    });

    if (
      dataDetail[0].total_kasus_baru <= dataDetail[0].total_jumlah_kunjungan
    ) {
      if (
        dataDetail[0].jumlah_kasus_baru_L <= dataDetail[0].jumlah_kunjungan_L
      ) {
        if (
          dataDetail[0].jumlah_kasus_baru_P <= dataDetail[0].jumlah_kunjungan_P
        ) {
          try {
            const resultInsertDetail = await rlLimaTitikSatuDetail.bulkCreate(
              dataDetail,
              {
                transaction,
                updateOnDuplicate: [
                  "rl_lima_titik_satu_id",
                  "jumlah_L_dibawah_1_jam",
                  "jumlah_P_dibawah_1_jam",
                  "jumlah_L_1_sampai_23_jam",
                  "jumlah_P_1_sampai_23_jam",
                  "jumlah_L_1_sampai_7_hari",
                  "jumlah_P_1_sampai_7_hari",
                  "jumlah_L_8_sampai_28_hari",
                  "jumlah_P_8_sampai_28_hari",
                  "jumlah_L_29_hari_sampai_dibawah_3_bulan",
                  "jumlah_P_29_hari_sampai_dibawah_3_bulan",
                  "jumlah_L_3_bulan_sampai_dibawah_6_bulan",
                  "jumlah_P_3_bulan_sampai_dibawah_6_bulan",
                  "jumlah_L_6_bulan_sampai_11_bulan",
                  "jumlah_P_6_bulan_sampai_11_bulan",
                  "jumlah_L_1_sampai_4_tahun",
                  "jumlah_P_1_sampai_4_tahun",
                  "jumlah_L_5_sampai_9_tahun",
                  "jumlah_P_5_sampai_9_tahun",
                  "jumlah_L_10_sampai_14_tahun",
                  "jumlah_P_10_sampai_14_tahun",
                  "jumlah_L_15_sampai_19_tahun",
                  "jumlah_P_15_sampai_19_tahun",
                  "jumlah_L_20_sampai_24_tahun",
                  "jumlah_P_20_sampai_24_tahun",
                  "jumlah_L_25_sampai_29_tahun",
                  "jumlah_P_25_sampai_29_tahun",
                  "jumlah_L_30_sampai_34_tahun",
                  "jumlah_P_30_sampai_34_tahun",
                  "jumlah_L_35_sampai_39_tahun",
                  "jumlah_P_35_sampai_39_tahun",
                  "jumlah_L_40_sampai_44_tahun",
                  "jumlah_P_40_sampai_44_tahun",
                  "jumlah_L_45_sampai_49_tahun",
                  "jumlah_P_45_sampai_49_tahun",
                  "jumlah_L_50_sampai_54_tahun",
                  "jumlah_P_50_sampai_54_tahun",
                  "jumlah_L_55_sampai_59_tahun",
                  "jumlah_P_55_sampai_59_tahun",
                  "jumlah_L_60_sampai_64_tahun",
                  "jumlah_P_60_sampai_64_tahun",
                  "jumlah_L_65_sampai_69_tahun",
                  "jumlah_P_65_sampai_69_tahun",
                  "jumlah_L_70_sampai_74_tahun",
                  "jumlah_P_70_sampai_74_tahun",
                  "jumlah_L_75_sampai_79_tahun",
                  "jumlah_P_75_sampai_79_tahun",
                  "jumlah_L_80_sampai_84_tahun",
                  "jumlah_P_80_sampai_84_tahun",
                  "jumlah_L_diatas_85_tahun",
                  "jumlah_P_diatas_85_tahun",
                  "jumlah_kasus_baru_L",
                  "jumlah_kasus_baru_P",
                  "total_kasus_baru",
                  "jumlah_kunjungan_L",
                  "jumlah_kunjungan_P",
                  "total_jumlah_kunjungan",
                ],
              }
            );
            await transaction.commit();
            res.status(201).send({
              status: true,
              message: "data created",
              data: {
                id: resultInsertHeader.id,
              },
            });
          } catch (error) {
            res.status(400).send({
              status: false,
              message: "Gagal Input Data.",
            });
            console.log(error);
            await transaction.rollback();
          }
        } else {
          res.status(400).send({
            status: false,
            message:
              "Data Jumlah Kasus Baru Perempuan Lebih Dari Jumlah Kunjungan Pasien Perempuan",
          });
          await transaction.rollback();
        }
      } else {
        res.status(400).send({
          status: false,
          message:
            "Data Jumlah Kasus Baru Laki - Laki Lebih Dari Jumlah Kunjungan Pasien Laki Laki",
        });
        await transaction.rollback();
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Data Jumlah Kasus Baru Lebih Dari Jumlah Kunjungan",
      });
      await transaction.rollback();
    }
  } catch (error) {
    if (transaction) {
      if (error.name == "SequelizeForeignKeyConstraintError") {
        res.status(400).send({
          status: false,
          message: "Gagal Input Data, Jenis Kegiatan Salah.",
        });
      } else {
        res.status(400).send({
          status: false,
          message: "Gagal Input Data.",
        });
      }
      await transaction.rollback();
    }
  }
};

export const updateDataRLLimaTitikSatu = async (req, res) => {
  const schema = Joi.object({
    jumlah_L_dibawah_1_jam: Joi.number().min(0).required(),
    jumlah_P_dibawah_1_jam: Joi.number().min(0).required(),
    jumlah_L_1_sampai_23_jam: Joi.number().min(0).required(),
    jumlah_P_1_sampai_23_jam: Joi.number().min(0).required(),
    jumlah_L_1_sampai_7_hari: Joi.number().min(0).required(),
    jumlah_P_1_sampai_7_hari: Joi.number().min(0).required(),
    jumlah_L_8_sampai_28_hari: Joi.number().min(0).required(),
    jumlah_P_8_sampai_28_hari: Joi.number().min(0).required(),
    jumlah_L_29_hari_sampai_dibawah_3_bulan: Joi.number().min(0).required(),
    jumlah_P_29_hari_sampai_dibawah_3_bulan: Joi.number().min(0).required(),
    jumlah_L_3_bulan_sampai_dibawah_6_bulan: Joi.number().min(0).required(),
    jumlah_P_3_bulan_sampai_dibawah_6_bulan: Joi.number().min(0).required(),
    jumlah_L_6_bulan_sampai_11_bulan: Joi.number().min(0).required(),
    jumlah_P_6_bulan_sampai_11_bulan: Joi.number().min(0).required(),
    jumlah_L_1_sampai_4_tahun: Joi.number().min(0).required(),
    jumlah_P_1_sampai_4_tahun: Joi.number().min(0).required(),
    jumlah_L_5_sampai_9_tahun: Joi.number().min(0).required(),
    jumlah_P_5_sampai_9_tahun: Joi.number().min(0).required(),
    jumlah_L_10_sampai_14_tahun: Joi.number().min(0).required(),
    jumlah_P_10_sampai_14_tahun: Joi.number().min(0).required(),
    jumlah_L_15_sampai_19_tahun: Joi.number().min(0).required(),
    jumlah_P_15_sampai_19_tahun: Joi.number().min(0).required(),
    jumlah_L_20_sampai_24_tahun: Joi.number().min(0).required(),
    jumlah_P_20_sampai_24_tahun: Joi.number().min(0).required(),
    jumlah_L_25_sampai_29_tahun: Joi.number().min(0).required(),
    jumlah_P_25_sampai_29_tahun: Joi.number().min(0).required(),
    jumlah_L_30_sampai_34_tahun: Joi.number().min(0).required(),
    jumlah_P_30_sampai_34_tahun: Joi.number().min(0).required(),
    jumlah_L_35_sampai_39_tahun: Joi.number().min(0).required(),
    jumlah_P_35_sampai_39_tahun: Joi.number().min(0).required(),
    jumlah_L_40_sampai_44_tahun: Joi.number().min(0).required(),
    jumlah_P_40_sampai_44_tahun: Joi.number().min(0).required(),
    jumlah_L_45_sampai_49_tahun: Joi.number().min(0).required(),
    jumlah_P_45_sampai_49_tahun: Joi.number().min(0).required(),
    jumlah_L_50_sampai_54_tahun: Joi.number().min(0).required(),
    jumlah_P_50_sampai_54_tahun: Joi.number().min(0).required(),
    jumlah_L_55_sampai_59_tahun: Joi.number().min(0).required(),
    jumlah_P_55_sampai_59_tahun: Joi.number().min(0).required(),
    jumlah_L_60_sampai_64_tahun: Joi.number().min(0).required(),
    jumlah_P_60_sampai_64_tahun: Joi.number().min(0).required(),
    jumlah_L_65_sampai_69_tahun: Joi.number().min(0).required(),
    jumlah_P_65_sampai_69_tahun: Joi.number().min(0).required(),
    jumlah_L_70_sampai_74_tahun: Joi.number().min(0).required(),
    jumlah_P_70_sampai_74_tahun: Joi.number().min(0).required(),
    jumlah_L_75_sampai_79_tahun: Joi.number().min(0).required(),
    jumlah_P_75_sampai_79_tahun: Joi.number().min(0).required(),
    jumlah_L_80_sampai_84_tahun: Joi.number().min(0).required(),
    jumlah_P_80_sampai_84_tahun: Joi.number().min(0).required(),
    jumlah_L_diatas_85_tahun: Joi.number().min(0).required(),
    jumlah_P_diatas_85_tahun: Joi.number().min(0).required(),
    jumlah_kunjungan_L: Joi.number().min(0).required(),
    jumlah_kunjungan_P: Joi.number().min(0).required(),
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
    let totalL =
      req.body.jumlah_L_dibawah_1_jam +
      req.body.jumlah_L_1_sampai_23_jam +
      req.body.jumlah_L_1_sampai_7_hari +
      req.body.jumlah_L_8_sampai_28_hari +
      req.body.jumlah_L_29_hari_sampai_dibawah_3_bulan +
      req.body.jumlah_L_3_bulan_sampai_dibawah_6_bulan +
      req.body.jumlah_L_6_bulan_sampai_11_bulan +
      req.body.jumlah_L_1_sampai_4_tahun +
      req.body.jumlah_L_5_sampai_9_tahun +
      req.body.jumlah_L_10_sampai_14_tahun +
      req.body.jumlah_L_15_sampai_19_tahun +
      req.body.jumlah_L_20_sampai_24_tahun +
      req.body.jumlah_L_25_sampai_29_tahun +
      req.body.jumlah_L_30_sampai_34_tahun +
      req.body.jumlah_L_35_sampai_39_tahun +
      req.body.jumlah_L_40_sampai_44_tahun +
      req.body.jumlah_L_45_sampai_49_tahun +
      req.body.jumlah_L_50_sampai_54_tahun +
      req.body.jumlah_L_55_sampai_59_tahun +
      req.body.jumlah_L_60_sampai_64_tahun +
      req.body.jumlah_L_65_sampai_69_tahun +
      req.body.jumlah_L_70_sampai_74_tahun +
      req.body.jumlah_L_75_sampai_79_tahun +
      req.body.jumlah_L_80_sampai_84_tahun +
      req.body.jumlah_L_diatas_85_tahun;

    let totalP =
      req.body.jumlah_P_dibawah_1_jam +
      req.body.jumlah_P_1_sampai_23_jam +
      req.body.jumlah_P_1_sampai_7_hari +
      req.body.jumlah_P_8_sampai_28_hari +
      req.body.jumlah_P_29_hari_sampai_dibawah_3_bulan +
      req.body.jumlah_P_3_bulan_sampai_dibawah_6_bulan +
      req.body.jumlah_P_6_bulan_sampai_11_bulan +
      req.body.jumlah_P_1_sampai_4_tahun +
      req.body.jumlah_P_5_sampai_9_tahun +
      req.body.jumlah_P_10_sampai_14_tahun +
      req.body.jumlah_P_15_sampai_19_tahun +
      req.body.jumlah_P_20_sampai_24_tahun +
      req.body.jumlah_P_25_sampai_29_tahun +
      req.body.jumlah_P_30_sampai_34_tahun +
      req.body.jumlah_P_35_sampai_39_tahun +
      req.body.jumlah_P_40_sampai_44_tahun +
      req.body.jumlah_P_45_sampai_49_tahun +
      req.body.jumlah_P_50_sampai_54_tahun +
      req.body.jumlah_P_55_sampai_59_tahun +
      req.body.jumlah_P_60_sampai_64_tahun +
      req.body.jumlah_P_65_sampai_69_tahun +
      req.body.jumlah_P_70_sampai_74_tahun +
      req.body.jumlah_P_75_sampai_79_tahun +
      req.body.jumlah_P_80_sampai_84_tahun +
      req.body.jumlah_P_diatas_85_tahun;

    let total = totalL + totalP;

    let totalkunjungan =
      req.body.jumlah_kunjungan_L + req.body.jumlah_kunjungan_P;

    const dataUpdate = {
      jumlah_L_dibawah_1_jam: req.body.jumlah_L_dibawah_1_jam,
      jumlah_P_dibawah_1_jam: req.body.jumlah_P_dibawah_1_jam,
      jumlah_L_1_sampai_23_jam: req.body.jumlah_L_1_sampai_23_jam,
      jumlah_P_1_sampai_23_jam: req.body.jumlah_P_1_sampai_23_jam,
      jumlah_L_1_sampai_7_hari: req.body.jumlah_L_1_sampai_7_hari,
      jumlah_P_1_sampai_7_hari: req.body.jumlah_P_1_sampai_7_hari,
      jumlah_L_8_sampai_28_hari: req.body.jumlah_L_8_sampai_28_hari,
      jumlah_P_8_sampai_28_hari: req.body.jumlah_P_8_sampai_28_hari,
      jumlah_L_29_hari_sampai_dibawah_3_bulan:
        req.body.jumlah_L_29_hari_sampai_dibawah_3_bulan,
      jumlah_P_29_hari_sampai_dibawah_3_bulan:
        req.body.jumlah_P_29_hari_sampai_dibawah_3_bulan,
      jumlah_L_3_bulan_sampai_dibawah_6_bulan:
        req.body.jumlah_L_3_bulan_sampai_dibawah_6_bulan,
      jumlah_P_3_bulan_sampai_dibawah_6_bulan:
        req.body.jumlah_P_3_bulan_sampai_dibawah_6_bulan,
      jumlah_L_6_bulan_sampai_11_bulan:
        req.body.jumlah_L_6_bulan_sampai_11_bulan,
      jumlah_P_6_bulan_sampai_11_bulan:
        req.body.jumlah_P_6_bulan_sampai_11_bulan,
      jumlah_L_1_sampai_4_tahun: req.body.jumlah_L_1_sampai_4_tahun,
      jumlah_P_1_sampai_4_tahun: req.body.jumlah_P_1_sampai_4_tahun,
      jumlah_L_5_sampai_9_tahun: req.body.jumlah_L_5_sampai_9_tahun,
      jumlah_P_5_sampai_9_tahun: req.body.jumlah_P_5_sampai_9_tahun,
      jumlah_L_10_sampai_14_tahun: req.body.jumlah_L_10_sampai_14_tahun,
      jumlah_P_10_sampai_14_tahun: req.body.jumlah_P_10_sampai_14_tahun,
      jumlah_L_15_sampai_19_tahun: req.body.jumlah_L_15_sampai_19_tahun,
      jumlah_P_15_sampai_19_tahun: req.body.jumlah_P_15_sampai_19_tahun,
      jumlah_L_20_sampai_24_tahun: req.body.jumlah_L_20_sampai_24_tahun,
      jumlah_P_20_sampai_24_tahun: req.body.jumlah_P_20_sampai_24_tahun,
      jumlah_L_25_sampai_29_tahun: req.body.jumlah_L_25_sampai_29_tahun,
      jumlah_P_25_sampai_29_tahun: req.body.jumlah_P_25_sampai_29_tahun,
      jumlah_L_30_sampai_34_tahun: req.body.jumlah_L_30_sampai_34_tahun,
      jumlah_P_30_sampai_34_tahun: req.body.jumlah_P_30_sampai_34_tahun,
      jumlah_L_35_sampai_39_tahun: req.body.jumlah_L_35_sampai_39_tahun,
      jumlah_P_35_sampai_39_tahun: req.body.jumlah_P_35_sampai_39_tahun,
      jumlah_L_40_sampai_44_tahun: req.body.jumlah_L_40_sampai_44_tahun,
      jumlah_P_40_sampai_44_tahun: req.body.jumlah_P_40_sampai_44_tahun,
      jumlah_L_45_sampai_49_tahun: req.body.jumlah_L_45_sampai_49_tahun,
      jumlah_P_45_sampai_49_tahun: req.body.jumlah_P_45_sampai_49_tahun,
      jumlah_L_50_sampai_54_tahun: req.body.jumlah_L_50_sampai_54_tahun,
      jumlah_P_50_sampai_54_tahun: req.body.jumlah_P_50_sampai_54_tahun,
      jumlah_L_55_sampai_59_tahun: req.body.jumlah_L_55_sampai_59_tahun,
      jumlah_P_55_sampai_59_tahun: req.body.jumlah_P_55_sampai_59_tahun,
      jumlah_L_60_sampai_64_tahun: req.body.jumlah_L_60_sampai_64_tahun,
      jumlah_P_60_sampai_64_tahun: req.body.jumlah_P_60_sampai_64_tahun,
      jumlah_L_65_sampai_69_tahun: req.body.jumlah_L_65_sampai_69_tahun,
      jumlah_P_65_sampai_69_tahun: req.body.jumlah_P_65_sampai_69_tahun,
      jumlah_L_70_sampai_74_tahun: req.body.jumlah_L_70_sampai_74_tahun,
      jumlah_P_70_sampai_74_tahun: req.body.jumlah_P_70_sampai_74_tahun,
      jumlah_L_75_sampai_79_tahun: req.body.jumlah_L_75_sampai_79_tahun,
      jumlah_P_75_sampai_79_tahun: req.body.jumlah_P_75_sampai_79_tahun,
      jumlah_L_80_sampai_84_tahun: req.body.jumlah_L_80_sampai_84_tahun,
      jumlah_P_80_sampai_84_tahun: req.body.jumlah_P_80_sampai_84_tahun,
      jumlah_L_diatas_85_tahun: req.body.jumlah_L_diatas_85_tahun,
      jumlah_P_diatas_85_tahun: req.body.jumlah_P_diatas_85_tahun,
      jumlah_kasus_baru_L: totalL,
      jumlah_kasus_baru_P: totalP,
      total_kasus_baru: total,
      jumlah_kunjungan_L: req.body.jumlah_kunjungan_L,
      jumlah_kunjungan_P: req.body.jumlah_kunjungan_P,
      total_jumlah_kunjungan: totalkunjungan,
    };
    transaction = await databaseSIRS.transaction();
    if (total <= totalkunjungan) {
      const update = await rlLimaTitikSatuDetail.update(dataUpdate, {
        where: {
          id: req.params.id,
          rs_id: req.user.satKerId,
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
        message: "Data Jumlah Kasus Baru Lebih Dari Jumlah Kunjungan",
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

export const deleteDataRLLimaTitikSatu = async (req, res) => {
  let transaction;
  try {
    transaction = await databaseSIRS.transaction();
    const count = await rlLimaTitikSatuDetail.destroy({
      where: {
        id: req.params.id,
        rs_id: req.user.satKerId,
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
