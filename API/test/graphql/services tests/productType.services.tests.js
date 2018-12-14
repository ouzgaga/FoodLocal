const mongoose = require('mongoose');

const productTypeService = require('../../../src/graphql/services/productType.services');
const producersService = require('../../../src/graphql/services/producers.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const userModel = require('../../../src/graphql/models/users.modelgql');
const salespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const tokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let categoryFruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let categoryVegetable = {
  name: 'Légumes',
  image: 'ceci est une image de légume encodée en base64!'
};

let pomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};
let poire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};
let raisin = {
  name: 'Raisin',
  image: 'ceci est une image de raisin encodée en base64!'
};
let courgette = {
  name: 'Courgette',
  image: 'ceci est une image de courgette encodée en base64!'
};

describe('tests productType services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProducersModel.deleteMany();
    await ProductModel.deleteMany();
    await ProductTypeModel.deleteMany();
    await ProductTypeCategoryModel.deleteMany();
    await userModel.deleteMany();
    await salespointsModel.deleteMany();
    await tokensValidationEmailModel.deleteMany();


    // on ajoute le contenu de départ
    categoryFruits = await ProductTypeCategoryModel.create(categoryFruits);
    categoryVegetable = await ProductTypeCategoryModel.create(categoryVegetable);

    pomme = {
      name: pomme.name,
      image: pomme.image,
      categoryId: categoryFruits.id
    };
    const addedPomme = await ProductTypeModel.create(pomme);
    pomme.id = addedPomme.id;
    pomme.categoryId = categoryFruits.id;

    poire = {
      name: poire.name,
      image: poire.image,
      categoryId: categoryFruits.id
    };
    const addedPoire = await ProductTypeModel.create(poire);
    poire.id = addedPoire.id;
    poire.categoryId = categoryFruits.id;

    raisin = {
      name: raisin.name,
      image: raisin.image,
      categoryId: categoryFruits.id
    };
    const addedRaisin = await ProductTypeModel.create(raisin);
    raisin.id = addedRaisin.id;
    raisin.categoryId = categoryFruits.id;

    courgette = {
      name: courgette.name,
      image: courgette.image,
      categoryId: categoryVegetable.id
    };
    const addedCourgette = await ProductTypeModel.create(courgette);
    courgette.id = addedCourgette.id;
    courgette.categoryId = categoryVegetable.id;
  });

  describe('tests getProductTypes', () => {
    it('should get all productType', async() => {
      const allProductType = await productTypeService.getProductTypes();

      allProductType.should.be.an('array');
      allProductType.length.should.be.equal(4);

      allProductType.forEach((productType) => {
        productType.should.be.not.null;
        productType.id.should.be.not.null;
        productType.name.should.be.not.null;
        productType.image.should.be.not.null;
        productType.categoryId.should.be.not.null;
      });
    });
  });

  describe('tests getProductTypeById', () => {
    it('should get one productType', async() => {
      let productTypeGotInDB = await productTypeService.getProductTypeById(pomme.id);

      productTypeGotInDB.should.be.an('object');
      productTypeGotInDB.should.be.not.null;
      productTypeGotInDB.id.should.be.not.null;

      productTypeGotInDB.name.should.be.equal(pomme.name);
      productTypeGotInDB.image.should.be.equal(pomme.image);
      productTypeGotInDB.categoryId.should.be.eql(new mongoose.Types.ObjectId(categoryFruits.id));
      productTypeGotInDB = await productTypeService.getProductTypeById(raisin.id);

      productTypeGotInDB.should.be.an('object');
      productTypeGotInDB.should.be.not.null;
      productTypeGotInDB.id.should.be.not.null;
      productTypeGotInDB.name.should.be.equal(raisin.name);

      productTypeGotInDB.image.should.be.equal(raisin.image);
      productTypeGotInDB.categoryId.should.be.eql(new mongoose.Types.ObjectId(categoryFruits.id));
    });

    it('should fail getting one productType because no id received', async() => {
      const productTypeGotInDB = await productTypeService.getProductTypeById('');
      productTypeGotInDB.message.should.be.equal('Received productType.id is invalid!');
    });
  });

  describe('tests getProductTypeByCategory', () => {
    it('should get all products of the category corresponding to the received id', async() => {
      let productTypeTab = [courgette];

      let productTypes = await productTypeService.getProductTypeByCategory(categoryVegetable.id);
      productTypes.should.be.not.null;
      productTypes.should.be.an('array');

      let promises = productTypes.map((async(productType, index) => {
        productType.should.be.not.null;
        productType.id.should.be.equal(productTypeTab[index].id);
        productType.name.should.be.equal(productTypeTab[index].name);
        productType.image.should.be.equal(productTypeTab[index].image);
        const promisesProducers = productType.producersIds.map((async(producerId) => {
          producerId.should.be.not.null;
        }));

        await Promise.all(promisesProducers);
      }));

      await Promise.all(promises);

      productTypeTab = [pomme, poire, raisin];

      productTypes = await productTypeService.getProductTypeByCategory(categoryFruits.id);
      productTypes.should.be.not.null;
      productTypes.should.be.an('array');

      promises = productTypes.map((async(productType, index) => {
        productType.should.be.not.null;
        productType.id.should.be.equal(productTypeTab[index].id);
        productType.name.should.be.equal(productTypeTab[index].name);
        productType.image.should.be.equal(productTypeTab[index].image);
        const promisesProducers = productType.producersIds.map((async(producerId) => {
          producerId.should.be.not.null;
        }));

        await Promise.all(promisesProducers);
      }));

      await Promise.all(promises);
    });
  });

  describe('tests getAllProducersIdsProposingProductsOfReceivedProductsTypeIds', () => {
    it('should get all producers producing one or more products of one or more of the received productTypeIds', async() => {

      let benoit = {
        firstname: 'Benoît',
        lastname: 'Schöpfli',
        email: 'benoit@paysan.ch',
        password: '1234abcd',
        image: 'Ceci est une image encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un chouet gaillard!',
        website: 'benoitpaysan.ch',
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productTypeId: pomme.id
          },
          {
            description: 'Une poire de folie!',
            productTypeId: poire.id
          }
        ]
      };

      let antoine = {
        firstname: 'Antoine',
        lastname: 'Rochaille',
        email: 'antoine.@paysan.ch',
        password: '1234abcd',
        image: 'Ceci est l\'image d\'un tueur encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un vrai payouz!',
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productTypeId: pomme.id
          }
        ]
      };

      benoit = await producersService.addProducer(benoit);

      antoine = await producersService.addProducer(antoine);

      let producersOfFruits = await productTypeService.getAllProducersIdsProposingProductsOfReceivedProductsTypeIds([poire.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(1);


      producersOfFruits = await productTypeService.getAllProducersIdsProposingProductsOfReceivedProductsTypeIds([pomme.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(2);
    });
  });

  describe('tests addProductType', () => {
    it('should add a new productType', async() => {
      const addedProductType = await productTypeService.addProductType(pomme);

      addedProductType.should.be.an('object');
      addedProductType.should.be.not.null;
      addedProductType.id.should.be.not.null;

      addedProductType.name.should.be.equal(pomme.name);
      addedProductType.image.should.be.equal(pomme.image);
      addedProductType.categoryId.toString().should.be.equal(pomme.categoryId.toString());
    });
  });

  describe('tests updateProductType', () => {
    it('should update a productType', async() => {
      let addedProductType = await productTypeService.addProductType(pomme);
      addedProductType = {
        id: addedProductType.id,
        name: poire.name,
        image: poire.image,
        category: { id: categoryFruits.id },
        producers: []
      };
      const updatedProductType = await productTypeService.updateProductType(addedProductType);

      updatedProductType.should.be.an('object');
      updatedProductType.should.be.not.null;
      updatedProductType.id.should.be.not.null;
      updatedProductType.name.should.be.equal(poire.name);
      updatedProductType.image.should.be.equal(poire.image);
    });

    it('should fail updating a productType because no id received', async() => {
      const addedProductType = {
        ...poire,
        id: ''
      };
      const updatedProductType = await productTypeService.updateProductType(addedProductType);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      const addedProductType = {
        ...poire,
        id: '5c04561e7209e21e582750' // id trop court (<24 caractères)
      };
      const updatedProductType = await productTypeService.updateProductType(addedProductType);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      const addedProductType = {
        ...poire,
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3' // id trop long (> 24 caractères)
      };
      const updatedProductType = await productTypeService.updateProductType(addedProductType);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });
  });

  describe('tests deleteProductType', () => {
    it('should delete a productType', async() => {
      const addedProductType = await productTypeService.addProductType(pomme);

      addedProductType.should.be.an('object');
      addedProductType.should.be.not.null;
      addedProductType.id.should.be.not.null;

      addedProductType.name.should.be.equal(pomme.name);
      addedProductType.image.should.be.equal(pomme.image);

      let deleteProductType = await productTypeService.deleteProductType(addedProductType);

      deleteProductType.should.be.not.null;

      deleteProductType = await productTypeService.getProductTypeById(deleteProductType);
      expect(deleteProductType).to.be.null;
    });
  });
});
