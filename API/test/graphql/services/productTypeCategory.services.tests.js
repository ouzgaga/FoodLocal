const productTypeCategoryServices = require('../../../src/graphql/services/productTypeCategories.services');
const clearDB = require('../clearDB');
const ProductTypeCategoriesModel = require('../../../src/graphql/models/productTypeCategories.modelgql');

let fruits = {
  name: 'Fruits',
  image: 'ceci est une image de fruits encodée en base64!'
};
let legumes = {
  name: 'Légumes',
  image: 'ceci est une image de légumes encodée en base64!'
};
let viande = {
  name: 'Viande',
  image: 'ceci est une image de viande encodée en base64!'
};
let pain = {
  name: 'Pain',
  image: 'ceci est une image de pain encodée en base64!'
};
let tabProductTypeCategory = [];

const clearAndPopulateDB = async() => {
  // ---------------------------------------- on supprime tout le contenu de la DB ----------------------------------------
  await clearDB();


  // on ajoute le contenu de départ
  fruits = (await ProductTypeCategoriesModel.create(fruits)).toObject();
  legumes = (await ProductTypeCategoriesModel.create(legumes)).toObject();
  viande = (await ProductTypeCategoriesModel.create(viande)).toObject();
  pain = (await ProductTypeCategoriesModel.create(pain)).toObject();

  tabProductTypeCategory = [fruits, legumes, viande, pain];
};

describe('tests productTypeCategory services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProductTypeCategories', () => {
    it('should get all productTypeCategory', async() => {
      // on récupère un tableau contenant tous les productTypeCategory
      let allProductTypeCategory = await productTypeCategoryServices.getProductTypeCategories();

      // on transforme chaque producteur du tableau en un objet
      allProductTypeCategory = allProductTypeCategory.map(productTypeCategory => productTypeCategory.toObject());
      allProductTypeCategory.should.be.an('array');
      allProductTypeCategory.length.should.be.equal(4);

      // pour chaque productTypeCategory, on test les éléments critiques
      const promisesProductTypeCategory = allProductTypeCategory.map((productTypeCategory, index) => {
        productTypeCategory.should.be.not.null;
        productTypeCategory.id.should.be.eql(tabProductTypeCategory[index].id);
        productTypeCategory.name.should.be.equal(tabProductTypeCategory[index].name);
        productTypeCategory.image.should.be.equal(tabProductTypeCategory[index].image);
      });
      await Promise.all(promisesProductTypeCategory);
    });
  });

  describe('tests getProductTypeCategoryById', () => {
    it('should get one productTypeCategory', async() => {
      // on récupère le productTypeCategory corresondant à l'id donné
      let productTypeCategoryGotInDB = (await productTypeCategoryServices.getProductTypeCategoryById(fruits.id)).toObject();

      // on test son contenu
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB.id.should.be.eql(fruits.id);
      productTypeCategoryGotInDB.name.should.be.equal(fruits.name);
      productTypeCategoryGotInDB.image.should.be.equal(fruits.image);

      // on récupère le productTypeCategory corresondant à l'id donné
      productTypeCategoryGotInDB = (await productTypeCategoryServices.getProductTypeCategoryById(viande.id)).toObject();

      // on test son contenu
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB.id.should.be.eql(viande.id);
      productTypeCategoryGotInDB.name.should.be.equal(viande.name);
      productTypeCategoryGotInDB.image.should.be.equal(viande.image);
    });

    it('should fail getting one productTypeCategory because no id received', async() => {
      try {
        await productTypeCategoryServices.getProductTypeCategoryById('');
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should fail getting one productTypeCategory because invalid id received', async() => {
      try {
        await productTypeCategoryServices.getProductTypeCategoryById(fruits.id + fruits.id);
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should fail getting one productTypeCategory because unknown id received', async() => {
      const productTypeCategoryGotInDB = await productTypeCategoryServices.getProductTypeCategoryById('abcdefabcdefabcdefabcdef');
      expect(productTypeCategoryGotInDB).to.be.null;
    });
  });

  describe('tests addProductTypeCategory', () => {
    it('should add a new productTypeCategory', async() => {
      // on ajoute un nouveau productTypeCategory
      fruits._id = undefined;
      const addedProductTypeCategory = await productTypeCategoryServices.addProductTypeCategory(fruits);

      // on test son contenu
      addedProductTypeCategory.should.be.not.null;
      addedProductTypeCategory.id.should.be.not.null;
      addedProductTypeCategory.name.should.be.equal(fruits.name);
      addedProductTypeCategory.image.should.be.equal(fruits.image);
    });
  });

  describe('tests updateProductTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a productTypeCategory', async() => {
      let productTypeCategory = (await productTypeCategoryServices.getProductTypeCategoryById(fruits.id)).toObject();
      productTypeCategory = {
        id: productTypeCategory.id,
        name: legumes.name,
        image: legumes.image
      };
      // on met à jour dans la DB
      const updatedProductTypeCategory = (await productTypeCategoryServices.updateProductTypeCategory(productTypeCategory)).toObject();

      updatedProductTypeCategory.should.be.an('object');
      updatedProductTypeCategory.should.be.not.null;
      updatedProductTypeCategory.id.should.be.eql(productTypeCategory.id);
      updatedProductTypeCategory.name.should.be.equal(legumes.name);
      updatedProductTypeCategory.image.should.be.equal(legumes.image);
    });

    it('should fail updating a productTypeCategory because no id received', async() => {
      try {
        fruits.id = '';
        await productTypeCategoryServices.updateProductTypeCategory(fruits);
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should fail updating a productTypeCategory because invalid id received (too short)', async() => {
      try {
      fruits.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
        await productTypeCategoryServices.updateProductTypeCategory(fruits);
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should fail updating a productTypeCategory because invalid id received (too long)', async() => {
      try {
      fruits.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)
        await productTypeCategoryServices.updateProductTypeCategory(fruits);
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should return null updating a productTypeCategory because unknown id received', async() => {
      fruits.id = 'abcdefabcdefabcdefabcdef';
      const updatedProducer = await productTypeCategoryServices.updateProductTypeCategory(fruits);
      expect(updatedProducer).to.be.null;
    });
  });

  describe('tests deleteProductTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a productTypeCategory', async() => {
      // on supprime un productTypeCategory
      const deleteProductTypeCategory = await productTypeCategoryServices.deleteProductTypeCategory(fruits.id);
      deleteProductTypeCategory.should.be.not.null;
      deleteProductTypeCategory.id.should.be.equal(fruits.id);

      try {
        // on tente de re-supprimer le même productTypeCategory -> retourne null car le productTypeCategory est introuvable dans la DB
        await productTypeCategoryServices.getProductTypeCategoryById(deleteProductTypeCategory.id);
      } catch (err) {
        err.message.should.be.equal('Received productTypeCategory.id is invalid!');
      }
    });

    it('should fail deleting a productTypeCategory because given id not found in DB', async() => {
      // on supprime un productTypeCategory inexistant -> retourne null car le productTypeCategory est introuvable dans la DB
      const deleteProductType = await productTypeCategoryServices.deleteProductTypeCategory('abcdefabcdefabcdefabcdef');
      expect(deleteProductType).to.be.null;
    });
  });
});
