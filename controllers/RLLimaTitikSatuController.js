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
import { Op } from "sequelize";
import { icd } from "../models/ICDModel.js";
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
      const jsonString = JSON.stringify(results);

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
      if (err.response) {
        const statusCode = err.response.status;
        const errorMessage =
          err.response.data?.message || "Error from external API";
        if (statusCode === 404) {
          return res.status(404).json({
            status: false,
            message: errorMessage,
            detail: "Data tidak ditemukan dari API Satusehat",
          });
        }
        // Untuk error lain dari API
        return res.status(statusCode).json({
          status: false,
          message: errorMessage,
          detail: "Error dari Satusehat",
        });
      }
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

    result.sort((a, b) => {
      if (a.icd_10 === b.icd_10) {
        return a.age_id - b.age_id;
      }
      return a.icd_10.localeCompare(b.icd_10, undefined, { numeric: true });
    });
    // const nestedData = groupByRSandAge(result);
    res.status(200).send({
      status: true,
      message: "data found",
      data: result,
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

export const getDataRLLimaTitikSatuSatuSehatShowPaging = async (req, res) => {
  const joi = Joi.extend(joiDate);
  const schema = joi.object({
    rsId: joi.string().required(),
    periode: joi.date().format("YYYY-MM").required(),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(100).default(100),
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
    koders = req.user.satKerId;
    periodeget = req.query.periode;
  } else {
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

    const page = value.page;
    const limit = value.limit;
    const offset = (page - 1) * limit;

    const totalData = await rlLimaTitikSatuSatuSehat.count({
      where: {
        organization_id,
        periode: periodeget,
      },
    });

    let result = await rlLimaTitikSatuSatuSehat.findAll({
      where: {
        organization_id,
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
          attributes: ["name"],
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
      limit,
      offset,
    });

    if (result.length === 0) {
      return res.status(200).send({
        status: true,
        message: "data found",
        satu_sehat_id: null,
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
      });
    }

    // Ambil satu_sehat_id dan users_sso dari data pertama
    const satuSehatData = result[0].satu_sehat_id;

    // Hapus properti satu_sehat_id di tiap record agar tidak duplikat
    result = result.map((item) => {
      const plain = item.get({ plain: true });
      delete plain.satu_sehat_id;
      return plain;
    });

    res.status(200).send({
      status: true,
      message: "data found",
      satu_sehat_id: satuSehatData,
      data: result,
      pagination: {
        total: totalData,
        page,
        limit,
        pages: Math.ceil(totalData / limit),
      },
    });
  } catch (err) {
    res.status(422).send({
      status: false,
      message: err.message || err,
    });
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
  // 1. Load all existing AgeGroups once
  const existingAges = await AgeGroups.findAll();
  const ageMap = new Map(existingAges.map((age) => [age.id, age.name]));

  // 2. Prepare new AgeGroups (if needed)
  const newAgeGroups = [];
  const dataToUpsert = [];

  for (const record of records) {
    for (const newCase of record.new_cases) {
      const age_id = newCase.age_id;
      const age_name = newCase.age_name;

      // Add missing age groups
      if (!ageMap.has(age_id)) {
        newAgeGroups.push({ id: age_id, name: age_name });
        ageMap.set(age_id, age_name);
      }

      const total_new = newCase.male_new_cases + newCase.female_new_cases;

      dataToUpsert.push({
        organization_id,
        periode,
        icd_10: record.icd10,
        age_id: age_id,
        diagnosis: record.diagnosis,
        male_new_cases: newCase.male_new_cases,
        females_new_cases: newCase.female_new_cases,
        total_new_cases: total_new,
        male_visits: record.male_visits,
        female_visits: record.female_visits,
        total_visits: record.total_visits,
      });
    }
  }

  // 3. Bulk insert missing age groups
  if (newAgeGroups.length > 0) {
    await AgeGroups.bulkCreate(newAgeGroups, {
      ignoreDuplicates: true,
    });
  }

  // 4. Bulk upsert records
  if (dataToUpsert.length > 0) {
    await rlLimaTitikSatuSatuSehat.bulkCreate(dataToUpsert, {
      updateOnDuplicate: [
        "diagnosis",
        "male_new_cases",
        "females_new_cases",
        "total_new_cases",
        "male_visits",
        "female_visits",
        "total_visits",
      ],
    });
  }

  // console.log(`✅ ${dataToUpsert.length} records saved/updated`);
}

// async function saveRecords(records, organization_id, periode) {
//   for (const record of records) {
//     for (const newCase of record.new_cases) {
//       // 1. Pastikan age group tersedia
//       const age = await AgeGroups.findByPk(newCase.age_id);
//       if (!age) {
//         await AgeGroups.create({
//           id: newCase.age_id,
//           name: newCase.age_name,
//         });
//       }

//       // 2. Cek apakah data dengan kombinasi unik sudah ada
//       const existing = await rlLimaTitikSatuSatuSehat.findOne({
//         where: {
//           organization_id,
//           periode,
//           icd_10: record.icd10,
//           age_id: newCase.age_id,
//         },
//       });

//       const total_new = newCase.male_new_cases + newCase.female_new_cases;

//       const dataToSave = {
//         diagnosis: record.diagnosis,
//         male_new_cases: newCase.male_new_cases,
//         females_new_cases: newCase.female_new_cases,
//         total_new_cases: total_new,
//         male_visits: record.male_visits,
//         female_visits: record.female_visits,
//         total_visits: record.total_visits,
//       };

//       if (existing) {
//         // 3. Jika sudah ada, update
//         await existing.update(dataToSave);
//       } else {
//         // 4. Jika belum ada, create
//         await rlLimaTitikSatuSatuSehat.create({
//           ...dataToSave,
//           organization_id,
//           periode,
//           icd_10: record.icd10,
//           age_id: newCase.age_id,
//         });
//       }
//     }
//   }
// }

function groupByICDandAge(results) {
  const grouped = {};

  for (const item of results) {
    const icd = item.icd_10;

    if (!grouped[icd]) {
      grouped[icd] = {
        icd_10: icd,
        diagnosis: item.diagnosis,
        periode: item.periode,
        records: [],
      };
    }

    grouped[icd].records.push({
      age_id: item.age_id,
      age_name: item.AgeGroup?.name || "-",
      male_new_cases: item.male_new_cases,
      female_new_cases: item.females_new_cases,
      total_new_cases: item.total_new_cases,
      male_visits: item.male_visits,
      female_visits: item.female_visits,
      total_visits: item.total_visits,
    });
  }

  // Ubah object ke array, dan urutkan age_id
  return Object.values(grouped).map((group) => {
    group.records.sort((a, b) => a.age_id - b.age_id);
    return group;
  });
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

export const getDataRLLimaTitikSatuExternal = (req, res) => {
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
  };

  rlLimaTitikSatuDetail
    .findAll({
      include: {
        model: icd,
        attributes: [
          "id",
          "icd_code",
          "description_code",
          "icd_code_group",
          "description_code_group",
        ],
      },
      attributes: [
        "id",
        "periode",
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

export const insertdataRLLimaTitikSatuExternal = async (req, res) => {
  const schema = Joi.object({
    periodeBulan: Joi.number().greater(0).less(13).required(),
    periodeTahun: Joi.number().required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            icd10: Joi.string().required(),
            jumlahKasusBaruPasienUmurKurangDari1JamL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmurKurangDari1JamP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1JamSampai23JamL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1JamSampai23JamP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1HariSampai7HariL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1HariSampai7HariP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur8HariSampai28HariL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur8HariSampai28HariP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur3BulanSampai6BulanL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur3BulanSampai6BulanP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur6BulanSampai11BulanL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur6BulanSampai11BulanP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1TahunSampai4TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur1TahunSampai4TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur5TahunSampai9TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur5TahunSampai9TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur10TahunSampai14TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur10TahunSampai14TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur15TahunSampai19TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur15TahunSampai19TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur20TahunSampai24TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur20TahunSampai24TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur25TahunSampai29TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur25TahunSampai29TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur30TahunSampai34TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur30TahunSampai34TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur35TahunSampai39TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur35TahunSampai39TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur40TahunSampai44TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur40TahunSampai44TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur45TahunSampai49TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur45TahunSampai49TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur50TahunSampai54TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur50TahunSampai54TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur55TahunSampai59TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur55TahunSampai59TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur60TahunSampai64TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur60TahunSampai64TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur65TahunSampai69TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur65TahunSampai69TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur70TahunSampai74TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur70TahunSampai74TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur75TahunSampai79TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur75TahunSampai79TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur80TahunSampai84TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmur80TahunSampai84TahunP: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL: Joi.number().min(0).required(),
            jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP: Joi.number().min(0).required(),
            jumlahKunjunganPasienL: Joi.number().min(0).required(),
            jumlahKunjunganPasienP: Joi.number().min(0).required(),
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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (
    req.body.periodeTahun > currentYear ||
    (req.body.periodeTahun === currentYear &&
      req.body.periodeBulan >= currentMonth)
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
        dupMsgs.push(
          `ICD id ${key} duplikat pada data ke-${positions.join(", ")}.`
        );
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
        [Op.and]: [{ icd_code: { [Op.in]: ids } }, { status_rawat_jalan: 1 }],
      },
      attributes: [
        "id",
        "icd_code",
        "description_code",
        "status_laki",
        "status_perempuan",
      ],
      raw: true,
    });

    const masterMap = new Map(masterRows.map((r) => [r.icd_code, r]));
    const errors = [];

    value.data.forEach((item, idx) => {
      const no = idx + 1;
      const idNum = Number(item.icdId);
      const master = masterMap.get(item.icd10);

      if (!master) {
        errors.push(
          `Data ke-${no} (ICD ${idNum}) tidak tepat karena bukan kode penyakit rawat inap.`
        );
        return;
      }

      item.icdId = master.id;
      const { status_laki, status_perempuan } = master;
      const keys = Object.keys(item);

      const lKeys = keys
        .filter(k => k.endsWith("L"))
        .filter(k => k !== "jumlahKunjunganPasienL");

      const pKeys = keys
        .filter(k => k.endsWith("P"))
        .filter(k => k !== "jumlahKunjunganPasienP");

      if (Number(status_laki) === 0) {
        const filledL = lKeys.filter((k) => item[k] > 0);
        if (filledL.length > 0) {
          errors.push(
            `Data ke-${no} dengan ICD ID = ${item.icd10} parameter Untuk Jenis Kelamin L (Laki) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Perempuan.`
          );
        }
      }

      if (Number(status_perempuan) === 0) {
        const filledP = pKeys.filter((k) => item[k] > 0);
        if (filledP.length > 0) {
          errors.push(
            `Data ke-${no} (ICD ${item.icd10}) parameter Untuk Jenis Kelamin P (Perempuan) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Laki-Laki.`
          );
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).send({
        status: false,
        message: "Validasi ICD gagal",
        errors,
      });
    }

    const periode = `${req.body.periodeTahun}-${String(
      req.body.periodeBulan
    ).padStart(2, "0")}-01`;

    const dataDetail = value.data.map((item) => {
      const totalL =
        val(item.jumlahKasusBaruPasienUmurKurangDari1JamL) +
        val(item.jumlahKasusBaruPasienUmur1JamSampai23JamL) +
        val(item.jumlahKasusBaruPasienUmur1HariSampai7HariL) +
        val(item.jumlahKasusBaruPasienUmur8HariSampai28HariL) +
        val(item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL) +
        val(item.jumlahKasusBaruPasienUmur3BulanSampai6BulanL) +
        val(item.jumlahKasusBaruPasienUmur6BulanSampai11BulanL) +
        val(item.jumlahKasusBaruPasienUmur1TahunSampai4TahunL) +
        val(item.jumlahKasusBaruPasienUmur5TahunSampai9TahunL) +
        val(item.jumlahKasusBaruPasienUmur10TahunSampai14TahunL) +
        val(item.jumlahKasusBaruPasienUmur15TahunSampai19TahunL) +
        val(item.jumlahKasusBaruPasienUmur20TahunSampai24TahunL) +
        val(item.jumlahKasusBaruPasienUmur25TahunSampai29TahunL) +
        val(item.jumlahKasusBaruPasienUmur30TahunSampai34TahunL) +
        val(item.jumlahKasusBaruPasienUmur35TahunSampai39TahunL) +
        val(item.jumlahKasusBaruPasienUmur40TahunSampai44TahunL) +
        val(item.jumlahKasusBaruPasienUmur45TahunSampai49TahunL) +
        val(item.jumlahKasusBaruPasienUmur50TahunSampai54TahunL) +
        val(item.jumlahKasusBaruPasienUmur55TahunSampai59TahunL) +
        val(item.jumlahKasusBaruPasienUmur60TahunSampai64TahunL) +
        val(item.jumlahKasusBaruPasienUmur65TahunSampai69TahunL) +
        val(item.jumlahKasusBaruPasienUmur70TahunSampai74TahunL) +
        val(item.jumlahKasusBaruPasienUmur75TahunSampai79TahunL) +
        val(item.jumlahKasusBaruPasienUmur80TahunSampai84TahunL) +
        val(item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL);

      const totalP =
        val(item.jumlahKasusBaruPasienUmurKurangDari1JamP) +
        val(item.jumlahKasusBaruPasienUmur1JamSampai23JamP) +
        val(item.jumlahKasusBaruPasienUmur1HariSampai7HariP) +
        val(item.jumlahKasusBaruPasienUmur8HariSampai28HariP) +
        val(item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP) +
        val(item.jumlahKasusBaruPasienUmur3BulanSampai6BulanP) +
        val(item.jumlahKasusBaruPasienUmur6BulanSampai11BulanP) +
        val(item.jumlahKasusBaruPasienUmur1TahunSampai4TahunP) +
        val(item.jumlahKasusBaruPasienUmur5TahunSampai9TahunP) +
        val(item.jumlahKasusBaruPasienUmur10TahunSampai14TahunP) +
        val(item.jumlahKasusBaruPasienUmur15TahunSampai19TahunP) +
        val(item.jumlahKasusBaruPasienUmur20TahunSampai24TahunP) +
        val(item.jumlahKasusBaruPasienUmur25TahunSampai29TahunP) +
        val(item.jumlahKasusBaruPasienUmur30TahunSampai34TahunP) +
        val(item.jumlahKasusBaruPasienUmur35TahunSampai39TahunP) +
        val(item.jumlahKasusBaruPasienUmur40TahunSampai44TahunP) +
        val(item.jumlahKasusBaruPasienUmur45TahunSampai49TahunP) +
        val(item.jumlahKasusBaruPasienUmur50TahunSampai54TahunP) +
        val(item.jumlahKasusBaruPasienUmur55TahunSampai59TahunP) +
        val(item.jumlahKasusBaruPasienUmur60TahunSampai64TahunP) +
        val(item.jumlahKasusBaruPasienUmur65TahunSampai69TahunP) +
        val(item.jumlahKasusBaruPasienUmur70TahunSampai74TahunP) +
        val(item.jumlahKasusBaruPasienUmur75TahunSampai79TahunP) +
        val(item.jumlahKasusBaruPasienUmur80TahunSampai84TahunP) +
        val(item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP);

      const total = totalL + totalP;
      const totalkunjungan = val(item.jumlahKunjunganPasienL) + val(item.jumlahKunjunganPasienP);
      const relErrors = [];
      if (total <= totalkunjungan) {
        relErrors.push(`Data Jumlah Kasus Baru Lebih Dari Jumlah Kunjungan.`);
      }
      
      if (val(item.jumlahKunjunganPasienL) >= totalL) {
        relErrors.push(`Data Jumlah Kasus Baru Laki-Laki Tidak Boleh Lebih Dari Jumlah Kunjungan Pasien Laki-Laki.`);
      }
      if (val(item.jumlahKunjunganPasienP) >= totalP) {
        relErrors.push(`Data Jumlah Kasus Baru Perempuan Tidak Boleh Lebih Dari Jumlah Kunjungan Pasien Perempuan`);
      }

      if (relErrors.length > 0) {
        return res.status(400).send({
          status: false,
          message: relErrors,
          // errors: relErrors,
        });
      }
      return {
        rl_lima_titik_satu_id: null,
        rs_id: req.user.satKerId,
        periode,
        icd_id: item.icdId,
        jumlah_L_dibawah_1_jam: item.jumlahKasusBaruPasienUmurKurangDari1JamL,
        jumlah_P_dibawah_1_jam: item.jumlahKasusBaruPasienUmurKurangDari1JamP,
        jumlah_L_1_sampai_23_jam: item.jumlahKasusBaruPasienUmur1JamSampai23JamL,
        jumlah_P_1_sampai_23_jam: item.jumlahKasusBaruPasienUmur1JamSampai23JamP,
        jumlah_L_1_sampai_7_hari: item.jumlahKasusBaruPasienUmur1HariSampai7HariL,
        jumlah_P_1_sampai_7_hari: item.jumlahKasusBaruPasienUmur1HariSampai7HariP,
        jumlah_L_8_sampai_28_hari: item.jumlahKasusBaruPasienUmur8HariSampai28HariL,
        jumlah_P_8_sampai_28_hari: item.jumlahKasusBaruPasienUmur8HariSampai28HariP,
        jumlah_L_29_hari_sampai_dibawah_3_bulan: item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL,
        jumlah_P_29_hari_sampai_dibawah_3_bulan: item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP,
        jumlah_L_3_bulan_sampai_dibawah_6_bulan: item.jumlahKasusBaruPasienUmur3BulanSampai6BulanL,
        jumlah_P_3_bulan_sampai_dibawah_6_bulan: item.jumlahKasusBaruPasienUmur3BulanSampai6BulanP,
        jumlah_L_6_bulan_sampai_11_bulan: item.jumlahKasusBaruPasienUmur6BulanSampai11BulanL,
        jumlah_P_6_bulan_sampai_11_bulan: item.jumlahKasusBaruPasienUmur6BulanSampai11BulanP,
        jumlah_L_1_sampai_4_tahun: item.jumlahKasusBaruPasienUmur1TahunSampai4TahunL,
        jumlah_P_1_sampai_4_tahun: item.jumlahKasusBaruPasienUmur1TahunSampai4TahunP,
        jumlah_L_5_sampai_9_tahun: item.jumlahKasusBaruPasienUmur5TahunSampai9TahunL,
        jumlah_P_5_sampai_9_tahun: item.jumlahKasusBaruPasienUmur5TahunSampai9TahunP,
        jumlah_L_10_sampai_14_tahun: item.jumlahKasusBaruPasienUmur10TahunSampai14TahunL,
        jumlah_P_10_sampai_14_tahun: item.jumlahKasusBaruPasienUmur10TahunSampai14TahunP,
        jumlah_L_15_sampai_19_tahun: item.jumlahKasusBaruPasienUmur15TahunSampai19TahunL,
        jumlah_P_15_sampai_19_tahun: item.jumlahKasusBaruPasienUmur15TahunSampai19TahunP,
        jumlah_L_20_sampai_24_tahun: item.jumlahKasusBaruPasienUmur20TahunSampai24TahunL,
        jumlah_P_20_sampai_24_tahun: item.jumlahKasusBaruPasienUmur20TahunSampai24TahunP,
        jumlah_L_25_sampai_29_tahun: item.jumlahKasusBaruPasienUmur25TahunSampai29TahunL,
        jumlah_P_25_sampai_29_tahun: item.jumlahKasusBaruPasienUmur25TahunSampai29TahunP,
        jumlah_L_30_sampai_34_tahun: item.jumlahKasusBaruPasienUmur30TahunSampai34TahunL,
        jumlah_P_30_sampai_34_tahun: item.jumlahKasusBaruPasienUmur30TahunSampai34TahunP,
        jumlah_L_35_sampai_39_tahun: item.jumlahKasusBaruPasienUmur35TahunSampai39TahunL,
        jumlah_P_35_sampai_39_tahun: item.jumlahKasusBaruPasienUmur35TahunSampai39TahunP,
        jumlah_L_40_sampai_44_tahun: item.jumlahKasusBaruPasienUmur40TahunSampai44TahunL,
        jumlah_P_40_sampai_44_tahun: item.jumlahKasusBaruPasienUmur40TahunSampai44TahunP,
        jumlah_L_45_sampai_49_tahun: item.jumlahKasusBaruPasienUmur45TahunSampai49TahunL,
        jumlah_P_45_sampai_49_tahun: item.jumlahKasusBaruPasienUmur45TahunSampai49TahunP,
        jumlah_L_50_sampai_54_tahun: item.jumlahKasusBaruPasienUmur50TahunSampai54TahunL,
        jumlah_P_50_sampai_54_tahun: item.jumlahKasusBaruPasienUmur50TahunSampai54TahunP,
        jumlah_L_55_sampai_59_tahun: item.jumlahKasusBaruPasienUmur55TahunSampai59TahunL,
        jumlah_P_55_sampai_59_tahun: item.jumlahKasusBaruPasienUmur55TahunSampai59TahunP,
        jumlah_L_60_sampai_64_tahun: item.jumlahKasusBaruPasienUmur60TahunSampai64TahunL,
        jumlah_P_60_sampai_64_tahun: item.jumlahKasusBaruPasienUmur60TahunSampai64TahunP,
        jumlah_L_65_sampai_69_tahun: item.jumlahKasusBaruPasienUmur65TahunSampai69TahunL,
        jumlah_P_65_sampai_69_tahun: item.jumlahKasusBaruPasienUmur65TahunSampai69TahunP,
        jumlah_L_70_sampai_74_tahun: item.jumlahKasusBaruPasienUmur70TahunSampai74TahunL,
        jumlah_P_70_sampai_74_tahun: item.jumlahKasusBaruPasienUmur70TahunSampai74TahunP,
        jumlah_L_75_sampai_79_tahun: item.jumlahKasusBaruPasienUmur75TahunSampai79TahunL,
        jumlah_P_75_sampai_79_tahun: item.jumlahKasusBaruPasienUmur75TahunSampai79TahunP,
        jumlah_L_80_sampai_84_tahun: item.jumlahKasusBaruPasienUmur80TahunSampai84TahunL,
        jumlah_P_80_sampai_84_tahun: item.jumlahKasusBaruPasienUmur80TahunSampai84TahunP,
        jumlah_L_diatas_85_tahun: item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL,
        jumlah_P_diatas_85_tahun: item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP,
        jumlah_kasus_baru_L: totalL,
        jumlah_kasus_baru_P: totalP,
        total_kasus_baru: total,
        jumlah_kunjungan_L: item.jumlahKunjunganPasienL,
        jumlah_kunjungan_P: item.jumlahKunjunganPasienP,
        total_jumlah_kunjungan: totalkunjungan,
        user_id: req.user.userId,
      };
    });
    const totalErrors = [];
    dataDetail.forEach((d, i) => {
      const no = i + 1;
      if (d.total_pas_keluar_mati > d.total_pas_hidup_mati) {
        totalErrors.push(
          `Data ke-${no}: Jumlah Pasien Keluar Mati > Jumlah Pasien Hidup/Mati.`
        );
      }
      if (d.jmlh_pas_keluar_mati_gen_l > d.jmlh_pas_hidup_mati_gen_l) {
        totalErrors.push(
          `Data ke-${no}: Keluar Mati Laki-Laki > Hidup/Mati Laki-Laki.`
        );
      }
      if (d.jmlh_pas_keluar_mati_gen_p > d.jmlh_pas_hidup_mati_gen_p) {
        totalErrors.push(
          `Data ke-${no}: Keluar Mati Perempuan > Hidup/Mati Perempuan.`
        );
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

      const resultInsertHeader = await rlLimaTitikSatuHeader.create(
        {
          rs_id: req.user.satKerId,
          periode,
          user_id: req.user.userId,
        },
        { transaction }
      );
      dataDetail.forEach((d) => {
        d.rl_lima_titik_satu_id = resultInsertHeader.id;
      });

      await rlLimaTitikSatuDetail.bulkCreate(dataDetail, {
        transaction,
        updateOnDuplicate: [
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
      });

      // await transaction.rollback()
      await transaction.commit();
      res.status(201).send({
        status: true,
        message: "data created",
        data: {
          id: resultInsertHeader.id,
        },
      });
    } catch (err) {
      console.log("bang", err);
      if (transaction) await transaction.rollback();
      if (err?.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).send({
          status: false,
          message: "Gagal Input Data, Parameter Tidak Tepat.",
        });
      }
      return res.status(400).send({
        status: false,
        message: "Gagal Input Data.",
      });
    }
  } catch (error) {
    console.log(error);
    if (transaction) await transaction.rollback();
    res.status(400).send({
      status: false,
      message: "Gagal Input Data.",
    });
  }
};

export const updateDataRLLimaTitikSatuExternal = async (req, res) => {
  const itemSchema = Joi.object({
    id: Joi.number().required(),
    jumlahKasusBaruPasienUmurKurangDari1JamL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmurKurangDari1JamP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1JamSampai23JamL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1JamSampai23JamP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1HariSampai7HariL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1HariSampai7HariP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur8HariSampai28HariL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur8HariSampai28HariP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur3BulanSampai6BulanL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur3BulanSampai6BulanP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur6BulanSampai11BulanL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur6BulanSampai11BulanP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1TahunSampai4TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur1TahunSampai4TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur5TahunSampai9TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur5TahunSampai9TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur10TahunSampai14TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur10TahunSampai14TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur15TahunSampai19TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur15TahunSampai19TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur20TahunSampai24TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur20TahunSampai24TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur25TahunSampai29TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur25TahunSampai29TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur30TahunSampai34TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur30TahunSampai34TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur35TahunSampai39TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur35TahunSampai39TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur40TahunSampai44TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur40TahunSampai44TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur45TahunSampai49TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur45TahunSampai49TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur50TahunSampai54TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur50TahunSampai54TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur55TahunSampai59TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur55TahunSampai59TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur60TahunSampai64TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur60TahunSampai64TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur65TahunSampai69TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur65TahunSampai69TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur70TahunSampai74TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur70TahunSampai74TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur75TahunSampai79TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur75TahunSampai79TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur80TahunSampai84TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmur80TahunSampai84TahunP: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL: Joi.number().min(0).required(),
    jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP: Joi.number().min(0).required(),
    jumlahKunjunganPasienL: Joi.number().min(0).required(),
    jumlahKunjunganPasienP: Joi.number().min(0).required(),
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
      if (pos.length > 1)
        dupIds.push(`ID ${id} duplikat pada data ke-${pos.join(", ")}`);
    });
    if (dupIds.length) {
      return res.status(400).send({
        status: false,
        message: "Validasi gagal (duplikat id).",
        errors: dupIds,
      });
    }

    const ids = Array.from(idPos.keys());
    const existing = await rlLimaTitikSatuDetail.findAll({
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
        notFoundOrNotOwned.push(
          `Data dengan ${id} tidak ditemukan atau kepemilikan data tidak sesuai.`
        );
      }
    });
    if (notFoundOrNotOwned.length > 0) {
      return res.status(404).send({
        status: false,
        message: "Verifikasi kepemilikan gagal.",
        errors: notFoundOrNotOwned,
      });
    }

    let icds = existing.map((item) => item.icd_id);
    const masterIcd = await icd.findAll({
      where: {
        [Op.and]: [{ id: { [Op.in]: icds } }, { status_rawat_jalan: 1 }],
      },
      attributes: [
        "id",
        "icd_code",
        "description_code",
        "icd_code_group",
        "description_code_group",
        "status_top_10",
        "status_rawat_inap",
        "status_rawat_jalan",
        "status_laki",
        "status_perempuan",
      ],
      raw: true,
    });

    const masterMap = new Map(masterIcd.map((r) => [r.id, r]));

    let toUpdate = [];
    const errorsIcd = [];
    const relErrors = [];

    value.data.forEach((item, idx) => {
      const no = idx + 1;
      const cek = masterMap.get(item.icd_id);
      const keys = Object.keys(item);

      const lKeys = keys.filter(k => k.endsWith("L")).filter(k => k !== "jumlahKunjunganPasienL");
      const pKeys = keys.filter(k => k.endsWith("P")).filter(k => k !== "jumlahKunjunganPasienP");
      const { status_laki, status_perempuan } = cek || {};

      if (!cek) {
        errorsIcd.push(`Data ke-${no}: ICD master tidak ditemukan untuk icd_id = ${item.icd_id}.`);
        return;
      }

      if (Number(status_laki) === 0) {
        const filledL = lKeys.filter(k => val(item[k]) > 0);
        if (filledL.length > 0) {
          errorsIcd.push(
            `Data ke-${no} dengan ICD ID = ${item.icd_id} parameter Untuk Jenis Kelamin L (Laki) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Perempuan.`
          );
        }
      }

      if (Number(status_perempuan) === 0) {
        const filledP = pKeys.filter((k) => val(item[k]) > 0);
        if (filledP.length > 0) {
          errorsIcd.push(
            `Data ke-${no} dengan ICD ID = ${item.icd_id} parameter Untuk Jenis Kelamin P (Perempuan) tidak boleh bernilai > 0 karena Kode penyakit tersebut khusus untuk pasien Laki.`
          );
        }
      }

      const totalL = [
        item.jumlahKasusBaruPasienUmurKurangDari1JamL,
        item.jumlahKasusBaruPasienUmur1JamSampai23JamL,
        item.jumlahKasusBaruPasienUmur1HariSampai7HariL,
        item.jumlahKasusBaruPasienUmur8HariSampai28HariL,
        item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL,
        item.jumlahKasusBaruPasienUmur3BulanSampai6BulanL,
        item.jumlahKasusBaruPasienUmur6BulanSampai11BulanL,
        item.jumlahKasusBaruPasienUmur1TahunSampai4TahunL,
        item.jumlahKasusBaruPasienUmur5TahunSampai9TahunL,
        item.jumlahKasusBaruPasienUmur10TahunSampai14TahunL,
        item.jumlahKasusBaruPasienUmur15TahunSampai19TahunL,
        item.jumlahKasusBaruPasienUmur20TahunSampai24TahunL,
        item.jumlahKasusBaruPasienUmur25TahunSampai29TahunL,
        item.jumlahKasusBaruPasienUmur30TahunSampai34TahunL,
        item.jumlahKasusBaruPasienUmur35TahunSampai39TahunL,
        item.jumlahKasusBaruPasienUmur40TahunSampai44TahunL,
        item.jumlahKasusBaruPasienUmur45TahunSampai49TahunL,
        item.jumlahKasusBaruPasienUmur50TahunSampai54TahunL,
        item.jumlahKasusBaruPasienUmur55TahunSampai59TahunL,
        item.jumlahKasusBaruPasienUmur60TahunSampai64TahunL,
        item.jumlahKasusBaruPasienUmur65TahunSampai69TahunL,
        item.jumlahKasusBaruPasienUmur70TahunSampai74TahunL,
        item.jumlahKasusBaruPasienUmur75TahunSampai79TahunL,
        item.jumlahKasusBaruPasienUmur80TahunSampai84TahunL,
        item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL,
      ].reduce((sum, x) => sum + val(x), 0);

      const totalP = [
        item.jumlahKasusBaruPasienUmurKurangDari1JamP,
        item.jumlahKasusBaruPasienUmur1JamSampai23JamP,
        item.jumlahKasusBaruPasienUmur1HariSampai7HariP,
        item.jumlahKasusBaruPasienUmur8HariSampai28HariP,
        item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP,
        item.jumlahKasusBaruPasienUmur3BulanSampai6BulanP,
        item.jumlahKasusBaruPasienUmur6BulanSampai11BulanP,
        item.jumlahKasusBaruPasienUmur1TahunSampai4TahunP,
        item.jumlahKasusBaruPasienUmur5TahunSampai9TahunP,
        item.jumlahKasusBaruPasienUmur10TahunSampai14TahunP,
        item.jumlahKasusBaruPasienUmur15TahunSampai19TahunP,
        item.jumlahKasusBaruPasienUmur20TahunSampai24TahunP,
        item.jumlahKasusBaruPasienUmur25TahunSampai29TahunP,
        item.jumlahKasusBaruPasienUmur30TahunSampai34TahunP,
        item.jumlahKasusBaruPasienUmur35TahunSampai39TahunP,
        item.jumlahKasusBaruPasienUmur40TahunSampai44TahunP,
        item.jumlahKasusBaruPasienUmur45TahunSampai49TahunP,
        item.jumlahKasusBaruPasienUmur50TahunSampai54TahunP,
        item.jumlahKasusBaruPasienUmur55TahunSampai59TahunP,
        item.jumlahKasusBaruPasienUmur60TahunSampai64TahunP,
        item.jumlahKasusBaruPasienUmur65TahunSampai69TahunP,
        item.jumlahKasusBaruPasienUmur70TahunSampai74TahunP,
        item.jumlahKasusBaruPasienUmur75TahunSampai79TahunP,
        item.jumlahKasusBaruPasienUmur80TahunSampai84TahunP,
        item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP,
      ].reduce((sum, x) => sum + val(x), 0);

      const total = totalL + totalP;
      const totalkunjungan = val(item.jumlahKunjunganPasienL) + val(item.jumlahKunjunganPasienP);
      if (total <= totalkunjungan) {
        relErrors.push(`Data ke-${no}: Jumlah Kasus Baru harus lebih dari Jumlah Kunjungan.`);
      }
      if (val(item.jumlahKunjunganPasienL) >= totalL) {
        relErrors.push(`Data ke-${no}: Jumlah Kasus Baru Laki-Laki Tidak Boleh Lebih Dari Jumlah Kunjungan Pasien Laki-Laki.`);
      }
      if (val(item.jumlahKunjunganPasienP) >= totalP) {
        relErrors.push(`Data ke-${no}: Jumlah Kasus Baru Perempuan Tidak Boleh Lebih Dari Jumlah Kunjungan Pasien Perempuan`);
      }

      toUpdate.push({
        id: Number(item.id),
        jumlah_L_dibawah_1_jam: val(item.jumlahKasusBaruPasienUmurKurangDari1JamL),
        jumlah_P_dibawah_1_jam: val(item.jumlahKasusBaruPasienUmurKurangDari1JamP),
        jumlah_L_1_sampai_23_jam: val(item.jumlahKasusBaruPasienUmur1JamSampai23JamL),
        jumlah_P_1_sampai_23_jam: val(item.jumlahKasusBaruPasienUmur1JamSampai23JamP),
        jumlah_L_1_sampai_7_hari: val(item.jumlahKasusBaruPasienUmur1HariSampai7HariL),
        jumlah_P_1_sampai_7_hari: val(item.jumlahKasusBaruPasienUmur1HariSampai7HariP),
        jumlah_L_8_sampai_28_hari: val(item.jumlahKasusBaruPasienUmur8HariSampai28HariL),
        jumlah_P_8_sampai_28_hari: val(item.jumlahKasusBaruPasienUmur8HariSampai28HariP),
        jumlah_L_29_hari_sampai_dibawah_3_bulan: val(item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanL),
        jumlah_P_29_hari_sampai_dibawah_3_bulan: val(item.jumlahKasusBaruPasienUmur2HariSampai9Hari3BulanP),
        jumlah_L_3_bulan_sampai_dibawah_6_bulan: val(item.jumlahKasusBaruPasienUmur3BulanSampai6BulanL),
        jumlah_P_3_bulan_sampai_dibawah_6_bulan: val(item.jumlahKasusBaruPasienUmur3BulanSampai6BulanP),
        jumlah_L_6_bulan_sampai_11_bulan: val(item.jumlahKasusBaruPasienUmur6BulanSampai11BulanL),
        jumlah_P_6_bulan_sampai_11_bulan: val(item.jumlahKasusBaruPasienUmur6BulanSampai11BulanP),
        jumlah_L_1_sampai_4_tahun: val(item.jumlahKasusBaruPasienUmur1TahunSampai4TahunL),
        jumlah_P_1_sampai_4_tahun: val(item.jumlahKasusBaruPasienUmur1TahunSampai4TahunP),
        jumlah_L_5_sampai_9_tahun: val(item.jumlahKasusBaruPasienUmur5TahunSampai9TahunL),
        jumlah_P_5_sampai_9_tahun: val(item.jumlahKasusBaruPasienUmur5TahunSampai9TahunP),
        jumlah_L_10_sampai_14_tahun: val(item.jumlahKasusBaruPasienUmur10TahunSampai14TahunL),
        jumlah_P_10_sampai_14_tahun: val(item.jumlahKasusBaruPasienUmur10TahunSampai14TahunP),
        jumlah_L_15_sampai_19_tahun: val(item.jumlahKasusBaruPasienUmur15TahunSampai19TahunL),
        jumlah_P_15_sampai_19_tahun: val(item.jumlahKasusBaruPasienUmur15TahunSampai19TahunP),
        jumlah_L_20_sampai_24_tahun: val(item.jumlahKasusBaruPasienUmur20TahunSampai24TahunL),
        jumlah_P_20_sampai_24_tahun: val(item.jumlahKasusBaruPasienUmur20TahunSampai24TahunP),
        jumlah_L_25_sampai_29_tahun: val(item.jumlahKasusBaruPasienUmur25TahunSampai29TahunL),
        jumlah_P_25_sampai_29_tahun: val(item.jumlahKasusBaruPasienUmur25TahunSampai29TahunP),
        jumlah_L_30_sampai_34_tahun: val(item.jumlahKasusBaruPasienUmur30TahunSampai34TahunL),
        jumlah_P_30_sampai_34_tahun: val(item.jumlahKasusBaruPasienUmur30TahunSampai34TahunP),
        jumlah_L_35_sampai_39_tahun: val(item.jumlahKasusBaruPasienUmur35TahunSampai39TahunL),
        jumlah_P_35_sampai_39_tahun: val(item.jumlahKasusBaruPasienUmur35TahunSampai39TahunP),
        jumlah_L_40_sampai_44_tahun: val(item.jumlahKasusBaruPasienUmur40TahunSampai44TahunL),
        jumlah_P_40_sampai_44_tahun: val(item.jumlahKasusBaruPasienUmur40TahunSampai44TahunP),
        jumlah_L_45_sampai_49_tahun: val(item.jumlahKasusBaruPasienUmur45TahunSampai49TahunL),
        jumlah_P_45_sampai_49_tahun: val(item.jumlahKasusBaruPasienUmur45TahunSampai49TahunP),
        jumlah_L_50_sampai_54_tahun: val(item.jumlahKasusBaruPasienUmur50TahunSampai54TahunL),
        jumlah_P_50_sampai_54_tahun: val(item.jumlahKasusBaruPasienUmur50TahunSampai54TahunP),
        jumlah_L_55_sampai_59_tahun: val(item.jumlahKasusBaruPasienUmur55TahunSampai59TahunL),
        jumlah_P_55_sampai_59_tahun: val(item.jumlahKasusBaruPasienUmur55TahunSampai59TahunP),
        jumlah_L_60_sampai_64_tahun: val(item.jumlahKasusBaruPasienUmur60TahunSampai64TahunL),
        jumlah_P_60_sampai_64_tahun: val(item.jumlahKasusBaruPasienUmur60TahunSampai64TahunP),
        jumlah_L_65_sampai_69_tahun: val(item.jumlahKasusBaruPasienUmur65TahunSampai69TahunL),
        jumlah_P_65_sampai_69_tahun: val(item.jumlahKasusBaruPasienUmur65TahunSampai69TahunP),
        jumlah_L_70_sampai_74_tahun: val(item.jumlahKasusBaruPasienUmur70TahunSampai74TahunL),
        jumlah_P_70_sampai_74_tahun: val(item.jumlahKasusBaruPasienUmur70TahunSampai74TahunP),
        jumlah_L_75_sampai_79_tahun: val(item.jumlahKasusBaruPasienUmur75TahunSampai79TahunL),
        jumlah_P_75_sampai_79_tahun: val(item.jumlahKasusBaruPasienUmur75TahunSampai79TahunP),
        jumlah_L_80_sampai_84_tahun: val(item.jumlahKasusBaruPasienUmur80TahunSampai84TahunL),
        jumlah_P_80_sampai_84_tahun: val(item.jumlahKasusBaruPasienUmur80TahunSampai84TahunP),
        jumlah_L_diatas_85_tahun: val(item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunL),
        jumlah_P_diatas_85_tahun: val(item.jumlahKasusBaruPasienUmurLebihDariAtauSamaDengan85TahunP),
        jumlah_kasus_baru_L: totalL,
        jumlah_kasus_baru_P: totalP,
        total_kasus_baru: total,
        jumlah_kunjungan_L: val(item.jumlahKunjunganPasienL),
        jumlah_kunjungan_P: val(item.jumlahKunjunganPasienP),
        total_jumlah_kunjungan: totalkunjungan,
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
        await rlLimaTitikSatuDetail.update(item, {
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
    return res.status(400).send({
      status: false,
      message: "Failed to process update.",
    });
  }
};