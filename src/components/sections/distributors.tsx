"use client";

import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check, Loader2, MapPin, Percent, ShieldCheck, TrendingUp } from "lucide-react";
import { PROVINCES } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/form-fields";
import { Reveal, RevealLines } from "@/components/effects/reveal";
import { COMPANY } from "@/lib/constants";

const schema = z.object({
  company: z.string().min(2, "Ingresá la razón social"),
  cuit: z
    .string()
    .min(1, "Ingresá el CUIT")
    .regex(/^\d{2}-?\d{8}-?\d$/, "Formato: XX-XXXXXXXX-X"),
  contact: z.string().min(3, "Ingresá tu nombre y apellido"),
  email: z.string().min(1, "Ingresá tu email").email("Email inválido"),
  phone: z.string().min(8, "Ingresá un teléfono de contacto"),
  zone: z.string().min(1, "Elegí tu provincia"),
  volume: z.string().min(1, "Estimá un volumen mensual"),
  message: z.string().max(500, "Máximo 500 caracteres").optional(),
});

type FormValues = z.infer<typeof schema>;

const BENEFITS = [
  {
    icon: Percent,
    title: "Márgenes reales",
    text: "Hasta 35 % de margen sobre lista, con bonificación por volumen y precios de reventa protegidos.",
  },
  {
    icon: MapPin,
    title: "Exclusividad por zona",
    text: "Cobertura territorial definida por contrato. No competimos con nuestro propio distribuidor.",
  },
  {
    icon: ShieldCheck,
    title: "Soporte y repuestos garantizados",
    text: "Prioridad en reposición de stock y asistencia técnica directa con nuestro taller.",
  },
  {
    icon: TrendingUp,
    title: "Formación y material de venta",
    text: "Capacitación de producto, fichas técnicas y campañas listas para tu canal.",
  },
];

