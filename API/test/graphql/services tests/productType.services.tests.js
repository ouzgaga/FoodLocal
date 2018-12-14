const mongoose = require('mongoose');
const productTypeService = require('../../../src/graphql/services/productType.services');
const producersService = require('../../../src/graphql/services/producers.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const UserModel = require('../../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
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
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();

  // on ajoute le contenu de départ
  categoryFruits = (await ProductTypeCategoryModel.create(categoryFruits)).toObject();
  categoryVegetable = (await ProductTypeCategoryModel.create(categoryVegetable)).toObject();

  productTypePomme.categoryId = categoryFruits.id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();

  productTypePoire.categoryId = categoryFruits.id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  productTypeRaisin.categoryId = categoryFruits.id;
  productTypeRaisin = (await ProductTypeModel.create(productTypeRaisin)).toObject();

  productTypeCourgette.id = undefined;
  productTypeCourgette.categoryId = categoryVegetable.id;
  productTypeCourgette = (await ProductTypeModel.create(productTypeCourgette)).toObject();

  tabProductType = [productTypePomme, productTypePoire, productTypeRaisin, productTypeCourgette];
};

describe('tests productType services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProductTypes', () => {
    it('should get all productType', async() => {
      // on récupère un tableau contenant tous les productType
      let allProductType = await productTypeService.getProductTypes();

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
    beforeEach(() => clearAndPopulateDB());

    it('should get one productType', async() => {
      // on récupère le productType correspondant à l'id donné
      const productType = (await productTypeService.getProductTypeById(productTypePomme.id)).toObject();

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
      const productTypeGotInDB = await productTypeService.getProductTypeById('');
      productTypeGotInDB.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail getting one productType because invalid id received', async() => {
      const productTypeGotInDB = await productTypeService.getProductTypeById(productTypePomme.id + productTypePomme.id);
      productTypeGotInDB.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail getting one productType because unknown id received', async() => {
      const productTypeGotInDB = await productTypeService.getProductTypeById('abcdefabcdefabcdefabcdef');
      expect(productTypeGotInDB).to.be.null;
    });
  });

  describe('tests getProductTypeByCategory', () => {
    it('should get all products of the category corresponding to the received id', async() => {
      productTypeCourgette = (await productTypeService.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      tabProductType = [productTypeCourgette];

      // on récupère tous les productType de la catégorie correspondante à l'id passé en paramètre
      let productTypes = await productTypeService.getProductTypeByCategory(categoryVegetable.id);
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
      productTypes = await productTypeService.getProductTypeByCategory(categoryFruits.id);
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

  describe('tests getAllProducersIdsProposingProductsOfReceivedProductsTypeIds', () => {
    it('should get all producers producing one or more products of one or more of the received productTypeIds', async() => {
      // on ajoute 1 producteur proposant 2 produits, 1 de type 'productTypePomme' et un de type 'productTypePoire'
      const benoit = {
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
            productTypeId: productTypePomme.id
          },
          {
            description: 'Une poire de folie!',
            productTypeId: productTypePoire.id
          }
        ]
      };
      await producersService.addProducer(benoit);

      // on ajoute 1 producteur proposant 1 produit de type 'productTypePomme'
      const antoine = {
        firstname: 'Antoine',
        lastname: 'Rochaille',
        email: 'antoine@paysan.ch',
        password: '1234abcd',
        image: 'Ceci est l\'image d\'un tueur encodée en base64!',
        phoneNumber: '0761435196',
        description: 'Un vrai payouz!',
        products: [
          {
            description: 'Une pomme monnnnstre bonne!',
            productTypeId: productTypePomme.id
          }
        ]
      };
      await producersService.addProducer(antoine);

      // On récupère tous les producteurs produisant un ou plusieurs produits de type productTypePoire
      let producersOfFruits = await productTypeService.getAllProducersIdsProposingProductsOfReceivedProductsTypeIds([productTypePoire.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(1);

      // On récupère tous les producteurs produisant un ou plusieurs produits de type productTypePomme
      producersOfFruits = await productTypeService.getAllProducersIdsProposingProductsOfReceivedProductsTypeIds([productTypePomme.id]);
      producersOfFruits.should.be.not.null;
      producersOfFruits.should.be.an('array');
      producersOfFruits.length.should.be.equal(2);
    });
  });

  describe('tests addProductType', () => {
    it('should add a new productType', async() => {
      const addedProductType = (await productTypeService.addProductType(productTypePomme)).toObject();
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

      productTypeCourgette = (await productTypeService.addProductType(productTypeCourgette));
      productTypeCourgette = (await productTypeService.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(1);
      productTypeCourgette.producersIds.map(p => p.toString())
        .should
        .contain('abcdefabcdefabcdefabcdef');

      // on tente de rajouter un producteur produisant déjà un ou plusieurs produits de type productTypeCourgette (donc déjà présent dans le tableau)
      /*
      // fixme: à décommenter lorsque j'aurai ajouté le check de présence d'un producerId dans addProducerProducingThisProductType()
      productTypeCourgette = (await productTypeService.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdef')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(2);
      productTypeCourgette.producersIds.map(p => p.toString())
        .should
        .contain('abcdefabcdefabcdefabcdef');
      */

      // on ajoute un autre producteur produisant un ou plusieurs produits de type productTypeCourgette
      productTypeCourgette = (await productTypeService.addProducerProducingThisProductType(productTypeCourgette.id, 'abcdefabcdefabcdefabcdfe')).toObject();
      productTypeCourgette.producersIds.length.should.be.equal(2);
      // productTypeCourgette.producersIds.map(p => p.toString()).should.contain('abcdefabcdefabcdefabcdfe');
    });
  });

  describe('tests updateProductType', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a productType', async() => {
      const productType = (await productTypeService.getProductTypeById(productTypePomme.id)).toObject();

      // on copie l'id du productType dans productTypeCourgette --> revient à mettre à jour l'ensemble des données (sauf l'id) de 'productTypeCourgette'
      productTypeCourgette.id = productType.id;

      // on crée le champ id car on en a besoin dans updateProductType()
      productTypeCourgette.id = productTypeCourgette.id;

      // on met à jour dans la DB
      const updatedProductType = await productTypeService.updateProductType(productTypeCourgette);
      // on test son contenu
      updatedProductType.should.be.not.null;
      updatedProductType.id.should.be.not.null; // ne peut pas être égal à productTypePomme.id !
      updatedProductType.name.should.be.equal(productTypeCourgette.name);
      updatedProductType.image.should.be.equal(productTypeCourgette.image);
      updatedProductType.categoryId.should.be.eql(productTypeCourgette.categoryId);
      updatedProductType.producersIds.should.be.not.null;
      updatedProductType.producersIds.length.should.be.equal(productTypeCourgette.producersIds.length);

      // on test chaque producerId
      const promisesProducersIds = await updatedProductType.producersIds.map(async(producerId, index) => {
        producerId.should.be.not.null;
        producerId.should.be.eql(productTypeCourgette.producersIds[index]);
      });
      await Promise.all(promisesProducersIds);
    });

    it('should fail updating a productType because no id received', async() => {
      productTypePomme.id = '';
      const updatedProductType = await productTypeService.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      productTypePomme.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProductType = await productTypeService.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      productTypePomme.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProductType = await productTypeService.updateProductType(productTypePomme);

      updatedProductType.message.should.be.equal('Received productType.id is invalid!');
    });

    it('should fail updating a producer because unknown id received', async() => {
      productTypePomme.id = 'abcdefabcdefabcdefabcdef';
      const updatedProductType = await productTypeService.updateProductType(productTypePomme);
      expect(updatedProductType).to.be.null;
    });
  });

  describe('tests deleteProductType', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a productType', async() => {
      // on supprime un productType
      let deleteProductType = await productTypeService.deleteProductType(productTypePomme._id);
      deleteProductType.should.be.not.null;
      deleteProductType._id.should.be.eql(productTypePomme._id);

      // on tente de re-supprimer le même productType -> retourne null car le productType est introuvable dans la DB
      deleteProductType = await productTypeService.getProductTypeById(deleteProductType);
      expect(deleteProductType).to.be.null;
    });

    it('should fail deleting a productType because given id not found in DB', async() => {
      // on supprime un productType
      const deleteProductType = await productTypeService.deleteProductType('abcdefabcdefabcdefabcdef');
      expect(deleteProductType).to.be.null;
    });
  });
});
