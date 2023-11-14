const routes = (handler) => [
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadByIdHandler,
    options: {
      plugins: {
        rateLimit: {
          enabled: true,
          pathLimit: "/threads/{threadId}",
          method: "get",
          max: 90,
          duration: 60000,
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
        rateLimit: {
          enabled: true,
          pathLimit: "/threads",
          method: "post",
          max: 90,
          duration: 60000,
        },
      },
    },
  },
];

module.exports = routes;
