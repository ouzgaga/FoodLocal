const productTypeCategoryService = require('../../../src/graphql/services/productTypeCategory.services');
const ProducersModel = require('../../../src/graphql/models/producers.modelgql');
const PersonModel = require('../../../src/graphql/models/persons.modelgql');
const UserModel = require('../../../src/graphql/models/users.modelgql');
const SalespointsModel = require('../../../src/graphql/models/salespoints.modelgql');
const TokensValidationEmailModel = require('../../../src/graphql/models/tokensValidationEmail.modelgql');
const { Products: ProductModel, ProductType: ProductTypeModel, ProductTypeCategory: ProductTypeCategoryModel } = require(
  '../../../src/graphql/models/products.modelgql'
);

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
  await ProducersModel.deleteMany();
  await ProductModel.deleteMany();
  await ProductTypeModel.deleteMany();
  await ProductTypeCategoryModel.deleteMany();
  await PersonModel.deleteMany();
  await UserModel.deleteMany();
  await SalespointsModel.deleteMany();
  await TokensValidationEmailModel.deleteMany();


  // on ajoute le contenu de départ
  fruits = (await ProductTypeCategoryModel.create(fruits)).toObject();
  legumes = (await ProductTypeCategoryModel.create(legumes)).toObject();
  viande = (await ProductTypeCategoryModel.create(viande)).toObject();
  pain = (await ProductTypeCategoryModel.create(pain)).toObject();

  tabProductTypeCategory = [fruits, legumes, viande, pain];
};

describe('tests productTypeCategory services', () => {
  beforeEach(() => clearAndPopulateDB());

  describe('tests getProductTypeCategories', () => {
    it('should get all productTypeCategory', async() => {
      // on récupère un tableau contenant tous les productTypeCategory
      let allProductTypeCategory = await productTypeCategoryService.getProductTypeCategories();

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
    beforeEach(() => clearAndPopulateDB());

    it('should get one productTypeCategory', async() => {
      // on récupère le productTypeCategory corresondant à l'id donné
      let productTypeCategoryGotInDB = (await productTypeCategoryService.getProductTypeCategoryById(fruits.id)).toObject();

      // on test son contenu
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB.id.should.be.eql(fruits.id);
      productTypeCategoryGotInDB.name.should.be.equal(fruits.name);
      productTypeCategoryGotInDB.image.should.be.equal(fruits.image);

      // on récupère le productTypeCategory corresondant à l'id donné
      productTypeCategoryGotInDB = (await productTypeCategoryService.getProductTypeCategoryById(viande.id)).toObject();

      // on test son contenu
      productTypeCategoryGotInDB.should.be.not.null;
      productTypeCategoryGotInDB.id.should.be.eql(viande.id);
      productTypeCategoryGotInDB.name.should.be.equal(viande.name);
      productTypeCategoryGotInDB.image.should.be.equal(viande.image);
    });

    it('should fail getting one productTypeCategory because no id received', async() => {
      const productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById('');
      productTypeCategoryGotInDB.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail getting one productTypeCategory because invalid id received', async() => {
      const productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById(fruits.id + fruits.id);
      productTypeCategoryGotInDB.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail getting one productTypeCategory because unknown id received', async() => {
      const productTypeCategoryGotInDB = await productTypeCategoryService.getProductTypeCategoryById('abcdefabcdefabcdefabcdef');
      expect(productTypeCategoryGotInDB).to.be.null;
    });
  });

  describe('tests addProductTypeCategory', () => {
    it('should add a new productTypeCategory', async() => {
      // on ajoute un nouveau productTypeCategory
      fruits._id = undefined;
      const addedProductTypeCategory = await productTypeCategoryService.addProductTypeCategory(fruits);

      // on test son contenu
      addedProductTypeCategory.should.be.not.null;
      addedProductTypeCategory.id.should.be.not.null;
      addedProductTypeCategory.name.should.be.equal(fruits.name);
      addedProductTypeCategory.image.should.be.equal(fruits.image);
    });

    // TODO: ajouter des tests d'échec d'ajout lorsqu'il manque des données obligatoires
  });

  describe('tests updateProductTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should update a productTypeCategory', async() => {
      let productTypeCategory = (await productTypeCategoryService.getProductTypeCategoryById(fruits.id)).toObject();
      productTypeCategory = {
        id: productTypeCategory.id,
        name: legumes.name,
        image: legumes.image
      };
      // on met à jour dans la DB
      const updatedProductTypeCategory = (await productTypeCategoryService.updateProductTypeCategory(productTypeCategory)).toObject();

      updatedProductTypeCategory.should.be.an('object');
      updatedProductTypeCategory.should.be.not.null;
      updatedProductTypeCategory.id.should.be.eql(productTypeCategory.id);
      updatedProductTypeCategory.name.should.be.equal(legumes.name);
      updatedProductTypeCategory.image.should.be.equal(legumes.image);
    });

    it('should fail updating a productTypeCategory because no id received', async() => {
      fruits.id = '';
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(fruits);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail updating a productTypeCategory because invalid id received', async() => {
      fruits.id = '5c04561e7209e21e582750'; // id trop court (<24 caractères)
      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(fruits);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should fail updating a productTypeCategory because invalid id received', async() => {
      fruits.id = '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3'; // id trop long (> 24 caractères)

      const updatedProductTypeCategory = await productTypeCategoryService.updateProductTypeCategory(fruits);

      updatedProductTypeCategory.message.should.be.equal('Received productTypeCategory.id is invalid!');
    });

    it('should return null updating a productTypeCategory because unknown id received', async() => {
      fruits.id = 'abcdefabcdefabcdefabcdef';
      const updatedProducer = await productTypeCategoryService.updateProductTypeCategory(fruits);
      expect(updatedProducer).to.be.null;
    });
  });

  describe('tests deleteProductTypeCategory', () => {
    beforeEach(() => clearAndPopulateDB());

    it('should delete a productTypeCategory', async() => {
      // on supprime un productTypeCategory
      let deleteProductTypeCategory = await productTypeCategoryService.deleteProductTypeCategory(fruits.id);
      deleteProductTypeCategory.should.be.not.null;
      deleteProductTypeCategory.id.should.be.equal(fruits.id);

      // on tente de re-supprimer le même productTypeCategory -> retourne null car le productTypeCategory est introuvable dans la DB
      deleteProductTypeCategory = await productTypeCategoryService.getProductTypeCategoryById(deleteProductTypeCategory);
      expect(deleteProductTypeCategory).to.be.null;
    });

    it('should fail deleting a productTypeCategory because given id not found in DB', async() => {
      // on supprime un productTypeCategory inexistant -> retourne null car le productTypeCategory est introuvable dans la DB
      const deleteProductType = await productTypeCategoryService.deleteProductTypeCategory('abcdefabcdefabcdefabcdef');
      expect(deleteProductType).to.be.null;
    });
  });
});
