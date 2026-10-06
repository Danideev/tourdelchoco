/**
 * Datos institucionales de AGROPYME S.R.L. (mock realista para la propuesta).
 * Fuente editable: `content/empresa.json`. Los href de teléfono y WhatsApp se
 * derivan de los números del JSON, así el cliente edita un solo campo.
 */
import { z } from "zod";
import empresa from "../../content/empresa.json";

const companySchema = z.object({
  name: z.string(),
  wordmark: z.string(),
  tagline: z.string(),
  legal: z.string(),
  address: z.string(),
  addressShort: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  hours: z.string(),
  founded: z.number(),
  whatsappGreeting: z.string(),
});

const navLinkSchema = z.object({ label: z.string(), href: z.string() });

const socialLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.enum(["instagram", "facebook", "youtube", "linkedin"]),
});

const footerColumnSchema = z.object({
  title: z.string(),
  links: z.array(navLinkSchema),
});

const company = companySchema.parse(empresa.company);

/** Solo dígitos de un número telefónico. */
const digits = (value: string) => value.replace(/\D/g, "");

/** "(011) 4519-2958" → E.164 argentino (+54 11 ...), tolerando el 0 inicial. */
const phoneE164 = (() => {
  const d = digits(company.phone);
  return d.startsWith("54") ? d : `54${d.replace(/^0/, "")}`;
})();

export const COMPANY = {
  ...company,
  phoneHref: `tel:+${phoneE164}`,
  whatsappHref: `https://wa.me/${digits(company.whatsapp)}?text=${encodeURIComponent(
    company.whatsappGreeting,
  )}`,
};

export const NAV_LINKS = z.array(navLinkSchema).parse(empresa.navLinks);

export const SOCIAL_LINKS = z.array(socialLinkSchema).parse(empresa.socialLinks);

export const FOOTER_COLUMNS = z
  .array(footerColumnSchema)
  .parse(empresa.footerColumns);
