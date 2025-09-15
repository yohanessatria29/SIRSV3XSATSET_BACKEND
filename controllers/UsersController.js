import {
  users,
  users_sso,
  insert,
  show,
  satu_sehat_id,
} from "../models/UserModel.js";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import Joi from "joi";
import passwordValidator from "password-validator";
import { Sequelize } from "sequelize";
import { apiKeyDevelopment } from "../models/ApiKeyDevelopmentModel.js";
import { apiRegistration } from "../models/ApiRegistrationModel.js";
const Op = Sequelize.Op;
const SSO_BASE_URL = process.env.SSO_BASE_URL;

dotenv.config();

export const getUser = (req, res) => {
  users_sso
    .findAll({
      attributes: [
        "id",
        "nama",
        "email",
        "password",
        "created_at",
        "modified_at",
      ],
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

export const showUser = (req, res) => {
  show(req, (err, results) => {
    if (err) {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    }

    const message = results.length ? "data found" : "data not found";
    const data = results.length ? results[0] : null;

    res.status(200).send({
      status: true,
      message: message,
      data: data,
    });
  });
};

// const reCaptchaToken = async (req) => {
//     const reCaptchaSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY
//     try {
//         return await  axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=6Le2kKUmAAAAADk8Pw4Rt35YLph2lx0uxYxPBkfX&response=${req}`)
//     } catch (error) {
//         console.error(error)
//     }
// }

export const login = async (req, res) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    // reCaptchaToken:Joi.string()
    //     .required()
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  users
    .findAll({
      attributes: [
        "id",
        "nama",
        "email",
        "password",
        "satker_id",
        "jenis_user_id",
        "created_at",
        "modified_at",
      ],
      where: {
        email: req.body.userName,
        jenis_user_id: 4,
        is_active: 1,
      },
    })
    .then((results) => {
      if (!results.length) {
        res.status(404).send({
          status: false,
          message: "email not found",
        });
        return;
      }
      bcrypt.compare(
        req.body.password,
        results[0].password,
        (error, compareResult) => {
          if (compareResult == false) {
            res.status(404).send({
              status: false,
              message: "wrong password",
            });
            return;
          }
          const payloadObject = {
            id: results[0].id,
            nama: results[0].nama,
            email: results[0].email,
            satKerId: results[0].satker_id,
            jenisUserId: results[0].jenis_user_id,
          };

          const accessToken = jsonWebToken.sign(
            payloadObject,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
          );
          jsonWebToken.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, result) => {
              const refreshToken = jsonWebToken.sign(
                payloadObject,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
              );
              users
                .update(
                  { refresh_token: refreshToken },
                  {
                    where: {
                      id: results[0].id,
                    },
                  }
                )
                .then(() => {
                  res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "Strict",
                    secure: true,
                    maxAge: 6 * 60 * 60 * 1000,
                  });
                  res.status(201).send({
                    status: true,
                    message: "access token created",
                    data: {
                      access_token: accessToken,
                    },
                  });
                })
                .catch((err) => {
                  res.status(404).send({
                    status: false,
                    message: err,
                  });
                  return;
                });
            }
          );
        }
      );
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        message: err,
      });
      return;
    });

  // const reCaptchaRes = await reCaptchaToken(req.body.reCaptchaToken)

  // if (reCaptchaRes.data.success === true) {
  //     users.findAll({
  //         attributes: ['id','nama','email','password', 'rs_id', 'jenis_user_id','created_at', 'modified_at'],
  //         where: {
  //             email: req.body.userName,
  //             jenis_user_id: 4
  //         }
  //     })
  //     .then((results) => {
  //         if (!results.length) {
  //             res.status(404).send({
  //                 status: false,
  //                 message: 'email not found'
  //             })
  //             return
  //         }
  //         bcrypt.compare(req.body.password, results[0].password, (error, compareResult) => {
  //             if (compareResult == false) {
  //                 res.status(404).send({
  //                     status: false,
  //                     message: 'wrong password'
  //                 })
  //                 return
  //             }
  //             const payloadObject = {
  //                 id: results[0].id,
  //                 nama: results[0].nama,
  //                 email: results[0].email,
  //                 rsId: results[0].rs_id,
  //                 jenisUserId: results[0].jenis_user_id
  //             }

  //             const accessToken = jsonWebToken.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
  //             jsonWebToken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
  //                 const refreshToken = jsonWebToken.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN})
  //                 users.update({refresh_token: refreshToken},{
  //                     where: {
  //                         id: results[0].id
  //                     }
  //                 })
  //                 .then(() => {
  //                     res.cookie('refreshToken', refreshToken, {
  //                         httpOnly: true,
  //                         // maxAge: 24 * 60 * 60 * 1000
  //                         maxAge: 1000 * 60 * 60 * 24
  //                     })
  //                     res.status(201).send({
  //                         status: true,
  //                         message: "access token created",
  //                         data: {
  //                             name: results[0].nama,
  //                             access_token: accessToken
  //                         }
  //                     })
  //                 })
  //                 .catch((err) => {
  //                     res.status(404).send({
  //                         status: false,
  //                         message: err
  //                     })
  //                     return
  //                 })
  //             })
  //         })
  //     })
  //     .catch((err) => {
  //         res.status(404).send({
  //             status: false,
  //             message: err
  //         })
  //         return
  //     })
  // } else {
  //     res.status(404).send({
  //         status: false,
  //         message: 're Captcha not valid'
  //     })
  // }
};

