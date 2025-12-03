import CategoryList from "@/components/category/CategoriesList";
import CategoryCreateFormm from "@/components/category/CategoryCreateFormm";

function CategoryPage() {
  return (
    <div className="mx-auto container max-w-7xl flex flex-col gap-8 py-8">
      <CategoryList />
      <CategoryCreateFormm />
    </div>
  );
}

export default CategoryPage;
