// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 6 - excluded
		stage: 6,  source: {
			$project: {
			    salespointId: false, producer: false, productsIds: false
			}
		}
	},
]

db.getCollection("salespoints").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$geoNear: {
			    near: { type: 'Point', coordinates: [6.68, 46.76] },
			    spherical: true,
			    distanceField: 'distance',
			    maxDistance: 3000
			}
		},

		// Stage 2
		{
			$replaceRoot: {
			    newRoot: {
			        'salespoint': '$$ROOT'
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
			            { $arrayElemAt: ["$producer", 0]}, "$$ROOT"
			        ]
			    }
			}
		},

		// Stage 5
		{
			$lookup: { from: 'products', localField: 'productsIds', foreignField: '_id', as: 'products' }
		},

		// Stage 7
		{
			$group: {
			      _id: '$_id',
			   	  followersIds: {$first: '$followersIds'},
			      followingProducersIds: {$first: '$followingProducersIds'},
			      kind: {$first: '$kind'},
			      firstname: {$first: '$firstname'},
			      lastname: {$first: '$lastname'},
			      email: {$first: '$email'},
			      password: {$first: '$password'},
			      image: {$first: '$image'},
			      emailValidated: {$first: '$emailValidated'},
			      isAdmin: {$first: '$isAdmin'},
			      phoneNumber: {$first: '$phoneNumber'},
			      description: {$first: '$description'},
			      isValidated: {$first: '$isValidated'},
			      rating: {$first: '$rating'},
			      salespoint: {$first: '$salespoint'},
			      products: {$first: '$products'},
			 	  productTypeIds: { $addToSet: '$products.productTypeId'},
			  	  salespointId: {$first: '$salespointId'},
			  	  productsIds: {$first: '$productsIds'}
			}
		},

		// Stage 8
		{
			$unwind: { path: '$productTypeIds' }
		},

		// Stage 9
		{
			$match: {
			  productTypeIds: {
			    $all: [ObjectId("5c3efe96d51af507c5310a3a"), ObjectId("5c3efe96d51af507c5310a43")]
			  }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
