const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "forumapi_jwt",
      plugins: {
        "hapi-rate-limit": {
          enabled: true,
          pathLimit: 10,
          userLimit: 100,
          userCache: {
            expiresIn: 60000,
          },
        },
      },
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forumapi_jwt",
      plugins: {
        "hapi-rate-limit": {
          enabled: true,
          pathLimit: 10,
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
