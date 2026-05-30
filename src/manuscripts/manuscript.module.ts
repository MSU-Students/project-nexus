import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manuscript } from 'src/entities/manuscript.entity';
import { ManuscriptController } from './manuscript.controller';
import { ManuscriptService } from './manuscript.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manuscript])],
  controllers: [ManuscriptController],
  providers: [ManuscriptService],
  exports: [ManuscriptService],
})
export class ManuscriptModule {}
