// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 6 - excluded
		stage: 6,  source: {
			$group: {
			          _id: '$_id',
			          kind: { $first: '$kind' },
			          firstname: { $first: '$firstname' },
			          lastname: { $first: '$lastname' },
			          email: { $first: '$email' },
			          image: { $first: '$image' },
			          followingProducersIds: { $first: '$followingProducersIds' },
			          emailValidated: { $first: '$emailValidated' },
			          isAdmin: { $first: '$isAdmin' },
			          followersIds: { $first: '$followersIds' },
			          phoneNumber: { $first: '$phoneNumber' },
			          description: { $first: '$description' },
			          website: { $first: '$website' },
			          salespointId: { $first: '$salespointId' },
			          isValidated: { $first: '$isValidated' },
			          productsIds: { $first: '$productsIds' },
			          rating: { $first: '$rating' },
			          productTypeIds: { $addToSet: '$products.productTypeId' },
			          salespoint: { $first: '$salespoint' },
			          products: { $first: '$products' }
			}
		}
	},

	{
		// Stage 7 - excluded
		stage: 7,  source: {
			$unwind: { path: '$productTypeIds' }
		}
	},

	{
		// Stage 8 - excluded
		stage: 8,  source: {
			$match: {
			  productTypeIds: {
			    $all: [ObjectId("5c3efe96d51af507c5310a3a"), ObjectId("5c3efe96d51af507c5310a43")]
			  }
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
			    distanceField: 'address.distance',
			    maxDistance: 1000000
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

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
