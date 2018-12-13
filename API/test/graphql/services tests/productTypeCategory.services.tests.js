require('../../chai-config');

const productTypeCategoryService = require('../../../src/graphql/services/productTypeCategory.services');
const { ProductTypeCategory: ProductTypeCategoryModel } = require('../../../src/graphql/models/products.modelgql');

const fruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};
const legumes = {
  name: 'Légumes',
  image: 'ceci est une image de légumes encodée en base64!'
};
const viande = {
  name: 'Viande',
  image: 'ceci est une image de viande encodée en base64!'
};
const pain = {
  name: 'Pain',
  image: 'ceci est une image de pain encodée en base64!'
};
let ids;

describe('tests productTypeCategory services', () => {
  beforeEach(async() => {
    // on supprime tout le contenu de la DB
    await ProductTypeCategoryModel.deleteMany();
    // on ajoute le contenu de départ
    const res = await Promise.all([fruits, legumes, viande, pain].map(p => ProductTypeCategoryModel.create(p)));
    ids = res.map(p => p.id);
  });

  it('should get all productTypeCategory', async() => {
    const allProductTypeCategory = await productTypeCategoryService.getProductsCategories();

    allProductTypeCategory.should.be.an('array');
    allProductTypeCategory.length.should.be.equal(4);

    allProductTypeCategory.map((productTypeCategory) => {
      productTypeCategory.should.be.not.null;
      productTypeCategory.id.should.be.not.null;
      productTypeCategory.name.should.be.not.null;
      productTypeCategory.image.should.be.not.null;
    });
  });

  describe('tests getProductTypeCategoryById', () => {
    it('should get one productTypeCategory', async() => {
      let productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById(ids[0]);

      productTypeCategoryGotInDB.should.be.an('object');
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB._id.should.be.not.null;

      productTypeCategoryGotInDB.name.should.be.equal(fruits.name);
      productTypeCategoryGotInDB.image.should.be.equal(fruits.image);

      productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById(ids[2]);
      productTypeCategoryGotInDB.should.be.an('object');
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB._id.should.be.not.null;

      productTypeCategoryGotInDB.name.should.be.equal(viande.name);
      productTypeCategoryGotInDB.image.should.be.equal(viande.image);
    });

    it('should fail getting one productTypeCategory because no id received', async() => {
      const productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById('');
      productTypeCategoryGotInDB.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });
  });

  it('should add a new productTypeCategory', async() => {
    const addedProductTypeCategory = await productTypeCategoryService.addProductTypeCategory(fruits);

    addedProductTypeCategory.should.be.an('object');
    addedProductTypeCategory.should.be.not.null;
    addedProductTypeCategory._id.should.be.not.null;

    addedProductTypeCategory.name.should.be.equal(fruits.name);
    addedProductTypeCategory.image.should.be.equal(fruits.image);
  });

  describe('tests updateProductTypeCategory', () => {
    it('should update a productTypeCategory', async() => {
      let addedProductTypeCategory = await productTypeCategoryService.addProductTypeCategory(fruits);
      addedProductTypeCategory = {
        id: addedProductTypeCategory.id,
        ...legumes
      };
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(addedProductTypeCategory);

      updatedProductTypeCategory.should.be.an('object');
      updatedProductTypeCategory.should.be.not.null;
      updatedProductTypeCategory.id.should.be.not.null;
      updatedProductTypeCategory.name.should.be.equal(legumes.name);
      updatedProductTypeCategory.image.should.be.equal(legumes.image);
    });

    it('should fail updating a productTypeCategory because no id received', async() => {
      const addedProductTypeCategory = {
        id: '',
        ...legumes
      };
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(addedProductTypeCategory);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail updating a productTypeCategory because invalid id received', async() => {
      const addedProductTypeCategory = {
        id: '5c04561e7209e21e582750', // id trop court (<24 caractères)
        ...legumes
      };
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(addedProductTypeCategory);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail updating a productTypeCategory because invalid id received', async() => {
      const addedProductTypeCategory = {
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3', // id trop long (> 24 caractères)
        ...legumes
      };
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(addedProductTypeCategory);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });
  });

  it('should delete a productTypeCategory', async() => {
    const addedProductTypeCategory = await productTypeCategoryService.addProductTypeCategory(fruits);

    addedProductTypeCategory.should.be.an('object');
    addedProductTypeCategory.should.be.not.null;
    addedProductTypeCategory._id.should.be.not.null;

    addedProductTypeCategory.name.should.be.equal(fruits.name);
    addedProductTypeCategory.image.should.be.equal(fruits.image);

    let deleteProductTypeCategory = await productTypeCategoryService.deleteProductTypeCategory(addedProductTypeCategory);

    deleteProductTypeCategory.should.be.not.null;

    deleteProductTypeCategory = await productTypeCategoryService.getProductTypeCategoryById(deleteProductTypeCategory);
    expect(deleteProductTypeCategory).to.be.null;
  });
});
