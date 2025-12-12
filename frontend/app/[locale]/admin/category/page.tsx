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

// "use client";

// import { useState } from "react";
// import { useTranslations } from "next-intl";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Plus, Edit, Trash2, Grid3x3, ImageIcon, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Field,
//   FieldLabel,
//   FieldError,
//   FieldGroup,
// } from "@/components/ui/field";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import { id } from "zod/v4/locales";

// const categorySchema = z.object({
//   name: z.string().min(1, "Category name is required"),
//   image: z.any().optional(),
//   translations: z.object({
//     en: z.string().optional(),
//     de: z.string().optional(),
//     ru: z.string().optional(),
//     fr: z.string().optional(),
//   }),
// });

// type CategoryFormData = z.infer<typeof categorySchema>;

// // Mock data - will be replaced with RTK Query
// const mockCategories = [
//   {
//     id: "1",
//     name: "Ana Yemek",
//     image: "/main-course.jpg",
//     translations: {
//       en: "Main course",
//       de: "Hauptgericht",
//       ru: "Основное блюдо",
//       fr: "Plat principal",
//     },
//   },
//   {
//     id: "2",
//     name: "İçecekler",
//     image: "/assorted-drinks.png",
//     translations: {
//       en: "Drinks",
//       de: "Getränke",
//       ru: "Напитки",
//       fr: "Boissons",
//     },
//   },
//   {
//     id: "3",
//     name: "Tatlı",
//     image: "/assorted-desserts.png",
//     translations: {
//       en: "Sweet",
//       de: "Süß",
//       ru: "Сладкий",
//       fr: "Doux",
//     },
//   },
//   {
//     id: "4",
//     name: "Atıştırmalık",
//     image: "",
//     translations: {
//       en: "Snack",
//       de: "Snack",

//       ru: "Закуска",
//       fr: "Collation",
//     },
//   },

//   {
//     id: "5",
//     name: "Çorba",
//     image: "/soup.jpg",
//     translations: {
//       en: "Soup",
//       de: "Suppe",
//       ru: "Суп",
//       fr: "Soupe",
//     },
//   },
//   {
//     id: "6",
//     name: "Salata",
//     image: "/salad.jpg",
//     translations: {
//       en: "Salad",
//       de: "Salat",
//       ru: "Салат",
//       fr: "Salade",
//     },
//   },
//   {
//     id: "7",
//     name: "Kahvaltı",
//     image: "/breakfast.jpg",
//     translations: {
//       en: "Breakfast",
//       de: "Frühstück",
//       ru: "Завтрак",
//       fr: "Petit déjeuner",
//     },
//   },
//   {
//     id: "8",
//     name: "Atıştırmalık",
//     image: "",
//     translations: {
//       en: "Snack",
//       de: "Snack",
//       ru: "Закуска",
//       fr: "Collation",
//     },
//   },
//   {
//     id: "9",
//     name: "Çorba",
//     image: "/soup.jpg",
//     translations: {
//       en: "Soup",
//       de: "Suppe",
//       ru: "Суп",
//       fr: "Soupe",
//     },
//   },
//   {
//     id: "10",
//     name: "Salata",
//     image: "/salad.jpg",
//     translations: {
//       en: "Salad",
//       de: "Salat",
//       ru: "Салат",
//       fr: "Salade",
//     },
//   },
// ];

// export default function CategoriesPage() {
//   const t = useTranslations();
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [categories] = useState(mockCategories);
//   const [editingCategory, setEditingCategory] = useState<
//     (typeof mockCategories)[0] | null
//   >(null);

//   const createForm = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       translations: {
//         en: "",
//         de: "",
//         ru: "",
//         fr: "",
//       },
//     },
//   });

//   const editForm = useForm<CategoryFormData>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       name: "",
//       translations: {
//         en: "",
//         de: "",
//         ru: "",
//         fr: "",
//       },
//     },
//   });

//   const handleCreate = (data: CategoryFormData) => {
//     console.log("[v0] Creating category:", data);
//     toast.success(t("common.success"));
//     setIsCreateDialogOpen(false);
//     createForm.reset();
//   };

