import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}
  @Post('anonymous') createAnonymous(@Body() dto: CreateClientDto) { return this.clientsService.create(null, dto); }
  @UseGuards(JwtAuthGuard) @Post() create(@CurrentUser() user: any, @Body() dto: CreateClientDto) { return this.clientsService.create(user.id, dto); }
  @UseGuards(JwtAuthGuard) @Get('me') findMe(@CurrentUser() user: any) { return this.clientsService.findByUserId(user.id); }
}
