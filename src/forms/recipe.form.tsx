"use client";

import { useState, useTransition } from "react";
import { Button, Form, Input, ListBox, Select, Spinner, TextField } from "@heroui/react";
import { useIngredientStore } from "@/store/ingredient.store";
import { useRecipeStore } from "@/store/recipe.store";
import { IRecipe } from "@/types/recipe";
import { useRouter } from "next/navigation";

interface RecipeFormProps {
  initialRecipe?: IRecipe;
}

interface IIngredientField {
  id: number;
  ingredientId: string;
  quantity: number | null;
}

const initialState = {
  name: "",
  description: "",
  imageUrl: ""
};

const RecipeForm = ({ initialRecipe }: RecipeFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialRecipe?.name || initialState.name,
    description: initialRecipe?.description || initialState.description,
    imageUrl: initialRecipe?.imageUrl || initialState.imageUrl
  });

  const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
    initialRecipe?.ingredients
      ? initialRecipe.ingredients.map((ing, index) => ({
          id: index,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity
        }))
      : [{ id: 0, ingredientId: "", quantity: null }]
  );

  const { ingredients } = useIngredientStore();
  const { addRecipe, updateRecipe } = useRecipeStore();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleAddIngredientField = () => {
    if (ingredientFields.length < 10) {
      setIngredientFields([
        ...ingredientFields,
        { id: ingredientFields.length, ingredientId: "", quantity: null }
      ]);
    }
  };

  const handleRemoveIngredientField = (id: number) => {
    if (ingredientFields.length > 1) {
      setIngredientFields(ingredientFields.filter((field) => field.id !== id));
    }
  };

  const handleIngredientChange = (
    id: number,
    field: keyof IIngredientField,
    value: string | number | null
  ) => {
    setIngredientFields(
      ingredientFields.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setError(null);

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, formData)
        : await addRecipe(formData);

      if (result.success) {
        setIngredientFields([{ id: 0, ingredientId: "", quantity: null }]);
        router.push("/");
        setFormData(initialState);
      } else {
        setError(result.error || "Ошибка при сохранении рецепта");
      }

			console.log(result);
    });
  };

  return (
    <Form className="w-[450px]" action={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
			<TextField
				isRequired
				className="w-full max "
				validate={(value) => (!value ? "Название обязательно" : null)}
			>
				<Input
					name="name"
					placeholder="Введите название рецепта"
					type="text"
					value={formData.name}
					className="bg-default-100 text-sm focus:outline-none"
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
				/>
			</TextField>
			<TextField
				className="w-full max mt-2"
			>
				<Input
					name="description"
					placeholder="Введите описание (необязательно)"
					type="text"
					value={formData.description}
					className="bg-default-100 text-sm focus:outline-none"
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
				/>
			</TextField>
			<TextField
				className="w-full max mt-2"
			>
				<Input
					name="imageUrl"
					placeholder="URL изображения (необязательно)"
					type="url"
					value={formData.imageUrl}
					className="bg-default-100 text-sm focus:outline-none"
					onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
				/>
			</TextField>

      <div className="space-y-2 w-full">
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center mt-2">
						<Select 
							isRequired 
							name={`ingredient_${index}`}
							placeholder="Выберите ингредиент"
							className="bg-default-100 w-full"
							// selectedKeys={field.ingredientId ? [field.ingredientId] : []}
							onChange={(keys) => {
								const value = Array.from(keys)[0];
                handleIngredientChange(field.id, "ingredientId", value)}
              }
						>
							<Select.Trigger className="bg-default-100 w-full">
								<Select.Value className="truncate text-sm"/>
								<Select.Indicator className="text-black"/>
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{ingredients.map((ingredient) => (
										<ListBox.Item 
											key={ingredient.id} 
											id={ingredient.id} 
											// textValue={ingredient.label}
											className="text-black"
										>
											{ingredient.name}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>	
            {/* <Select
              isRequired
              name={`ingredient_${index}`}
              placeholder="Выберите ингредиент"
              selectedKeys={field.ingredientId ? [field.ingredientId] : []}
              classNames={{
                trigger: "bg-default-100 w-full",
                innerWrapper: "text-sm",
                value: "truncate",
                selectorIcon: "text-black"
              }}
              onChange={(e) =>
                handleIngredientChange(field.id, "ingredientId", e.target.value)
              }
            >
              {ingredients.map((ingredient) => (
                <SelectItem key={ingredient.id} className="text-black">
                  {ingredient.name}
                </SelectItem>
              ))}
            </Select> */}
						<TextField
							isRequired
							className="bg-default-100 w-full"
							validate={(value) =>
								!value || parseFloat(value) <= 0
									? "Количество должно быть больше 0"
									: null
							}
						>
							<Input
								name={`quantity_${index}`}
								placeholder="Количество"
								type="number"
								value={field.quantity !== null ? field.quantity.toString() : ""}
								className="text-sm focus:outline-none w-[100px]"
								onChange={(e) =>
									handleIngredientChange(
										field.id,
										"quantity",
										e.target.value ? parseFloat(e.target.value) : null
									)
								}
							/>
						</TextField>
            
            {ingredientFields.length > 1 && (
              <Button
                variant="ghost"
                onPress={() => handleRemoveIngredientField(field.id)}
                className="w-[50px]"
              >
                -
              </Button>
            )}
          </div>
        ))}

        {ingredientFields.length < 10 && (
          <Button
            variant="secondary"
            onPress={handleAddIngredientField}
          >
            +
          </Button>
        )}
      </div>

      <div className="flex w-full items-center justify-end mt-4">
        <Button 
					variant="primary" 
					type="submit" 
					isDisabled={isPending}
					className={isPending ? "opacity-100" : ""}
				>
					{isPending && <Spinner size="sm" className="text-white !opacity-100"/>}
          {initialRecipe ? "Сохранить изменения" : "Добавить рецепт"}
        </Button>
      </div>
    </Form>
  );
};

export default RecipeForm;