//   const handleEdit = (category: (typeof mockCategories)[0]) => {
//     setEditingCategory(category);
//     editForm.reset({
//       name: category.name,
//       translations: category.translations,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdate = (data: CategoryFormData) => {
//     console.log("[v0] Updating category:", {
//       id: editingCategory?.id,
//       ...data,
//     });
//     toast.success(t("common.success"));
//     setIsEditDialogOpen(false);
//     setEditingCategory(null);
//     editForm.reset();
//   };

//   const handleDelete = (id: string) => {
//     console.log("[v0] Deleting category:", id);
//     toast.success("Category deleted");
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">
//             {t("categories.title")}
//           </h1>
//           <p className="text-muted-foreground">{t("categories.subtitle")}</p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="h-4 w-4" />
//               {t("categories.create")}
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>{t("categories.create")}</DialogTitle>
//               <DialogDescription>{t("categories.addNew")}</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={createForm.handleSubmit(handleCreate)}>
//               <FieldGroup className="py-4">
//                 <Controller
//                   name="name"
//                   control={createForm.control}
//                   render={({ field, fieldState }) => (
//                     <Field data-invalid={fieldState.invalid}>
//                       <FieldLabel htmlFor="name">
//                         {t("categories.name")}
//                       </FieldLabel>
//                       <Input
//                         {...field}
//                         id="name"
//                         placeholder="Örn: Ana Yemek"
//                         autoComplete="off"
//                       />
//                       {fieldState.invalid && (
//                         <FieldError errors={[fieldState.error]} />
//                       )}
//                     </Field>
//                   )}
//                 />

//                 <Controller
//                   name="image"
//                   control={createForm.control}
//                   render={({ field: { onChange, value, ...field } }) => (
//                     <Field>
//                       <FieldLabel htmlFor="image">
//                         {t("categories.image")}
//                       </FieldLabel>
//                       <div className="flex items-center gap-4">
//                         <Input
//                           {...field}
//                           id="image"
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => onChange(e.target.files?.[0])}
//                           className="cursor-pointer"
//                         />
//                         <Button type="button" variant="outline" size="icon">
//                           <Upload className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </Field>
//                   )}
//                 />

//                 <div className="space-y-2">
//                   <FieldLabel>{t("categories.translations")}</FieldLabel>
//                   <Tabs defaultValue="en" className="w-full">
//                     <TabsList className="grid w-full grid-cols-4">
//                       <TabsTrigger value="en">EN</TabsTrigger>
//                       <TabsTrigger value="de">DE</TabsTrigger>
//                       <TabsTrigger value="ru">RU</TabsTrigger>
//                       <TabsTrigger value="fr">FR</TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="en" className="mt-4">
//                       <Controller
//                         name="translations.en"
//                         control={createForm.control}
//                         render={({ field }) => (
//                           <Input
//                             {...field}
//                             placeholder="Main course"
//                             autoComplete="off"
//                           />
//                         )}
//                       />
//                     </TabsContent>
//                     <TabsContent value="de" className="mt-4">
//                       <Controller
//                         name="translations.de"
//                         control={createForm.control}
//                         render={({ field }) => (
//                           <Input
//                             {...field}
//                             placeholder="Hauptgericht"
//                             autoComplete="off"
//                           />
//                         )}
//                       />
//                     </TabsContent>
//                     <TabsContent value="ru" className="mt-4">
//                       <Controller
//                         name="translations.ru"
//                         control={createForm.control}
//                         render={({ field }) => (
//                           <Input
//                             {...field}
//                             placeholder="Основное блюдо"
//                             autoComplete="off"
//                           />
//                         )}
//                       />
//                     </TabsContent>
//                     <TabsContent value="fr" className="mt-4">
//                       <Controller
//                         name="translations.fr"
//                         control={createForm.control}
//                         render={({ field }) => (
//                           <Input
//                             {...field}
//                             placeholder="Plat principal"
//                             autoComplete="off"
//                           />
//                         )}
//                       />
//                     </TabsContent>
//                   </Tabs>
//                 </div>
//               </FieldGroup>
//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsCreateDialogOpen(false)}
//                 >
//                   {t("common.cancel")}
//                 </Button>
//                 <Button type="submit">{t("common.create")}</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{t("common.edit")}</DialogTitle>
//             <DialogDescription>{t("categories.subtitle")}</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={editForm.handleSubmit(handleUpdate)}>
//             <FieldGroup className="py-4">
//               <Controller
//                 name="name"
//                 control={editForm.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel htmlFor="edit-name">
//                       {t("categories.name")}
//                     </FieldLabel>
//                     <Input
//                       {...field}
//                       id="edit-name"
//                       placeholder="Örn: Ana Yemek"
//                       autoComplete="off"
//                     />
//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error]} />
//                     )}
//                   </Field>
//                 )}
//               />

