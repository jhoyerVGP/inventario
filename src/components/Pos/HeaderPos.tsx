import { DebouncedInput } from "../common/tabla/DebouncedInput";
import { ButtonShopping } from "@/components/Pos/ButtonShopping";

interface Props {
  setSearch: (value: string) => void;
  search: string;
  categories: { id: string; nameCat: string }[];
  category: string | null;
  setCategory: (value: string | null) => void;
  isOpenShopping: boolean;
  setIsOpenShopping: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HeaderPos = (props: Props) => {
  const {
    setSearch,
    search,
    categories,
    category,
    setCategory,
    isOpenShopping,
    setIsOpenShopping,
  } = props;

  return (
    <header className="w-full bg-card border-b border-border shadow-xs select-none">
      <div className="mx-auto flex flex-col gap-3 py-3">
        {/* Barra Principal: Buscador y Carrito */}
        <div className="w-full flex justify-between items-center gap-4 px-4">
          <div className="flex-1 max-w-xl">
            <DebouncedInput
              onChange={(value) => setSearch(String(value))}
              debounce={300}
              valueDafault={search}
              placeholder="Buscar por nombre o cod. único..."
            />
          </div>
          <div className="flex-shrink-0">
            <ButtonShopping
              isOpenShopping={isOpenShopping}
              setIsOpenShopping={setIsOpenShopping}
            />
          </div>
        </div>

        {/* Contenedor de Categorías (Scroll Horizontal Optimizado) */}
        <div className="w-full border-t border-border/60 bg-muted/20">
          <div className="flex w-full gap-2 overflow-x-auto py-2.5 px-4 scroll-smooth items-center no-scrollbar">
            {/* Botón "Todos" */}
            <button
              onClick={() => setCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border tracking-wide ${
                category === null
                  ? "bg-brand text-brand-foreground border-brand shadow-sm scale-[1.02]"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              Todos
            </button>

            {/* Mapeo de Categorías */}
            {categories?.map((cat) => {
              const isSelected =
                category === cat.id || (cat.nameCat === "Todos" && !category);
              return (
                <button
                  key={`section-category-filter-pos-${cat.id}`}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border tracking-wide ${
                    isSelected
                      ? "bg-brand text-brand-foreground border-brand shadow-sm scale-[1.02]"
                      : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {cat.nameCat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
