import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VendeursModule } from './vendeurs/vendeurs.module';
import { ClientsModule } from './clients/clients.module';
import { AdressesModule } from './adresses/adresses.module';
import { ContactsModule } from './contacts/contacts.module';
import { EntreprisesModule } from './entreprises/entreprises.module';
import { CategoriesModule } from './categories/categories.module';
import { ProduitsModule } from './produits/produits.module';
import { DevisModule } from './devis/devis.module';
import { CommandesModule } from './commandes/commandes.module';
import { FacturesModule } from './factures/factures.module';
import { TicketsModule } from './tickets/tickets.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // ← charge le .env pour toute l'app
    PrismaModule,
    AuthModule,
    UsersModule,
    VendeursModule,
    ClientsModule,
    AdressesModule,
    ContactsModule,
    EntreprisesModule,
    CategoriesModule,
    ProduitsModule,
    DevisModule,
    CommandesModule,
    FacturesModule,
    TicketsModule,
    DashboardModule,
  ],
})
export class AppModule {}