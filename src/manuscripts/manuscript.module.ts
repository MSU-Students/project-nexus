import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManuscriptController } from './manuscript.controller';
import { ManuscriptService } from './manuscript.service';
import { Manuscript } from './manuscript.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manuscript])],
  controllers: [ManuscriptController],
  providers: [ManuscriptService],
  exports: [ManuscriptService],
})
export class ManuscriptModule {}
