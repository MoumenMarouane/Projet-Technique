import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  findAll() { return this.ticketsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.ticketsService.findOne(id); }
}