/** SECCIÓN B2B — alta de distribuidores con formulario validado (RHF + Zod). */
export function Distributors() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { company: "", cuit: "", contact: "", email: "", phone: "", volume: "" },
  });

  const onSubmit = async (values: FormValues) => {
    // Mock del endpoint: en producción POST /api/distribuidores
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Solicitud enviada", {
      description: "Un responsable comercial te contacta en menos de 24 hs hábiles.",
    });
    setSubmitted(true);
    reset();
    void values;
  };

  const inputClass = (hasError?: string) =>
    hasError ? "border-highlight focus-visible:border-highlight" : "";

  return (
    <section
      id="distribuidores"
      className="container-site py-20 md:py-28"
      aria-labelledby="distributors-title"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Pitch */}
        <div>
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Programa B2B
            </p>
            <h2
              id="distributors-title"
              className="text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              <RevealLines
                lines={[
                  <Fragment key="l1">¿Querés ser distribuidor</Fragment>,
                  <Fragment key="l2">
                    de <span className="text-forest-600 dark:text-ochre-500">AGROPYME</span>?
                  </Fragment>,
                ]}
              />
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Trabajamos con distribuidores rurales, agropecuarias y casas de insumos en todo el
              país. Definimos zona, volumen y condiciones en una reunión de 30 minutos.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-600/40 dark:hover:border-ochre-500/40"
              >
                <benefit.icon
                  className="h-5 w-5 text-forest-600 transition-transform duration-300 group-hover:scale-110 dark:text-ochre-500"
                  aria-hidden="true"
                />
                <p className="mt-3 font-semibold tracking-tight">{benefit.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {benefit.text}
                </p>
              </li>
            ))}
          </ul>

          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-forest-600/20 bg-forest-600/6 p-5 dark:border-ochre-500/25 dark:bg-ochre-500/8">
              <p className="text-sm leading-relaxed">
                ¿Preferís hablarlo ahora? Escribinos y te pasamos la lista de precios de reventa.
              </p>
              <Button asChild variant="dark" size="sm" className="shine" data-cursor="link">
                <a href={COMPANY.whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp comercial
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Formulario B2B */}
        <Reveal delay={0.08}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Alta de distribuidor</h3>
                <p className="text-xs text-muted-foreground">
                  Completá los datos y te enviamos la propuesta comercial.
                </p>
              </div>
              <span className="eyebrow rounded-md bg-muted px-2 py-1 text-muted-foreground">
                B2B
              </span>
            </div>

            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-forest-600 text-bone">
                  <Check className="h-7 w-7" />
                </span>
                <h4 className="mt-5 text-xl font-semibold tracking-tight">
                  ¡Gracias! Recibimos tu solicitud
                </h4>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Un responsable comercial revisa tu zona y volumen estimado, y te escribe en
                  menos de 24 hs hábiles con la lista de precios de reventa.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Cargar otra solicitud
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Empresa / Razón social *</Label>
                    <Input
                      id="company"
                      autoComplete="organization"
                      placeholder="S.R.L. o monotributo"
                      className={inputClass(errors.company?.message)}
                      aria-invalid={!!errors.company}
                      {...register("company")}
                    />
                    <FieldError id="company-error" message={errors.company?.message} />
                  </div>
                  <div>
                    <Label htmlFor="cuit">CUIT *</Label>
                    <Input
                      id="cuit"
                      inputMode="numeric"
                      placeholder="30-71234567-8"
                      className={`${inputClass(errors.cuit?.message)} font-mono tabular`}
                      aria-invalid={!!errors.cuit}
                      {...register("cuit")}
                    />
                    <FieldError id="cuit-error" message={errors.cuit?.message} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact">Nombre y apellido *</Label>
                    <Input
                      id="contact"
                      autoComplete="name"
                      placeholder="Nombre del responsable"
                      className={inputClass(errors.contact?.message)}
                      aria-invalid={!!errors.contact}
                      {...register("contact")}
                    />
                    <FieldError id="contact-error" message={errors.contact?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="266 4123456"
                      className={inputClass(errors.phone?.message)}
                      aria-invalid={!!errors.phone}
                      {...register("phone")}
                    />
                    <FieldError id="phone-error" message={errors.phone?.message} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email comercial *</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ventas@empresa.com"
                      className={inputClass(errors.email?.message)}
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                    <FieldError id="email-error" message={errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="zone">Zona / Provincia *</Label>
                    <Select
                      id="zone"
                      className={inputClass(errors.zone?.message)}
                      aria-invalid={!!errors.zone}
                      defaultValue=""
                      {...register("zone")}
                    >
                      <option value="" disabled>
                        Seleccioná una opción
                      </option>
                      {PROVINCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {p.zone}
                        </option>
                      ))}
                    </Select>
                    <FieldError id="zone-error" message={errors.zone?.message} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="volume">Volumen estimado por mes *</Label>
                  <Select
                    id="volume"
                    className={inputClass(errors.volume?.message)}
                    aria-invalid={!!errors.volume}
                    defaultValue=""
                    {...register("volume")}
                  >
                    <option value="" disabled>
                      Seleccioná un rango
                    </option>
                    <option value="1">Hasta 10 unidades</option>
                    <option value="2">11 – 30 unidades</option>
                    <option value="3">31 – 80 unidades</option>
                    <option value="4">Más de 80 unidades</option>
                  </Select>
                  <FieldError id="volume-error" message={errors.volume?.message} />
                </div>

                <div>
                  <Label htmlFor="message">Contanos sobre tu operación</Label>
                  <Textarea
                    id="message"
                    placeholder="Rubro, ciudades que cubrís, canales de venta…"
                    aria-invalid={!!errors.message}
                    {...register("message")}
                  />
                  <FieldError id="message-error" message={errors.message?.message} />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="shine group w-full"
                  disabled={isSubmitting}
                  data-cursor="link"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Solicitar propuesta comercial
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <p className="text-center text-[0.6875rem] leading-relaxed text-muted-foreground">
                  Al enviar aceptás ser contactado por AGROPYME S.R.L. respecto de esta solicitud.
                  No compartimos tus datos con terceros.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
