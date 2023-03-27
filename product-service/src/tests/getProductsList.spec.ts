import { products } from "../mocks/data";
import { getProductsList } from "../functions/getProductsList/handler";

describe('getProductsList hanler', () => {
  it('should return products list', async () => {
    const data = await getProductsList();
    expect(data.body).toEqual(JSON.stringify(products, null, 2));
  });

  it('should return statusCode: 200', async () => {
    const data = await getProductsList();
    expect(data.statusCode).toEqual(200);
  });
});