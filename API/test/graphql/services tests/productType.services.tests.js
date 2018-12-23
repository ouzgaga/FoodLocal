const productTypeServices = require('../../../src/graphql/services/productType.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const productsServices = require('../../../src/graphql/services/products.services');
const clearDB = require('../clearDB');
const ProductTypesModel = require('../../../src/graphql/models/productTypes.modelgql');
const ProductTypeCategoriesModel = require('../../../src/graphql/models/productTypeCategories.modelgql');

let categoryFruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let categoryVegetable = {
  name: 'Légumes',
  image: 'ceci est une image de légume encodée en base64!'
};

let productTypePomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};
let productTypePoire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};
let productTypeRaisin = {
  name: 'Raisin',
  image: 'ceci est une image de raisin encodée en base64!'
};
let productTypeCourgette = {
  name: 'Courgette',
  image: 'ceci est une image de courgette encodée en base64!'
};

let tabProductType = [];

const clearAndPopulateDB = async() => {
  // on supprime tout le contenu de la DB
  await clearDB();

  // on ajoute le contenu de départ
  categoryFruits = (await ProductTypeCategoriesModel.create(categoryFruits)).toObject();
  categoryVegetable = (await ProductTypeCategoriesModel.create(categoryVegetable)).toObject();

  productTypePomme.categoryId = categoryFruits.id;
  productTypePomme = (await ProductTypesModel.create(productTypePomme)).toObject();

  productTypePoire.categoryId = categoryFruits.id;
  productTypePoire = (await ProductTypesModel.create(productTypePoire)).toObject();

  productTypeRaisin.categoryId = categoryFruits.id;
  productTypeRaisin = (await ProductTypesModel.create(productTypeRaisin)).toObject();

  productTypeCourgette.id = undefined;
  productTypeCourgette.categoryId = categoryVegetable.id;
  productTypeCourgette = (await ProductTypesModel.create(productTypeCourgette)).toObject();

  tabProductType = [productTypePomme, productTypePoire, productTypeRaisin, productTypeCourgette];
};

