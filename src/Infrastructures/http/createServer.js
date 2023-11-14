const {RateLimiterMemory} = require("rate-limiter-flexible");

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const ClientError = require("../../Commons/exceptions/ClientError");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");

const users = require("../../Interfaces/http/api/users");
const threads = require("../../Interfaces/http/api/threads");
const authentications = require("../../Interfaces/http/api/authentications");
const comments = require("../../Interfaces/http/api/comments");
const replies = require("../../Interfaces/http/api/replies");
const likes = require("../../Interfaces/http/api/likes");

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.route({
    method: "GET",
    path: "/",
    handler: () => ({
      value: "Hello world!",
    }),
  });

  server.auth.strategy("forumapi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {container},
    },
    {
      plugin: authentications,
      options: {container},
    },
    {
      plugin: threads,
      options: {container},
    },
    {
      plugin: comments,
      options: {container},
    },
    {
      plugin: replies,
      options: {container},
    },
    {
      plugin: likes,
      options: {container},
    },
  ]);

  // options untuk penerapan rate limit
  const opts = {
    points: 90,
    duration: 60,
    blockDuration: 60,
  };

  const rateLimiter = new RateLimiterMemory(opts);

  server.ext("onPreHandler", async (request, h) => {
    const key = request.path; // Gunakan path sebagai kunci pembatasan

    try {
      const result = await rateLimiter.consume(key, 1);
      if (result.remainingPoints >= 0) {
        return h.continue;
      } else {
        return h
          .response({status: "fail", message: "Too Many Requests"})
          .code(429);
      }
    } catch (err) {
      return h
        .response({status: "fail", message: "Internal Server Error"})
        .code(500);
    }
  });

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const {response} = request;
    console.log(response);

    if (response instanceof Error) {
      // console.log(response);

      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  return server;
};

module.exports = createServer;
