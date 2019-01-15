db.getCollection("salespoints").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$geoNear: {
				near: { type: 'Point', coordinates: [6.68, 46.76] },
			    spherical: true,
			    distanceField: 'distance',
			    maxDistance: 5000
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
			$project: {
			    salespointId: false, producer: false, productsIds: false
			}
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
			    $all: [ObjectId("5c3df2e5e1abee4a38356edb"), ObjectId("5c3df2e5e1abee4a38356ed2"), ObjectId("5c3df2e5e1abee4a38356ee2")]
			  }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
