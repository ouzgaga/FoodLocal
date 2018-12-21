const productsServices = require('../../../src/graphql/services/products.services');
const producersServices = require('../../../src/graphql/services/producers.services');
const clearDB = require('../clearDB');
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
  await clearDB();

  // on ajoute 1 productTypeCategory
  productTypeCategory = (await ProductTypeCategoryModel.create(productTypeCategory)).toObject();

  // on ajoute 2 productType
  productTypePomme.categoryId = productTypeCategory.id;
  productTypePomme = (await ProductTypeModel.create(productTypePomme)).toObject();
  productTypePoire.categoryId = productTypeCategory.id;
  productTypePoire = (await ProductTypeModel.create(productTypePoire)).toObject();

  // on ajoute 2 produits
  productPomme.productTypeId = productTypePomme.id;
  productPomme = (await ProductModel.create(productPomme)).toObject();
  productPoire.productTypeId = productTypePoire.id;
  productPoire = (await ProductModel.create(productPoire)).toObject();

  tabProducts = [productPomme, productPoire];
};

describe('tests product services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProducts', () => {
    it('should get all product', async() => {
      // on récupère un tableau contenant tous les produits
      let allProducts = await productsServices.getProducts();

      // on transforme chaque producteur du tableau en un objet
      allProducts = allProducts.map(product => product.toObject());
      allProducts.should.be.an('array');
      allProducts.length.should.be.equal(2);

      // pour chaque produit
      const promises = await allProducts.map(async(product, index) => {
        product.should.be.not.null;
        product.id.should.be.eql(tabProducts[index].id);
        product.productTypeId.should.be.not.null;
        product.productTypeId.should.be.an('object');
      });
      await Promise.all(promises);
    });
  });

  describe('tests getAllProductsInReceivedIdList', () => {
    it('should get all product with id in received list', async() => {
      // on récupère 2 produits
      let products = await productsServices.getAllProductsInReceivedIdList([productPoire.id, productPomme.id]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(2);

      // on récupère 1 seul produit
      products = await productsServices.getAllProductsInReceivedIdList([productPomme.id]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(1);

      // on récupère aucun produit
      products = await productsServices.getAllProductsInReceivedIdList([]);
      products.should.be.not.null;
      products.should.be.an('array');
      products.length.should.be.equal(0);
    });
  });

  describe('tests getProductById', () => {
    it('should get one product', async() => {
      // on récupère le produit correspondant à l'id donné
      const productGotInDB = (await productsServices.getProductById(productPomme.id)).toObject();

      // on test son contenu
      productGotInDB.should.be.not.null;
      productGotInDB.should.be.an('object');
      productGotInDB.id.should.be.eql(productPomme.id);
      productGotInDB.description.should.be.equal(productPomme.description);
      productGotInDB.productTypeId.should.be.eql(productPomme.productTypeId);
    });

    it('should fail getting one product because no id received', async() => {
      const productGotInDB = await productsServices.getProductById({ id: '' });
      productGotInDB.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail getting one product because unknown id received', async() => {
      const productGotInDB = await productsServices.getProductById('abcdefabcdefabcdefabcdef');
      expect(productGotInDB).to.be.null;
    });
  });

  describe('tests addProduct', () => {
    let antoine = {
      firstname: 'Antoine',
      lastname: 'Rochaille',
      email: 'antoine@paysan.ch',
      password: '1234abcd',
      image: 'Ceci est l\'image d\'un tueur encodée en base64!',
      phoneNumber: '0761435196',
      description: 'Un vrai payouz!'
    };

    beforeEach(async() => {
      await clearAndPopulateDB();

      // on ajoute 1 producteur ne contenant pas de salespoint ainsi que 1 produit ('productPomme')
      antoine = (await producersServices.addProducer(antoine)).toObject();
    });

    it('should add a new product', async() => {
      productPomme.id = undefined;
      productPomme._id = undefined;
      const addedProduct = (await productsServices.addProduct(productPomme, antoine.id)).toObject();
      // on test son contenu
      addedProduct.should.be.not.null;
      addedProduct.should.be.an('object');
      addedProduct.id.should.be.not.null; // ne peut pas être le même que productPomme.id
      addedProduct.description.should.be.equal(productPomme.description);
      addedProduct.productTypeId.should.be.eql(productPomme.productTypeId);
    });

    it('should fail adding a new product because given productTypeId is unknow', async() => {
      productPomme.id = undefined;
      productPomme._id = undefined;
      productPomme.productTypeId = 'abcdefabcdefabcdefabcdef';
      try {
        const addedProduct = await productsServices.addProduct(productPomme, antoine.id);
      } catch (e) {
        // on test son contenu
        e.message.should.be.equal(`The given productTypeId (${productPomme.productTypeId}) doesn’t exist in the database!`);
      }
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires
  });

  describe('tests addAllProductsInArray', () => {
    it('should add a new product for all product in received array', async() => {
      // on supprime tout le contenu de la DB de products
      await ProductModel.deleteMany();

      // on ajoute tous les produits passés dans le tableau en paramètre
      const addedProducts = await productsServices.addAllProductsInArray([productPomme, productPoire]);

      const promises = addedProducts.map((async(product, index) => {
        product.should.be.not.null;
        product.id.should.be.not.null;
        product.description.should.be.equal(tabProducts[index].description);
        product.productTypeId.should.be.eql(tabProducts[index].productTypeId);
      }));
      await Promise.all(promises);
    });
  });

  describe('tests updateProduct', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a product', async() => {
      // on récupère un produit
      let product = await productsServices.getProductById(productPomme.id);
      // on le modifie
      product = {
        ...productPoire,
        id: product.id,
        _id: product._id
      };
      // on le met à jour
      const updatedProduct = await productsServices.updateProduct(product);
      // on test son nouveau contenu
      updatedProduct.should.be.not.null;
      updatedProduct.id.should.be.not.null;
      updatedProduct.description.should.be.not.null;
      updatedProduct.description.should.be.equal(productPoire.description);
      updatedProduct.productTypeId.should.be.not.null;
      updatedProduct.productTypeId.should.be.eql(productPoire.productTypeId);
    });

    it('should fail updating a product because no id received', async() => {
      productPomme.id = '';
      const updatedProduct = await productsServices.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      productPomme.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProduct = await productsServices.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      productPomme.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
      const updatedProduct = await productsServices.updateProduct(productPomme);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should return null after update a product because unknown id received', async() => {
      productPomme.id = 'abcdefabcdefabcdefabcdef';
      const updatedProduct = await productsServices.updateProduct(productPomme);

      expect(updatedProduct).to.be.null;
    });
  });

  describe('tests deleteProduct', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a product', async() => {
      // on supprime le produit
      let deleteProduct = (await productsServices.deleteProduct(productPomme.id)).toObject();

      // on test le contenu du produit qui vient d'être supprimé
      deleteProduct.should.be.not.null;
      deleteProduct.id.should.be.eql(productPomme.id);

      // on tente de re-supprimer le produit -> retourne null car le produit est introuvable dans la DB
      deleteProduct = await productsServices.getProductById(deleteProduct);
      expect(deleteProduct).to.be.null;
    });

    it('should fail deleting a product because given id not found in DB', async() => {
      // on supprime un product inexistant
      const deleteProduct = await productsServices.deleteProduct('abcdefabcdefabcdefabcdef');
      expect(deleteProduct).to.be.null;
    });
  });
});
