// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

  {
    // Stage 8 - excluded
    stage: 8,
    source: {
      $match: {
			  productTypeIds: {
			    $all: [ObjectId('5c3efe96d51af507c5310a3a'), ObjectId('5c3efe96d51af507c5310a43')]
			  }
      }
    }
  },
];

db.getCollection('salespoints').aggregate(

  // Pipeline
  [
    // Stage 1
    {
      $geoNear: {
			    near: { type: 'Point', coordinates: [6.68, 46.76] },
			    spherical: true,
			    distanceField: 'address.distance',
			    maxDistance: 1000000
      }
    },

    // Stage 2
    {
      $replaceRoot: {
			    newRoot: {
			        salespoint: '$$ROOT'
			    }
      }
    },

    // Stage 3
    {
      $lookup: { from: 'persons', localField: 'salespoint._id', foreignField: 'salespointId', as: 'producer' }
    },

    // Stage 4
    {
      $replaceRoot: {
			    newRoot: {
			        $mergeObjects: [
			            { $arrayElemAt: ['$producer', 0] }, '$$ROOT'
			        ]
			    }
      }
    },

    // Stage 5
    {
      $lookup: { from: 'products', localField: 'productsIds', foreignField: '_id', as: 'products' }
    },

    // Stage 6
    {
      $group: {
			      _id: '$_id',
			         followersIds: { $first: '$followersIds' },
			      followingProducersIds: { $first: '$followingProducersIds' },
			      kind: { $first: '$kind' },
			      firstname: { $first: '$firstname' },
			      lastname: { $first: '$lastname' },
			      email: { $first: '$email' },
			      password: { $first: '$password' },
			      image: { $first: '$image' },
			      emailValidated: { $first: '$emailValidated' },
			      isAdmin: { $first: '$isAdmin' },
			      phoneNumber: { $first: '$phoneNumber' },
			      description: { $first: '$description' },
			      isValidated: { $first: '$isValidated' },
			      rating: { $first: '$rating' },
			      salespoint: { $first: '$salespoint' },
			      products: { $first: '$products' },
			       productTypeIds: { $addToSet: '$products.productTypeId' },
			        salespointId: { $first: '$salespointId' },
			        productsIds: { $first: '$productsIds' }
      }
    },

    // Stage 7
    {
      $unwind: { path: '$productTypeIds' }
    },

  ]

  // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
