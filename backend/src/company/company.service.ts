// company.service.ts

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class CompanyService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,

    ) { }

    async findAll() {
        return this.prisma.company.findMany();
    }

    async create(
        data: CreateCompanyDTO
    ) {

        const companyExists =
            await this.prisma.company.findFirst({
                where: {
                    OR: [
                        {
                            cnpj: data.cnpj,
                        },
                        {
                            adminEmail:
                                data.adminEmail,
                        },
                    ],
                },
            });

        if (companyExists) {
            throw new ConflictException(
                "Empresa já cadastrada"
            );
        }

        /*
        =========================
        HASH PASSWORD
        =========================
        */

        const hashedPassword =
            await bcrypt.hash(
                data.password,
                10
            );

        /*
        =========================
        CREATE COMPANY
        =========================
        */

        const company =
            await this.prisma.company.create({
                data: {

                    adminName:
                        data.adminName,

                    adminEmail:
                        data.adminEmail,

                    password:
                        hashedPassword,

                    representante:
                        data.representante,

                    fantasyName:
                        data.fantasyName,

                    legalName:
                        data.legalName,

                    cnpj:
                        data.cnpj,

                    cnpj_status:
                        data.cnpj_status,

                    phone:
                        data.phone,

                    cep:
                        data.cep,

                    state:
                        data.state,

                    city:
                        data.city,

                    address:
                        data.address,

                    dpopPublicKey:
                        data.publicKey,
                },
            });

        /*
        =========================
        JWT + DPoP
        =========================
        */

        const access_token =
            await this.jwtService.signAsync(
                {
                    sub: company.id,

                    role: "COMPANY_ADMIN",

                    cnf: {
                        jwk: data.publicKey,
                    },
                },
                {
                    expiresIn: "15m",
                }
            );

        /*
        =========================
        RESPONSE
        =========================
        */

        return {

            company: {
                id: company.id,

                fantasyName:
                    company.fantasyName,

                adminEmail:
                    company.adminEmail,
            },

            access_token,
        };
    }


    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: {
                id,
            },
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada');
        }

        return company;
    }

    async update(id: string, data: UpdateCompanyDTO) {

        const company = await this.prisma.company.findUnique({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada');
        }

        if (data.cnpj) {
            const companyWithSameCnpj =
                await this.prisma.company.findFirst({
                    where: {
                        cnpj: data.cnpj,
                        NOT: { id },
                    },
                });

            if (companyWithSameCnpj) {
                throw new ConflictException(
                    'CNPJ já está em uso',
                );
            }
        }

        if (data.adminEmail) {
            const companyWithSameEmail =
                await this.prisma.company.findFirst({
                    where: {
                        adminEmail: data.adminEmail,
                        NOT: { id },
                    },
                });

            if (companyWithSameEmail) {
                throw new ConflictException(
                    'Email já está em uso!',
                );
            }
        }

        return this.prisma.company.update({
            where: { id },
            data,
        });
    }
}