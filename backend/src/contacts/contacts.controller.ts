import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}
  @Post() create(@Body() dto: CreateContactDto) { return this.contactsService.create(dto); }
  @Get() findAll() { return this.contactsService.findAll(); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateContactDto>) { return this.contactsService.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.contactsService.remove(id); }
}
