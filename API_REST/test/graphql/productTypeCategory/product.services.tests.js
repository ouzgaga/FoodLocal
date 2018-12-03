require('../../chai-config');
const mongoose = require('mongoose');

const productService = require('../../../src/graphql/services/products.services');
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

let maPomme = {
  description: 'Viendez acheter ma belle pomme!'
};

let maPoire = {
  description: 'Viendez acheter ma belle poire!'
};


describe('tests productType services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProductModel.deleteMany();
    await ProductTypeModel.deleteMany();
    await ProductTypeCategoryModel.deleteMany();

    // on ajoute le contenu de départ

    // on ajoute le productTypeCategory
    productTypeCategory = await ProductTypeCategoryModel.create(productTypeCategory);

    // on ajoute 2 productType
    productTypePomme = {
      name: productTypePomme.name,
      image: productTypePomme.image,
      category: productTypeCategory.id
    };
    productTypePomme = await ProductTypeModel.create(productTypePomme);
    productTypePoire = {
      name: productTypePoire.name,
      image: productTypePoire.image,
      category: productTypeCategory.id
    };
    productTypePoire = await ProductTypeModel.create(productTypePoire);

    // on ajoute 2 produits
    maPomme = {
      description: 'Viendez acheter ma belle pomme!',
      productType: productTypePomme.id
    };
    maPomme = await ProductModel.create(maPomme);
    maPoire = {
      description: 'Viendez acheter ma belle poire!',
      productType: productTypePoire.id
    };
    maPoire = await ProductModel.create(maPoire);
  });

  it('should get all product', async() => {
    const allProducts = await productService.getProducts();

    allProducts.should.be.an('array');
    allProducts.length.should.be.equal(2);

    allProducts.map((productType) => {
      productType.should.be.not.null;
      productType.id.should.be.not.null;
      productType.description.should.be.not.null;
      productType.productType.should.be.not.null;
      productType.productType.should.be.an('object');
      productType.productType.id.should.be.not.null;
    });
  });

  describe('tests getProductTypeById', () => {
    it('should get one productType', async() => {
      let productGotInDB = await productService.getProductById(maPomme);

      productGotInDB.should.be.not.null;
      productGotInDB.should.be.an('object');
      productGotInDB.id.should.be.not.null;
      productGotInDB.description.should.be.not.null;
      productGotInDB.description.should.be.equal(maPomme.description);
      productGotInDB.productType.should.be.not.null;
      productGotInDB.productType.should.be.an('object');
      productGotInDB.productType.id.should.be.not.null;
      productGotInDB.productType.id.should.be.eql(maPomme.productType.id);

      productGotInDB = await productService.getProductById(maPoire);
      productGotInDB.should.be.not.null;
      productGotInDB.should.be.an('object');
      productGotInDB.id.should.be.not.null;
      productGotInDB.description.should.be.not.null;
      productGotInDB.description.should.be.equal(maPoire.description);
      productGotInDB.productType.should.be.not.null;
      productGotInDB.productType.should.be.an('object');
      productGotInDB.productType.id.should.be.not.null;
      productGotInDB.productType.id.should.be.eql(maPoire.productType.id);
    });

    it('should fail getting one productType because no id received', async() => {
      const productTypeGotInDB = await productService.getProductById({ id: '' });
      productTypeGotInDB.message.should.be.equal('Received product.id is invalid!');
    });
  });

  it('should add a new productType', async() => {
    const addedProduct = await productService.addProduct(maPomme);

    addedProduct.should.be.an('object');
    addedProduct.should.be.not.null;
    addedProduct.id.should.be.not.null;
    addedProduct.description.should.be.not.null;
    addedProduct.description.should.be.equal(maPomme.description);
    addedProduct.productType.should.be.an('object');
    addedProduct.productType.should.be.not.null;
    addedProduct.productType.id.should.be.not.null;
    addedProduct.productType.id.should.be.eql(maPomme.productType.id);
  });

  describe('tests updateProductType', () => {
    it('should update a productType', async() => {
      let addedProduct = await productService.addProduct(maPomme);
      addedProduct = {
        id: addedProduct.id,
        description: 'Viendez acheter ma belle poire!',
        productType: { id: productTypePoire.id }
      };
      const updatedProduct = await productService.updateProduct(addedProduct);
      updatedProduct.should.be.an('object');
      updatedProduct.should.be.not.null;
      updatedProduct.id.should.be.not.null;
      updatedProduct.description.should.be.not.null;
      updatedProduct.description.should.be.equal(maPoire.description);
      updatedProduct.productType.should.be.an('object');
      updatedProduct.productType.should.be.not.null;
      updatedProduct.productType.id.should.be.not.null;
      updatedProduct.productType.id.should.be.eql(maPoire.productType.id);
    });

    it('should fail updating a productType because no id received', async() => {
      const addedProduct = {
        id: '',
        ...maPomme
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      const addedProduct = {
        id: '5c04561e7209e21e582750', // id trop court (<24 caractères)
        ...maPomme
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a productType because invalid id received', async() => {
      const addedProduct = {
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3', // id trop long (> 24 caractères)
        ...maPomme
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });
  });

  it('should delete a productType', async() => {
    const addedProduct = await productService.addProduct(maPomme);

    addedProduct.should.be.an('object');
    addedProduct.should.be.not.null;
    addedProduct.id.should.be.not.null;
    addedProduct.description.should.be.not.null;
    addedProduct.description.should.be.equal(maPomme.description);
    addedProduct.productType.should.be.an('object');
    addedProduct.productType.should.be.not.null;
    addedProduct.productType.id.should.be.not.null;
    addedProduct.productType.id.should.be.eql(maPomme.productType.id);

    let deleteProduct = await productService.deleteProduct(addedProduct);

    deleteProduct.should.be.not.null;

    deleteProduct = await productService.getProductById(deleteProduct);
    it.should.be.null = deleteProduct; // Fixme: Ca marche de faire ça ??
  });
});
