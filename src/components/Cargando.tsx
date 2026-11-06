export default function Cargando({ texto = "Cargando..." }: { texto?: string }) {
    return (
      <div role="status" className="py-16 text-center text-sm text-tinta/60">
        {texto}
      </div>
    );
  }