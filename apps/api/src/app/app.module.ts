import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Model } from '@gradii/fedaco';



@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
