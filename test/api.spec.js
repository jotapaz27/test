const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');
const config = require('../config')
let server;

test.beforeAll(async () => {
    server = spawn('node', ['index.js'], { stdio: 'inherit' });
    await new Promise(resolve => setTimeout(resolve, 2000));
});

test.afterAll(() => {
    server.kill();
});

const apiUrl = `http://localhost:${config.port}`;

test.describe('API de productos', () => {

    test('Obtener lista de productos (vacía al inicio)', async ({ request }) => {
        const response = await request.get(`${apiUrl}/products`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        console.log(body);
        expect(body.products.length).toBe(0); 
    
    });

    test('Agregar un nuevo producto', async ({ request }) => {
        const response = await request.post(`${apiUrl}/products`, {
            data: {
                nombre: 'Producto Test',
                precio: 100,
                cantidad: 10
            }
        });
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.nombre).toBe('Producto Test');
        expect(body.precio).toBe(100);
        expect(body.cantidad).toBe(10);
    });

    test('Obtener un producto por su ID', async ({ request }) => {
        const createResponse = await request.post(`${apiUrl}/products`, {
            data: {
                nombre: 'Producto Test 2',
                precio: 200,
                cantidad: 20
            }
        });
        const createdProduct = await createResponse.json();
        const productId = createdProduct.id;

        const response = await request.get(`${apiUrl}/products/${productId}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.nombre).toBe('Producto Test 2');
        expect(body.precio).toBe(200);
        expect(body.cantidad).toBe(20);
    });

    test('Actualizar un producto existente', async ({ request }) => {
        const createResponse = await request.post(`${apiUrl}/products`, {
            data: {
                nombre: 'Producto para Actualizar',
                precio: 150,
                cantidad: 15
            }
        });
        const createdProduct = await createResponse.json();
        const productId = createdProduct.id;

        const response = await request.put(`${apiUrl}/products/${productId}`, {
            data: {
                nombre: 'Producto Actualizado',
                precio: 180,
                cantidad: 18
            }
        });
        expect(response.status()).toBe(200);

        const responseUpdate = await request.get(`${apiUrl}/products/${productId}`);

        const bodyUpdated = await responseUpdate.json();

        expect(bodyUpdated.nombre).toEqual('Producto Actualizado');
        expect(bodyUpdated.precio).toEqual(180);
        expect(bodyUpdated.cantidad).toEqual(18);
    });

    test('Eliminar un producto', async ({ request }) => {
        const createResponse = await request.post(`${apiUrl}/products`, {
            data: {
                nombre: 'Producto para Eliminar',
                precio: 50,
                cantidad: 5
            }
        });
        const createdProduct = await createResponse.json();
        const productId = createdProduct.id;

        const response = await request.delete(`${apiUrl}/products/${productId}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.message).toBe('Producto eliminado correctamente');
    });

    test('Validar que un producto eliminado ya no está disponible', async ({ request }) => {
        const createResponse = await request.post(`${apiUrl}/products`, {
            data: {
                nombre: 'Producto para Validar Eliminación',
                precio: 75,
                cantidad: 7
            }
        });
        const createdProduct = await createResponse.json();
        const productId = createdProduct.id;

        await request.delete(`${apiUrl}/products/${productId}`);

        const response = await request.get(`${apiUrl}/products/${productId}`);
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.error).toBe('Producto no encontrado');
    });

    test('Validar que no se puede actualizar un producto inexistente', async ({ request }) => {
        const response = await request.put(`${apiUrl}/products/99999`, {
            data: {
                nombre: 'Producto Inexistente',
                precio: 500,
                cantidad: 5
            }
        });
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.error).toBe('Producto no encontrado');
    });

    test('Validar que no se puede eliminar un producto inexistente', async ({ request }) => {
        const response = await request.delete(`${apiUrl}/products/99999`);
        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.error).toBe('Producto no encontrado');
    });
});