export const loginSSO = async (req, res) => {
  const token = req.query.token;
  try {
    // const response = await axios.get(
    //   "https://akun-yankes.kemkes.go.id/sso/v1/token?value=" +
    //     token +
    //     "&serviceProviderId=UfXjipowQNdlVoeU3lpE"
    // );

    const response = await axios.get(
      `${SSO_BASE_URL}/sso/v1/token?value=` +
        token +
        "&serviceProviderId=UfXjipowQNdlVoeU3lpE"
    );

    const encrypted = response.data.data; // ambil iv, ciphertext, tag

    try {
      const plainText = decrypt(encrypted);
      const parsed = JSON.parse(plainText);
      const email_sso = parsed.email;
      const rs_id = parsed.organizationId;
      const id_user_sso = parsed.id;

      users_sso
        .findAll({
          attributes: [
            "id",
            "nama",
            "email",
            "password",
            "rs_id",
            "jenis_user_id",
            "created_at",
            "modified_at",
          ],
          where: {
            rs_id: rs_id,
            is_active: 1,
          },
          // include: [
          //   {
          //     model: satu_sehat_id,
          //     as: "satuSehat",
          //     attributes: ["organization_id"],
          //     required: false,
          //   },
          // ],
        })
        .then((results) => {
          if (!results.length) {
            // console.log("buat akun baru");

            res.status(404).send({
              status: false,
              message: "Kode RS tidak ada",
            });
            return;
          }
          // const mappedResults = results.map((user) => {
          //   const plain = user.get({ plain: true });
          //   return {
          //     ...plain,
          //     organization_id: plain.satuSehat
          //       ? plain.satuSehat.organization_id
          //       : null,
          //   };
          // });

          const payloadObject = {
            id: results[0].id,
            id_user_sso: id_user_sso,
            nama: results[0].nama,
            // email: results[0].email,
            satKerId: results[0].rs_id,
            jenisUserId: results[0].jenis_user_id,
            // organizationId: mappedResults[0].organization_id,
          };

          const payloadObjectRefreshToken = {
            id: results[0].id,
            id_user_sso: id_user_sso,
          };
          const accessToken = jsonWebToken.sign(
            payloadObject,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
          );
          jsonWebToken.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, result) => {
              const refreshToken = jsonWebToken.sign(
                payloadObjectRefreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
              );
              users_sso
                .update(
                  { refresh_token: refreshToken },
                  {
                    where: {
                      id: results[0].id,
                    },
                  }
                )
                .then(() => {
                  const isSecure = process.env.COOKIE_SECURE === "true"; // convert string to boolean

                  res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "Strict",
                    secure: isSecure,
                    maxAge: 6 * 60 * 60 * 1000,
                  });
                  const csrfToken = crypto.randomUUID();
                  res.cookie("XSRF-TOKEN", csrfToken, {
                    httpOnly: true,
                    sameSite: "Strict", // atau 'Lax' tergantung kebutuhan
                    secure: true,
                  });
                  res.status(201).send({
                    status: true,
                    message: "access token created",
                    data: {
                      access_token: accessToken,
                      csrfToken: csrfToken,
                    },
                  });
                })
                .catch((err) => {
                  res.status(404).send({
                    status: false,
                    message: err,
                  });
                  return;
                });
            }
          );
        })
        .catch((err) => {
          res.status(404).send({
            status: false,
            message: err,
          });
          return;
        });
    } catch (e) {
      res.status(400).send({
        status: false,
        message: e.message,
      });
      return;
    }

    // const email_sso = response.data.data.email;

    // users_sso
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
    return;
  }
};

