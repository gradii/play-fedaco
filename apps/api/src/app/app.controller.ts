import { Controller, Get } from '@nestjs/common';

import { Message } from '@play-fedaco/api-interfaces';

import { AppService } from './app.service';

import { DatabaseConfig, Model, SchemaBuilder } from '@gradii/fedaco';
import { User } from './model/user.model';

function connection(connectionName = 'default') {
  return Model.getConnectionResolver().connection(connectionName);
}

function schema(connectionName = 'default'): SchemaBuilder {
  return connection(connectionName).getSchemaBuilder();
}

async function createSchema() {
  await schema().create('users', table => {
    table.increments('id');
    table.string('email').withUnique();
  });
  await schema().create('articles', table => {
    table.increments('aid');
    table.string('title');
  });
  await schema().create('article_user', table => {
    table.integer('article_id').withUnsigned();
    table.foreign('article_id').withReferences('aid').withOn('articles');
    table.integer('user_id').withUnsigned();
    table.foreign('user_id').withReferences('id').withOn('users');
  });
}

const db = new DatabaseConfig();
db.addConnection({
  'driver': 'sqlite',
  'database': 'tmp/test-app.sqlite'
});
db.bootFedaco();
db.setAsGlobal();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('init-table')
  async initTable(): Promise<Message> {
    await createSchema();

    return this.appService.getData();
  }

  @Get('generate-data')
  async generateData() {
    const user = await User.createQuery().create({
      'email': 'linbolen@gradii.com'
    });

    return user.toArray();
  }

  @Get('list-all')
  async listAll() {
    const list = await User.createQuery().get();

    return list.map(it => it.toArray());
  }
}
