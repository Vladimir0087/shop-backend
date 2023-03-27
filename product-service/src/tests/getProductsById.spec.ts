import { products } from "../mocks/data";
import { getProductsById } from "../functions/getProductsById/handler";

describe('getProductsById hanler', () => {
  it('should return one product', async () => {
    const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80a1';
    const data = await getProductsById({ pathParameters: { productId } });
    expect(data.body).toEqual(JSON.stringify(products.find((product) => product.id === productId), null, 2));
    expect(data.statusCode).toEqual(200);
  });

  it('if invalid ID should return error', async () => {
    const productId = 'Invalid ID';
    const data = await getProductsById({ pathParameters: { productId } });
    expect(data.body).toEqual(JSON.stringify({message: 'Product not found in the list of products'}, null, 2));
    expect(data.statusCode).toEqual(404);
  });
});
