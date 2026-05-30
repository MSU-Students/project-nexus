import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MilestoneService } from './milestone.service';
import { CreateProjectMilestoneDto } from 'src/dto/create-project-milestone.dto';
import { RejectMilestoneDto } from 'src/dto/reject-milestone.dto';

@ApiBearerAuth()
@ApiTags('milestones')
@Controller()
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  // PATCH /milestones/:id/approve
  @Patch('milestones/:id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.milestoneService.approve(id);
  }

  // PATCH /milestones/:id/reject
  @Patch('milestones/:id/reject')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectMilestoneDto,
  ) {
    return this.milestoneService.reject(id, dto);
  }

  // POST /milestones/:id/upload
  @Post('milestones/:id/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const uploadedBy: number | undefined = req.user?.sub ?? req.user?.id;
    return this.milestoneService.uploadFile(id, file, uploadedBy);
  }
}
