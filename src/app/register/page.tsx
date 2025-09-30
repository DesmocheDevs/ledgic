"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    nombreCompleto: "",
    correo: "",
    password: "",
    confirmPassword: "",
    tipoEntidadId: 1, // Valor por defecto
    tipoPersonaId: 1, // Valor por defecto
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Actualizar nombre completo automáticamente
    if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
      const nombreCompleto = [
        formData.primerNombre || (name === "primerNombre" ? value : ""),
        formData.segundoNombre || (name === "segundoNombre" ? value : ""),
        formData.primerApellido || (name === "primerApellido" ? value : ""),
        formData.segundoApellido || (name === "segundoApellido" ? value : "")
      ].filter(Boolean).join(" ");

      setFormData(prev => ({
        ...prev,
        nombreCompleto
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre || undefined,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido || undefined,
          nombreCompleto: formData.nombreCompleto,
          correo: formData.correo,
          password: formData.password,
          tipoEntidadId: formData.tipoEntidadId,
          tipoPersonaId: formData.tipoPersonaId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }

      setSuccess("Cuenta creada exitosamente. Redirigiendo al login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500 p-3 text-white text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-500 p-3 text-white text-sm">
              {success}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {/* Primer Nombre */}
              <input
                type="text"
                name="primerNombre"
                placeholder="Primer nombre"
                value={formData.primerNombre}
                onChange={handleInputChange}
                className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none text-sm"
                style={{ fontFamily: 'var(--font-opensans)' }}
                required
              />

              {/* Segundo Nombre */}
              <input
                type="text"
                name="segundoNombre"
                placeholder="Segundo nombre"
                value={formData.segundoNombre}
                onChange={handleInputChange}
                className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none text-sm"
                style={{ fontFamily: 'var(--font-opensans)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Primer Apellido */}
              <input
                type="text"
                name="primerApellido"
                placeholder="Primer apellido"
                value={formData.primerApellido}
                onChange={handleInputChange}
                className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none text-sm"
                style={{ fontFamily: 'var(--font-opensans)' }}
                required
              />

              {/* Segundo Apellido */}
              <input
                type="text"
                name="segundoApellido"
                placeholder="Segundo apellido"
                value={formData.segundoApellido}
                onChange={handleInputChange}
                className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none text-sm"
                style={{ fontFamily: 'var(--font-opensans)' }}
              />
            </div>

            {/* Email Input */}
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
              required
            />

            {/* Password Input */}
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
              required
            />

            {/* Confirm Password Input */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="rounded-2xl border border-white bg-black px-4 py-2 text-white placeholder:text-white/80 focus:border-teal-strong focus:outline-none"
              style={{ fontFamily: 'var(--font-opensans)' }}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-red py-2 text-lg font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
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