export const decrypt = ({ iv, ciphertext, tag }) => {
  const key = Buffer.from(process.env.AES_KEY, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let decrypted = decipher.update(Buffer.from(ciphertext, "base64"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
};

export const loginSSOAdmin = async (req, res) => {
  const token = req.query.token;
  //   console.log(token);

  try {
    // const response = await axios.get(
    //   "https://akun-yankes.kemkes.go.id/sso/v1/token?value=" +
    //     token +
    //     "&serviceProviderId=UfXjipowQNdlVoeU3lpE"
    // );

    const response = await axios.get(
      `${SSO_BASE_URL}/sso/v1/token?value=` +
        token +
        "&serviceProviderId=UfXjipowQNdlVoeU3lpE"
    );

    const email_sso = response.data.data.email;

    users_sso
      .findAll({
        attributes: [
          "id",
          "nama",
          "email",
          "password",
          "rs_id",
          "jenis_user_id",
          "created_at",
          "modified_at",
        ],
        where: {
          email: email_sso,
          jenis_user_id: {
            [Op.not]: 4,
          },
          is_active: 1,
        },
      })
      .then((results) => {
        if (!results.length) {
          res.status(404).send({
            status: false,
            message: "email not found",
          });
          return;
        }
        const payloadObject = {
          id: results[0].id,
          nama: results[0].nama,
          email: results[0].email,
          satKerId: results[0].rs_id,
          jenisUserId: results[0].jenis_user_id,
        };

        const payloadObjectRefreshToken = {
          id: results[0].id,
        };

        const accessToken = jsonWebToken.sign(
          payloadObject,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
        );
        jsonWebToken.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
          (err, result) => {
            const refreshToken = jsonWebToken.sign(
              payloadObjectRefreshToken,
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
            );
            users
              .update(
                { refresh_token: refreshToken },
                {
                  where: {
                    id: results[0].id,
                  },
                }
              )
              .then(() => {
                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  // maxAge: 24 * 60 * 60 * 1000
                  maxAge: 1000 * 60 * 60 * 24,
                });
                res.status(201).send({
                  status: true,
                  message: "access token created",
                  data: {
                    access_token: accessToken,
                  },
                });
              })
              .catch((err) => {
                res.status(404).send({
                  status: false,
                  message: err,
                });
                return;
              });
          }
        );
      })
      .catch((err) => {
        res.status(404).send({
          status: false,
          message: err,
        });
        return;
      });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
    return;
  }
};

export const logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(204).send({
      status: false,
      message: "No",
    });
    return;
  }
  res.clearCookie("refreshToken");
  res.clearCookie("XSRF-TOKEN");
  res.clearCookie("connect.sid");
  res.sendStatus(200);

  //   users_sso
  //     .findAll({
  //       where: {
  //         refresh_token: refreshToken,
  //       },
  //     })
  //     .then((results) => {
  //       users_sso
  //         .update(
  //           { refresh_token: null },
  //           {
  //             where: {
  //               id: results[0].id,
  //             },
  //           }
  //         )
  //         .then((resultsUpdate) => {
  //           res.clearCookie("refreshToken");
  //           res.sendStatus(200);
  //         });
  //     })
  //     .catch((err) => {
  //       res.status(404).send({
  //         status: false,
  //         message: err,
  //       });
  //       return;
  //     });
};

export const insertUser = (req, res) => {
  const schema = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    kriteriaUserId: Joi.number().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  const schemaPasswordValidator = new passwordValidator();
  schemaPasswordValidator
    .is()
    .min(8)
    .is()
    .max(8)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces();

  const passwordValidationResults = schemaPasswordValidator.validate(
    req.body.password,
    { details: true }
  );
  if (passwordValidationResults.length) {
    res.status(400).send({
      status: false,
      message: passwordValidationResults,
    });
    return;
  }

  const saltRound = 10;
  const plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRound, (err, hash) => {
    if (err) {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    }

    const data = [
      req.body.nama,
      req.body.email,
      hash,
      req.user.rsId,
      req.user.jenisUserId,
      req.body.kriteriaUserId,
    ];

    insert(data, (err, results) => {
      if (err) {
        res.status(422).send({
          status: false,
          message: err,
        });
        return;
      }
      res.status(201).send({
        status: true,
        message: "data created",
        data: {
          id: results[0],
        },
      });
    });
  });
};

