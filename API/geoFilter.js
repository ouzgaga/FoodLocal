// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 9 - excluded
		stage: 9,  source: {
			$project: {
			rating: true
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
			    near: { type: 'Point', coordinates: [6.65, 46.77] },
			    spherical: true,
			    distanceField: 'address.distance',
			    maxDistance: 300
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

		// Stage 6
		{
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
		},

		// Stage 7
		{
			$unwind: { path: '$productTypeIds' }
		},

		// Stage 8
		{
			$match: {
			  productTypeIds: {
			    $all: [ObjectId('5c477f57d989178f3211e3df'), ObjectId('5c477f57d989178f3211e3f1'), ObjectId('5c477f57d989178f3211e3ff')]
			  },
			  isValidated: true,
			  'rating.grade': {$gte: 3}
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
