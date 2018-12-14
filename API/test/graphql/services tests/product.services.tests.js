const mongoose = require('mongoose');
const producersService = require('../../../src/graphql/services/producers.services');
const productsService = require('../../../src/graphql/services/products.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../../src/graphql/models/persons.modelgql');
const userModel = require('../../../src/graphql/models/users.modelgql');
const salespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const tokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

let productTypeCategory = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};

let productTypePomme = {
  name: 'Pomme',
  image: 'ceci est une image de pomme encodée en base64!'
};

let productTypePoire = {
  name: 'Poire',
  image: 'ceci est une image de poire encodée en base64!'
};

let productPomme = {
  description: 'Viendez acheter ma belle pomme!'
};

let productPoire = {
  description: 'Viendez acheter ma belle poire!'
};

let tabProducts = [productPomme, productPoire];

const clearAndPopulateDB = async() => {
  // on supprime tout le contenu de la DB
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await userModel.deleteMany();
  await salespointsModel.deleteMany();
  await tokensValidationEmailModel.deleteMany();

  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoryModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  // FIXME: Paul: ya un moyen de transformer le _id en id lorsqu'on fait un toObject() ? --> juste id n'est plus reconnu après un toObject()...
  productTypePomme.categoryId = productTypeCategory._id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory._id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  // on ajoute 2 produits
  productPomme.productTypeId = productTypePomme._id;
  productPomme = (await ProductModel.create(productPomme)).toObject();
  productPoire.productTypeId = productTypePoire._id;
  productPoire = (await ProductModel.create(productPoire)).toObject();

  tabProducts = [productPomme, productPoire];
};

describe('tests product services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProducts', () => {
    it('should get all product', async() => {
      // on récupère un tableau contenant tous les produits
      let allProducts = await productsService.getProducts();

      // on transforme chaque producteur du tableau en un objet
      allProducts = allProducts.map(product => product.toObject());
      allProducts.should.be.an('array');
      allProducts.length.should.be.equal(2);

      // pour chaque produit
      const promises = await allProducts.map(async(product, index) => {
        product.should.be.not.null;
        product._id.should.be.eql(tabProducts[index]._id);
        product.productTypeId.should.be.not.null;
        product.productTypeId.should.be.an('object');
      });
      await Promise.all(promises);
    });
  });

  describe('tests getAllProductsInReceivedIdList', () => {
    it('should get all product with id in received list', async() => {
      // on récupère 2 produits
      let products = await productsService.getAllProductsInReceivedIdList([productPoire._id, productPomme._id]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(2);

      // on récupère 1 seul produit
      products = await productsService.getAllProductsInReceivedIdList([productPomme._id]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(1);

      // on récupère aucun produit
      products = await productsService.getAllProductsInReceivedIdList([]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(0);
    });
  });

  describe('tests getProductById', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should get one product', async() => {
      // on récupère le produit correspondant à l'id donné
      const productGotInDB = (await productsService.getProductById(productPomme._id)).toObject();

      // on test son contenu
      productGotInDB.should.be.not.null;
      productGotInDB.should.be.an('object');
      productGotInDB._id.should.be.eql(productPomme._id);
      productGotInDB.description.should.be.equal(productPomme.description);
      productGotInDB.productTypeId.should.be.eql(productPomme.productTypeId);
    });

    it('should fail getting one product because no id received', async() => {
      const productGotInDB = await productsService.getProductById({ id: '' });
      productGotInDB.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail getting one product because unknown id received', async() => {
      const productGotInDB = await productsService.getProductById('abcdefabcdefabcdefabcdef');
      // FIXME: Paul: est-ce que c'est la meilleure façon de tester si un element est nul? -> faire elem.should.be.null lève une erreur...
      expect(productGotInDB).to.be.null;
    });
  });

  describe('tests addProduct', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should add a new product', async() => {
      const addedProduct = (await productsService.addProduct(productPomme)).toObject();
      // on test son contenu
      addedProduct.should.be.not.null;
      addedProduct.should.be.an('object');
      addedProduct._id.should.be.not.null; // ne peut pas être le même que productPomme._id
      addedProduct.description.should.be.equal(productPomme.description);
      addedProduct.productTypeId.should.be.eql(productPomme.productTypeId);
    });

    it('should fail adding a new product because given productTypeId is unknow', async() => {
      productPomme.productTypeId = 'abcdefabcdefabcdefabcdef';
      const addedProduct = await productsService.addProduct(productPomme);
      // on test son contenu
      addedProduct.message.should.be.equal('This productType.id doesn\'t exist!');
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires
  });

  describe('tests addAllProductsInArray', () => {
    it('should add a new product for all product in received array', async() => {
      // on supprime tout le contenu de la DB de products
      await ProductModel.deleteMany();

      // on ajoute tous les produits passés dans le tableau en paramètre
      const addedProducts = await productsService.addAllProductsInArray([productPomme, productPoire]);

      const promises = addedProducts.map((async(productId, index) => {
        const product = await productsService.getProductById(productId);
        product.should.be.not.null;
        product._id.should.be.not.null;
        product.description.should.be.equal(tabProducts[index].description);
        product.productTypeId.should.be.eql(tabProducts[index].productTypeId);
      }));
      await Promise.all(promises);
    });
  });

  describe('tests updateProduct', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a product', async() => {
      const addedProduct = await productsService.addProduct(productPomme);

      // on copie l'id du product dans productPoire --> revient à mettre à jour l'ensemble des données (sauf l'id) de 'addedProduct'
      productPoire._id = addedProduct._id;

      // on crée le champ id car on en a besoin dans updateProduct()
      productPoire.id = productPoire._id;

      const updatedProduct = await productsService.updateProduct(productPoire);
      updatedProduct.should.be.not.null;
      updatedProduct.id.should.be.not.null;
      updatedProduct.description.should.be.not.null;
      updatedProduct.description.should.be.equal(productPoire.description);
      updatedProduct.productTypeId.should.be.not.null;
      updatedProduct.productTypeId.should.be.eql(productPoire.productTypeId);
    });

    it('should fail updating a product because no id received', async() => {

      productPomme.id = '';
      const updatedProduct = await productsService.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      productPomme.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProduct = await productsService.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      productPomme.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProduct = await productsService.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should return null after update a product because unknown id received', async() => {
      productPomme.id = 'abcdefabcdefabcdefabcdef';
      const updatedProduct = await productsService.updateProduct(productPomme);

      expect(updatedProduct).to.be.null;
    });
  });

  describe('tests deleteProduct', () => {
    it('should delete a product', async() => {
      // on supprime le produit
      let deleteProduct = (await productsService.deleteProduct(productPomme._id)).toObject();

      // on test le contenu du produit qui vient d'être supprimé
      deleteProduct.should.be.not.null;
      deleteProduct._id.should.be.eql(productPomme._id);

      // on tente de re-supprimer le produit -> retourne null car le produit est introuvable dans la DB
      deleteProduct = await productsService.getProductById(deleteProduct);

      // FIXME: Paul: est-ce que c'est la meilleure façon de tester si un element est nul? -> faire elem.should.be.null lève une erreur...
      expect(deleteProduct).to.be.null;
    });
  });
});
