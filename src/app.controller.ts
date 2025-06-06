import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('health')
  healthCheck() {
    return { status: '✅ Server is running!' };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
