const request = require('supertest');
const app = require('../index');
const assert = require('assert');

describe('API de productos', () => {

    it('Obtener lista de productos (vacía al inicio)', (done) => {
        request(app)
            .get('/products')
            .expect(200)
            .then((res) => {
                console.log(res?.body);
                assert(res?.body?.products?.length === 0, 'El array debe estar vacío');
                done();
            })
            .catch(err => done(err));
    });

    it('Agregar un nuevo producto', (done) => {
        request(app)
            .post('/products')
            .send({ nombre: 'Producto Test', precio: 100, cantidad: 10 })
            .expect(201)
            .then((res) => {
                assert(res?.body?.nombre === 'Producto Test', 'El nombre debe ser "Producto Test"');
                assert(res?.body?.precio === 100, 'El precio debe ser 100');
                assert(res?.body?.cantidad === 10, 'La cantidad debe ser 10');
                done();
            })
            .catch(err => done(err));
    });

    it('Obtener un producto por su ID', (done) => {
        request(app)
            .post('/products')
            .send({ nombre: 'Producto Test 2', precio: 200, cantidad: 20 })
            .then((postRes) => {
                const productId = postRes.body.id;
                request(app)
                    .get(`/products/${productId}`)
                    .expect(200)
                    .then((res) => {
                        assert(res?.body?.nombre === 'Producto Test 2', 'El nombre debe ser "Producto Test 2"');
                        assert(res?.body?.precio === 200, 'El precio debe ser 200');
                        assert(res?.body?.cantidad === 20, 'La cantidad debe ser 20');
                        done();
                    });
            })
            .catch(err => done(err));
    });

    it('Actualizar un producto existente', (done) => {
        request(app)
            .post('/products')
            .send({ nombre: 'Producto para Actualizar', precio: 150, cantidad: 15 })
            .then((postRes) => {
                const productId = postRes.body.id;
                request(app)
                    .put(`/products/${productId}`)
                    .send({ nombre: 'Producto Actualizado', precio: 180, cantidad: 18 })
                    .expect(200)
                    .then((res) => {
                        assert(res?.body?.nombre === 'Producto Actualizado', 'El nombre debe ser "Producto Actualizado"');
                        assert(res?.body?.precio === 180, 'El precio debe ser 180');
                        assert(res?.body?.cantidad === 18, 'La cantidad debe ser 18');
                        done();
                    });
            })
            .catch(err => done(err));
    });

    it('Eliminar un producto', (done) => {
        request(app)
            .post('/products')
            .send({ nombre: 'Producto para Eliminar', precio: 50, cantidad: 5 })
            .then((postRes) => {
                const productId = postRes.body.id;
                request(app)
                    .delete(`/products/${productId}`)
                    .expect(200)
                    .then((res) => {
                        assert(res.body.message === 'Producto eliminado correctamente', 'El mensaje debe indicar que el producto fue eliminado');
                        done();
                    });
            })
            .catch(err => done(err));
    });

    it('Validar que un producto eliminado ya no está disponible', (done) => {
        request(app)
            .post('/products')
            .send({ nombre: 'Producto para Validar Eliminación', precio: 75, cantidad: 7 })
            .then((postRes) => {
                const productId = postRes.body.id;
                request(app)
                    .delete(`/products/${productId}`)
                    .expect(200)
                    .then(() => {
                        request(app)
                            .get(`/products/${productId}`)
                            .expect(404)
                            .then((res) => {
                                assert(res.body.error === 'Producto no encontrado', 'Debe devolver error de no encontrado');
                                done();
                            });
                    });
            })
            .catch(err => done(err));
    });

    it('Validar que no se puede actualizar un producto inexistente', (done) => {
        request(app)
            .put('/products/99999') // ID que no existe
            .send({ nombre: 'Producto Inexistente', precio: 500, cantidad: 5 })
            .expect(404)
            .then((res) => {
                assert(res.body.error === 'Producto no encontrado', 'Debe devolver error de no encontrado');
                done();
            })
            .catch(err => done(err));
    });

    it('Validar que no se puede eliminar un producto inexistente', (done) => {
        request(app)
            .delete('/products/99999') 
            .expect(404)
            .then((res) => {
                assert(res.body.error === 'Producto no encontrado', 'Debe devolver error de no encontrado');
                done();
            })
            .catch(err => done(err));
    });
});