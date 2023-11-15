const routes = (handler) => [
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadByIdHandler,
    options: {
      plugins: {
        "hapi-rate-limit": {
          enabled: true,
          pathLimit: 90,
          userLimit: 100,
          userCache: {
            expiresIn: 60000,
          },
        },
      },
    },
  },
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt",
      plugins: {
        "hapi-rate-limit": {
          enabled: true,
          pathLimit: 90,
          userLimit: 100,
          userCache: {
            expiresIn: 60000,
          },
        },
      },
    },
  },
];

module.exports = routes;