export const changePassword = async (req, res) => {
  const schema = Joi.object({
    passwordLama: Joi.string().required(),
    passwordBaru: Joi.string().required(),
    passwordBaruConfirmation: Joi.string()
      .required()
      .valid(Joi.ref("passwordBaru")),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  try {
    const passwordLama = await users.findOne({
      attributes: ["password"],
      where: {
        id: req.params.id,
      },
    });

    const compareResult = await bcrypt.compare(
      req.body.passwordLama,
      passwordLama.dataValues.password
    );
    if (!compareResult) {
      res.status(404).json({
        status: false,
        message: "password lama tidak sesuai",
      });
      return;
    }

    const saltRound = 10;
    const plainPassword = req.body.passwordBaru;
    const password = await bcrypt.hash(plainPassword, saltRound);
    const update = await users.update(
      {
        password: password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      status: true,
      message: update,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const loginadmin = (req, res) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  users
    .findAll({
      attributes: [
        "id",
        "jenis_user_id",
        "nama",
        "email",
        "password",
        "rs_id",
        "created_at",
        "modified_at",
      ],
      where: {
        email: req.body.userName,
        jenis_user_id: {
          [Op.not]: 4,
        },
      },
    })
    .then((results) => {
      if (!results.length) {
        res.status(404).send({
          status: false,
          message: "email not found",
        });
        return;
      }
      bcrypt.compare(
        req.body.password,
        results[0].password,
        (error, compareResult) => {
          if (compareResult == false) {
            res.status(404).send({
              status: false,
              message: "wrong password",
            });
            return;
          }
          const payloadObject = {
            id: results[0].id,
            jenis_user_id: results[0].jenis_user_id,
            nama: results[0].nama,
            email: results[0].email,
            rsId: results[0].rs_id,
          };

          const accessToken = jsonWebToken.sign(
            payloadObject,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
          );
          jsonWebToken.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err, result) => {
              const refreshToken = jsonWebToken.sign(
                payloadObject,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
              );
              users
                .update(
                  { refresh_token: refreshToken },
                  {
                    where: {
                      id: results[0].id,
                    },
                  }
                )
                .then(() => {
                  res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                  });
                  res.status(201).send({
                    status: true,
                    message: "access token created",
                    data: {
                      name: results[0].nama,
                      access_token: accessToken,
                    },
                  });
                })
                .catch((err) => {
                  res.status(404).send({
                    status: false,
                    message: err,
                  });
                  return;
                });
            }
          );
        }
      );
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const logoutadmin = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(204).send({
      status: false,
      message: "No",
    });
    return;
  }
  users_sso
    .findAll({
      where: {
        refresh_token: refreshToken,
      },
    })
    .then((results) => {
      users_sso
        .update(
          { refresh_token: null },
          {
            where: {
              id: results[0].id,
            },
          }
        )
        .then((resultsUpdate) => {
          res.clearCookie("refreshToken");
          res.sendStatus(200);
        });
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        message: err,
      });
      return;
    });
};


