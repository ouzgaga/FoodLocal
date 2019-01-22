exports['Testing graphql resquest tokens MUTATION tokens Testing askNewEmailToken(email:String!, password: String!) should fail returning a new token for validate an email because email already validated 1'] = {
  "errors": [
    {
      "message": "Email already validated!",
      "locations": [
        {
          "line": 3,
          "column": 15
        }
      ],
      "path": [
        "validateAnEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing askNewEmailToken(email:String!, password: String!) should fail returning a new token for validate an email because incorrect password received 1'] = {
  "errors": [
    {
      "message": "Received password is not correct!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "askNewEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing askNewEmailToken(email:String!, password: String!) should fail returning a new token for validate an email because unknown email received 1'] = {
  "errors": [
    {
      "message": "There is no user corresponding to the email \"unknown@mail.com\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "askNewEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing login(email: String!, password:String!) should fail during login because incorrect password received 1'] = {
  "errors": [
    {
      "message": "Received password is not correct!",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "login"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing login(email: String!, password:String!) should fail during login because unknown email received 1'] = {
  "errors": [
    {
      "message": "There is no user corresponding to the email \"unknown@mail.com\"",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "login"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsProducer(newProducer: ProducerInputAdd!) should create a new producer and return a token 1'] = {
  "data": {
    "producer": {
      "firstname": "benoit",
      "lastname": "schop",
      "email": "ben@schop.ch",
      "image": null,
      "followingProducers": {
        "edges": []
      },
      "emailValidated": false,
      "isAdmin": false,
      "followers": {
        "edges": []
      },
      "phoneNumber": null,
      "description": null,
      "website": null,
      "salespoint": null,
      "isValidated": false,
      "products": {
        "edges": []
      },
      "rating": null
    }
  }
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsProducer(newProducer: ProducerInputAdd!) should fail creating a new producer and returning a token because missing mendatory information (email) 1'] = {
  "errors": [
    {
      "message": "Variable \"$producer\" got invalid value { firstname: \"benoit\", lastname: \"schop\", password: \"abcd1234\" }; Field value.email of required type String! was not provided.",
      "locations": [
        {
          "line": 2,
          "column": 20
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsProducer(newProducer: ProducerInputAdd!) should fail creating a new producer and returning a token because missing mendatory information (firstname) 1'] = {
  "errors": [
    {
      "message": "Variable \"$producer\" got invalid value { lastname: \"schop\", email: \"ben@schop.ch\", password: \"abcd1234\" }; Field value.firstname of required type String! was not provided.",
      "locations": [
        {
          "line": 2,
          "column": 20
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsProducer(newProducer: ProducerInputAdd!) should fail creating a new producer and returning a token because missing mendatory information (lastname) 1'] = {
  "errors": [
    {
      "message": "Variable \"$producer\" got invalid value { firstname: \"benoit\", email: \"ben@schop.ch\", password: \"abcd1234\" }; Field value.lastname of required type String! was not provided.",
      "locations": [
        {
          "line": 2,
          "column": 20
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsProducer(newProducer: ProducerInputAdd!) should fail creating a new producer and returning a token because missing mendatory information (password) 1'] = {
  "errors": [
    {
      "message": "Variable \"$producer\" got invalid value { firstname: \"benoit\", lastname: \"schop\", email: \"ben@schop.ch\" }; Field value.password of required type String! was not provided.",
      "locations": [
        {
          "line": 2,
          "column": 20
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsUser(newUser: UserInputAdd!) should create a new user and return a token 1'] = {
  "data": {
    "user": {
      "firstname": "benoit",
      "lastname": "schop",
      "email": "ben@schop.ch",
      "image": null,
      "followingProducers": {
        "edges": []
      },
      "emailValidated": false,
      "isAdmin": false
    }
  }
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsUser(newUser: UserInputAdd!) should fail creating a new user and returning a token because missing mendatory information (email) 1'] = {
  "errors": [
    {
      "message": "Variable \"$user\" got invalid value { firstname: \"benoit\", lastname: \"schop\", password: \"abcd1234\" }; Field value.email of required type String! was not provided.",
      "locations": [
        {
          "line": 1,
          "column": 10
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsUser(newUser: UserInputAdd!) should fail creating a new user and returning a token because missing mendatory information (firstname) 1'] = {
  "errors": [
    {
      "message": "Variable \"$user\" got invalid value { lastname: \"schop\", email: \"ben@schop.ch\", password: \"abcd1234\" }; Field value.firstname of required type String! was not provided.",
      "locations": [
        {
          "line": 1,
          "column": 10
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsUser(newUser: UserInputAdd!) should fail creating a new user and returning a token because missing mendatory information (lastname) 1'] = {
  "errors": [
    {
      "message": "Variable \"$user\" got invalid value { firstname: \"benoit\", email: \"ben@schop.ch\", password: \"abcd1234\" }; Field value.lastname of required type String! was not provided.",
      "locations": [
        {
          "line": 1,
          "column": 10
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing signUpAsUser(newUser: UserInputAdd!) should fail creating a new user and returning a token because missing mendatory information (password) 1'] = {
  "errors": [
    {
      "message": "Variable \"$user\" got invalid value { firstname: \"benoit\", lastname: \"schop\", email: \"ben@schop.ch\" }; Field value.password of required type String! was not provided.",
      "locations": [
        {
          "line": 1,
          "column": 10
        }
      ]
    }
  ]
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail adding a new productType because not authenticated 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be authenticated to do that.",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail adding a new productType because not authenticated as yourself 1'] = {
  "errors": [
    {
      "message": "You can't modify information of another user than yourself!",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail creating a new producer and returning a new token because idUser received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail creating a new producer and returning a new token because invalid idUser received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"users\"",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail creating a new producer and returning a new token because unknown idUser received 1'] = {
  "errors": [
    {
      "message": "The received idUserToUpgrade is not in the database!",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing upgradeUserToProducer(idUserToUpgrade: ID!, password: String!) should fail creating a new producer and returning a new token because wrong password 1'] = {
  "errors": [
    {
      "message": "Received password is not correct!",
      "locations": [
        {
          "line": 2,
          "column": 13
        }
      ],
      "path": [
        "upgradeUserToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing validateAnEmailToken(emailValidationToken: String!) should fail validating an email with received token because invalid token received 1'] = {
  "errors": [
    {
      "message": "invalid token",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "validateAnEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing validateAnEmailToken(emailValidationToken: String!) should fail validating an email with received token because no token received 1'] = {
  "errors": [
    {
      "message": "jwt must be provided",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "validateAnEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing validateAnEmailToken(emailValidationToken: String!) should fail validating an email with received token because token has been modified 1'] = {
  "errors": [
    {
      "message": "invalid signature",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "validateAnEmailToken"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql resquest tokens MUTATION tokens Testing validateAnEmailToken(emailValidationToken: String!) should fail validating an email with received token because token has expired 1'] = {
  "errors": [
    {
      "message": "Your token is expired. Please ask for a new one.",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "validateAnEmailToken"
      ]
    }
  ],
  "data": null
}
