"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useCreateCategoryMutation } from "@/services/categoryService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload } from "lucide-react";

// ----------------------
// FORM VALIDATION
// ----------------------
const formSchema = z.object({
  name: z
    .string()
    .min(3, "Kategori adı en az 3 karakter olmalı")
    .max(50, "Kategori adı en fazla 50 karakter olmalı"),
  image: z
    .any()
    .refine((files) => files?.length > 0, "Lütfen bir görsel seçin")
    .refine(
      (files) =>
        files &&
        files[0] &&
        ["image/jpeg", "image/png", "image/jpg"].includes(files[0].type),
      "Sadece JPEG, JPG veya PNG formatı kabul edilir"
    ),
});

export default function CategoryCreateForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", image: null },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // FormData oluştur
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.image && data.image[0]) formData.append("image", data.image[0]);

      // RTK Mutation çağır
      const result = await createCategory({
        name: data.name,
        image: data.image[0],
      }).unwrap();

      // Başarılı mesaj
      toast.success(result.message || "Kategori başarıyla oluşturuldu");

      // Formu resetle
      form.reset();
      setPreview(null);
    } catch (err: unknown) {
      let message = "Kategori oluşturulurken bir hata oluştu";

      if (err && typeof err === "object" && "data" in err) {
        const e = err as { data?: { error?: string } };
        if (e.data?.error) message = e.data.error;
      }

      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kategori Oluştur</CardTitle>
        <CardDescription>
          Yeni kategori eklemek için formu doldurun.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Kategori Adı</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Yeni kategori adı"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="mt-4">
                  <FieldLabel htmlFor="image">Kategori Görseli</FieldLabel>
                  <div className="relative">
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files);
                        if (files && files[0]) {
                          setPreview(URL.createObjectURL(files[0]));
                        } else {
                          setPreview(null);
                        }
                      }}
                      className="h-11 cursor-pointer"
                      aria-invalid={fieldState.invalid}
                    />
                    <Upload className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>

                  {fieldState.invalid && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldState.error?.message}
                    </p>
                  )}

                  {preview && (
                    <div className="mt-2 w-32 h-32 relative rounded-md border border-border overflow-hidden">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              )}
            />
          </FieldGroup>

          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setPreview(null);
              }}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