export const loginBridgingDev = async (req, res) => {
  const schema = Joi.object({
    apiKey: Joi.string().required(),
    apiSecret: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
apiKeyDevelopment
    .findOne({
      attributes: [
        "rs_id",
        "api_key",
        "api_secret",
      ],
      include: {
        model: apiRegistration,
        attributes: ["email_pendaftaran", "nama_aplikasi"],
        where :{
          status_pendaftaran : 'diterima',
        }
      }, 
      where: {
        api_key: req.body.apiKey,
        api_secret: req.body.apiSecret,
      },
    })
    .then((results) => {

      // console.log("tadaa ",results)
      if (!results) {
        res.status(404).send({
          status: false,
          message: "user not found1",
        });
        return;
      }

      // console.log("tadaa ",results.api_registration.dataValues.email_pendaftaran)
      
      // console.log(results.dataValues)
      // results.dataValues.api_registration.api_registration.dataValues.email_pendaftaran

      users_sso.findOne({
        attributes : [
          "id",
          "jenis_user_id",
          "nama",
          "email",
          "rs_id",
        ], 
        where: {
          rs_id: results.dataValues.rs_id,
          email : results.api_registration.dataValues.email_pendaftaran,
          kriteria_user_id : 2,
        },
      })
      .then((findUserResults) => {
        // console.log("cih ", findUserResults)
        if(!findUserResults){
          res.status(404).send({
            status: false,
            message: "user not found2",
          });
          return;
        }
        
        const payloadObject = {
          nama: findUserResults.dataValues.nama,
          email: findUserResults.dataValues.email,
          satKerId: findUserResults.dataValues.rs_id,
        };

        const accessToken = jsonWebToken.sign(
          payloadObject,
          process.env.ACCESS_TOKEN_SECRET_BRIDGING,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
        );
        // console.log("tadaa ",findUserResults)
        
        jsonWebToken.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET_BRIDGING,
          (err, result) => {
            const refreshToken = jsonWebToken.sign(
              payloadObject,
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
            );
            users_sso
              .update(
                { refresh_token: refreshToken },
                {
                  where: {
                    id: findUserResults.dataValues.id,
                  },
                }
              )
              .then(() => {
                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  sameSite: 'Strict',
                  secure: true, 
                  maxAge: 6 * 60 * 60 * 1000
                });
                console.log("dtatata ", accessToken)
                res.status(201).send({
                  status: true,
                  message: "access token created",
                  data: {
                    access_token: accessToken,
                  },
                });
              })
              .catch((err) => {
                res.status(404).send({
                  status: false,
                  message:  err+"firstt",
                });
                return;
              });
          }
        );
      }).catch((err) => {
        res.status(404).send({
          status: false,
          message:  err+"mid",
        });
        return;
      });
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        message: err+"last",
      });
      return;
    });
  
};

export const loginBridging = async (req, res) => {
  const schema = Joi.object({
    apiKey: Joi.string().required(),
    apiSecret: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
apiKeyDevelopment
    .findOne({
      attributes: [
        "rs_id",
        "api_key",
        "api_secret",
      ],
      include: {
        model: apiRegistration,
        attributes: ["email_pendaftaran", "nama_aplikasi"],
        where :{
          status_pendaftaran : 'diterima',
        }
      }, 
      where: {
        api_key: req.body.apiKey,
        api_secret: req.body.apiSecret,
      },
    })
    .then((results) => {

      // console.log("tadaa ",results)
      if (!results) {
        res.status(404).send({
          status: false,
          message: "user not found1",
        });
        return;
      }

      // console.log("tadaa ",results.api_registration.dataValues.email_pendaftaran)
      
      // console.log(results.dataValues)
      // results.dataValues.api_registration.api_registration.dataValues.email_pendaftaran

      users_sso.findOne({
        attributes : [
          "id",
          "jenis_user_id",
          "nama",
          "email",
          "rs_id",
        ], 
        where: {
          rs_id: results.dataValues.rs_id,
          email : results.api_registration.dataValues.email_pendaftaran,
          kriteria_user_id : 4,
        },
      })
      .then((findUserResults) => {
        // console.log("cih ", findUserResults)
        if(!findUserResults){
          res.status(404).send({
            status: false,
            message: "user not found2",
          });
          return;
        }
        
        const payloadObject = {
          nama: findUserResults.dataValues.nama,
          email: findUserResults.dataValues.email,
          satKerId: findUserResults.dataValues.rs_id,
        };

        const accessToken = jsonWebToken.sign(
          payloadObject,
          process.env.ACCESS_TOKEN_SECRET_BRIDGING,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN }
        );
        // console.log("tadaa ",findUserResults)
        
        jsonWebToken.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET_BRIDGING,
          (err, result) => {
            const refreshToken = jsonWebToken.sign(
              payloadObject,
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN }
            );
            users_sso
              .update(
                { refresh_token: refreshToken },
                {
                  where: {
                    id: findUserResults.dataValues.id,
                  },
                }
              )
              .then(() => {
                res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  sameSite: 'Strict',
                  secure: true, 
                  maxAge: 6 * 60 * 60 * 1000
                });
                console.log("dtatata ", accessToken)
                res.status(201).send({
                  status: true,
                  message: "access token created",
                  data: {
                    access_token: accessToken,
                  },
                });
              })
              .catch((err) => {
                res.status(404).send({
                  status: false,
                  message:  err+"firstt",
                });
                return;
              });
          }
        );
      }).catch((err) => {
        res.status(404).send({
          status: false,
          message:  err+"mid",
        });
        return;
      });
    })
    .catch((err) => {
      res.status(404).send({
        status: false,
        message: err+"last",
      });
      return;
    });
  
};