describe('tests productType services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProductTypes', () => {
    it('should get all productType', async() => {
      // on récupère un tableau contenant tous les productType
      let allProductType = await productTypeServices.getProductTypes();

      // on transforme chaque productType du tableau en un objet
      allProductType = allProductType.map(producer => producer.toObject());
      allProductType.should.be.an('array');
      allProductType.length.should.be.equal(4);

      // pour chaque productType, on test les éléments critiques
      const promisesProductType = allProductType.map(async(productType, index) => {
        productType.should.be.not.null;
        productType.id.should.be.eql(tabProductType[index].id);
        productType.name.should.be.equal(tabProductType[index].name);
        productType.image.should.be.equal(tabProductType[index].image);
        productType.categoryId.should.be.eql(tabProductType[index].categoryId);
        productType.producersIds.should.be.not.null;
        productType.producersIds.length.should.be.equal(productTypePomme.producersIds.length);

        // on test chaque producerId
        const promisesProducersIds = await productType.producersIds.map(async(producerId, indexProducersIds) => {
          producerId.should.be.not.null;
          producerId.should.be.equal(tabProductType[index].producersIds[indexProducersIds]);
        });
        await Promise.all(promisesProducersIds);
      });
      await Promise.all(promisesProductType);
    });
  });

  describe('tests getProductTypeById', () => {
    it('should get one productType', async() => {
      // on récupère le productType correspondant à l'id donné
      const productType = (await productTypeServices.getProductTypeById(productTypePomme.id)).toObject();

      // on test son contenu
      productType.should.be.not.null;
      productType.id.should.be.eql(productTypePomme.id);
      productType.name.should.be.equal(productTypePomme.name);
      productType.image.should.be.equal(productTypePomme.image);
      productType.categoryId.should.be.eql(productTypePomme.categoryId);
      productType.producersIds.should.be.not.null;
      productType.producersIds.length.should.be.equal(productTypePomme.producersIds.length);

      // on test chaque producerId
      const promisesProducersIds = await productType.producersIds.map(async(producerId, index) => {
        producerId.should.be.not.null;
        producerId.should.be.equal(productTypePomme.producersIds[index]);
      });
      await Promise.all(promisesProducersIds);
    });

    it('should fail getting one productType because no id received', async() => {
      const productTypeGotInDB = await productTypeServices.getProductTypeById('');
      productTypeGotInDB.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail getting one productType because invalid id received', async() => {
      const productTypeGotInDB = await productTypeServices.getProductTypeById(productTypePomme.id + productTypePomme.id);
      productTypeGotInDB.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail getting one productType because unknown id received', async() => {
      const productTypeGotInDB = await productTypeServices.getProductTypeById('abcdefabcdefabcdefabcdef');
      expect(productTypeGotInDB).to.be.null;
    });
  });

  describe('tests getProductTypeByCategory', () => {
    it('should get all products of the category corresponding to the received id', async() => {
      productTypeCourgette = (await productTypeServices.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      tabProductType = [productTypeCourgette];

      // on récupère tous les productType de la catégorie correspondante à l'id passé en paramètre
      let productTypes = await productTypeServices.getProductTypeByCategory(categoryVegetable.id);
      productTypes.should.be.not.null;
      productTypes.should.be.an('array');
      productTypes.length.should.be.equal(1);

      // on test le contenu des productType récupérés
      let promisesProductTypes = productTypes.map((async(productType, index) => {
        productType.should.be.not.null;
        productType.id.should.be.eql(tabProductType[index].id);
        productType.name.should.be.equal(tabProductType[index].name);
        productType.image.should.be.equal(tabProductType[index].image);
        productType.categoryId.should.be.eql(tabProductType[index].categoryId);
        productType.producersIds.should.be.not.null;
        productType.producersIds.length.should.be.equal(tabProductType[index].producersIds.length);

        // on test chaque producerId
        const promisesProducersIds = await productType.producersIds.map(async(producerId, indexProducersIds) => {
          producerId.should.be.not.null;
          producerId.should.be.eql(tabProductType[index].producersIds[indexProducersIds]);
        });
        await Promise.all(promisesProducersIds);
      }));

      await Promise.all(promisesProductTypes);

      tabProductType = [productTypePomme, productTypePoire, productTypeRaisin];

      // on récupère tous les produits de la catégorie correspondante à l'id passé en paramètre
      productTypes = await productTypeServices.getProductTypeByCategory(categoryFruits.id);
      productTypes.should.be.not.null;
      productTypes.should.be.an('array');
      productTypes.length.should.be.equal(3);

      // on test le contenu des productType récupérés
      promisesProductTypes = productTypes.map((async(productType, index) => {
        productType.should.be.not.null;
        productType.id.should.be.eql(tabProductType[index].id);
        productType.name.should.be.equal(tabProductType[index].name);
        productType.image.should.be.equal(tabProductType[index].image);
        productType.categoryId.should.be.eql(tabProductType[index].categoryId);
        productType.producersIds.should.be.not.null;
        productType.producersIds.length.should.be.equal(productTypePomme.producersIds.length);

        // on test chaque producerId
        const promisesProducersIds = await productType.producersIds.map(async(producerId, indexProducersIds) => {
          producerId.should.be.not.null;
          producerId.should.be.eql(tabProductType[index].producersIds[indexProducersIds]);
        });
        await Promise.all(promisesProducersIds);
      }));

      await Promise.all(promisesProductTypes);
    });
  });

  describe('tests getProducersIdsProposingProductsOfAllReceivedProductsTypeIds', () => {
    it('should get all producers producing one or more products of one or more of the received productTypeIds', async() => {
      // on ajoute 1 producteur proposant 2 produits, 1 de type 'productTypePomme' et un de type 'productTypePoire'
      let benoit = {
        firstname: 'Benoît',
        lastname: 'Schöpfli',
        email: 'benoit@paysan.ch',
        password: '1234abcd',
        image: 'Ceci est une image encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un chouet gaillard!',
        website: 'benoitpaysan.ch'
      };
      benoit = await producersServices.addProducer(benoit);
      await productsServices.addAllProductsInArray([
        {
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: productTypePomme.id
        },
        {
          description: 'Une poire de folie!',
          productTypeId: productTypePoire.id
        }
      ], benoit.id);

      // on ajoute 1 producteur proposant 1 produit de type 'productTypePomme'
      let antoine = {
        firstname: 'Antoine',
        lastname: 'Rochaille',
        email: 'antoine@paysan.ch',
        password: '1234abcd',
        image: 'Ceci est l\'image d\'un tueur encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un vrai payouz!'
      };
      antoine = await producersServices.addProducer(antoine);
      await productsServices.addAllProductsInArray([
        {
          description: 'Une pomme monnnnstre bonne!',
          productTypeId: productTypePomme.id
        }
      ], antoine.id);

      // On récupère tous les producteurs produisant un ou plusieurs produits de type productTypePoire
      let producersOfFruits = await productTypeServices.getProducersIdsProposingProductsOfAllReceivedProductsTypeIds([productTypePoire.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(1);

      // On récupère tous les producteurs produisant un ou plusieurs produits de type productTypePomme
      producersOfFruits = await productTypeServices.getProducersIdsProposingProductsOfAllReceivedProductsTypeIds([productTypePomme.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(2);
    });
  });

  describe('tests addProductType', () => {
    it('should add a new productType', async() => {
      const addedProductType = (await productTypeServices.addProductType(productTypePomme)).toObject();
      // on test son contenu
      addedProductType.should.be.not.null;
      addedProductType.id.should.be.not.null; // ne peut pas être égal à productTypePomme.id !
      addedProductType.name.should.be.equal(productTypePomme.name);
      addedProductType.image.should.be.equal(productTypePomme.image);
      addedProductType.categoryId.should.be.eql(productTypePomme.categoryId);
      addedProductType.producersIds.should.be.not.null;
      addedProductType.producersIds.length.should.be.equal(productTypePomme.producersIds.length);

      // on test chaque producerId
      const promisesProducersIds = await addedProductType.producersIds.map(async(producerId, index) => {
        producerId.should.be.not.null;
        producerId.should.be.equal(productTypePomme.producersIds[index]);
      });
      await Promise.all(promisesProducersIds);
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires
  });

  describe('tests addProducerProducingThisProductType', () => {
    it('should add the received producerId as producing one or more products of the received productTypeId', async() => {
      // on ajoute un producteur produisant un ou plusieurs produits de type productTypeCourgette
      productTypeCourgette = (await productTypeServices.addProductType(productTypeCourgette));
      productTypeCourgette = (await productTypeServices.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(1);
      productTypeCourgette.producersIds.map(p => p.toString())
        .should
        .contain('abcdefabcdefabcdefabcdef');

      // on tente de rajouter un producteur produisant déjà un ou plusieurs produits de type productTypeCourgette (donc déjà présent dans le tableau)
      productTypeCourgette = (await productTypeServices.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(1);
      productTypeCourgette.producersIds.map(p => p.toString()).should.contain('abcdefabcdefabcdefabcdef');

      // on ajoute un autre producteur produisant un ou plusieurs produits de type productTypeCourgette
      productTypeCourgette = (await productTypeServices.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdfe')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(2);
      productTypeCourgette.producersIds.map(p => p.toString()).should.contain('abcdefabcdefabcdefabcdfe');
    });
  });

  describe('tests updateProductType', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a productType', async() => {
      let productType = (await productTypeServices.getProductTypeById(productTypePomme.id)).toObject();

      productType = {
        id: productType.id,
        name: productTypeCourgette.name,
        image: productTypeCourgette.image,
        categoryId: productTypeCourgette.categoryId
      };

      // on met à jour dans la DB
      const updatedProductType = await productTypeServices.updateProductType(productType);
      // on test son contenu
      updatedProductType.should.be.not.null;
      updatedProductType.id.should.be.not.null; // ne peut pas être égal à productTypePomme.id !
      updatedProductType.name.should.be.equal(productTypeCourgette.name);
      updatedProductType.image.should.be.equal(productTypeCourgette.image);
      updatedProductType.categoryId.should.be.eql(productTypeCourgette.categoryId);

      // on test chaque producerId
      const promisesProducersIds = await updatedProductType.producersIds.map(async(producerId, index) => {
        producerId.should.be.not.null;
        producerId.should.be.eql(productTypeCourgette.producersIds[index]);
      });
      await Promise.all(promisesProducersIds);
    });

    it('should fail updating a productType because no id received', async() => {
      productTypePomme.id = '';
      const updatedProductType = await productTypeServices.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      productTypePomme.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProductType = await productTypeServices.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      productTypePomme.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProductType = await productTypeServices.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a producer because unknown id received', async() => {
      productTypePomme.id = 'abcdefabcdefabcdefabcdef';
      const updatedProductType = await productTypeServices.updateProductType(productTypePomme);
      expect(updatedProductType).to.be.null;
    });
  });

  describe('tests deleteProductType', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a productType', async() => {
      // on supprime un productType
      let deleteProductType = await productTypeServices.deleteProductType(productTypePomme._id);
      deleteProductType.should.be.not.null;
      deleteProductType._id.should.be.eql(productTypePomme._id);

      // on tente de re-supprimer le même productType -> retourne null car le productType est introuvable dans la DB
      deleteProductType = await productTypeServices.getProductTypeById(deleteProductType);
      expect(deleteProductType).to.be.null;
    });

    it('should fail deleting a productType because given id not found in DB', async() => {
      // on supprime un productType
      const deleteProductType = await productTypeServices.deleteProductType('abcdefabcdefabcdefabcdef');
      expect(deleteProductType).to.be.null;
    });
  });
});
