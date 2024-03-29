exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should add a new follower to a producer 1'] = {
  "data": {
    "addFollowerToProducer": {
      "firstname": "J\u00E9r\u00E9mie",
      "lastname": "Chaton",
      "email": "jerem@paysan.ch",
      "image": null,
      "followingProducers": {
        "pageInfo": {
          "hasNextPage": false,
          "hasPreviousPage": false,
          "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
          "endCursor": "YXJyYXljb25uZWN0aW9uOjA="
        },
        "edges": [
          {
            "cursor": "YXJyYXljb25uZWN0aW9uOjA=",
            "node": {
              "firstname": "James",
              "lastname": "submith",
              "email": "james@paysan.ch"
            }
          }
        ],
        "totalCount": 1
      },
      "emailValidated": false,
      "isAdmin": false,
      "__typename": "Producer"
    }
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because invalid followerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because invalid followerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because invalid producerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because invalid producerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because unknown followerId received 1'] = {
  "errors": [
    {
      "message": "There is no person with this id in database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should fail adding a new follower to a producer because unknown producerId received 1'] = {
  "errors": [
    {
      "message": "There is no producer with this id in database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "addFollowerToProducer"
      ]
    }
  ],
  "data": {
    "addFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should not add twice the same follower to the same producer 1'] = {
  "data": {
    "addFollowerToProducer": {
      "firstname": "J\u00E9r\u00E9mie",
      "lastname": "Chaton",
      "email": "jerem@paysan.ch",
      "image": null,
      "followingProducers": {
        "pageInfo": {
          "hasNextPage": false,
          "hasPreviousPage": false,
          "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
          "endCursor": "YXJyYXljb25uZWN0aW9uOjA="
        },
        "edges": [
          {
            "cursor": "YXJyYXljb25uZWN0aW9uOjA=",
            "node": {
              "firstname": "James",
              "lastname": "submith",
              "email": "james@paysan.ch"
            }
          }
        ],
        "totalCount": 1
      },
      "emailValidated": false,
      "isAdmin": false,
      "__typename": "Producer"
    }
  }
}

exports['Testing graphql request persons MUTATION persons Testing addFollowerToProducer(producerId: ID!, followerId: ID!) should not add twice the same follower to the same producer 2'] = {
  "data": {
    "addFollowerToProducer": {
      "firstname": "J\u00E9r\u00E9mie",
      "lastname": "Chaton",
      "email": "jerem@paysan.ch",
      "image": null,
      "followingProducers": {
        "pageInfo": {
          "hasNextPage": false,
          "hasPreviousPage": false,
          "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
          "endCursor": "YXJyYXljb25uZWN0aW9uOjA="
        },
        "edges": [
          {
            "cursor": "YXJyYXljb25uZWN0aW9uOjA=",
            "node": {
              "firstname": "James",
              "lastname": "submith",
              "email": "james@paysan.ch"
            }
          }
        ],
        "totalCount": 1
      },
      "emailValidated": false,
      "isAdmin": false,
      "__typename": "Producer"
    }
  }
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should change the password of the producer 1'] = {
  "data": {
    "changePassword": true
  }
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should change the password of the producer 2'] = {
  "data": {
    "changePassword": true
  }
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because empty new password 1'] = {
  "errors": [
    {
      "message": "New password must be at least 6 characters long.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because empty new password is too long 1'] = {
  "errors": [
    {
      "message": "New password must be less than 30 characters long.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because empty old password 1'] = {
  "errors": [
    {
      "message": "The received oldPassword is not correct!",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because new password is too short 1'] = {
  "errors": [
    {
      "message": "New password must be at least 6 characters long.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because new password must contain at least one letter 1'] = {
  "errors": [
    {
      "message": "New password must contain at least 1 letter.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because new password must contain at least one number 1'] = {
  "errors": [
    {
      "message": "New password must contain at least 1 number.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the person because wrong old password 1'] = {
  "errors": [
    {
      "message": "The received oldPassword is not correct!",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the user because user is not logged in 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be authenticated to do that.",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing changePassword(newPassword: String!, oldPassword: String!, personId: ID!) should not change the password of the user because user try to modify another member 1'] = {
  "errors": [
    {
      "message": "You can't modify information of another user than yourself!",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "changePassword"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a follower from a producer because invalid producerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a follower from a producer because invalid producerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a follower from a producer because unknown producerId received 1'] = {
  "errors": [
    {
      "message": "There is no producer with this id in database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a new follower to a producer because invalid followerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a new follower to a producer because invalid followerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"persons\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should fail removing a new follower to a producer because unknown followerId received 1'] = {
  "errors": [
    {
      "message": "There is no person with this id in database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "removeFollowerToProducer"
      ]
    }
  ],
  "data": {
    "removeFollowerToProducer": null
  }
}

exports['Testing graphql request persons MUTATION persons Testing removeFollowerToProducer(producerId: ID!, followerId: ID!) should remove a follower from a producer 1'] = {
  "data": {
    "producer": {
      "firstname": "Antoine",
      "lastname": "Rochaille",
      "email": "antoine@paysan.ch",
      "image": "Ceci est une image encod\u00E9e en base64!",
      "followingProducers": {
        "pageInfo": {
          "hasNextPage": false,
          "hasPreviousPage": false,
          "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
          "endCursor": "YXJyYXljb25uZWN0aW9uOjA="
        },
        "edges": [
          {
            "cursor": "YXJyYXljb25uZWN0aW9uOjA=",
            "node": {
              "firstname": "J\u00E9r\u00E9mie",
              "lastname": "Chaton",
              "email": "jerem@paysan.ch"
            }
          }
        ],
        "totalCount": 1
      },
      "emailValidated": false,
      "isAdmin": false,
      "followers": {
        "pageInfo": {
          "hasNextPage": false,
          "hasPreviousPage": false,
          "startCursor": null,
          "endCursor": null
        },
        "edges": [],
        "totalCount": 0
      },
      "phoneNumber": "0761435196",
      "description": "description",
      "website": "foodlocal.ch",
      "salespoint": {
        "name": "Chez moi",
        "address": {
          "number": 6,
          "street": "Chemin de par ici",
          "city": "Yverdon",
          "postalCode": "1400",
          "state": "Vaud",
          "country": "Suisse",
          "longitude": 6.6562137,
          "latitude": 46.7702474
        },
        "schedule": {
          "monday": [
            {
              "openingHour": "08:00",
              "closingHour": "12:00"
            },
            {
              "openingHour": "13:00",
              "closingHour": "18:00"
            }
          ],
          "tuesday": [],
          "wednesday": [
            {
              "openingHour": "08:00",
              "closingHour": "12:00"
            }
          ],
          "thursday": [],
          "friday": [
            {
              "openingHour": "08:00",
              "closingHour": "12:00"
            }
          ],
          "saturday": [],
          "sunday": []
        }
      },
      "isValidated": true,
      "products": {
        "edges": [
          {
            "node": {
              "description": "Une tomme monnnnstre bonne!",
              "productType": {
                "name": "Fromages / Produits laitiers",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "Autres",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "Beno\u00EEt",
                        "lastname": "Sch\u00F6pfli",
                        "email": "benoit@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "James",
                        "lastname": "submith",
                        "email": "james@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Du lait hyper frais!",
              "productType": {
                "name": "Lait",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "Boissons",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "Beno\u00EEt",
                        "lastname": "Sch\u00F6pfli",
                        "email": "benoit@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Des spaghettis fait maison!",
              "productType": {
                "name": "P\u00E2tes",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "C\u00E9r\u00E9ales",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "Beno\u00EEt",
                        "lastname": "Sch\u00F6pfli",
                        "email": "benoit@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Une biere de ouf!",
              "productType": {
                "name": "Bi\u00E8res / Cidres",
                "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAAE40lEQVR4Xu2dWcg+UxzHX3t2WW6QLYSyJLJcWC5wI0lIKJGEJIUoW7bcULLlhiyJQrZIZMkfEaGQZI9kKTvZ+XzrOfVrmmfmzDwzb2f+fT/1uTnNzHPmfJ/3me3M710yxhhjjDHGLAfr43Yd3QpXQTMwB+Ev+F8Pn8XV0AzIXVg32LnujmZA7sW6gc51LzQDEgN5Dw9v8Tx0ICMSA3lZDS3sjw5kRBxIYTiQwnAgheFACsOBFIYDKQwHUhgOpDBiIN/jky2+gg5kRGIgfXQgA3Mt1g10jn/jlmgGZEO8CR/H+Fzkk1mbfGLWlnwbH8Fj0YzIB5gG/QY1zFgTYyCnoxmRQ/BN/BPToP+AH878aNaW/AZvRwVlRuB9jAOeq3+yRuJrrBvwNk9DMwIxkFfx+jneiA5kGYiBXKWGOayFDmQZcCCF4UAKw4EUhgMpDAdSCJpkrbm9uirvE4juge2EnnS9ILvhA/gHxgGWXQJJ6tbKOehbKT04F//CuoGVF+M8Vsemdd9AvaZgMlEYdQOZ1Dd9a2ziStRzkLr1pbaxCZoWdsF4N/df1KsIB+KmuAHmHgvWRj1H2R7PxM8whnI3mhZuwxjGCTgUG+HrmLb/D/qnq4UvMA3Yg2oYmD0wbV+egmYOeu1MfxVpsM7GMYinz5epwdSzBqaBkmM9gv0W02dcoQZTjwMpjGog72LdJLhFjReaDqSBaiDLoQNpwIEURjUQTXRLk+CG1D9ZmfigXhgOpDAcSGEMFYiu+HVDccc5focOJIMhAtHDqdcwbqdJB9LAEIHsh3EbbTqQBoYIRM/fP8W4nSYdSANDHUP0EEuvLhw2x3i314E0MFQgbfgsKxMHUhgOpDAcSGE4kMJwIIXhQAqjxEBWXdBJU1Ig26DK0cb+9FGvUGjm/iQpKRDNDY59WUSV/JgkJQVyPsa+LOJ9OElKCuQojH25Gs/qYJww3vQuS9GUFIiK98e+6KZkLpqlH9c9GSdJSYGsh7Evep0hl30wrnsATpKSAhFfYVruOjVkcjym9eQWOElKC+QlTMs9rIZMLsG03m842ZdNq4Go3lWqhVX1RdwZ+5AbyJ2YltOkvVzuwLTeO2qYKtVA2rwf+5AbyKWYlvsVc7/pKzCtpxKDk6VrILG8XxdyA9HrdPHzco8FX2Jap8uxpziqgTyDdfWw5AW4DvYhN5B9MfYn52xpXYxvgXU5OyuO0g7qm2Hsz614UosXYlyny/VLcZQWiPgRY5+6qhmUk6XEQFT1Ifapi6omoX2aLCUGojO52KcuqlrEpCkxkGswLat/AqBJeE0+h2n5p3DSVAM5A8cgBnK5Gho4FWOfNsYmPsa07C1qmDo/Y9qhMc7hVXBGJTXSZ6hcUxMHY1pW7o3z0BcqViFSEZ3J8zSmHdIc3G1xSG7GtH2pa40mVAslLn8czmMHjMseiZPnaIw79TkegYtOGNgcVQc+blt15Ntuh+hzf8e0jioT6eFVnSrTEbe/K04eDZDelI07JjVZ4HnUgbKrb2G1dpae6Oldkhz6THbQ1bqu2lcKdLbyAtbt6BDqG38M5vIo1m2nSVU1WqlQXUTdbf0J63a4rytQJZq6cCh2+ef6+mtsO1mYLKoIdyLqYPwQPtZRfbvvwYtwT+yLbmTqbm+OKpRmjDHGGGOMMcaMydLS/yr6ZI56otT6AAAAAElFTkSuQmCC",
                "category": {
                  "name": "Boissons",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Un jus d'orange trop bon!",
              "productType": {
                "name": "Jus de fruits",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "Boissons",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "James",
                        "lastname": "submith",
                        "email": "james@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Un jus de pomme trop bon!",
              "productType": {
                "name": "Jus de fruits",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "Boissons",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "James",
                        "lastname": "submith",
                        "email": "james@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "node": {
              "description": "Une polenta faite maison!",
              "productType": {
                "name": "Polenta",
                "image": "data:image/png;base64,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",
                "category": {
                  "name": "C\u00E9r\u00E9ales",
                  "image": "data:image/png;base64,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"
                },
                "producers": {
                  "edges": [
                    {
                      "node": {
                        "firstname": "Antoine",
                        "lastname": "Rochaille",
                        "email": "antoine@paysan.ch"
                      }
                    },
                    {
                      "node": {
                        "firstname": "Beno\u00EEt",
                        "lastname": "Sch\u00F6pfli",
                        "email": "benoit@paysan.ch"
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      "rating": {
        "nbRatings": 3,
        "grade": 3.3333333333333335
      }
    }
  }
}
