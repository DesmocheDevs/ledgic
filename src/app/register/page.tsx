import Image from "next/image";

export default function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-strong from-30% via-white via-100% to-white p-4">
      <section className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-4 border-black bg-white/80 shadow-lg md:flex-row">
        
        {/* Izquierda: Pet + info */}
        <div className="flex flex-1 flex-col items-center justify-between rounded-l-2xl bg-white p-8">
          {/* Navigation Buttons */}
          <div className="mb-3 flex w-full justify-end gap-2">
            <a
              href="/login"
              className="rounded-full border border-black bg-white px-6 py-1 font-medium text-black transition-colors hover:bg-gray-50"
            >
              Login
            </a>
            <button className="rounded-full bg-black px-6 py-1 font-medium text-white">
              Regístrate
            </button>
          </div>
          
          {/* Pet Image */}
          <div className="flex w-full flex-1 items-center justify-center">
            <Image
              src="/pet.png"
              alt="Ledgic Pet"
              width={300}
              height={300}
              className="h-[90%] max-h-[90%] w-auto object-contain"
              priority
            />
          </div>
          
          {/* Developer Info */}
          <div className="mt-3 flex w-full items-center justify-start gap-2">
            <span className="inline-block h-6 w-6 rounded-full bg-teal-strong"></span>
            <div>
              <div className="font-semibold text-black">Desmoche Devs</div>
              <div className="text-xs text-gray-600">info@ledgic.com</div>
            </div>
          </div>
        </div>
        
        {/* Derecha: Formulario */}
        <div className="flex flex-1 flex-col bg-black p-8">
          {/* Logo */}
          <div className="mb-6 flex w-full justify-end">
            <Image
              src="/ledgic_text_png.png"
              alt="Ledgic Logo"
              width={120}
              height={36}
            />
          </div>
          
          {/* Welcome Text */}
          <h1
            className="mb-2 text-3xl font-bold text-white text-center"
            style={{ fontFamily: 'var(--font-helvetica)' }}
          >
            Bienvenido
          </h1>
          <div className="mb-6 text-sm text-teal-strong text-center">
            Planificador de costos | Manufactura inteligente
          </div>
          
          {/* Register Form */}
          <form className="flex flex-col gap-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Correo"
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
            />
            
            {/* Password Input */}
            <input
              type="password"
              placeholder="Contraseña"
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
            />
            
            {/* Confirm Password Input */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
            />
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-red py-2 text-lg font-semibold text-white transition-colors hover:opacity-90"
            >
              Registrarse
            </button>
          </form>
          
          {/* Login Link */}
          <div className="mt-4 text-center text-xs text-white">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/login"
              className="text-red underline hover:text-red/80"
            >
              Inicia sesión
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
