import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {MultiBoardModule} from "../src/app/multiboard/multiboard.module";

describe('MultiboardController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MultiBoardModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/1 (GET) gets board with id correctly', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).get('/multiboard/1');
    console.log(response.body);
    expect(response.body).toEqual({
      id: "1",
      board: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]
    })
  });

  it('/cell/1 (PUT) updates board with id correctly', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    await request(app.getHttpServer()).put('/multiboard/cell/1').send({row: 3, col: 3});
    const response = await request(app.getHttpServer()).get('/multiboard/1').send({row: 5, col: 5});
    expect(response.body).toEqual({
      id: '1',
      board: [
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 0 ],
        [ 0, 0, 0, 0, 0 ]
      ]
    })
  });

  it('/cells/1 (PUT) updates board with array of cells for selected board by id correctly', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    await request(app.getHttpServer()).put('/multiboard/cells/1').send({cells: [[3,3], [4,4]]});
    const response = await request(app.getHttpServer()).get('/multiboard/1');
    console.log(response.body);
    expect(response.body).toEqual({
      id: '1',
      board: [
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 0 ],
        [ 0, 0, 0, 0, 1 ]
      ]
    })
  });

  it('/cells/1 (PUT) should throw error if board with id not found', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).put('/multiboard/cells/2').send({cells: [[3,3], [4,4]]});
    expect(response.status).toBe(404);
  });

  it('/cell/1 (PUT) should throw error if board with id not found', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).put('/multiboard/cell/2').send({row: 3, col: 3});
    expect(response.status).toBe(404);
  });

  it('/cell/1 (PUT) should throw error if cell is out of board', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).put('/multiboard/cell/1').send({row: 6, col: 6});
    expect(response.status).toBe(400);
  });

  it('/cells/1 (PUT) should throw error if cell is out of board', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).put('/multiboard/cells/1').send({cells: [[6,6], [7,7]]});
    expect(response.status).toBe(400);
  });

  // TODO: this exception is not handled
  it('/cells/1 (PUT) should throw error if cell not pass validation', async () => {
    await request(app.getHttpServer()).put('/multiboard').send({row: 5, col: 5});
    const response = await request(app.getHttpServer()).put('/multiboard/cells/1').send({cells: [[3,3], ["3",4]]});
    expect(response.status).toBe(400);
  });

});
