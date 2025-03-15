import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, parse } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const { name, ext } = parse(file.originalname);
          const filename = `${encodeURIComponent(name)}_${Date.now()}${ext}`; // 파일 이름 인코딩
          callback(null, filename);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB 제한
          //   new FileTypeValidator({ fileType: '.(png|jpg|jpeg|gif|csv)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return { message: 'File uploaded successfully!', filename: decodeURIComponent(file.filename) };
  }
}
