exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should fail updating a user because invalid id received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "updateUser"
      ]
    }
  ],
  "data": {
    "updateUser": null
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should fail updating a user because invalid id received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "updateUser"
      ]
    }
  ],
  "data": {
    "updateUser": null
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should fail updating a user because unknown id received 1'] = {
  "errors": [
    {
      "message": "The received id is not in the database!",
      "locations": [
        {
          "line": 3,
          "column": 11
        }
      ],
      "path": [
        "updateUser"
      ]
    }
  ],
  "data": {
    "updateUser": null
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should not update a user because not authenticated 1'] = {
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
        "updateUser"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "updateUser": null
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should not update a user because not authenticated as yourself 1'] = {
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
        "updateUser"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "updateUser": null
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should not update the user image because image not received (undefined) 1'] = {
  "data": {
    "updateUser": {
      "firstname": "Loyse",
      "lastname": "Hug",
      "email": "jerem@user.ch",
      "image": "ceci est une image encod\u00E9e en base64!",
      "followingProducers": {
        "edges": [
          {
            "node": {
              "firstname": "Antoine",
              "lastname": "Rochaille",
              "email": "antoine@paysan.ch",
              "image": "Ceci est une image encod\u00E9e en base64!",
              "phoneNumber": "0761435196",
              "rating": {
                "nbRatings": 3,
                "grade": 3.3333333333333335
              }
            }
          }
        ]
      },
      "emailValidated": false,
      "isAdmin": false
    }
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should update a user 1'] = {
  "data": {
    "updateUser": {
      "firstname": "Loyse",
      "lastname": "Hug",
      "email": "jerem@user.ch",
      "image": "ceci est une image encod\u00E9e en base64!",
      "followingProducers": {
        "edges": [
          {
            "node": {
              "firstname": "Antoine",
              "lastname": "Rochaille",
              "email": "antoine@paysan.ch",
              "image": "Ceci est une image encod\u00E9e en base64!",
              "phoneNumber": "0761435196",
              "rating": {
                "nbRatings": 3,
                "grade": 3.3333333333333335
              }
            }
          }
        ]
      },
      "emailValidated": false,
      "isAdmin": false
    }
  }
}

exports['Testing graphql resquest user MUTATION user Testing updateUser(user: UserInputUpdate!) should update the user image to null because null image received 1'] = {
  "data": {
    "updateUser": {
      "firstname": "Loyse",
      "lastname": "Hug",
      "email": "jerem@user.ch",
      "image": null,
      "followingProducers": {
        "edges": [
          {
            "node": {
              "firstname": "Antoine",
              "lastname": "Rochaille",
              "email": "antoine@paysan.ch",
              "image": "Ceci est une image encod\u00E9e en base64!",
              "phoneNumber": "0761435196",
              "rating": {
                "nbRatings": 3,
                "grade": 3.3333333333333335
              }
            }
          }
        ]
      },
      "emailValidated": false,
      "isAdmin": false
    }
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should fail getting a user by id because invalid id received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "user"
      ]
    }
  ],
  "data": {
    "user": null
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should fail getting a user by id because invalid id received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "user"
      ]
    }
  ],
  "data": {
    "user": null
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should fail getting a user by id because unknown id received 1'] = {
  "data": {
    "user": null
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should get a user because not authenticated as administrator 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be an administrator to do that.",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "user"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "user": null
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should get a user by id 1'] = {
  "data": {
    "user": {
      "firstname": "J\u00E9r\u00E9mie",
      "lastname": "Chaton",
      "email": "jerem@user.ch",
      "image": "ceci est une image encod\u00E9e en base64!",
      "followingProducers": {
        "edges": [
          {
            "node": {
              "firstname": "Antoine",
              "lastname": "Rochaille",
              "email": "antoine@paysan.ch",
              "image": "Ceci est une image encod\u00E9e en base64!",
              "phoneNumber": "0761435196",
              "rating": {
                "nbRatings": 3,
                "grade": 3.3333333333333335
              }
            }
          }
        ]
      },
      "emailValidated": false,
      "isAdmin": false
    }
  }
}

exports['Testing graphql resquest user QUERY user Testing user(userId: ID!) should not get a user because not authenticated 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be authenticated to do that.",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "user"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "user": null
  }
}

exports['Testing graphql resquest user QUERY user Testing users() should get all users 1'] = {
  "data": {
    "users": {
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "YXJyYXljb25uZWN0aW9uOjA=",
        "endCursor": "YXJyYXljb25uZWN0aW9uOjE="
      },
      "edges": [
        {
          "node": {
            "firstname": "J\u00E9r\u00E9mie",
            "lastname": "Chaton",
            "email": "jerem@user.ch",
            "image": "ceci est une image encod\u00E9e en base64!",
            "emailValidated": false,
            "isAdmin": false,
            "followingProducers": {
              "edges": [
                {
                  "node": {
                    "firstname": "Antoine",
                    "lastname": "Rochaille"
                  }
                }
              ]
            }
          }
        },
        {
          "node": {
            "firstname": "Loyse",
            "lastname": "Hug",
            "email": "loyse@user.ch",
            "image": null,
            "emailValidated": false,
            "isAdmin": false,
            "followingProducers": {
              "edges": [
                {
                  "node": {
                    "firstname": "Antoine",
                    "lastname": "Rochaille"
                  }
                }
              ]
            }
          }
        }
      ],
      "totalCount": 2
    }
  }
}

exports['Testing graphql resquest user QUERY user Testing users() should get all users because not authenticated as administrator 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be an administrator to do that.",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "users"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql resquest user QUERY user Testing users() should not get all users because not authenticated 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be authenticated to do that.",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "users"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}
