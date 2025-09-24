import Image from "next/image";

export default function Landing() {
	return (
		<main className="min-h-screen bg-black p-4">
			{/* Header y Hero */}
			<section className="relative mb-8 flex flex-col items-center justify-between gap-6 rounded-xl bg-white p-6 md:flex-row md:p-10">
				{/* Logo */}
				<div className="absolute left-6 top-4 flex items-center">
					<Image
						src="/ledgic_text_png.png"
						alt="Ledgic Logo"
						width={160}
						height={48}
						priority
						className="h-12 w-auto"
					/>
				</div>
				
				{/* Navigation Tabs */}
				<div className="absolute right-0 top-0 flex gap-0 overflow-hidden bg-black">
					<a
						href="#faq"
						className="z-10 rounded-tl-none rounded-tr-2xl border-b-0 border-black bg-white px-6 py-2 text-lg font-medium text-black"
					>
						FAQ
					</a>
					<a
						href="#register"
						className="z-20 mx-0 bg-black px-8 py-2 text-lg font-medium text-white"
					>
						Registration
					</a>
				</div>
				
				{/* Hero Content */}
				<div className="z-10 mt-16 min-w-0 flex-1 md:mt-0">
					<h1
						className="mb-4 text-3xl font-semibold leading-tight text-black md:text-4xl"
						style={{ fontFamily: 'var(--font-helvetica)' }}
					>
						Lleve de la mejor manera el ...
					</h1>
					<p
						className="mb-6 max-w-xl text-lg text-black"
						style={{ fontFamily: 'var(--font-opensans)' }}
					>
						La contabilidad es una herramienta poderosa para comprender el paso y planificar el futuro.
					</p>
					<a
						href="#register"
						className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2 font-semibold text-white transition-colors hover:opacity-90"
						style={{ fontFamily: 'var(--font-opensans)' }}
					>
						<span role="img" aria-label="graduation">🎓</span>
						¡Comienza gratis!
					</a>
				</div>
				
				{/* Pet Image */}
				<div className="z-10 mt-8 flex-shrink-0 md:mt-0">
					<Image
						src="/pet.png"
						alt="Ledgic Pet"
						width={220}
						height={220}
						className="object-contain"
						priority
					/>
				</div>
			</section>

			{/* Cards Section */}
			<section className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{/* Card Component Pattern */}
				<div className="min-h-[120px] rounded-lg bg-teal-strong p-6">
					<span className="text-lg font-medium text-blue">Lorem ip sum</span>
				</div>
				<div className="min-h-[120px] rounded-lg bg-teal-strong p-6">
					<span className="text-lg font-medium text-blue">Lorem ip sum</span>
				</div>
				<div className="min-h-[120px] rounded-lg bg-teal-strong p-6">
					<span className="text-lg font-medium text-blue">Lorem ip sum</span>
				</div>
			</section>
		</main>
	);
}
