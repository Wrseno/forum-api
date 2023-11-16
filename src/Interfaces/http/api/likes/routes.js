const routes = (handler) => [
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: handler.putLikeUnlikeHandler,
    options: {
      auth: "forumapi_jwt",
      // plugins: {
      //   "hapi-rate-limit": {
      //     enabled: true,
      //     pathLimit: 10,
      //     userLimit: 100,
      //     userCache: {
      //       expiresIn: 60000,
      //     },
      //   },
      // },
    },
  },
];

module.exports = routes;
