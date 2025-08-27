import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikLimaHeader, rlTigaTitikLimaDetail, jenisKegiatan } from '../models/RLTigaTitikLimaModel.js'
import Joi from 'joi'
import { satu_sehat_id } from '../models/UserModel.js'

export const getDataRLTigaTitikLima = (req, res) => {
    console.log(req.user)
    rlTigaTitikLimaDetail.findAll({
        where:{
            rs_id: req.query.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: jenisKegiatan,
        },
        order: [['jenis_kegiatan_id', 'ASC']]
    })
    .then((results) => {
        res.status(200).send({
            status: true,
            message: "data found",
            data: results
        })
    })
    .catch((err) => {
        res.status(422).send({
            status: false,
            message: err
        })
        return
    })
}


export const getDataRLTigaTitikLimaSatuSehat = async (req, res) => {
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
        `${process.env.SATUSEHAT_BASE_URL}/v1/rlreport/rl35?month=${periodeget}&organization_id=${organization_id}`,
        {
          headers: {
            "X-API-Key": process.env.SATUSEHAT_API_KEY,
          },
        }
      );

      // console.log(response);

      // lanjut proses GET DATA KE SATSET

      res.status(200).send({
        status: true,
        message: "data found",
        data: response.data,
      });
    } catch (err) {
      // Kalau error dari axios (seperti 404)
    //   if (err.response) {
    //     const statusCode = err.response.status;
    //     const errorMessage =
    //       err.response.data?.message || "Error from external API";

    //     if (statusCode === 404) {
    //       return res.status(404).json({
    //         status: false,
    //         message: errorMessage,
    //         detail: "Data tidak ditemukan dari API Satusehat",
    //       });
    //     }

    //     // Untuk error lain dari API
    //     return res.status(statusCode).json({
    //       status: false,
    //       message: errorMessage,
    //       detail: "Error dari Satusehat",
    //     });
    //   }

      // Untuk error umum (misalnya timeout, DNS error, dll)
      return res.status(500).json({
        status: false,
        message: "Gagal mengambil data dari Satusehat Silakan Cek Data di SatuSehat",
        detail: error.message,
      });
    }
  } else {
    return res.status(404).send({
      status: false,
      message: "Untuk Dinkes belum bisa menarik data",
    });
  }
};

export const insertDataRLTigaTitikLima =  async (req, res) => {
    console.log(req.user)
    const schema = Joi.object({
        tahun: Joi.number().required(),
        tahunDanBulan: Joi.date().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisKegiatanId: Joi.number().required(),
                    kunjungan_pasien_dalam_kabkota_laki: Joi.number().required(),
                    kunjungan_pasien_luar_kabkota_laki: Joi.number().required(),
                    kunjungan_pasien_luar_kabkota_perempuan: Joi.number().required(),
                    kunjungan_pasien_dalam_kabkota_perempuan: Joi.number().required(),
                    total_kunjungan: Joi.number().required()
                }).required()
            ).required()
    })

    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    let transaction
    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlTigaTitikLimaHeader.create({
            rs_id: req.user.satKerId,
            tahun: req.body.tahunDanBulan,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rs_id: req.user.satKerId,
                tahun: req.body.tahunDanBulan,
                rl_tiga_titik_lima_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                kunjungan_pasien_dalam_kabkota_laki : value.kunjungan_pasien_dalam_kabkota_laki,
                kunjungan_pasien_luar_kabkota_perempuan : value.kunjungan_pasien_luar_kabkota_perempuan,
                kunjungan_pasien_dalam_kabkota_perempuan: value.kunjungan_pasien_dalam_kabkota_perempuan,
                kunjungan_pasien_luar_kabkota_laki: value.kunjungan_pasien_luar_kabkota_laki,
                total_kunjungan: value.total_kunjungan,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikLimaDetail.bulkCreate(dataDetail, { 
            transaction,
            updateOnDuplicate: [
                "kunjungan_pasien_dalam_kabkota_laki",   
                "kunjungan_pasien_luar_kabkota_laki",   
                "kunjungan_pasien_luar_kabkota_perempuan",   
                "kunjungan_pasien_dalam_kabkota_perempuan", 
                "total_kunjungan",
            ],
        })
        // console.log(resultInsertDetail[0].id)
        await transaction.commit()
        res.status(201).send({
            status: true,
            message: "data created",
            data: {
                id: resultInsertHeader.id
            }
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            status: false,
            message: "data not created",
            error: "duplicate data"
        })
        if (transaction) {
            await transaction.rollback()
        }
    }
}

export const updateDataRLTigaTitikLima = async(req,res)=>{
    try{
        await rlTigaTitikLimaDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikLima = async(req, res) => {
    try {
        const count = await rlTigaTitikLimaDetail.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).send({
            status: true,
            message: "data deleted successfully",
            data: {
                'deleted_rows': count
            }
        })
    } catch (error) {
        res.status(404).send({
            status: false,
            message: error
        })
    }
}

export const getRLTigaTitikLimaById = async(req,res)=>{
    rlTigaTitikLimaDetail.findOne({
        where:{
            id:req.params.id
        },
        include:{
            model: jenisKegiatan
        }
    })
    .then((results) => {
        res.status(200).send({
            status: true,
            message: "data found",
            data: results
        })
    })
    .catch((err) => {
        res.status(422).send({
            status: false,
            message: err
        })
        return
    })
}