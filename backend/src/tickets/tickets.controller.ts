import { Controller, Get, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}
  @Get(':id') findOne(@Param('id') id: string) { return this.ticketsService.findOne(id); }
}
