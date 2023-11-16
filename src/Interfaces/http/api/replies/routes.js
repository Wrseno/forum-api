const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
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
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyByIdHandler,
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
