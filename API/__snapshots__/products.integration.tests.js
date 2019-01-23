exports['Testing graphql request products MUTATION product Testing deleteProduct(productId: ID!) should delete a product 1'] = {
  "data": {
    "deleteProduct": {
      "description": "Une tomme monnnnstre bonne!",
      "productType": {
        "name": "Fromages / Produits laitiers",
        "category": {
          "name": "Autres"
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
}