//               <Controller
//                 name="image"
//                 control={editForm.control}
//                 render={({ field: { onChange, value, ...field } }) => (
//                   <Field>
//                     <FieldLabel htmlFor="edit-image">
//                       {t("categories.image")}
//                     </FieldLabel>
//                     <div className="flex items-center gap-4">
//                       <Input
//                         {...field}
//                         id="edit-image"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => onChange(e.target.files?.[0])}
//                         className="cursor-pointer"
//                       />
//                       <Button type="button" variant="outline" size="icon">
//                         <Upload className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </Field>
//                 )}
//               />

//               <div className="space-y-2">
//                 <FieldLabel>{t("categories.translations")}</FieldLabel>
//                 <Tabs defaultValue="en" className="w-full">
//                   <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="en">EN</TabsTrigger>
//                     <TabsTrigger value="de">DE</TabsTrigger>
//                     <TabsTrigger value="ru">RU</TabsTrigger>
//                     <TabsTrigger value="fr">FR</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="en" className="mt-4">
//                     <Controller
//                       name="translations.en"
//                       control={editForm.control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           placeholder="Main course"
//                           autoComplete="off"
//                         />
//                       )}
//                     />
//                   </TabsContent>
//                   <TabsContent value="de" className="mt-4">
//                     <Controller
//                       name="translations.de"
//                       control={editForm.control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           placeholder="Hauptgericht"
//                           autoComplete="off"
//                         />
//                       )}
//                     />
//                   </TabsContent>
//                   <TabsContent value="ru" className="mt-4">
//                     <Controller
//                       name="translations.ru"
//                       control={editForm.control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           placeholder="Основное блюдо"
//                           autoComplete="off"
//                         />
//                       )}
//                     />
//                   </TabsContent>
//                   <TabsContent value="fr" className="mt-4">
//                     <Controller
//                       name="translations.fr"
//                       control={editForm.control}
//                       render={({ field }) => (
//                         <Input
//                           {...field}
//                           placeholder="Plat principal"
//                           autoComplete="off"
//                         />
//                       )}
//                     />
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </FieldGroup>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsEditDialogOpen(false)}
//               >
//                 {t("common.cancel")}
//               </Button>
//               <Button type="submit">{t("common.save")}</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Categories Grid */}
//       {categories.length === 0 ? (
//         <Card className="flex flex-col items-center justify-center py-12">
//           <CardContent className="flex flex-col items-center gap-4 pt-6">
//             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
//               <Grid3x3 className="h-10 w-10 text-muted-foreground" />
//             </div>
//             <div className="text-center">
//               <h3 className="font-semibold text-lg mb-1">
//                 {t("common.noData")}
//               </h3>
//               <p className="text-sm text-muted-foreground max-w-sm">
//                 {t("categories.subtitle")}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {categories.map((category) => (
//             <Card
//               key={category.id}
//               className="group hover:shadow-md transition-shadow overflow-hidden"
//             >
//               <CardHeader className="p-0">
//                 <div className="aspect-video w-full bg-muted flex items-center justify-center relative overflow-hidden">
//                   {category.image ? (
//                     <img
//                       src={category.image || "/placeholder.svg"}
//                       alt={category.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <ImageIcon className="h-12 w-12 text-muted-foreground" />
//                   )}
//                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <Button
//                       variant="secondary"
//                       size="icon"
//                       className="h-8 w-8 bg-background/80 backdrop-blur"
//                       onClick={() => handleEdit(category)}
//                     >
//                       <Edit className="h-4 w-4" />
//                       <span className="sr-only">{t("common.edit")}</span>
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       size="icon"
//                       className="h-8 w-8 bg-background/80 backdrop-blur text-destructive hover:text-destructive"
//                       onClick={() => handleDelete(category.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span className="sr-only">{t("common.delete")}</span>
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <CardTitle className="text-base mb-1">
//                   {category.name}
//                 </CardTitle>
//                 <CardDescription className="text-xs line-clamp-1">
//                   EN: {category.translations.en} / DE:{" "}
//                   {category.translations.de}
//                 </CardDescription>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
