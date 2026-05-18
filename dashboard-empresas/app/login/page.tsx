import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <main
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-orange-50
                via-white
                to-orange-100
                p-6
            "
        >
            <div
                className="
                    w-full
                    max-w-6xl
                    grid
                    lg:grid-cols-2
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/40
                    bg-white/70
                    backdrop-blur-xl
                    shadow-2xl
                "
            >
                {/* LEFT SIDE */}
                <div
                    className="
                        hidden
                        lg:flex
                        flex-col
                        justify-between
                        p-14
                        bg-gradient-to-br
                        from-[#ffac2e]
                        to-orange-500
                        text-white
                        relative
                        overflow-hidden
                    "
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-white blur-3xl" />
                    </div>

                    <div className="relative z-10">


                        <h1 className="text-5xl font-bold leading-tight">
                            Bem-vindo ao
                            <br />
                            dashboard
                        </h1>

                        <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-md">
                            Gerencie empresas, usuários e
                            informações da sua plataforma
                            em um único lugar.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-white/70">
                        © 2026 Compre Flow
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-center p-8 lg:p-14">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}