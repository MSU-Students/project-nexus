import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/decorators';
import { RejectMilestoneDto } from 'src/dto/reject-milestone.dto';
import { Role } from 'src/enums';
import { MilestoneService } from './milestone.service';

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
    // GET /milestones/audit
    // APEX - MM - 005 — Milestone Monitoring Audit
    @Get('milestones/audit')
    @Roles(Role.COORDINATOR, Role.FACULTY) // Only reviewers and managers should audit tracking
    getMilestoneAudit(
        @Query('projectId') projectId?: number,
        @Query('status') status?: string,
    ) {
        // Safe parsing if string is passed via query params
        const parsedProjectId = projectId ? Number(projectId) : undefined;
        return this.milestoneService.getMilestoneAuditTrail(parsedProjectId, status);
    }
}
