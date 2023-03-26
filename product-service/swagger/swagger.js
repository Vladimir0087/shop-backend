// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "product-service",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "getProductsList",
        "description": "",
        "operationId": "getProductsList.get.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "succescful API response",
            "schema": {
              "$ref": "#/definitions/Products"
            }
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "getProductsById",
        "description": "",
        "operationId": "getProductsById.get.products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "succescful API response",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Product": {
      "properties": {
        "description": {
          "title": "Product.description",
          "type": "string"
        },
        "id": {
          "title": "Product.id",
          "type": "string"
        },
        "price": {
          "title": "Product.price",
          "type": "number"
        },
        "title": {
          "title": "Product.title",
          "type": "string"
        }
      },
      "required": [
        "description",
        "id",
        "price",
        "title"
      ],
      "additionalProperties": false,
      "title": "Product",
      "type": "object"
    },
    "Products": {
      "items": {
        "$ref": "#/definitions/Product",
        "title": "Products.[]"
      },
      "title": "Products.[]",
      "type": "array"
    }
  },
  "securityDefinitions": {},
  "basePath": "/dev",
  "host": "g3zqd6y4k0.execute-api.us-east-1.amazonaws.com"
};