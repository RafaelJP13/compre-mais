import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(private readonly prisma: PrismaService) { }

    async run() {
        this.logger.log('🌱 Starting database seed...');

        await this.seedCompanies();
        await this.seedUsers();

        this.logger.log('✅ Database seeding completed');
    }

    private async seedCompanies() {
        const companiesCount = await this.prisma.company.count();

        if (companiesCount > 0) {
            this.logger.log('🏢 Companies already seeded, skipping...');
            return;
        }

        const hashedPassword = await bcrypt.hash('123456', 10);

        await this.prisma.company.createMany({
            data: [
                {
                    adminName: "Nike Admin",
                    adminEmail: "admin@nike.com",
                    representante: "Carlos Silva",
                    fantasyName: "Nike",
                    legalName: "Nike Inc",
                    cnpj: "12345678000190",
                    cnpj_status: "VALID",
                    phone: "11999990001",
                    cep: "01310-100",
                    state: "SP",
                    city: "São Paulo",
                    address: "Av. Paulista, 1000 - São Paulo/SP - 01310-100",
                    password: hashedPassword,
                },
                {
                    adminName: "Coca-Cola Admin",
                    adminEmail: "admin@coca.com",
                    representante: "Maria Souza",
                    fantasyName: "Coca-Cola",
                    legalName: "Coca-Cola Company",
                    cnpj: "98765432000110",
                    cnpj_status: "VALID",
                    phone: "21999990002",
                    cep: "20000-000",
                    state: "RJ",
                    city: "Rio de Janeiro",
                    address: "Av. Presidente Vargas, 500 - Rio de Janeiro/RJ - 20000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "João Pedro",
                    adminEmail: "joao@smartgondola.com",
                    representante: "Ricardo Souza",
                    fantasyName: "Smart Gondola",
                    legalName: "Smart Gondola Sistemas LTDA",
                    cnpj: "10000000000003",
                    cnpj_status: "VALID",
                    phone: "21999990003",
                    cep: "20000-000",
                    state: "RJ",
                    city: "Rio de Janeiro",
                    address: "Rua Central, 120 - Rio de Janeiro/RJ - 20000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Ana Clara",
                    adminEmail: "ana@vendaspro.com",
                    representante: "Luciano Ferreira",
                    fantasyName: "VendasPro",
                    legalName: "VendasPro Comercial LTDA",
                    cnpj: "10000000000004",
                    cnpj_status: "VALID",
                    phone: "31999990004",
                    cep: "30100-000",
                    state: "MG",
                    city: "Belo Horizonte",
                    address: "Av. Afonso Pena, 800 - Belo Horizonte/MG - 30100-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Lucas Martins",
                    adminEmail: "lucas@shelftrack.com",
                    representante: "Eduardo Ramos",
                    fantasyName: "ShelfTrack",
                    legalName: "ShelfTrack Tecnologia LTDA",
                    cnpj: "10000000000005",
                    cnpj_status: "INVALID",
                    phone: "41999990005",
                    cep: "80000-000",
                    state: "PR",
                    city: "Curitiba",
                    address: "Rua XV de Novembro, 300 - Curitiba/PR - 80000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Felipe Gomes",
                    adminEmail: "felipe@mercadodata.com",
                    representante: "Patricia Alves",
                    fantasyName: "MercadoData",
                    legalName: "MercadoData Analytics LTDA",
                    cnpj: "10000000000006",
                    cnpj_status: "INVALID",
                    phone: "51999990006",
                    cep: "90000-000",
                    state: "RS",
                    city: "Porto Alegre",
                    address: "Av. Borges de Medeiros, 700 - Porto Alegre/RS - 90000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Juliana Rocha",
                    adminEmail: "juliana@retailhub.com",
                    representante: "Marcelo Dias",
                    fantasyName: "RetailHub",
                    legalName: "RetailHub Soluções LTDA",
                    cnpj: "10000000000007",
                    cnpj_status: "VALID",
                    phone: "85999990007",
                    cep: "60000-000",
                    state: "CE",
                    city: "Fortaleza",
                    address: "Av. Beira Mar, 900 - Fortaleza/CE - 60000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Gabriel Almeida",
                    adminEmail: "gabriel@storecheck.com",
                    representante: "Vanessa Pinto",
                    fantasyName: "StoreCheck",
                    legalName: "StoreCheck LTDA",
                    cnpj: "10000000000008",
                    cnpj_status: "VALID",
                    phone: "71999990008",
                    cep: "40000-000",
                    state: "BA",
                    city: "Salvador",
                    address: "Rua das Flores, 250 - Salvador/BA - 40000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Camila Freitas",
                    adminEmail: "camila@fastsales.com",
                    representante: "Roberto Nunes",
                    fantasyName: "FastSales",
                    legalName: "FastSales Tecnologia LTDA",
                    cnpj: "10000000000009",
                    cnpj_status: "INVALID",
                    phone: "81999990009",
                    cep: "50000-000",
                    state: "PE",
                    city: "Recife",
                    address: "Av. Boa Viagem, 1200 - Recife/PE - 50000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Thiago Silva",
                    adminEmail: "thiago@visionretail.com",
                    representante: "Paulo Mendes",
                    fantasyName: "Vision Retail",
                    legalName: "Vision Retail LTDA",
                    cnpj: "10000000000010",
                    cnpj_status: "VALID",
                    phone: "62999990010",
                    cep: "74000-000",
                    state: "GO",
                    city: "Goiânia",
                    address: "Av. Goiás, 400 - Goiânia/GO - 74000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Bruna Castro",
                    adminEmail: "bruna@checkmarket.com",
                    representante: "Renato Lopes",
                    fantasyName: "CheckMarket",
                    legalName: "CheckMarket Sistemas LTDA",
                    cnpj: "10000000000011",
                    cnpj_status: "VALID",
                    phone: "27999990011",
                    cep: "29000-000",
                    state: "ES",
                    city: "Vitória",
                    address: "Av. Jerônimo Monteiro, 600 - Vitória/ES - 29000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Matheus Ribeiro",
                    adminEmail: "matheus@gondolatech.com",
                    representante: "Cristina Araujo",
                    fantasyName: "GondolaTech",
                    legalName: "GondolaTech LTDA",
                    cnpj: "10000000000012",
                    cnpj_status: "INVALID",
                    phone: "48999990012",
                    cep: "88000-000",
                    state: "SC",
                    city: "Florianópolis",
                    address: "Rua Bocaiúva, 150 - Florianópolis/SC - 88000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Larissa Mendes",
                    adminEmail: "larissa@salesvision.com",
                    representante: "Daniel Costa",
                    fantasyName: "SalesVision",
                    legalName: "SalesVision Comercial LTDA",
                    cnpj: "10000000000013",
                    cnpj_status: "VALID",
                    phone: "65999990013",
                    cep: "78000-000",
                    state: "MT",
                    city: "Cuiabá",
                    address: "Av. Getúlio Vargas, 500 - Cuiabá/MT - 78000-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Pedro Henrique",
                    adminEmail: "pedro@mercadoplus.com",
                    representante: "Aline Souza",
                    fantasyName: "MercadoPlus",
                    legalName: "MercadoPlus LTDA",
                    cnpj: "10000000000014",
                    cnpj_status: "VALID",
                    phone: "68999990014",
                    cep: "69900-000",
                    state: "AC",
                    city: "Rio Branco",
                    address: "Rua Amazonas, 90 - Rio Branco/AC - 69900-000",
                    password: hashedPassword,
                },
                {
                    adminName: "Vanessa Lima",
                    adminEmail: "vanessa@shelfanalytics.com",
                    representante: "Claudio Ferreira",
                    fantasyName: "ShelfAnalytics",
                    legalName: "ShelfAnalytics LTDA",
                    cnpj: "10000000000015",
                    cnpj_status: "VALID",
                    phone: "91999990015",
                    cep: "66000-000",
                    state: "PA",
                    city: "Belém",
                    address: "Av. Nazaré, 300 - Belém/PA - 66000-000",
                    password: hashedPassword,
                },
            ],
        });

        this.logger.log('🏢 Companies seeded successfully');
    }

    private async seedUsers() {
        const usersCount = await this.prisma.user.count();

        if (usersCount > 0) {
            this.logger.log('👤 Users already seeded, skipping...');
            return;
        }

        const hashedPassword = await bcrypt.hash('123456', 10);

        await this.prisma.user.createMany({
            data: [
                {
                    name: 'Platform Owner',
                    email: 'owner@test.com',
                    password: hashedPassword,
                    role: Role.OWNER,
                },
            ],
        });

        this.logger.log('👤 Users seeded successfully');
    }
}