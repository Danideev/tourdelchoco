"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input, FieldError } from "@/components/ui/form-fields";

const schema = z.object({
  email: z.string().min(1, "Ingresá tu email").email("Email inválido"),
});
type FormValues = z.infer<typeof schema>;

/** Newsletter del footer — React Hook Form + Zod, feedback vía toast. */
export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  const onSubmit = async (values: FormValues) => {
    // Mock: en producción esto llama a la API de email marketing.
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Listo", {
      description: `Te sumamos a la lista. Escribimos poco y con datos técnicos.`,
    });
    reset();
    void values;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Tu email
      </label>
      <div className="relative flex items-center gap-2">
        <Input
          id="newsletter-email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className="border-bone/20 bg-bone/5 text-bone placeholder:text-bone/40 focus-visible:border-ochre-500 focus-visible:ring-ochre-500/30"
          {...register("email")}
        />
        <button
          type="submit"
          aria-label="Suscribirme al newsletter"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ochre-500 text-ink-900 transition-all hover:bg-ochre-400 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
      <FieldError id="newsletter-error" message={errors.email?.message} />
    </form>
  );
}
