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
          pathLimit: "/threads/{threadId}",
        },
      },
    },
  },
];

module.exports = routes;
