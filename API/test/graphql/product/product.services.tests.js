require('../../chai-config');

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


describe('tests product services', () => {
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
      category: productTypeCategory.id,
      producers: []
    };
    const addedProductTypePomme = await ProductTypeModel.create(productTypePomme);
    productTypePomme = {
      id: addedProductTypePomme.id,
      name: addedProductTypePomme.name,
      image: productTypePomme.image,
      category: productTypeCategory.id,
      producers: addedProductTypePomme.producers
    };

    productTypePoire = {
      name: productTypePoire.name,
      image: productTypePoire.image,
      category: productTypeCategory.id,
      producers: []
    };
    const addedProductTypePoire = await ProductTypeModel.create(productTypePoire);
    productTypePoire = {
      id: addedProductTypePoire.id,
      name: addedProductTypePoire.name,
      image: productTypePomme.image,
      category: { id: productTypeCategory.id },
      producers: addedProductTypePoire.producers
    };
    // on ajoute 2 produits
    maPomme = {
      description: 'Viendez acheter ma belle pomme!',
      productType: productTypePomme.id
    };
    const addedPomme = await ProductModel.create(maPomme);
    maPomme = {
      id: addedPomme.id,
      description: addedPomme.description,
      productType: { id: addedPomme.productType.id }
    };

    maPoire = {
      description: 'Viendez acheter ma belle poire!',
      productType: productTypePoire.id
    };
    const addedPoire = await ProductModel.create(maPoire);
    maPoire = {
      id: addedPoire.id,
      description: addedPoire.description,
      productType: { id: addedPoire.productType.id }
    };
  });

  it('should get all product', async() => {
    const allProducts = await productService.getProducts();

    allProducts.should.be.an('array');
    allProducts.length.should.be.equal(2);

    allProducts.map((product) => {
      product.should.be.not.null;
      product.id.should.be.not.null;
      product.description.should.be.not.null;
      product.productType.should.be.not.null;
      product.productType.should.be.an('object');
      product.productType.id.should.be.not.null;
    });
  });

  describe('tests getProductById', () => {
    it('should get one product', async() => {
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

    it('should fail getting one product because no id received', async() => {
      const productTypeGotInDB = await productService.getProductById({ id: '' });
      productTypeGotInDB.message.should.be.equal('Received product.id is invalid!');
    });
  });

  it('should add a new product', async() => {
    const addedProduct = await productService.addProduct(maPomme);

    addedProduct.should.be.an('object');
    addedProduct.should.be.not.null;
    addedProduct.id.should.be.not.null;
    addedProduct.description.should.be.not.null;
    addedProduct.description.should.be.equal(maPomme.description);
    addedProduct.productType.should.be.an('object');
    addedProduct.productType.should.be.not.null;
    addedProduct.productType.id.should.be.not.null;
    addedProduct.productType.id.should.be.equal(maPomme.productType.id);
  });

  describe('tests updateProduct', () => {
    it('should update a product', async() => {
      let addedProduct = await productService.addProduct(maPomme);
      addedProduct = {
        id: addedProduct.id,
        description: maPoire.description,
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

    it('should fail updating a product because no id received', async() => {
      const addedProduct = {
        ...maPomme,
        id: ''
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      const addedProduct = {
        ...maPomme,
        id: '5c04561e7209e21e582750' // id trop court (<24 caractères)
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });

    it('should fail updating a product because invalid id received', async() => {
      const addedProduct = {
        ...maPomme,
        id: '5c04561e7209e21e582750a35c04561e7209e21e582750a35c04561e7209e21e582750a3' // id trop long (> 24 caractères)
      };
      const updatedProduct = await productService.updateProduct(addedProduct);

      updatedProduct.message.should.be.equal('Received product.id is invalid!');
    });
  });

  it('should delete a product', async() => {
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
