import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

export type CreateCompanyDTO = {

    adminName: string;

    adminEmail: string;

    password: string;

    publicKey: any;

    representante: string;

    fantasyName: string;

    legalName: string;

    cnpj: string;

    cnpj_status: string;

    phone: string;

    cep: string;

    state: string;

    city: string;

    address: string;
}