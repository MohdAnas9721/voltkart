const content = {
  about: ['About VoltKart Electricals', 'VoltKart is a professional electrical marketplace built for homeowners, electricians, contractors and procurement teams. The catalog focuses on reliable wires, cables, protection devices, lighting, fans, accessories and tools from established brands.'],
  contact: ['Contact Us', 'For bulk orders, technical product selection or order support, email support@voltkart.example or call +91 98765 43210.'],
  privacy: ['Privacy Policy', 'We collect account, order and delivery information only to operate the store, process orders and support customers. Payment gateway integration can be connected without storing card data on this application.'],
  terms: ['Terms & Conditions', 'Product prices, taxes, delivery charges and stock availability are validated at checkout. Orders can be cancelled before dispatch according to store operations.'],
  return: ['Return Policy', 'Eligible unopened electrical products may be returned within the configured return window. Installed, cut-length, damaged or custom cable orders may not be returnable.']
};

export default function StaticPage({ type }) {
  const [title, text] = content[type] || content.about;
  return (
    <main className="container-page mt-8">
      <section className="card p-8">
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">{text}</p>
      </section>
    </main>
  );
}
