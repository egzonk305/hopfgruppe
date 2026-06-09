export default function CartPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Warenkorb</h1>

      <p className="mt-4 text-gray-600">
        Hier werden später die ausgewählten Produkte angezeigt.
      </p>

      <div className="mt-6 rounded border p-4">
        <p>Dein Warenkorb ist aktuell leer.</p>
      </div>
    </main>
  );
}