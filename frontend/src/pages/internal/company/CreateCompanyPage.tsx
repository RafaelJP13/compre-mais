import { useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Save,
    ArrowLeft,
    Search,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { InputMask } from "@react-input/mask";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import fetchWithRefresh from "../../../services/api";

type BrasilApiResponse = {
    razao_social: string;
    nome_fantasia: string;
    email: string;
    ddd_telefone_1: string;
    logradouro: string;
    numero: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    descricao_situacao_cadastral: string;
};

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);
    const [loadingCNPJ, setLoadingCNPJ] = useState(false);

    const [cnpjStatus, setCnpjStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        adminName: "",
        adminEmail: "",
        password: "",

        representante: "",

        fantasyName: "",
        legalName: "",

        cnpj: "",
        cnpj_status: "",

        phone: "",

        cep: "",
        state: "",
        city: "",

        address: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchCNPJ = async (cnpj: string) => {
        try {
            setLoadingCNPJ(true);
            setCnpjStatus("idle");

            const cleanedCNPJ = cnpj.replace(/\D/g, "");

            const response = await fetch(
                `https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`
            );

            if (!response.ok) {
                throw new Error("Erro ao consultar CNPJ");
            }

            const data: BrasilApiResponse =
                await response.json();

            setFormData((prev) => ({
                ...prev,

                fantasyName:
                    data.nome_fantasia ||
                    data.razao_social ||
                    "",

                legalName:
                    data.razao_social || "",

                cnpj_status:
                    data.descricao_situacao_cadastral ||
                    "",

                cep: data.cep || "",

                adminEmail: data.email || "",

                phone:
                    data.ddd_telefone_1 || "",

                address: `${data.logradouro || ""}, ${data.numero || ""
                    } - ${data.bairro || ""}`,

                city: data.municipio || "",

                state: data.uf || "",
            }));

            setCnpjStatus("success");
        } catch (error) {
            console.error(error);

            setCnpjStatus("error");
        } finally {
            setLoadingCNPJ(false);
        }
    };

    const handleDocumentChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        setFormData({
            ...formData,
            cnpj: value,
        });

        const cleaned = value.replace(/\D/g, "");

        if (cleaned.length === 14) {
            await fetchCNPJ(cleaned);
        } else {
            setCnpjStatus("idle");
        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setLoading(true);

            /*
            =====================================
            DPoP KEY GENERATION
            =====================================
            */

            const keyPair =
                await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: "P-256",
                    },
                    true,
                    ["sign", "verify"]
                );

            /*
            =====================================
            EXPORT PUBLIC KEY
            =====================================
            */

            const exportedPublicKey =
                await crypto.subtle.exportKey(
                    "jwk",
                    keyPair.publicKey
                );

            console.log(
                "DPOP PUBLIC KEY = ",
                exportedPublicKey
            );

            /*
            =====================================
            CREATE COMPANY
            =====================================
            */

            const response =
                await fetchWithRefresh(
                    "http://localhost:3000/companies",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({

                            adminName:
                                formData.adminName,

                            adminEmail:
                                formData.adminEmail,

                            password:
                                formData.password,

                            representante:
                                formData.representante,

                            fantasyName:
                                formData.fantasyName,

                            legalName:
                                formData.legalName,

                            cnpj:
                                formData.cnpj,

                            cnpj_status:
                                formData.cnpj_status,

                            phone:
                                formData.phone,

                            cep:
                                formData.cep,

                            state:
                                formData.state,

                            city:
                                formData.city,

                            address:
                                formData.address,

                            /*
                            =====================================
                            DPoP KEY
                            =====================================
                            */

                            publicKey:
                                exportedPublicKey,
                        }),
                    }
                );

            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData.message ||
                    "Failed to create company"
                );
            }

            /*
            =====================================
            RESPONSE
            =====================================
            */

            const data =
                await response.json();

            console.log(data);

            /*
            =====================================
            SAVE JWT
            =====================================
            */

            localStorage.setItem(
                "company_token",
                data.access_token
            );

            /*
            =====================================
            EXPORT PRIVATE KEY
            =====================================
            */

            const exportedPrivateKey =
                await crypto.subtle.exportKey(
                    "jwk",
                    keyPair.privateKey
                );

            /*
            =====================================
            SAVE DPoP KEYS
            =====================================
            */

            localStorage.setItem(
                "company_private_key",
                JSON.stringify(
                    exportedPrivateKey
                )
            );

            localStorage.setItem(
                "company_public_key",
                JSON.stringify(
                    exportedPublicKey
                )
            );

            /*
            =====================================
            SUCCESS
            =====================================
            */

            toast.success(
                "Empresa criada com sucesso!"
            );

            /*
            =====================================
            RESET FORM
            =====================================
            */

            setFormData({

                adminName: "",

                adminEmail: "",

                password: "",

                representante: "",

                fantasyName: "",

                legalName: "",

                cnpj: "",

                cnpj_status: "",

                phone: "",

                cep: "",

                state: "",

                city: "",

                address: "",
            });

            setCnpjStatus("idle");

            /*
            =====================================
            REDIRECT
            =====================================
            */

            setTimeout(() => {

                navigate("/companies");

            }, 1200);

        } catch (error: any) {

            console.error(error);

            toast.error(
                error.message ||
                "Erro ao criar empresa!"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="p-6 w-full bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Adicionar Empresa
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Cadastre uma nova empresa na
                        plataforma
                    </p>
                </div>

                <button
                    onClick={() =>
                        window.history.back()
                    }
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        bg-white
                        border border-gray-200
                        rounded-2xl
                        hover:bg-gray-100
                        transition
                        shadow-sm
                        cursor-pointer
                    "
                >
                    <ArrowLeft size={16} />
                    Voltar
                </button>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    border border-gray-100
                    rounded-3xl
                    shadow-sm
                    overflow-hidden
                "
            >
                {/* TOP BAR */}
                <div
                    className="
                        h-2
                        bg-gradient-to-r
                        from-[#ffac2e]
                        to-orange-400
                    "
                />

                <div className="p-8">
                    {/* COMPANY INFO */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="
                                    w-10 h-10
                                    rounded-2xl
                                    bg-[#ffac2e]/10
                                    flex items-center justify-center
                                "
                            >
                                <Building2
                                    size={20}
                                    className="text-[#ffac2e]"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Informações da
                                    Empresa
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Dados principais da
                                    empresa
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* ADMIN NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do
                                    Administrador
                                </label>

                                <input
                                    type="text"
                                    name="adminName"
                                    value={
                                        formData.adminName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Digite o nome"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        outline-none
                                        focus:ring-4
                                        focus:ring-[#ffac2e]/20
                                        focus:border-[#ffac2e]
                                    "
                                />
                            </div>

                            {/* ADMIN EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail do
                                    Administrador
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="email"
                                        name="adminEmail"
                                        value={
                                            formData.adminEmail
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="admin@empresa.com"
                                        className="
                                            w-full
                                            pl-12
                                            pr-4
                                            py-3
                                            rounded-2xl
                                            border border-gray-200
                                            outline-none
                                            focus:ring-4
                                            focus:ring-[#ffac2e]/20
                                            focus:border-[#ffac2e]
                                        "
                                    />
                                </div>
                            </div>

                            {/* ADMIN SENHA */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha do
                                    Administrador
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="**************"
                                        className="
                                            w-full
                                            pl-12
                                            pr-4
                                            py-3
                                            rounded-2xl
                                            border border-gray-200
                                            outline-none
                                            focus:ring-4
                                            focus:ring-[#ffac2e]/20
                                            focus:border-[#ffac2e]
                                        "
                                    />
                                </div>
                            </div>

                            {/* CNPJ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CNPJ
                                </label>

                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <InputMask
                                        mask="__.___.___/____-__"
                                        replacement={{
                                            _:
                                                /\d/,
                                        }}
                                        type="text"
                                        name="cnpj"
                                        value={
                                            formData.cnpj
                                        }
                                        onChange={
                                            handleDocumentChange
                                        }
                                        placeholder="00.000.000/0000-00"
                                        className="
                                            w-full
                                            pl-12
                                            pr-12
                                            py-3
                                            rounded-2xl
                                            border border-gray-200
                                            bg-white
                                            outline-none
                                            transition
                                            focus:ring-4
                                            focus:ring-[#ffac2e]/20
                                            focus:border-[#ffac2e]
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                        "
                                    >
                                        {loadingCNPJ && (
                                            <div
                                                className="
                                                    w-5 h-5
                                                    border-2
                                                    border-[#ffac2e]
                                                    border-t-transparent
                                                    rounded-full
                                                    animate-spin
                                                "
                                            />
                                        )}

                                        {cnpjStatus ===
                                            "success" && (
                                                <CheckCircle2
                                                    size={
                                                        20
                                                    }
                                                    className="text-green-500"
                                                />
                                            )}

                                        {cnpjStatus ===
                                            "error" && (
                                                <AlertCircle
                                                    size={
                                                        20
                                                    }
                                                    className="text-red-500"
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* CNPJ STATUS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Situação
                                    Cadastral
                                </label>

                                <input
                                    type="text"
                                    name="cnpj_status"
                                    value={
                                        formData.cnpj_status
                                    }
                                    disabled
                                    placeholder="ATIVA"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        bg-gray-100
                                        text-gray-500
                                        cursor-not-allowed
                                        outline-none
                                    "
                                />
                            </div>

                            {/* FANTASY NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Fantasia
                                </label>

                                <input
                                    type="text"
                                    name="fantasyName"
                                    value={
                                        formData.fantasyName
                                    }
                                    disabled
                                    placeholder="Preenchido automaticamente"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        bg-gray-100
                                        text-gray-500
                                        cursor-not-allowed
                                        outline-none
                                    "
                                />
                            </div>

                            {/* LEGAL NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Razão Social
                                </label>

                                <input
                                    type="text"
                                    name="legalName"
                                    value={
                                        formData.legalName
                                    }
                                    disabled
                                    placeholder="Preenchido automaticamente"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        bg-gray-100
                                        text-gray-500
                                        cursor-not-allowed
                                        outline-none
                                    "
                                />
                            </div>
                            {/* PHONE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <InputMask
                                        mask="(__) _____-____"
                                        replacement={{
                                            _:
                                                /\d/,
                                        }}
                                        type="text"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="(11) 99999-9999"
                                        className="
                                            w-full
                                            pl-12
                                            pr-4
                                            py-3
                                            rounded-2xl
                                            border border-gray-200
                                            outline-none
                                            focus:ring-4
                                            focus:ring-[#ffac2e]/20
                                            focus:border-[#ffac2e]
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ADDRESS */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="
                                    w-10 h-10
                                    rounded-2xl
                                    bg-[#ffac2e]/10
                                    flex items-center justify-center
                                "
                            >
                                <MapPin
                                    size={20}
                                    className="text-[#ffac2e]"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Endereço
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Informações de
                                    localização
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CEP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CEP
                                </label>

                                <InputMask
                                    mask="_____-___"
                                    replacement={{
                                        _: /\d/,
                                    }}
                                    type="text"
                                    name="cep"
                                    value={
                                        formData.cep
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="11325-030"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        outline-none
                                        focus:ring-4
                                        focus:ring-[#ffac2e]/20
                                        focus:border-[#ffac2e]
                                    "
                                />
                            </div>

                            {/* STATE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        formData.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="SP"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        outline-none
                                        focus:ring-4
                                        focus:ring-[#ffac2e]/20
                                        focus:border-[#ffac2e]
                                    "
                                />
                            </div>

                            {/* ADDRESS */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Endereço
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Rua, número e bairro"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        outline-none
                                        focus:ring-4
                                        focus:ring-[#ffac2e]/20
                                        focus:border-[#ffac2e]
                                    "
                                />
                            </div>

                            {/* CITY */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cidade
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="São Paulo"
                                    className="
                                        w-full
                                        px-4 py-3
                                        rounded-2xl
                                        border border-gray-200
                                        outline-none
                                        focus:ring-4
                                        focus:ring-[#ffac2e]/20
                                        focus:border-[#ffac2e]
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end mt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex items-center gap-2
                                px-6 py-3
                                rounded-2xl
                                bg-[#ffac2e]
                                text-white
                                font-semibold
                                shadow-lg
                                shadow-[#ffac2e]/20
                                hover:opacity-90
                                transition
                                disabled:opacity-50
                                cursor-pointer
                            "
                        >
                            <Save size={18} />

                            {loading
                                ? "Salvando..."
                                : "Salvar Empresa"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}