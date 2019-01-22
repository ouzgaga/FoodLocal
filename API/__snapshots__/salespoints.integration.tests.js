exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should add a salespoint to a producer 1'] = {
  "data": {
    "addSalespointToProducer": {
      "firstname": "J\u00E9r\u00E9mie",
      "lastname": "Chaton",
      "email": "jerem@paysan.ch",
      "salespoint": {
        "name": "Ma maison",
        "address": {
          "number": 6,
          "street": "Chemin monChezMoi",
          "city": "Yverdon",
          "postalCode": "1400",
          "state": "Vaud",
          "country": "Suisse",
          "longitude": 6.6572137,
          "latitude": 46.7792474
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
      }
    }
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because he already has one. 1'] = {
  "errors": [
    {
      "message": "This producer has already a salespoint but a producer can't have more than one salespoint. Try to update the current salespoint.",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because invalid producerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"producers\"",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because invalid producerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"producers\"",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because missing mendatory information (producerId). 1'] = {
  "errors": [
    {
      "message": "Variable \"$producerId\" of required type \"ID!\" was not provided.",
      "locations": [
        {
          "line": 2,
          "column": 10
        }
      ]
    }
  ]
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because not authenticated 1'] = {
  "errors": [
    {
      "message": "Sorry, you need to be authenticated to do that.",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because unknown producerId received 1'] = {
  "errors": [
    {
      "message": "The received producerId is not in the database!",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ]
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing addSalespointToProducer(producerId: ID!, salespoint: SalespointInput!) should fail adding a salespoint to a producer because you can\'t modify someone else than yourself 1'] = {
  "errors": [
    {
      "message": "You can't modify information of another user than yourself!",
      "locations": [
        {
          "line": 3,
          "column": 3
        }
      ],
      "path": [
        "addSalespointToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should fail removing the salespoint of a producer because invalid producerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"producers\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "deleteSalespointToProducer"
      ]
    }
  ],
  "data": {
    "deleteSalespointToProducer": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should fail removing the salespoint of a producer because invalid producerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"producers\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "deleteSalespointToProducer"
      ]
    }
  ],
  "data": {
    "deleteSalespointToProducer": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should fail removing the salespoint of a producer because not authenticated 1'] = {
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
        "deleteSalespointToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "deleteSalespointToProducer": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should fail removing the salespoint of a producer because unknown producerId received 1'] = {
  "errors": [
    {
      "message": "The received producerId is not in the database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "deleteSalespointToProducer"
      ]
    }
  ],
  "data": {
    "deleteSalespointToProducer": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should fail removing the salespoint of a producer because you can\'t modify someone else than yourself 1'] = {
  "errors": [
    {
      "message": "You can't modify information of another user than yourself!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "deleteSalespointToProducer"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "deleteSalespointToProducer": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing deleteSalespointToProducer(producerId: ID!) should remove the salespoint of a producer 1'] = {
  "data": {
    "deleteSalespointToProducer": {
      "firstname": "Antoine",
      "lastname": "Rochaille",
      "email": "antoine@paysan.ch",
      "salespoint": null
    }
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should fail updating the salespoint of a producer because invalid producerId received (too long) 1'] = {
  "errors": [
    {
      "message": "Received producerId is invalid!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "updateSalespoint"
      ]
    }
  ],
  "data": {
    "updateSalespoint": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should fail updating the salespoint of a producer because invalid producerId received (too short) 1'] = {
  "errors": [
    {
      "message": "Received producerId is invalid!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "updateSalespoint"
      ]
    }
  ],
  "data": {
    "updateSalespoint": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should fail updating the salespoint of a producer because not authenticated 1'] = {
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
        "updateSalespoint"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "updateSalespoint": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should fail updating the salespoint of a producer because unknown producerId received 1'] = {
  "errors": [
    {
      "message": "Received producerId is not in the database!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "updateSalespoint"
      ]
    }
  ],
  "data": {
    "updateSalespoint": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should fail updating the salespoint of a producer because you can\'t modify someone else than yourself 1'] = {
  "errors": [
    {
      "message": "You can't modify information of another user than yourself!",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "updateSalespoint"
      ],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": {
    "updateSalespoint": null
  }
}

exports['Testing graphql request salespoints MUTATION producers Testing updateSalespoint(producerId: ID!, salespoint: SalespointInput!) should update the salespoint of a producer 1'] = {
  "data": {
    "updateSalespoint": {
      "firstname": "Antoine",
      "lastname": "Rochaille",
      "email": "antoine@paysan.ch",
      "salespoint": {
        "name": "Ma maison",
        "address": {
          "number": 6,
          "street": "Chemin monChezMoi",
          "city": "Yverdon",
          "postalCode": "1400",
          "state": "Vaud",
          "country": "Suisse",
          "longitude": 6.6572137,
          "latitude": 46.7792474
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
          "tuesday": [
            {
              "openingHour": "09:00",
              "closingHour": "12:00"
            },
            {
              "openingHour": "14:00",
              "closingHour": "18:00"
            }
          ],
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
          "sunday": [
            {
              "openingHour": "07:00",
              "closingHour": "10:00"
            },
            {
              "openingHour": "15:00",
              "closingHour": "18:00"
            }
          ]
        }
      }
    }
  }
}

exports['Testing graphql request salespoints QUERY salespoint Testing salespoint(salespointId: ID!) should fail getting a salespoint because invalid id received (too long) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdefabcdefabcdefabcdefabcdef\" at path \"_id\" for model \"salespoints\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "salespoint"
      ]
    }
  ],
  "data": {
    "salespoint": null
  }
}

exports['Testing graphql request salespoints QUERY salespoint Testing salespoint(salespointId: ID!) should fail getting a salespoint because invalid id received (too short) 1'] = {
  "errors": [
    {
      "message": "Cast to ObjectId failed for value \"abcdef\" at path \"_id\" for model \"salespoints\"",
      "locations": [
        {
          "line": 3,
          "column": 13
        }
      ],
      "path": [
        "salespoint"
      ]
    }
  ],
  "data": {
    "salespoint": null
  }
}

exports['Testing graphql request salespoints QUERY salespoint Testing salespoint(salespointId: ID!) should fail getting a salespoint because unknown id received 1'] = {
  "data": {
    "salespoint": null
  }
}

exports['Testing graphql request salespoints QUERY salespoint Testing salespoint(salespointId: ID!) should get a salespoint by id 1'] = {
  "data": {
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
    }
  }
}

exports['Testing graphql request salespoints QUERY salespoint Testing salespoints() should get all salespoints 1'] = {
  "errors": [
    {
      "message": "Cannot query field \"id\" on type \"Salespoint\".",
      "locations": [
        {
          "line": 12,
          "column": 19
        }
      ]
    }
  ]
}
